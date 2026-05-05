---
title: "Monitoring Cloudera Streaming Analytics (CSA) with Prometheus"
excerpt: "Learn how to monitor dynamic Flink and SQL Stream Builder jobs in Cloudera Streaming Analytics (CSA) by utilizing a Headless Service and ServiceMonitor for Prometheus discovery."
header:
  teaser: "/assets/images/2026-05-05-CSA_metrics.png"
categories:
  - blog
tags:
  - prometheus
  - grafana
  - flink
  - csa
---

:warning: **Danger!** This is a Work in Progress article, content and code is updating frequently until this notice is removed.
{: .notice--danger}

If you followed our previous guides on monitoring Cloudera Streams Messaging (CSM) and Cloudera Flow Management (CFM), you now have visibility into your data ingestion (NiFi) and event streaming (Kafka). But what about monitoring the streams processing jobs (FLINK) in Cloudera Streaming Analytics (CSA)?

When running Flink and SQL Stream Builder (SSB) via the CSA Operator, flink jobs spin up dynamically on Kubernetes. Because these dynamically generated TaskManager pods don't explicitly declare metric ports in their Kubernetes spec, standard Prometheus PodMonitors will silently drop the targets—making metric discovery a bit of a K8s networking puzzle.

In this third and final post of the series, we’re going to wire up our CSA Flink jobs to our existing Prometheus + Grafana stack. By utilizing a Headless Service to bypass strict pod-spec validation natively, we will finally complete plugging our CFM NiFi Operator, CSA Flink Operator, and CSM Kafka Operator into Prometheus and Grafana stack for monitoring.

---

### 1️⃣ Create the Prometheus Values File

Create this file in the **root** of your repo. This forces Flink to open port 9249 for metrics scraping.

**`csa-prometheus-values.yaml`**
```yaml
# csa-prometheus-values.yaml
# Enables native PrometheusReporter for ALL SQL Stream Builder (SSB) jobs

ssb:
  flinkConfiguration:
    flink-conf.yaml: |
      metrics.reporters: prom
      metrics.reporter.prom.factory.class: org.apache.flink.metrics.prometheus.PrometheusReporterFactory
      metrics.reporter.prom.port: "9249"
      taskmanager.network.detailed-metrics: "true"

      # Optional: cleaner metric labels for Grafana dashboards
      metrics.scope.jm: "flink.jobmanager.<host>"
      metrics.scope.tm: "flink.taskmanager.<host>.<tm_id>"
      metrics.scope.job: "flink.job.<job_id>.<job_name>"
```

---

### 2️⃣ Exact Helm Install Command (Fresh Install)

Run this **exact** command:

```bash
helm install csa-operator \
  oci://[container.repository.cloudera.com/cloudera-helm/csa-operator/csa-operator](https://container.repository.cloudera.com/cloudera-helm/csa-operator/csa-operator) \
  --namespace cld-streaming \
  --create-namespace \
  --version 1.5.0-b275 \
  --values ./csa-prometheus-values.yaml \
  --set 'flink-kubernetes-operator.imagePullSecrets[0].name=cloudera-creds' \
  --set 'ssb.sse.image.imagePullSecrets[0].name=cloudera-creds' \
  --set 'ssb.sqlRunner.image.imagePullSecrets[0].name=cloudera-creds' \
  --set 'ssb.mve.image.imagePullSecrets[0].name=cloudera-creds' \
  --set 'ssb.database.imagePullSecrets[0].name=cloudera-creds' \
  --set 'ssb.flink.image.imagePullSecrets[0].name=cloudera-creds' \
  --set-file flink-kubernetes-operator.clouderaLicense.fileContent=./license.txt
```

---

### 3️⃣ Verify the Install

```bash
# 1. Helm release
helm list -n cld-streaming

# 2. All pods running
kubectl get pods -n cld-streaming

# 3. Confirm Prometheus config was applied
helm get values csa-operator -n cld-streaming | grep -A 20 "flink-conf.yaml"
```

---

### 4️⃣ Discovery with Headless Service & ServiceMonitor

Because Flink Native Kubernetes does not explicitly declare port 9249 in its dynamic pod specs, standard `PodMonitors` will drop the targets. Instead, we bridge the gap using a **Headless Service** and a **ServiceMonitor**.

**A. Create the Headless Service (`csa-flink-service.yaml`)**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: csa-flink-metrics-service
  namespace: cld-streaming
  labels:
    app: csa-flink-metrics
spec:
  clusterIP: None  # Makes it a headless service
  selector:
    # This automatically captures ALL Flink pods (JobManagers & TaskManagers)
    type: flink-native-kubernetes
  ports:
    - name: prom-metrics
      port: 9249
      targetPort: 9249
