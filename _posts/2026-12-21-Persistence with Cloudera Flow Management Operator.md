---
title:  "Persistence with Cloudera Flow Management Operator"
excerpt: "How to make everything CFM writes to disk on Kubernetes — flow definitions, FlowFiles, content, provenance, cluster state, custom NARs, and Python extensions — survive pod restarts, rolling updates, and cluster reboots. Includes the migration from a fragile minikube mount at /extensions to a proper PersistentVolumeClaim."
header:
  teaser: "/assets/images/CFM-Cloudera_Flow_Management_Operator.png"
categories:
  - blog
tags:
  - cloudera
  - cfm
  - nifi
  - kubernetes
  - operator
  - persistence
  - minikube
  - python
  - extensions
---

# Persistence with Cloudera Flow Management Operator on Kubernetes

Cloudera Flow Management (CFM) Operator makes it easy to stand up an Apache NiFi cluster on Kubernetes with a single `Nifi` custom resource. What isn't obvious the first time you deploy it is that a "working" install still loses state in **five** different places the moment a pod restarts, plus a sixth surface — Python extensions — that most people patch with a `minikube mount` and then quietly curse every time the mount dies.

This post walks through fixing all of them in one pass, using the same `cfm-streaming` minikube cluster the rest of my Cloudera Streaming Operators (CSO) demos run in. Everything here is validated against **CFM Operator `3.2.0-b39`** with NiFi 2.6.0 on minikube v1.37.0 / k8s v1.34.0.

Companion post covering the same thing for SQL Stream Builder + Flink under the CSA Operator: [Persistence with Cloudera Streaming Analytics Operator](/blog/Persistence-with-Cloudera-Streaming-Analytics-Operator/).

---

## What CFM actually stores, and where

Before touching any YAML, this is the layout you're aiming for:

| State | Where the operator puts it | Path in pod | Persisted by |
|---|---|---|---|
| **`flow.xml.gz`, `authorizers.xml`, users, state.xml** | `data` repo | `/opt/nifi/nifi-current/data` | PVC per pod via `spec.persistence.data` |
| **In-flight FlowFiles** | `flowfileRepo` | `/opt/nifi/nifi-current/flowfile-repository` | PVC per pod via `spec.persistence.flowfileRepo` |
| **Payload content** | `contentRepo` | `/opt/nifi/nifi-current/content-repository` | PVC per pod via `spec.persistence.contentRepo` |
| **Provenance / lineage** | `provenanceRepo` | `/opt/nifi/nifi-current/provenance-repository` | PVC per pod via `spec.persistence.provenanceRepo` |
| **Node runtime state, leader election** | `state` | `/opt/nifi/nifi-current/state` | PVC per pod via `spec.persistence.state` |
| **Custom Java NARs** | `narProvider` | `/opt/nifi/nifi-current/nar-provider` (Cloudera-specific) | Shared PVC via `spec.narProvider.volumes` |
| **Python extensions (processors)** | `statefulset.volumes` | `/opt/nifi/nifi-current/python/extensions` | Shared PVC via `spec.statefulset.volumes` |

Rows 1–5 come from `NifiPersistenceSpec` (documented in the CFM Operator Helm/CR reference). Rows 6 and 7 need extra care — row 7 in particular is where the "minikube mount" trap sits.

The good news: the operator already knows how to manage all of this via `volumeClaimTemplates` on the underlying StatefulSet. You just need to declare the storage in the right places on the `Nifi` CR.

---

## Prerequisites

- StorageClass that supports **ReadWriteOnce (RWO)** — this is what minikube's `standard` class gives you, and what almost every cloud provisioner (`gp3`, `standard`, `longhorn`, `openebs`, etc.) defaults to. RWO is fine for repos and state (they're per-pod). Custom NARs / Python extensions **need RWX** if you scale NiFi beyond a single node — more on that below.
- CFM Operator installed in the same namespace as (or a namespace that watches) the target `Nifi` CR.
- CFM Operator version `3.2.0-b39` for this walkthrough — the images are:
  - `container.repository.cloudera.com/cloudera/cfm-operator:3.2.0-b39`
  - `container.repository.cloudera.com/cloudera/cfm-nifi-k8s:3.1.0-b129-nifi_2.6.0.4.12.0.1-9` (NiFi 2.x)
  - `container.repository.cloudera.com/cloudera/cfm-tini:3.2.0-b39`

