---
title:  "Cloudera Edge Flow Manager on Kubernetes"
excerpt: "A full recipe for running Cloudera Edge Flow Manager (EFM) on minikube with everything — agent classes, flows, agent binaries, and uploaded resources — surviving pod restarts and cluster reboots."
header:
  teaser: "/assets/images/EFM_on_Kubernetes.png"
categories:
  - blog
tags:
  - cloudera
  - efm
  - edge flow manager
  - minifi
  - kubernetes
  - cem
  - Cloudera Edge Manager
---

If you have ever run [Cloudera Edge Flow Manager (EFM)](https://docs.cloudera.com/cem/2.3.1/index.html) out of the box on Kubernetes, you know the sad little moment when the pod restarts and every agent class, every flow, and every resource you painstakingly uploaded is just... gone. EFM's default persistence lives inside the pod's ephemeral filesystem, and unless you wire it up properly it never sees a second day.

This post is the recipe I keep coming back to for running EFM `2.3.1.0-2` on minikube with **full** persistence. All state survives `kubectl rollout restart`, `minikube stop`, or the laptop lid closing on you at the wrong moment.

Three things need a permanent home:

- **Metadata** (agent classes, flows, agents, manifests) → PostgreSQL
- **Agent binaries** (MiNiFi C++ / Java installers) → a PVC
- **Uploaded resources** (Python scripts, JARs, custom assets) → a second PVC

The third one is the piece a bare EFM install always loses on restart, and it is the reason this post exists.

---

## 1. Prerequisites

You will need a running minikube cluster with:

- Installed [Cloudera Streaming Operators](/blog/Cloudera-Streaming-Operators/) in the `cld-streaming` namespace
- A PostgreSQL pod (I use `ssb-postgresql` from the SSB stack) — this becomes EFM's backing store
- Kafka pods if your flows publish to Kafka
- Access to `container.repo.cloudera.com` (your Cloudera entitlement)

Confirm they are all up:

```bash
kubectl get pods -n cld-streaming | grep -E "postgres|kafka"
```

---

## 2. Create the EFM Database in PostgreSQL

EFM needs its own database and user inside the existing Postgres. One-time setup:

```bash
PG=$(kubectl get pods -n cld-streaming | grep postgres | awk '{print $1}' | head -1)
kubectl exec $PG -n cld-streaming -- psql -U postgres -c "CREATE DATABASE efm;"
kubectl exec $PG -n cld-streaming -- psql -U postgres -c "CREATE USER efm WITH PASSWORD 'efm_password';"
kubectl exec $PG -n cld-streaming -- psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE efm TO efm;"
kubectl exec $PG -n cld-streaming -- psql -U postgres -c "ALTER DATABASE efm OWNER TO efm;"
```

---

## 3. Create the Secrets

Three secrets: the DB password, the EFM encryption password, and the Cloudera registry pull secret.

```bash
kubectl create secret generic efm-db-pass \
  --from-literal=password=efm_password \
  --namespace cld-streaming

kubectl create secret generic efm-encryption \
  --from-literal=encryption.password=efm_encryption_key \
  --namespace cld-streaming

source ~/.env
kubectl create secret docker-registry cloudera-registry \
  --docker-server=container.repo.cloudera.com \
  --docker-username=$CLOUDERA_USER \
  --docker-password=$CLOUDERA_PASS \
  --namespace=cld-streaming
```

:warning: **Warning!** `already exists` errors from prior sessions are fine — skip those.
{: .notice--warning}


---

## 4. Pull the EFM Image into Minikube

```bash
eval $(minikube docker-env)
docker login container.repo.cloudera.com
docker pull container.repo.cloudera.com/cloudera/efm:2.3.1.0-2
```

Match the tag to your CSO / CEM entitlement.

---

## 5. The ConfigMap

Save the following as `efm-configMap.yaml`. This is the full `efm.properties` file, and the important part is the `efm.db.*` block — that is what points EFM at Postgres instead of its default embedded H2 database.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: efm-config
  namespace: cld-streaming
data:
  efm.properties: |
    # Web Server Properties
    efm.server.address=0.0.0.0
    efm.server.port=10090
    efm.server.servlet.contextPath=/efm

    # Cluster Properties
    efm.cluster.enabled=false

    # Web Server TLS Properties
    efm.server.ssl.enabled=false
    efm.server.ssl.keyStore=./conf/keystore.jks
    efm.server.ssl.keyStoreType=jks
    efm.server.ssl.keyStorePassword=
    efm.server.ssl.keyPassword=
    efm.server.ssl.trustStore=./conf/truststore.jks
    efm.server.ssl.trustStoreType=jks
    efm.server.ssl.trustStorePassword=
    efm.server.ssl.clientAuth=WANT

    # User Authentication Properties
    efm.security.user.auth.enabled=false
    efm.security.user.auth.adminIdentities=admin
    efm.security.user.auth.autoRegisterNewUsers=true
    efm.security.user.auth.authTokenExpiration=12h
    efm.security.user.auth.groups.manager=INTERNAL
    efm.security.user.auth.groups.adminIdentities=
    efm.security.user.auth.groups.filter=.*
    efm.security.user.certificate.enabled=false
    efm.security.user.oidc.enabled=false
    efm.security.user.saml.enabled=false
    efm.security.user.knox.enabled=false
    efm.security.user.proxy.enabled=false

    # Database Properties (PostgreSQL Persistence)
    efm.db.url=jdbc:postgresql://ssb-postgresql.cld-streaming.svc:5432/efm
    efm.db.driverClass=org.postgresql.Driver
    efm.db.username=efm
    efm.db.password=efm_password
    efm.db.maxConnections=50
    efm.db.sqlDebug=false
    efm.db.l2CacheEnabled=false

    # Heartbeat Properties
    efm.heartbeat.maxAgeToKeep=0
    efm.heartbeat.persistContent=false
    efm.heartbeat.kafka.publishEnabled=false

    # Edge Event Retention Properties
    efm.event.cleanupInterval=30s
    efm.event.maxAgeToKeep.debug=0m
    efm.event.maxAgeToKeep.info=1h
    efm.event.maxAgeToKeep.warn=1d
    efm.event.maxAgeToKeep.error=7d

    # Agent Class Flow Monitor Properties
    efm.agentClassMonitor.interval=15s

    # Agent Monitoring Properties
    efm.monitor.maxHeartbeatInterval=5m
    efm.monitor.agentCertExpiryWarningInterval=30d

    # Operation Properties
    efm.operation.monitoring.enabled=true
    efm.operation.monitoring.inQueuedStateTimeoutHeartbeatRate=1.0
    efm.operation.monitoring.inDeployedStateTimeout=5m
    efm.operation.monitoring.inDeployedStateCheckFrequency=1m
    efm.operation.monitoring.rollingBatchOperationsFrequency=10s
    efm.operation.monitoring.rollingBatchOperationsSize=100
    efm.operation.monitoring.rollingOperationsSize.update.asset=10
    efm.operation.monitoring.rollingOperationsSize.update.configuration=100
    efm.operation.monitoring.rollingOperationsSize.update.properties=100
    efm.operation.monitoring.rollingOperationsSize.sync.resource=10

    # Bulletin Registry Properties
    efm.bulletinregistry.agentBulletinMaxAgeToKeep=5m
    efm.bulletinregistry.agentClassBulletinMinAgeToKeep=10s
    efm.bulletinregistry.agentClassBulletinMaxAgeToKeep=5m

    # Metrics Properties
    management.metrics.efm.enabled=true
    management.simple.metrics.export.enabled=false
    management.prometheus.metrics.export.enabled=true
    management.prometheus.metrics.export.descriptions=true
    management.metrics.enable.efm.heartbeat=true
    management.metrics.enable.efm.repo=true
    management.metrics.efm.enableTag.host=true
    management.metrics.efm.enableTag.protocol=false
    management.metrics.efm.enableTag.agentClass=true
    management.metrics.efm.enableTag.agentManifestId=true
    management.metrics.efm.enableTag.agentId=true
    management.metrics.efm.maxTags.agentClass=20
    management.metrics.efm.maxTags.agentManifestId=10
    management.metrics.efm.maxTags.agentId=100
    management.metrics.tags.application=efm
    management.metrics.distribution.percentiles.all=.75,.95,.99

    # Health and Info Properties
    efm.actuator.clusterHealthUpdateFrequency=10s
    efm.actuator.clusterInfoUpdateFrequency=1m
    management.endpoint.health.showDetails=never
    management.endpoint.health.showComponents=always
    management.health.refresh.enabled=false
    management.health.livenessstate.enabled=false
    management.health.readinessstate.enabled=false
    spring.cloud.discovery.client.compositeIndicator.enabled=false

    # EL Specification Properties
    efm.el.specifications.dir=./specs

    # Logging Properties
    logging.pattern.level=%5p [${spring.application.name:},%X{traceId:-},%X{spanId:-}]
    logging.level.com.cloudera.cem.efm=INFO
    logging.level.com.hazelcast=WARN
    logging.level.com.hazelcast.internal.cluster.ClusterService=INFO
    logging.level.com.hazelcast.internal.nio.tcp.TcpIpConnection=ERROR
    logging.level.com.hazelcast.internal.nio.tcp.TcpIpConnector=ERROR

    # General System Settings
    efm.data.transfer.maxFileSize=16MB
    efm.data.transfer.cleanupInterval=1h
    efm.data.transfer.maxAgeToKeep=1d
    efm.data.transfer.maxEntriesToKeep=100
    efm.agentManager.commands.displayLimit=20
    spring.main.banner-mode=log
    efm.asset.s3.downloadRootPath=/tmp/efm-asset-download
    efm.diagnosticBundle.enabled=false
    efm.agent-deployer.security.autoConfiguration=false
    efm.agent-deployer.security.ca.privateKeyPassword=
    spring.servlet.multipart.max-file-size=100MB
    spring.servlet.multipart.max-request-size=100MB
```

---

## 6. The Persistent Volume Claims

Save the following as `efm-pvc.yaml`. Two PVCs: one for agent installer binaries, one for uploaded resources like Python scripts and JARs.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: efm-agent-binaries
  namespace: cld-streaming
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
  storageClassName: standard
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: efm-resources
  namespace: cld-streaming
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard
```

:trophy: **Pro Tip!** The `efm-resources` PVC is the one everyone forgets. Without it, uploaded scripts get tracked in the DB but the actual bytes vanish on restart — every flow that references an uploaded resource breaks.
{: .notice--warning}

---

## 7. The Deployment and Service

Save the following as `efm-deployment-persisted.yaml`. This mounts both PVCs, mounts the ConfigMap on top of `efm.properties`, wires in the secrets as environment variables, and exposes EFM through a LoadBalancer service.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: efm
  namespace: cld-streaming
  labels:
    app: efm
spec:
  replicas: 1
  selector:
    matchLabels:
      app: efm
  template:
    metadata:
      labels:
        app: efm
    spec:
      imagePullSecrets:
      - name: cloudera-registry
      containers:
      - name: efm
        image: container.repo.cloudera.com/cloudera/efm:2.3.1.0-2
        ports:
        - containerPort: 10090
        - containerPort: 9092
        env:
        - name: EF_DB_URL
          value: "jdbc:postgresql://ssb-postgresql.cld-streaming.svc:5432/efm"
        - name: EF_REGISTRY_URL
          value: "http://host.minikube.internal:18080"
        - name: EF_REGISTRY_ENABLED
          value: "true"
        - name: JAVA_OPTS
          value: "-Dspring.datasource.driver-class-name=org.postgresql.Driver -Def.db.driver.class.name=org.postgresql.Driver"
        - name: EF_JAVA_OPTS
          value: "-Dspring.datasource.driver-class-name=org.postgresql.Driver -Def.db.driver.class.name=org.postgresql.Driver"
        - name: EFM_DB_USER
          value: efm
        - name: EFM_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: efm-db-pass
              key: password
        - name: EFM_ENCRYPTION_PASSWORD
          valueFrom:
            secretKeyRef:
              name: efm-encryption
              key: encryption.password
        resources:
          requests:
            cpu: "250m"
            memory: "4Gi"
          limits:
            cpu: "250m"
            memory: "4Gi"
        volumeMounts:
        - name: agent-binaries
          mountPath: /opt/efm/efm-2.3.1.0-2/agent-deployer/binaries
        - name: efm-resources
          mountPath: /opt/efm/efm-2.3.1.0-2/resources
        - name: efm-config
          mountPath: /opt/efm/efm-2.3.1.0-2/conf/efm.properties
          subPath: efm.properties
          readOnly: true

      volumes:
      - name: agent-binaries
        persistentVolumeClaim:
          claimName: efm-agent-binaries
      - name: efm-resources
        persistentVolumeClaim:
          claimName: efm-resources
      - name: efm-config
        configMap:
          name: efm-config
---
apiVersion: v1
kind: Service
metadata:
  name: efm
  namespace: cld-streaming
  labels:
    app: efm
spec:
  type: LoadBalancer
  ports:
  - port: 10090
    targetPort: 10090
    protocol: TCP
    name: efm-ui
  - port: 9092
    targetPort: 9092
    protocol: TCP
    name: metrics
  selector:
    app: efm
```

---

## 8. Apply Everything

Order matters — ConfigMap and PVCs first, deployment last:

```bash
kubectl apply -f efm-configMap.yaml -n cld-streaming
kubectl apply -f efm-pvc.yaml -n cld-streaming
kubectl apply -f efm-deployment-persisted.yaml -n cld-streaming
kubectl rollout status deployment/efm -n cld-streaming --timeout=180s
```

Quick sanity check that the ConfigMap actually mounted and that Postgres is in play (not H2):

```bash
EFM_POD=$(kubectl get pod -n cld-streaming -l app=efm -o jsonpath='{.items[0].metadata.name}')
kubectl exec $EFM_POD -n cld-streaming -- sh -c \
  'grep -E "db\.url|db\.driverClass" /opt/efm/efm-2.3.1.0-2/conf/efm.properties'
```

You should see `jdbc:postgresql://...`. If you see `h2`, the ConfigMap did not mount — re-apply and restart the deployment.

---

## 9. Route the LoadBalancer (Minikube Only)

Minikube needs a little help to assign an external IP. In a **separate terminal**, run:

```bash
minikube tunnel
```

Leave it running. If you want the port-forwards and tunnels managed nicely across a workspace, I covered that in my [Using Kftray and Zellij]({{ site.baseurl }}/blog/Using-Kftray-and-Zellij/) post.

---

## 10. Access the UI

Open your browser and go to:

**[http://127.0.0.1:10090/efm/ui/](http://127.0.0.1:10090/efm/ui/)**

You are in. Create your first agent class, design a flow, publish it, and upload a resource — everything is now backed by Postgres and the two PVCs.

---

## 11. Prove the Persistence

The whole point of this exercise. Bounce EFM and confirm nothing disappears:

```bash
kubectl rollout restart deployment/efm -n cld-streaming
kubectl rollout status deployment/efm -n cld-streaming --timeout=180s
```

Refresh the UI. Your agent classes, your flows, and your uploaded resources should all still be there. Agents re-download their assets from the PVC-backed file on the next heartbeat.

For an even stronger test, run `minikube stop` and `minikube start`. Once EFM's pod comes back Ready, everything reloads from Postgres and the PVCs automatically. Nothing to re-upload.

---

## Resources

* [Cloudera Edge Management (CEM) 2.3.1 Docs](https://docs.cloudera.com/cem/2.3.1/index.html)
* [MiNiFi C++ Documentation](https://nifi.apache.org/minifi/)
* [Cloudera Streaming Operators GitHub Repo](https://github.com/cldr-steven-matison/ClouderaStreamingOperators)
* [Using Kftray and Zellij]({{ site.baseurl }}/blog/Using-Kftray-and-Zellij/)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
