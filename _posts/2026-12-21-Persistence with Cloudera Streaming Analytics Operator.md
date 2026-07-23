---
title:  "Persistence with Cloudera Streaming Analytics Operator"
excerpt: "How to make everything CSA writes to disk — SQL Stream Builder metadata, uploaded user artifacts, and Flink checkpoints, savepoints and HA state — survive pod restarts on Kubernetes."
header:
  teaser: "/assets/images/CSA-Cloudera_Streaming_Analytics_Operator.png"
categories:
  - blog
tags:
  - cloudera
  - csa
  - ssb
  - flink
  - kubernetes
  - operator
  - persistence
  - minikube
---

# Persistence with Cloudera Streaming Analytics Operator

CSA on Kubernetes is easy to install with the Cloudera Helm chart. What's not so obvious the first time you deploy it is that a "working" install still loses state in three separate places the moment a pod restarts:

1. **SSB metadata** (materialized view definitions, projects, connectors, jobs) lives in Postgres — the chart already creates a PVC for that, but only 100 Mi and only if you leave `ssb.database.create=true`.
2. **User artifacts** (Iceberg JAR, custom UDF JARs, Python UDFs, anything you upload from the SSB UI) — by default there is **no** persistent volume mounted at `/persistent`, so uploads fail with `Mkdirs failed to create file...` and even when they don't, they disappear on the next re-roll.
3. **Flink job state** — checkpoints, savepoints, HA metadata. Without a durable `state.checkpoints.dir` and `high-availability.storageDir`, a Flink job restart loses exactly-once guarantees and any keyed state you built up.

This post walks through fixing all three, in order, using the same `cld-streaming` minikube cluster the rest of my CSA demos run in. Everything here is CSA Operator `1.5.0-b275` on minikube v1.37.0 / k8s v1.34.0.

Companion post covering Schema Registry on the same Postgres pod: [Persisting Schema Registry with PostgreSQL](/blog/Persiting-Schema-with-Schema-Registry/). Companion post covering the same thing for NiFi under the CFM Operator: [Persistence with Cloudera Flow Management Operator](/blog/Persistence-with-Cloudera-Flow-Management-Operator/).

---

## What CSA actually stores, and where

Before touching any YAML, this is the layout you're aiming for:

| State | Backing store | Path in pod | Helm value / Flink key |
|---|---|---|---|
| SSB metadata (projects, MV defs, users, jobs) | Postgres `ssb_admin` DB in `ssb-postgresql` | `/var/lib/postgresql/data` | `ssb.database.pvcSpec.resources.requests.storage` |
| Uploaded artifacts (JARs, Python UDFs) | PVC `ssb-artifacts-pvc` | `/persistent` (SSE) + optional Flink mount | `ssb.storageConfiguration` + `podVolumes` / `podVolumeMounts` |
| Flink checkpoints | S3 / HDFS / PVC | `state.checkpoints.dir` | `flink-conf.yaml → state.checkpoints.dir` |
| Flink savepoints | S3 / HDFS / PVC | `state.savepoints.dir` | `flink-conf.yaml → state.savepoints.dir` |
| Flink HA metadata (JobManager leader, JobGraph) | S3 / HDFS / PVC | `high-availability.storageDir` | `flink-conf.yaml → high-availability.*` |
| Schema Registry schemas | Postgres `registry` DB in same `ssb-postgresql` | — | See companion post |

The default `helm install` gets you row 1 (100 Mi). Rows 2–5 are on you.

---

## Phase 1 — Persist SSB Metadata (Postgres)

The chart already provisions this, but 100 Mi runs out fast the moment you register a handful of connectors and start jobs. Bump it before you deploy — resizing a PVC after the fact requires `allowVolumeExpansion: true` on the StorageClass and a rollout.

**Option A — set at install time via a values file.** Add this to your `csa-values.yaml`:

```yaml
ssb:
  database:
    create: true
    pvcSpec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 5Gi        # was 100Mi
      # storageClassName: nifi-storage   # optional, if you want a specific class
    resources:
      limits:
        cpu: "1"
        memory: "2048Mi"      # bumped from 1Gi
      requests:
        cpu: "500m"
        memory: "1024Mi"
```