**Important notes before starting:**

- PVCs created by `volumeClaimTemplates` are **per-pod** (named like `<name>-<repo>-<ordinal>`, e.g. `data-mynifi-0`). They are **not** deleted when you update the CR or roll the pod. That's what makes this work — the operator hands the same PVC back to the new pod after a restart.
- Operator handles data offloading during scale-down automatically.
- No changes to `nifi.properties` or ConfigMaps needed — the operator injects the mounts.
- Tested / validated pattern against CFM Operator 3.2.

---

## Step 1 — Prepare your StorageClass

Confirm your default StorageClass works, or create a named one so you can point specific repos at it:

```bash
kubectl get storageclass
kubectl describe storageclass <your-storageclass-name>
```

Look for the `provisioner` — on minikube it's `k8s.io/minikube-hostpath`; yours may be different. If you want a dedicated class for NiFi repos, save this as `nifi-storage-class.yaml`:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nifi-storage
provisioner: k8s.io/minikube-hostpath
reclaimPolicy: Retain
volumeBindingMode: Immediate
allowVolumeExpansion: true
```

`allowVolumeExpansion: true` matters — you'll thank yourself the day the content repo fills up and you want to bump it without redeploying NiFi.

```bash
kubectl apply -f nifi-storage-class.yaml
```

Export your current `Nifi` CR for backup and diffing before touching anything:

```bash
kubectl get nifi mynifi -n cfm-streaming -o yaml > nifi-base-backup.yaml
```

---

## Step 2 — Persist the five NiFi repos (`spec.persistence`)

Edit your `Nifi` CR file (mine is `nifi-cluster-30-nifi2x-python.yaml`, yours might be named differently). Add — or expand — the `persistence` block under `spec:`, at the same level as `replicas`, `image`, `security`, etc.

**Recommended minimal configuration for flows + good durability:**

```yaml
spec:
  # ... your existing settings (replicas, image, etc.) ...

  persistence:
    # Global defaults (applied to any repo not explicitly overridden)
    size: 10Gi
    storageClass: nifi-storage

    # === CRITICAL FOR FLOWS ===
    data:                     # ← persists flow.xml.gz + configs
      size: 20Gi              # bump if you have large / complex flows
      storageClass: nifi-storage

    # Highly recommended companions
    state:                    # node runtime state, leader election, etc.
      size: 5Gi
      storageClass: nifi-storage

    flowfileRepo:             # in-flight FlowFiles
      size: 20Gi
      storageClass: nifi-storage

    contentRepo:              # actual payload content
      size: 50Gi              # often the largest
      storageClass: nifi-storage

    provenanceRepo:           # lineage / audit data
      size: 30Gi
      storageClass: nifi-storage
