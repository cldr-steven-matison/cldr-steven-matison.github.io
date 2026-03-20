---
title:  "Cloudera Streaming Analytics Operator for Kubernetes 1.5"
header:
  teaser: "/assets/images/csa-architecture.png"
categories: 
  - release
tags:
  - Cloudera Streaming Analytics
  - flink
  - cloudera
  - kubernetes
---


Cloudera’s Data In Motion Team is pleased to announce the release of the **Cloudera Streaming Analytics Operator for Kubernetes 1.5**. This release advances our cloud-native streaming capabilities by introducing the Materialized View engine to Kubernetes, optimizing job handling responsiveness, and updating core infrastructure components for better performance and security.

---

### Release Highlights

#### Materialized View Engine on Kubernetes
Cloudera SQL Stream Builder now supports the **Materialized View engine** within Kubernetes deployments. This allows users to create and maintain mutating snapshots of queried data, which can be seamlessly accessed via REST APIs, bridging the gap between real-time streams and request-response applications.

#### Asynchronous Flink Job Handling
To improve the user experience, SQL Stream Builder now handles Flink jobs asynchronously. This architectural change significantly enhances the responsiveness of the Streaming SQL Console and ensures more stable job status transitions during deployments and state changes.

#### Rebase to Flink Operator 1.13
The embedded Apache Flink Kubernetes Operator has been rebased to version 1.13. Alongside Apache Flink 1.20, this update brings the latest upstream stability improvements, bug fixes, and performance optimizations to your production environment.

#### Modernized Infrastructure & Compatibility
* **PostgreSQL 18.1:** The default database deployed with SQL Stream Builder has been updated to version 18.1 for improved data management.
* **Java Runtime Updates:** Docker images now utilize an OpenJDK 17 build that supports older cipher suites, ensuring broader compatibility with legacy security configurations while maintaining a modern runtime.

---

### Getting the New Release
To learn more about the Cloudera Streaming Analytics Operator for Kubernetes and its typical deployment architecture, see the [Overview](https://docs.cloudera.com/csa-operator/1.5/overview/topics/csa-op-deployment-architecture.html) guide. If you are installing this operator for the first time, consult the [Installation](https://docs.cloudera.com/csa-operator/1.5/installation/topics/csa-op-installation-overview.html) instructions.

---

### Resources
Ready to explore Cloudera Streaming Analytics Operator for Kubernetes 1.5? Find out more here:
* [What's New - Cloudera Streaming Analytics Operator for Kubernetes 1.5 Release Notes](https://docs.cloudera.com/csa-operator/1.5/release-notes/topics/csa-op-whats-new.html)
* [Flink Operator 1.13 Upstream Documentation](https://flink.apache.org/2025/09/29/apache-flink-kubernetes-operator-1.13.0-release-announcement/)
* [Cloudera Streaming Product Page](https://www.cloudera.com/products/stream-processing.html)


If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about Cloudera Streaming Analytics Operator for Kubernetes 1.5 please reach out to schedule a discussion.
