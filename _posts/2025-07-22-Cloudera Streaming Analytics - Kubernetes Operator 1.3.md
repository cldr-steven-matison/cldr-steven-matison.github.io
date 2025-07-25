---
title:  "Cloudera Streaming Analytics - Kubernetes Operator 1.3"
header:
  teaser: "/assets/images/csa-architecture.png"
categories: 
  - blog
tags:
  - Cloudera Streaming Analytics
  - flink
  - cloudera
  - kubernetes
---


Cloudera’s Data In Motion Team is pleased to announce the release of the Cloudera Streaming Analytics - Kubernetes Operator 1.3, an integral component of Cloudera Streaming - Kubernetes Operators.

This release includes rebases to Apache Flink 1.20 and Apache Flink Kubernetes Operator 1.11.0. Other changes and updates are focused on enhancing security, usability, and making the product more robust.

### Release Highlights

* **Rebase to Flink 1.20**
    For more information, see the [Flink 1.20 Release Notes](https://flink.apache.org/news/2024/07/22/flink-1.20-release.html) and the [Flink 1.20 Documentation](https://nightlies.apache.org/flink/flink-docs-release-1.20/).

* **Rebase to Flink Kubernetes Operator 1.11.0**
    For more information, see the [Flink Kubernetes Operator 1.11.0 Release Notes](https://github.com/apache/flink-kubernetes-operator/releases/tag/v1.11.0) and the [Flink Kubernetes Operator 1.11.0 Documentation](https://nightlies.apache.org/flink/flink-kubernetes-operator-docs-release-1.11/).

* **Flink OpenTelemetry Metrics Reporter (Technical Preview)**
    The OpenTelemetry metrics reporter is now included, in Tech Preview, in the operator image. It makes it easier and more efficient to aggregate job metrics to a central service like Prometheus or any OpenTelemetry-compatible service, and aggregate metrics using open standards. To learn more about using the OpenTelemetry reporter with Flink, see [Monitoring Flink with OpenTelemetry](https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/deployment/metric_reporters/opentelemetry/).

* **Flink image with Hadoop, Hive, Iceberg, and Kudu connectors**
    Cloudera now offers alternative images for Cloudera Streaming Analytics - Kubernetes Operator that include popular connectors and their dependencies. This makes it easier to launch jobs right after installation and saves time because there’s no need to create custom images. For more information, refer to the Operator's [Documentation](https://docs.cloudera.com/csa/1.3.x/kubernetes-operator/concepts/csa-k8s-operator-images.html).

* **Basic authentication for Flink UI and rest API**
    The Operator now includes the Flink Basic Authentication Handler, enabling users to secure their deployments without the need for external or third-party JARs.

Please see the [Release Notes](https://docs.cloudera.com/csa/1.3.x/kubernetes-operator/release-notes/csa-k8s-operator-rn.html) for the complete list of fixes and improvements.

### Getting the New Release

* To upgrade to Cloudera Streaming Analytics - Kubernetes Operator 1.3, check out the [Upgrade Guide](https://docs.cloudera.com/csa/1.3.x/kubernetes-operator/installation/csa-k8s-operator-upgrade.html).
* If you are installing this operator for the first time, consult the [Installation Guide](https://docs.cloudera.com/csa/1.3.x/kubernetes-operator/installation/csa-k8s-operator-install.html).

### Use Cases

* **Event-Driven Applications:** Stateful applications that ingest events from one or more event streams and react to incoming events by triggering computations, state updates, or external actions. Apache Flink excels in handling the concept of time and state for these applications, and can scale to manage very large data volumes (up to several terabytes). It has a rich set of APIs, ranging from low-level controls to high-level functionality, like Flink SQL, enabling developers to choose the most suitable options for the implementation of advanced business logic. One of Apache Flink’s most popular features for event-driven applications is its support for savepoints. A savepoint is a consistent state image that can be used as a starting point for compatible applications. With a savepoint, an application can be updated or adapt its scale, or multiple versions of an application can be started for A/B testing.
    **Examples:**
    * Fraud detection
    * Anomaly detection
    * Rule-based alerting
    * Business process monitoring
    * Web application (social network)

* **Data Analytics Applications:** With a sophisticated stream processing engine, analytics can be performed in real time. Streaming queries or applications ingest real-time event streams and continuously produce and update results as events are consumed. The results are written to an external database or maintained as internal state. A dashboard application can read the latest results from the external database or directly query the internal state of the application. Apache Flink supports streaming as well as batch analytical applications.
    **Examples:**
    * Quality monitoring of telco networks
    * Analysis of product updates and experiment evaluation in mobile applications
    * Ad-hoc analysis of live data in consumer technology
    * Large-scale graph analysis

* **Data Pipeline Applications:** Streaming data pipelines serve a similar purpose as Extract-Transform-Load (ETL) jobs. They transform and enrich data and can move it from one storage system to another. However, they operate in a continuous streaming mode instead of being periodically triggered. Hence, they can read records from sources that continuously produce data and move it with low latency to their destination.
    **Examples:**
    * Real-time search index building in e-commerce
    * Continuous ETL in e-commerce

### Resources

* [New - Cloudera Streaming Analytics Community Page](https://www.cloudera.com/products/streaming-analytics.html)
* [New - Cloudera Streaming Analytics - Kubernetes Operator Product Page](https://www.cloudera.com/products/streaming-analytics/kubernetes-operator.html)
* [New - Cloudera Streaming Analytics - Kubernetes Operator 1.3 Blog Post](https://blog.cloudera.com/cloudera-streaming-analytics-kubernetes-operator-1-3-release/) (to share)
* [Updated - Cloudera Streaming Analytics - Kubernetes Operator Documentation](https://docs.cloudera.com/csa/1.3.x/kubernetes-operator/index.html)
* [Cloudera Streaming Analytics Overview (webinar recording)](https://www.cloudera.com/webinars/streaming-analytics-overview.html)