```

**Why the `data` repo is the one to focus on:** the base / evaluation `Nifi` CRs you'll see in Cloudera samples (or the pattern in `nifi-cluster-30-nifi2x-python.yaml` before this change) often omit full persistence or use ephemeral storage for simplicity. That causes **flow loss on StatefulSet re-rolls** — the single most annoying failure mode in this whole stack. The `data` repo is what stores `flow.xml.gz`, so persisting it is the direct fix. Everything else (state, flowfile, content, provenance) is durability for FlowFiles in-flight and lineage records — set them too if you care about surviving a re-roll mid-run.

---

## Step 3 — Delete and re-apply the CR

If NiFi is already deployed on the ephemeral StatefulSet, delete it. **This is the last time you have to re-create your flows.** Once persistence is in place, the same PVCs will get handed back to every future pod.

```bash
kubectl delete nifi mynifi -n cfm-streaming
kubectl apply -f nifi-cluster-30-nifi2x-python.yaml -n cfm-streaming
```

The operator will re-roll NiFi and new PVCs will be created automatically. Watch:

```bash
kubectl get pods -n cfm-streaming -l app.kubernetes.io/name=nifi -w
kubectl get pvc  -n cfm-streaming -w
```

You should see PVCs like this appear and go `Bound`:

```
NAME                             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
content-repository-mynifi-0      Bound    pvc-ed5daf31-...                           50Gi       RWO            nifi-storage   3m
data-mynifi-0                    Bound    pvc-d6054f5e-...                           20Gi       RWO            nifi-storage   3m
flowfile-repository-mynifi-0     Bound    pvc-ea2041f6-...                           20Gi       RWO            nifi-storage   3m
provenance-repository-mynifi-0   Bound    pvc-8fc752e8-...                           30Gi       RWO            nifi-storage   3m
state-mynifi-0                   Bound    pvc-37bdae77-...                           5Gi        RWO            nifi-storage   3m
```

That output is copy-pasted from this laptop's actual `cfm-streaming` namespace — this is what a working install looks like.

---

## Step 4 — Prove flow persistence works

The real test — deploy a flow, force a re-roll, confirm the flow's still there:

1. Open the NiFi UI, build a small flow, start it, confirm it runs.
2. Force a re-roll (this is the safest way, it re-schedules the pod without deleting the CR):

    ```bash
    kubectl rollout restart statefulset mynifi -n cfm-streaming
    ```

3. Wait for the pod to be Running / Ready again:

    ```bash
    kubectl rollout status statefulset/mynifi -n cfm-streaming --timeout=180s
    ```

4. Refresh the NiFi UI — **your test flow must still be there**.

If it's not, check the pod's mounts and PVC bindings:

```bash
kubectl exec -n cfm-streaming mynifi-0 -c nifi -- mount | grep nifi-current
kubectl describe pod -n cfm-streaming mynifi-0 | grep -A2 -iE "flowfile|content|provenance|state|data"
kubectl logs -n cfm-streaming mynifi-0 -c nifi | grep -i persist
```

---

## Step 5 — Persist custom Java NARs (`narProvider`)

CFM Operator has a first-class field for custom NARs — you don't have to wire this into the StatefulSet by hand. Add a `narProvider` block to `spec:`:

```yaml
spec:
  # ... persistence block from step 2 ...
  narProvider:
    volumes:
      - volumeClaimName: custom-nars
```

And create the PVC once, ahead of the CR apply:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: custom-nars
  namespace: cfm-streaming
spec:
  storageClassName: "standard"
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Mi
```

Drop your `.nar` files into it — the simplest way is a one-shot loader pod, same pattern as Step 6 below. Once they're on the PVC, the operator mounts them into every NiFi pod under `/opt/nifi/nifi-current/nar-provider/<pvc-name>/` (in this example, `/opt/nifi/nifi-current/nar-provider/custom-nars/`) and NiFi picks up the components on the next restart. The subdirectory is named after the PVC, which matters if you're wiring up multiple NAR sources.

Confirm the PVC has what you expect:

```bash
kubectl run tmp-inspect --rm -it --restart=Never --image=busybox -n cfm-streaming \
  --overrides='{"spec":{"containers":[{"name":"tmp-inspect","image":"busybox","command":["ls","-la","/mnt/nars"],
    "volumeMounts":[{"name":"n","mountPath":"/mnt/nars"}]}],
    "volumes":[{"name":"n","persistentVolumeClaim":{"claimName":"custom-nars"}}]}}'
```

Output on this laptop:

```
total 136
-rw-r--r-- 1 501 staff   1957 Apr  8 17:22 custom-transaction-generator.nar
-rw-r--r-- 1 501 staff 126892 Apr  9 12:57 nifi-mycustom-nar-1.0.0-SNAPSHOT.nar
```

If you scale NiFi to more than one node, swap the StorageClass for an RWX one (Longhorn, NFS, cloud file-share). RWO is fine for a single-node minikube demo.

---

## Step 6 — Persist Python extensions (moving off the `minikube mount` trap)

This is the piece the current `cfm-persisted-volume.md` didn't cover, and the piece I've been fighting the longest.

### The trap

When you first stand up NiFi 2.x with custom Python processors on minikube, the natural thing to do is drop them onto a folder on your Mac and mount it into the minikube VM:

```bash
minikube mount ~/nifi-custom-processors:/extensions &
```