Then install (or upgrade) with `-f csa-values.yaml`.

**Option B — you already installed CSA and just need to prove it's persisted.** Verify the PVC is bound and points at real storage, not `emptyDir`:

```bash
kubectl get pvc -n cld-streaming ssb-postgresql-db
kubectl exec -n cld-streaming deploy/ssb-postgresql -- \
  mount | grep /var/lib/postgresql/data
```

You should see a real block device on `/var/lib/postgresql/data`, not `tmpfs`.

**Persistence test:**

```bash
kubectl rollout restart deployment/ssb-postgresql -n cld-streaming
kubectl rollout status  deployment/ssb-postgresql -n cld-streaming --timeout=180s
# SSB UI → your projects, connectors, MV definitions should all still be there.
```

If they're gone, `ssb-postgresql-db` is not actually bound to real storage — check its `STATUS` and `STORAGECLASS`.

---

## Phase 2 — Persist SSB User Artifacts (`/persistent`)

This is the piece that bit me first: uploading the Iceberg JAR from the SSB UI failed with `Mkdirs failed to create file:/persistent/global/tmp/...`. The path doesn't exist inside the SSE pod at all — the chart never mounts it.

The fix is to create a PV/PVC, mount it into `ssb-sse` at `/persistent`, open permissions so the `ssb` user can write, and tell SSB that's where artifacts go.

### Step 2.1 — Create the PV and PVC

For minikube (`hostPath` is fine; for a real cluster use your StorageClass), save this as `ssb-storage.yaml`:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: ssb-pv
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/data/ssb-persistent"
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ssb-artifacts-pvc
  namespace: cld-streaming
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

Apply:

```bash
kubectl apply -f ssb-storage.yaml
```

### Step 2.2 — Attach the volume to `ssb-sse`

The clean way is to add it via Helm (`ssb.podVolumes` + `ssb.podVolumeMounts` — the same knobs the chart uses to mount Hadoop config or custom truststores), because those mounts are then applied to **both** SSB and every Flink pod SSB spins up. That matters when a Flink job needs to read the JAR you uploaded.

Add to `csa-values.yaml`:

```yaml
ssb:
  podVolumes:
    create: true
    data:
      - name: persistent-storage
        persistentVolumeClaim:
          claimName: ssb-artifacts-pvc
  podVolumeMounts:
    create: true
    data:
      - name: persistent-storage
        mountPath: /persistent
```

Then `helm upgrade` to apply.

If you already installed CSA and just want to patch the running deployment (works, but only mounts on `ssb-sse`, not on Flink pods — fine for the upload path, not fine for jobs that need the artifact at runtime):

```bash
kubectl patch deployment ssb-sse -n cld-streaming --patch '
{
  "spec": {
    "template": {
      "spec": {
        "containers": [
          {
            "name": "ssb-sse",
            "volumeMounts": [
              { "name": "persistent-storage", "mountPath": "/persistent" }
            ]
          }
        ],
        "volumes": [
          {
            "name": "persistent-storage",
            "persistentVolumeClaim": { "claimName": "ssb-artifacts-pvc" }
          }
        ]
      }
    }
  }
}'
```

### Step 2.3 — Fix ownership on the volume (one-time)

The `ssb-sse` container runs as a non-root `ssb` user. A fresh `hostPath` volume comes up owned by root, and the UI upload will still fail on the first `mkdir` under `/persistent/global/tmp/` even after the mount is there. Run a one-shot fixer pod:

```bash
kubectl run fix-perms --image=busybox --restart=Never -n cld-streaming --rm -it \
  --overrides='
{
  "spec": {
    "containers": [{
      "name": "fix-perms",
      "image": "busybox",
      "command": ["sh","-c","chmod -R 777 /mnt/persistent"],
      "volumeMounts": [{"name": "p", "mountPath": "/mnt/persistent"}]
    }],
    "volumes": [{"name": "p", "persistentVolumeClaim": {"claimName": "ssb-artifacts-pvc"}}]
  }
}'
```