```

**B. Create the ServiceMonitor (`csa-flink-service-monitor.yaml`)**
```yaml
apiVersion: [monitoring.coreos.com/v1](https://monitoring.coreos.com/v1)
kind: ServiceMonitor
metadata:
  name: csa-flink-metrics-monitor
  namespace: cld-streaming
  labels:
    release: prometheus # Must match your Prometheus Operator release label
spec:
  selector:
    matchLabels:
      app: csa-flink-metrics
  namespaceSelector:
    matchNames:
      - cld-streaming
  endpoints:
    - port: prom-metrics
      interval: 15s
      scrapeTimeout: 10s
      relabelings:
        # Extracts labels so Grafana dashboards automatically map deployments
        - sourceLabels: [__meta_kubernetes_pod_label_app]
          targetLabel: flink_deployment
        - sourceLabels: [__meta_kubernetes_pod_label_component]
          targetLabel: component
        - sourceLabels: [__meta_kubernetes_pod_name]
          targetLabel: pod
        - sourceLabels: [__meta_kubernetes_namespace]
          targetLabel: namespace
```

**C. Apply both files:**
```bash
kubectl apply -f csa-flink-service.yaml -n cld-streaming
kubectl apply -f csa-flink-service-monitor.yaml -n cld-streaming
```

*Wait ~30 seconds, then check Prometheus UI (`Status -> Targets`). You should see your JobManagers and TaskManagers listed as `UP` under `serviceMonitor/cld-streaming/csa-flink-metrics-monitor/0`.*

---

### 5️⃣ Test Prometheus Metrics (Run an SSB Job)

1. Open SSB UI:
   ```bash
   minikube service ssb-sse --namespace cld-streaming
   ```

2. Run any SQL job (or the existing `ssb-session-admin` job will already have created a Flink pod).

3. Verify metrics are exposed directly from a pod:
   ```bash
   # Replace with your actual taskmanager pod name
   kubectl exec -it ssb-session-admin-taskmanager-1-3 -n cld-streaming -- \
     curl -s http://localhost:9249/metrics | head -20
   ```

You should see `flink_` metrics.

---

### 6️⃣ Querying SSB / Flink Metrics in Prometheus UI

**Sample Query 1: JVM CPU Load**
```bash
flink_taskmanager_Status_JVM_CPU_Load{namespace="cld-streaming"}
```

**Sample Query 2: Job Uptime**
```bash
flink_jobmanager_job_uptime{namespace="cld-streaming"}
```

**Sample Query 3: Records In/Out Per Second**
```bash
sum(flink_taskmanager_job_task_operator_numRecordsInPerSecond{namespace="cld-streaming"}) by (job_name)
```

**End-to-End Pipeline (NiFi → SSB → Kafka)**
```bash
sum(rate(nifi_bytes_sent{namespace="cfm-streaming"}[5m])) 
or 
sum(flink_taskmanager_job_task_operator_numRecordsInPerSecond{namespace="cld-streaming"}) 
or 
sum(rate(kafka_server_brokertopicmetrics_bytesin_total{namespace="cld-streaming"}[5m]))
```

---

### 7️⃣ Visualizing in Grafana

* **ID `11049` (Recommended First Test)**
  * **Name:** Flink Dashboard
  * **Description:** The standard, most reliable community dashboard built explicitly for the Flink Prometheus Exporter. It tracks JobManagers, TaskManagers, JVM metrics, and basic job health.

* **ID `14911`**
  * **Name:** Apache Flink Dashboard for Job / Task Manager
  * **Description:** A slightly more modern layout that breaks down metrics specifically between the Job Manager and Task Manager. Good for digging into CPU/Memory constraints.

* **ID `14840`**
  * **Name:** Flink Metrics (with Kafka) on K8S
  * **Description:** Since you are running CSA alongside Kafka, this dashboard is actually built to monitor Flink applications *and* includes Kafka throughput parameters alongside Kubernetes memory/CPU stats.
---

### 🏁 Summary

With this final piece in place, you have successfully built a complete, end-to-end observability pipeline across your entire Cloudera Streaming Operators architecture. By bridging CFM (NiFi) for ingestion, CSA (SQL Stream Builder / Flink) for real-time processing, and CSM (Kafka) for event streaming, you now have a unified view of your data's lifecycle within a single Prometheus and Grafana stack.

In this specific guide, we didn't just flip a switch to turn on metrics—we architected a robust, Kubernetes-native solution. By implementing a Headless Service and a ServiceMonitor, we bypassed the strict pod-spec limitations of Flink Native Kubernetes. This ensures that every dynamically provisioned JobManager and TaskManager is automatically discovered and scraped by Prometheus, completely eliminating the silent "0 targets" discovery failures.

Best of all, your entire monitoring configuration remains declarative and fully Git-trackable. You can now reliably execute complex PromQL queries across namespaces and correlate behavior across entirely different engines. Whether you are tracking backpressure in NiFi, measuring checkpoint durations and records-per-second in Flink, or monitoring consumer lag in Kafka, you finally have the single pane of glass required to confidently debug, tune, and scale your real-time data pipelines.

---

### Appendix

#### 1. Cleanup / Re-install
```bash
helm uninstall csa-operator -n cld-streaming
kubectl delete servicemonitor csa-flink-metrics-monitor -n cld-streaming --ignore-not-found
kubectl delete service csa-flink-metrics-service -n cld-streaming --ignore-not-found
```

#### 2. Force Prometheus to Re-discover
```bash
kubectl rollout restart deployment prometheus-kube-prometheus-operator -n cld-streaming
```

#### 3. Quick Verification Commands
```bash
kubectl get servicemonitor -n cld-streaming
kubectl get service csa-flink-metrics-service -n cld-streaming
kubectl get pods -n cld-streaming -l type=flink-native-kubernetes
```