…and reference `/extensions` from the `Nifi` CR as a `hostPath`:

```yaml
spec:
  statefulset:
    volumes:
      - name: python-extensions
        hostPath:
          path: /extensions
    volumeMounts:
      - name: python-extensions
        mountPath: /opt/nifi/nifi-current/python/extensions
```

This works. It's also fragile:

- `minikube mount` runs a 9p filesystem over the minikube network. Inspecting `mount` inside the NiFi pod shows exactly that: `192.168.65.254 on /opt/nifi/nifi-current/python/extensions type 9p (rw,relatime,dfltuid=10001,dfltgid=10001,...)`. That's a network mount, not real storage.
- The 9p connection dies on `minikube stop / start`, on network flaps, and every time the mount command's background process is killed. When it dies, NiFi's Python processors go missing — sometimes with `Could not load module`, sometimes silently.
- It only works because the developer running the demo remembered to run `minikube mount`. Nothing in the cluster references it or restarts it.
- It doesn't survive being moved to any real cluster — there is no `/extensions` on your production nodes.

### The fix — a real PVC, seeded by a loader pod

Save this as `python-extensions-loader.yaml`:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: custom-python-extensions
  namespace: cfm-streaming
spec:
  storageClassName: "standard"
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Mi
---
apiVersion: v1
kind: Pod
metadata:
  name: python-extensions-loader
  namespace: cfm-streaming
spec:
  containers:
    - name: ubuntu
      image: ubuntu:latest
      command: ["/bin/bash"]
      stdin: true
      tty: true
      volumeMounts:
        - name: custom-python-extensions-vol
          mountPath: /home/ubuntu/extensions
  volumes:
    - name: custom-python-extensions-vol
      persistentVolumeClaim:
        claimName: custom-python-extensions
```

Apply, then copy your Python processors in:

```bash
kubectl apply -f python-extensions-loader.yaml -n cfm-streaming
kubectl wait --for=condition=Ready pod/python-extensions-loader -n cfm-streaming --timeout=60s

# Copy your extensions folder into the PVC via the loader pod
kubectl cp ~/nifi-custom-processors/. \
  cfm-streaming/python-extensions-loader:/home/ubuntu/extensions/

# Sanity check
kubectl exec -n cfm-streaming python-extensions-loader -- ls -la /home/ubuntu/extensions/
```

Then — and this bit isn't optional — **fix ownership** so NiFi's non-root user (uid `10001`) can read and write. `kubectl cp` from macOS drops files owned by the source-machine's UID (typically `501:staff`), which the pod then can't touch:

```bash
kubectl exec -n cfm-streaming python-extensions-loader -- \
  chown -R 10001:10001 /home/ubuntu/extensions/
```

Skip this and NiFi silently fails to load the module — with logs that only tell you "Could not load module" and no `chmod` hint.

The loader stays running so you can `kubectl cp` more files in later without re-applying anything. Delete it when you're done editing extensions:

```bash
kubectl delete pod python-extensions-loader -n cfm-streaming
```

The PVC and its contents stay behind — that's the whole point.

### Point NiFi at the PVC instead of `/extensions`

Update the `Nifi` CR's `statefulset.volumes` block: swap the `hostPath` for the PVC. This is the diff, in place:

```yaml
spec:
  statefulset:
    volumes:
      - name: python-extensions
        persistentVolumeClaim:
          claimName: custom-python-extensions      # ← was: hostPath.path: /extensions
    volumeMounts:
      - name: python-extensions
        mountPath: /opt/nifi/nifi-current/python/extensions