`777` is heavy-handed — on a shared cluster set `fsGroup` on the SSE pod's `securityContext` instead and let the kubelet chgrp the volume on mount. For a demo cluster this is fine.

### Step 2.4 — Test the upload

```bash
kubectl rollout restart deployment/ssb-sse -n cld-streaming
kubectl rollout status  deployment/ssb-sse -n cld-streaming --timeout=180s
```

SSB UI → **Data Sources** / **Functions** → upload the Iceberg connector JAR (or a custom UDF JAR). No `Mkdirs failed` error.

Confirm the bytes are actually on the PVC and not on ephemeral pod storage:

```bash
kubectl exec -n cld-streaming deploy/ssb-sse -- ls -la /persistent/
# and from the minikube VM (hostPath backing):
minikube ssh -- ls -la /data/ssb-persistent/
```

### Step 2.5 — (Optional) Point SSB at the volume as its artifact store

Mounting is enough to make the upload path work, but SSB also has a "remote artifact storage" mode that publishes artifacts to a URI so Flink task managers can pull them without needing the same mount. For a single-cluster minikube demo, `/persistent` is enough. For anything real, use S3:

```yaml
ssb:
  ssbConfiguration:
    application.properties: |+
      ssb.job-notifications.enabled=false
      ssb.sse.remote-artifact-storage-dir=sample-bucket/artifacts
      ssb.sse.remote-artifact-storage-type=s3
  storageConfiguration: |
    s3.access-key: root
    s3.secret-key: password
    s3.endpoint: http://minio:9000
    s3.path.style.access: true
```

`storageConfiguration` becomes a Secret mounted at `/etc/hadoop-conf/artifact-storage` inside both SSB and Flink pods. Put S3 credentials, endpoint overrides, path-style access, and anything else Flink's `s3` filesystem needs in there — never in the values file's plain text.

---

## Phase 3 — Persist Flink Checkpoints, Savepoints, and HA

The SSE side is now durable. The **Flink jobs SSB runs** are still not. If `ssb-session-admin` (the session cluster) restarts, or a `FlinkSessionJob` gets re-rolled, whatever keyed state that job had built up is gone unless there's an externalized checkpoint pointing at durable storage.

Everything here goes into `ssb.flinkConfiguration.flink-conf.yaml` in `csa-values.yaml`. It's appended to the default flink-conf and gets applied to every Flink job SSB deploys.

### Option A — S3 (recommended for anything beyond a laptop demo)

```yaml
ssb:
  flinkConfiguration:
    flink-conf.yaml: |+
      # SSB mounts Hadoop and Kerberos files manually
      kubernetes.decorator.hadoop-conf-mount.enabled: false
      kubernetes.decorator.kerberos-mount.enabled: false

      # State backend
      state.backend.type: rocksdb
      state.backend.incremental: true

      # Externalized checkpoints — survive job restart
      execution.checkpointing.interval: 60s
      execution.checkpointing.mode: EXACTLY_ONCE
      execution.checkpointing.externalized-checkpoint-retention: RETAIN_ON_CANCELLATION
      state.checkpoints.dir: s3://sample-bucket/checkpoints/
      state.savepoints.dir: s3://sample-bucket/savepoints/

      # High availability — survive JobManager restart
      high-availability.type: kubernetes
      high-availability.storageDir: s3://sample-bucket/ha/
```

Pair with the `storageConfiguration` block from Phase 2.5 so the `s3://` scheme actually authenticates.

### Option B — PVC (for a single-node minikube where you don't want to run MinIO)

Flink can write checkpoints to any filesystem it can see. Mount a PVC into every Flink pod using the same `podVolumes` / `podVolumeMounts` mechanism from Phase 2, then point checkpoints at the mount path:

```yaml
ssb:
  podVolumes:
    create: true
    data:
      - name: persistent-storage
        persistentVolumeClaim:
          claimName: ssb-artifacts-pvc
      - name: flink-state
        persistentVolumeClaim:
          claimName: flink-state-pvc      # RWX-capable StorageClass required
  podVolumeMounts:
    create: true
    data:
      - name: persistent-storage
        mountPath: /persistent
      - name: flink-state
        mountPath: /flink-state
  flinkConfiguration:
    flink-conf.yaml: |+
      state.backend.type: rocksdb
      state.backend.incremental: true
      execution.checkpointing.interval: 60s
      execution.checkpointing.externalized-checkpoint-retention: RETAIN_ON_CANCELLATION
      state.checkpoints.dir: file:///flink-state/checkpoints
      state.savepoints.dir: file:///flink-state/savepoints
      high-availability.type: kubernetes
      high-availability.storageDir: file:///flink-state/ha
```

The catch: RWO PVCs (which is what minikube's `standard` StorageClass gives you) only bind to one node, so this only works if all Flink pods land on that node. For multi-node, you need RWX — Longhorn, NFS, or a cloud provider's file-share class.

### Option C — Ephemeral (default, do this if you're fine losing state)

Do nothing. Checkpoints go to the local TaskManager working directory, HA is disabled, and a `kubectl rollout restart` on `ssb-session-admin` erases every running job's state. Good enough for interactive `SELECT * FROM …` exploration; not good enough for any streaming pipeline you'd hand to someone else.

---

## Full values file — put it all together

For copy-paste, this is a complete `csa-values.yaml` covering Phases 1–3 with S3:

```yaml
flink-kubernetes-operator:
  enabled: true
  # clouderaLicense injected via --set-file at helm install time

ssb:
  enabled: true

  # Phase 1 — Postgres metadata
  database:
    create: true
    pvcSpec:
      accessModes: [ReadWriteOnce]
      resources:
        requests:
          storage: 5Gi
    resources:
      limits:   { cpu: "1", memory: "2048Mi" }
      requests: { cpu: "500m", memory: "1024Mi" }

  # Phase 2 — /persistent mount for uploads, applied to SSE + every Flink pod
  podVolumes:
    create: true
    data:
      - name: persistent-storage
        persistentVolumeClaim:
          claimName: ssb-artifacts-pvc
  podVolumeMounts:
    create: true
    data:
      - name: persistent-storage
        mountPath: /persistent

  # Phase 2.5 — S3 credentials for Flink's s3 filesystem, mounted as a Secret
  storageConfiguration: |
    s3.access-key: root
    s3.secret-key: password
    s3.endpoint: http://minio.cld-streaming.svc:9000
    s3.path.style.access: true

  # SSB tells Flink where to publish artifacts
  ssbConfiguration:
    application.properties: |+
      ssb.job-notifications.enabled=false
      ssb.sse.remote-artifact-storage-dir=sample-bucket/artifacts
      ssb.sse.remote-artifact-storage-type=s3

  # Phase 3 — Flink checkpoints, savepoints, HA
  flinkConfiguration:
    flink-conf.yaml: |+
      kubernetes.decorator.hadoop-conf-mount.enabled: false
      kubernetes.decorator.kerberos-mount.enabled: false

      state.backend.type: rocksdb
      state.backend.incremental: true

      execution.checkpointing.interval: 60s
      execution.checkpointing.mode: EXACTLY_ONCE
      execution.checkpointing.externalized-checkpoint-retention: RETAIN_ON_CANCELLATION
      state.checkpoints.dir: s3://sample-bucket/checkpoints/
      state.savepoints.dir: s3://sample-bucket/savepoints/

      high-availability.type: kubernetes
      high-availability.storageDir: s3://sample-bucket/ha/
```

Install (or upgrade):

```bash
helm upgrade --install csa-operator \
  --namespace cld-streaming \
  --version 1.5.0-b275 \
  -f csa-values.yaml \
  --set-file flink-kubernetes-operator.clouderaLicense.fileContent=./license.txt \
  --set 'flink-kubernetes-operator.imagePullSecrets[0].name=cloudera-creds' \
  --set 'ssb.sse.image.imagePullSecrets[0].name=cloudera-creds' \
  --set 'ssb.sqlRunner.image.imagePullSecrets[0].name=cloudera-creds' \
  --set 'ssb.mve.image.imagePullSecrets[0].name=cloudera-creds' \
  --set 'ssb.database.imagePullSecrets[0].name=cloudera-creds' \
  oci://container.repository.cloudera.com/cloudera-helm/csa-operator/csa-operator
```

---

## The full persistence test

Deliberately break every pod in the CSA stack and confirm nothing disappears:

```bash
# 1. Baseline
kubectl exec -n cld-streaming deploy/ssb-postgresql -- \
  psql -U ssb_admin -c "SELECT count(*) FROM projects;"
kubectl exec -n cld-streaming deploy/ssb-sse -- ls -la /persistent/

# 2. Bounce everything
kubectl rollout restart deployment/ssb-postgresql -n cld-streaming
kubectl rollout restart deployment/ssb-sse        -n cld-streaming
kubectl rollout restart deployment/ssb-mve        -n cld-streaming
kubectl delete flinkdeployment ssb-session-admin  -n cld-streaming --wait=false
# operator re-creates ssb-session-admin from the ConfigMap

kubectl rollout status deployment/ssb-postgresql -n cld-streaming --timeout=180s
kubectl rollout status deployment/ssb-sse        -n cld-streaming --timeout=180s

# 3. Same numbers? Same files?
kubectl exec -n cld-streaming deploy/ssb-postgresql -- \
  psql -U ssb_admin -c "SELECT count(*) FROM projects;"
kubectl exec -n cld-streaming deploy/ssb-sse -- ls -la /persistent/

# 4. Running FlinkSessionJobs resumed from checkpoint?
kubectl get flinksessionjob -n cld-streaming
# LIFECYCLE STATE should still be STABLE, JOB STATUS RUNNING
```

If all four steps hold, you have real persistence.

---

## Failure modes I've hit

| Symptom | Cause | Fix |
|---|---|---|
| `Mkdirs failed to create file:/persistent/global/tmp/...` on JAR upload | `/persistent` not mounted, or mounted but owned by root | Phase 2.1 + 2.3 |
| Upload works but the JAR is gone after `rollout restart` | Mounted `emptyDir` instead of PVC (double-check the patch) | Phase 2.2, verify with `kubectl describe pod ssb-sse-... \| grep -A2 persistent-storage` |
| Flink job in SSB fails with `File does not exist: /persistent/...` | You patched the SSE pod only, not the Flink pods. `podVolumes`/`podVolumeMounts` covers both | Move the mount into `ssb.podVolumes` in the values file, `helm upgrade` |
| `s3://` checkpoint URLs fail with "No FileSystem for scheme" | Missing `storageConfiguration` block, or missing S3 filesystem plugin in the Flink image | Confirm `flink-s3-fs-*.jar` is in the image, and creds live in `storageConfiguration` |
| Postgres pod comes back but SSB UI shows no projects | The PVC came back but the DB inside it wasn't initialized — probably a fresh PVC that never had the schema written | Re-run `helm upgrade` so the operator re-applies the postgres init ConfigMap |
| `state.checkpoints.dir` points at `file:///flink-state/...` and TaskManagers crashloop on multi-node | RWO PVC only bindable to one node | Use RWX StorageClass (Longhorn / NFS), or switch to S3 |

---

## Reference

Everything in this post was validated against **CSA Operator `1.5.0-b275`** on **minikube v1.37.0 / k8s v1.34.0**. Chart values come straight from `helm show values oci://container.repository.cloudera.com/cloudera-helm/csa-operator/csa-operator --version 1.5.0-b275`, and the helm-value dictionary in the CSA docs Reference page.

### Cloudera Streaming Analytics (CSA)

- [CSA Operator 1.5 documentation](https://docs.cloudera.com/csa-operator/1.5/index.html)
- [CSA Operator 1.5 Helm chart reference (every helm value, with defaults)](https://docs.cloudera.com/csa-operator/1.5/reference/topics/csa-op-reference.html)
- [CSA Operator 1.5 install (internet)](https://docs.cloudera.com/csa-operator/1.5/installation/topics/csa-op-installation-process-internet.html) — where the Longhorn `fsGroup: 999` note comes from
- [CSA Operator 1.5 removing resources](https://docs.cloudera.com/csa-operator/1.5/operator-management/topics/csa-op-removing-resources.html) — the Postgres PVC is intentionally kept on uninstall so your SQL projects survive an operator upgrade
- Related posts on this blog:
  - [Announcing Cloudera Streaming Analytics 1.17.0](/release/Cloudera-Streaming-Analytics-1.17.0/)
  - [Cloudera Streaming Analytics - Kubernetes Operator 1.3](/release/Cloudera-Streaming-Analytics-Kubernetes-Operator-1.3/)
  - [Cloudera Streaming Analytics - Kubernetes Operator 1.2](/release/Cloudera-Streams-Analytics-Kubernetes-Operator-1.2/)

### Companion persistence posts (same `cld-streaming` cluster)

- [Persistence with Cloudera Flow Management Operator](/blog/Persistence-with-Cloudera-Flow-Management-Operator/) — the NiFi companion to this post: five repos, custom NARs, and Python extensions off the minikube mount.
- [Persisting Schema Registry with PostgreSQL](/blog/Persiting-Schema-with-Schema-Registry/) — piggyback Schema Registry on the same `ssb-postgresql` pod Phase 1 sets up here.
- [Cloudera Edge Flow Manager on Kubernetes](/blog/Cloudera-Edge-Flow-Manager-on-Kubernetes/) — full EFM persistence recipe (metadata → same Postgres, plus PVCs for agent binaries and uploaded resources).
- [Observability with Cloudera Streaming Operators](/blog/Observability-with-Cloudera-Streaming-Operators/) — Prometheus + Grafana for the same NiFi/Kafka/Flink stack.

### The rest of the Cloudera Streaming Operators family (CSO)

- **Cloudera Flow Management (CFM) Operator — NiFi:**
  - [CFM Operator documentation](https://docs.cloudera.com/cfm-operator/3.2.0/index.html)
  - [Cloudera Flow Management Operator for Kubernetes 3.1](/release/Cloudera-Flow-Management-Operator-for-Kubernetes-3.1/)
  - [Cloudera Apache NiFi Operator](/blog/Cloudera-Apache-NiFi-Operator/)
- **Cloudera Streams Messaging (CSM) Operator — Kafka / Schema Registry / Streams Messaging Manager:**
  - [CSM Operator documentation](https://docs.cloudera.com/csm-operator/latest/index.html)
  - [Cloudera Streams Messaging Kubernetes Operator 1.6](/release/Cloudera-Streams-Messaging-Kubernetes-Operator-1.6/)
- **Cloudera Edge Flow Manager (EFM) / CEM:**
  - [Cloudera Edge Manager documentation](https://docs.cloudera.com/cem/latest/index.html)

### Repos and images

- Helm chart (OCI): `oci://container.repository.cloudera.com/cloudera-helm/csa-operator/csa-operator`
- Container images (all `1.20.1-csaop1.5.0-b275` unless noted):
  - `container.repository.cloudera.com/cloudera/flink-kubernetes-operator:1.13-csaop1.5.0-b275`
  - `container.repository.cloudera.com/cloudera/flink-extended:1.20.1-csaop1.5.0-b275`
  - `container.repository.cloudera.com/cloudera/ssb-sse:1.20.1-csaop1.5.0-b275`
  - `container.repository.cloudera.com/cloudera/ssb-mve:1.20.1-csaop1.5.0-b275`
  - `docker-private.infra.cloudera.com/cloudera_thirdparty/hardened/postgres:18.1-r0-openshift-202601250614`
- Sample YAMLs and helm values I use across the CSO stack: [`cldr-steven-matison/ClouderaStreamingOperators`](https://github.com/cldr-steven-matison/ClouderaStreamingOperators)


---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.