```

Re-apply the CR and roll. The full CR YAML that pairs with this walkthrough lives in [`cldr-steven-matison/ClouderaStreamingOperators`](https://github.com/cldr-steven-matison/ClouderaStreamingOperators) as `nifi-cluster-32-nifi2x-pvc.yaml`:

```bash
kubectl apply -f nifi-cluster-32-nifi2x-pvc.yaml -n cfm-streaming
kubectl rollout restart statefulset mynifi -n cfm-streaming
kubectl rollout status  statefulset/mynifi -n cfm-streaming --timeout=180s
```

**Tip:** run `kubectl diff -f nifi-cluster-32-nifi2x-pvc.yaml` first. If your live NiFi is healthy and only `/extensions` needs to change, the diff should be a single volume replacement — nothing else. If you see repo PVCs, images, or security blocks moving, stop and reconcile the YAML with the live CR before applying.

You can also kill the `minikube mount` process now — nothing needs it anymore.

Verify inside the pod that the extensions path is a real block device (backed by the PVC) instead of a 9p network mount:

```bash
kubectl exec -n cfm-streaming mynifi-0 -c nifi -- mount | grep 'python/extensions'
# Expect: /dev/... on /opt/nifi/nifi-current/python/extensions type ext4 (rw,relatime,discard)
# NOT:    192.168.65.254 on /opt/nifi/nifi-current/python/extensions type 9p ...
```

That's the signal — real disk, not a fragile mount.

**Multi-node caveat:** just like custom NARs, if you scale NiFi beyond one pod, `custom-python-extensions` must be on an RWX StorageClass (Longhorn, NFS, cloud file-share). RWO works fine on single-node minikube.

---

## Full CR — put it all together

For copy-paste, this is a complete `nifi-cluster-32-nifi2x-pvc.yaml` covering steps 2–6 — the same file lives in [`cldr-steven-matison/ClouderaStreamingOperators`](https://github.com/cldr-steven-matison/ClouderaStreamingOperators) alongside `python-extensions-loader.yaml`:

```yaml
apiVersion: cfm.cloudera.com/v1alpha1
kind: Nifi
metadata:
  name: mynifi
  namespace: cfm-streaming
spec:
  replicas: 1
  nifiVersion: "2.6.0"
  image:
    repository: container.repository.cloudera.com/cloudera/cfm-nifi-k8s
    tag: 3.1.0-b129-nifi_2.6.0.4.12.0.1-9
    pullSecret: cloudera-creds
  tiniImage:
    repository: container.repository.cloudera.com/cloudera/cfm-tini
    tag: 3.2.0-b39
    pullSecret: cloudera-creds

  # === Step 2 — five NiFi repos ===
  persistence:
    size: 10Gi
    storageClass: nifi-storage
    data:           { size: 20Gi, storageClass: nifi-storage }
    state:          { size:  5Gi, storageClass: nifi-storage }
    flowfileRepo:   { size: 20Gi, storageClass: nifi-storage }
    contentRepo:    { size: 50Gi, storageClass: nifi-storage }
    provenanceRepo: { size: 30Gi, storageClass: nifi-storage }

  # === Step 5 — custom Java NARs ===
  narProvider:
    volumes:
      - volumeClaimName: custom-nars

  # === Step 6 — Python extensions on a PVC (not a minikube mount) ===
  statefulset:
    volumes:
      - name: python-extensions
        persistentVolumeClaim:
          claimName: custom-python-extensions
    volumeMounts:
      - name: python-extensions
        mountPath: /opt/nifi/nifi-current/python/extensions

  hostName: mynifi-web.mynifi.cfm-streaming.svc.cluster.local
  uiConnection:
    type: Ingress
    ingressConfig:
      hostname: ""
    annotations:
      nginx.ingress.kubernetes.io/affinity: cookie
      nginx.ingress.kubernetes.io/affinity-mode: persistent
      nginx.ingress.kubernetes.io/backend-protocol: HTTPS
      nginx.ingress.kubernetes.io/ssl-passthrough: "true"
      nginx.ingress.kubernetes.io/ssl-redirect: "true"
  security:
    initialAdminIdentity: "admin"
    nodeCertGen:
      issuerRef:
        name: cfm-operator-ca-issuer-signed
        kind: ClusterIssuer
    singleUserAuth:
      enabled: true
      credentialsSecretName: "nifi-admin-creds"
  configOverride:
    nifiProperties:
      upsert:
        nifi.cluster.leader.election.implementation: "KubernetesLeaderElectionManager"
  stateManagement:
    clusterProvider:
      id: kubernetes-provider
      class: org.apache.nifi.kubernetes.state.provider.KubernetesConfigMapStateProvider
```

---

## The full persistence test

Bounce NiFi and confirm every piece of state survives:

```bash
# 1. Baseline
kubectl exec -n cfm-streaming mynifi-0 -c nifi -- \
  ls /opt/nifi/nifi-current/data /opt/nifi/nifi-current/python/extensions

# 2. Roll the StatefulSet
kubectl rollout restart statefulset/mynifi -n cfm-streaming
kubectl rollout status  statefulset/mynifi -n cfm-streaming --timeout=180s

# 3. Same files? Flow still visible in the UI?
kubectl exec -n cfm-streaming mynifi-0 -c nifi -- \
  ls /opt/nifi/nifi-current/data /opt/nifi/nifi-current/python/extensions

# 4. Every mount is a real block device, no 9p, no emptyDir
kubectl exec -n cfm-streaming mynifi-0 -c nifi -- mount | \
  grep -E 'nifi-current|nar-provider'
```

Refresh the NiFi UI — every flow, every custom Java NAR, every Python processor should be exactly where you left it.

---

## Failure modes I've hit

| Symptom | Cause | Fix |
|---|---|---|
| Flow disappears after a StatefulSet re-roll | `data` repo not persisted (ephemeral or `emptyDir`) | Step 2 — add `spec.persistence.data` |
| `Could not load module` on Python processors after `minikube stop / start` | The `minikube mount` 9p filesystem died with the VM | Step 6 — move to a PVC |
| Python processors work locally but the same CR fails on a "real" cluster | `hostPath: /extensions` doesn't exist on those nodes | Step 6 — the PVC pattern works everywhere |
| Custom NAR appears in `custom-nars` PVC but NiFi UI doesn't show the processor | `narProvider` block missing from the CR (or the operator hasn't rolled) | Step 5, then `kubectl rollout restart statefulset/mynifi` |
| PVCs stuck `Pending` — `no volume plugin matched` | StorageClass name typo, or default class not set on the cluster | `kubectl get storageclass`; check spelling and default annotation |
| Content repo fills up mid-demo and the pod goes `OOMKilled`-adjacent | `contentRepo` too small | With `allowVolumeExpansion: true` on the class, `kubectl edit pvc content-repository-mynifi-0`, bump `spec.resources.requests.storage` |
| `helm uninstall` on the operator wipes NiFi state | It shouldn't — the PVCs are labelled to survive, but confirm | `kubectl get pvc -n cfm-streaming` after uninstall; they should still be `Bound` |
| Scaling NiFi to `replicas: 2+` fails to schedule the second pod | `custom-nars` / `custom-python-extensions` on an RWO class | Move both to an RWX StorageClass (Longhorn, NFS, cloud file-share) |

---

## Expected outcome

After all six steps, this is what you get:

- **Flows** survive `kubectl rollout restart`, `minikube stop / start`, node failures, and CFM Operator upgrades.
- **In-flight FlowFiles** and **content** survive the same events — no data loss mid-pipeline.
- **Provenance** history is preserved across restarts, so lineage queries still return real answers after a bounce.
- **Custom Java NARs** and **Python processors** are cluster-native — no hostPath, no `minikube mount`, no manual re-syncing. The same YAML that works on your laptop works on a real cluster.
- **`/extensions` is no longer a minikube trap.** It's a first-class PVC with a documented loader-pod pattern for adding new processors.

That last one is the big win. It's the difference between a demo that works on the presenter's laptop and a recipe you can ship.

---

## Reference

Everything in this post was validated against **CFM Operator `3.2.0-b39`** on **minikube v1.37.0 / k8s v1.34.0**, with NiFi 2.6.0. The CFM Operator installs into `cfm-streaming` and manages the `mynifi` `Nifi` CR referenced throughout.

### Cloudera Flow Management (CFM)

- [CFM Operator 3.2 documentation](https://docs.cloudera.com/cfm-operator/3.2.0/index.html)
- [CFM Operator 3.2 — install the operator](https://docs.cloudera.com/cfm-operator/3.2.0/installation/topics/cfm-op-install-cfm-op.html)
- [CFM Operator 3.2 — deploy a NiFi cluster](https://docs.cloudera.com/cfm-operator/3.2.0/nifi-deployment-configuration/topics/cfm-op-deploy-nifi-cluster.html)
- [CFM Operator 3.2 — NiFi Registry deployment](https://docs.cloudera.com/cfm-operator/3.2.0/registry-deployment-configuration/topics/cfm-op-nifi-registry-deployment.html)
- [CFM Operator 3.2 — what's new](https://docs.cloudera.com/cfm-operator/3.2.0/release-notes/topics/cfm-op-whats-new-320.html)
- [CFM Operator 3.2 — component versions](https://docs.cloudera.com/cfm-operator/3.2.0/release-notes/topics/cfm-op-component-versions.html)
- Related posts on this blog:
  - [Cloudera Flow Management Operator for Kubernetes 3.1](/release/Cloudera-Flow-Management-Operator-for-Kubernetes-3.1/)
  - [Cloudera Apache NiFi Operator](/blog/Cloudera-Apache-NiFi-Operator/)
  - [How To Install NiFi Registry on Kubernetes with CFM Operator](/blog/How-To-Install-NiFi-Registry-on-Kubernetes-with-CFM-Operator/)
  - [How to AI with NiFi and Python](/blog/How-to-AI-with-NiFi-and-Python/) — where the Python processors this post persists come from

### Companion persistence posts (same `cld-streaming` / `cfm-streaming` cluster)

- [Persistence with Cloudera Streaming Analytics Operator](/blog/Persistence-with-Cloudera-Streaming-Analytics-Operator/) — SSB metadata, user artifacts, Flink checkpoints / savepoints / HA.
- [Persisting Schema Registry with PostgreSQL](/blog/Persiting-Schema-with-Schema-Registry/) — piggyback Schema Registry on the same Postgres pod CSA sets up.
- [Cloudera Edge Flow Manager on Kubernetes](/blog/Cloudera-Edge-Flow-Manager-on-Kubernetes/) — full EFM persistence recipe.
- [Observability with Cloudera Streaming Operators](/blog/Observability-with-Cloudera-Streaming-Operators/) — Prometheus + Grafana for the same NiFi / Kafka / Flink stack.

### The rest of the Cloudera Streaming Operators family (CSO)

- **Cloudera Streaming Analytics (CSA) Operator — Flink / SSB:**
  - [CSA Operator 1.5 documentation](https://docs.cloudera.com/csa-operator/1.5/index.html)
  - [Announcing Cloudera Streaming Analytics 1.17.0](/release/Cloudera-Streaming-Analytics-1.17.0/)
- **Cloudera Streams Messaging (CSM) Operator — Kafka / Schema Registry / SMM:**
  - [CSM Operator documentation](https://docs.cloudera.com/csm-operator/latest/index.html)
  - [Cloudera Streams Messaging Kubernetes Operator 1.6](/release/Cloudera-Streams-Messaging-Kubernetes-Operator-1.6/)
- **Cloudera Edge Flow Manager (EFM) / CEM:**
  - [Cloudera Edge Manager documentation](https://docs.cloudera.com/cem/latest/index.html)

### Repos and images

- Helm chart (OCI): `oci://container.repository.cloudera.com/cloudera-helm/cfm-operator/cfm-operator`
- Container images (validated against CFM Operator 3.2.0-b39):
  - `container.repository.cloudera.com/cloudera/cfm-operator:3.2.0-b39`
  - `container.repository.cloudera.com/cloudera/cfm-tini:3.2.0-b39`
  - `container.repository.cloudera.com/cloudera/cfm-nifi-k8s:3.1.0-b129-nifi_2.6.0.4.12.0.1-9` (NiFi 2.x)
  - `container.repository.cloudera.com/cloudera/cfm-nifi-k8s:3.1.0-b129-nifi_1.28.1.2.3.17.0-9` (NiFi 1.x)
  - `container.repository.cloudera.com/cloudera/cfm-nifiregistry-k8s:3.1.0-b129-nifi_2.6.0.4.12.0.1-9` (Registry, NiFi 2.x)
- Sample YAMLs and helm values I use across the CSO stack: [`cldr-steven-matison/ClouderaStreamingOperators`](https://github.com/cldr-steven-matison/ClouderaStreamingOperators)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.