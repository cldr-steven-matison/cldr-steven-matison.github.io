---
title:  "Cloudera Streams Messaging - Kubernetes Operator 1.6"
header:
  teaser: "/assets/images/csm-op-deployment-architecture.jpg"
categories: 
  - release
tags:
  - csm
  - kafka
  - kubernetes
  - cloudera
---

# Announcing Cloudera Streams Messaging - Operator for Kubernetes v1.6

The Cloudera’s Data In Motion Team is pleased to announce the release of the **Cloudera Streams Messaging Operator for Kubernetes v1.6**.

This release centers on a major platform rebase to the latest Kafka standards, official certification for the Apache Iceberg Sink Connector, the introduction of Schema Registry support, and the transition to the stable Strimzi v1 API for enhanced environment stability.

---

## Release Highlights

### 1. Rebase to Strimzi 0.49.1 and Kafka 4.1.1
The Operator is now based on **Strimzi 0.49.1** (up from 0.47.0) and **Apache Kafka 4.1.1** (up from 4.0.1). This rebase brings the latest performance optimizations and feature sets from the upstream community, ensuring your streaming infrastructure remains at the cutting edge.

### 2. Introduction of Cloudera Schema Registry
Schema Registry is now available as a standalone application to efficiently store and manage schemas for your streaming data.
* **Format Support:** Avro and JSON schema formats.
* **Consistency:** Provides schema evolution capabilities with configurable compatibility modes.
* **Access:** Central repository for applications to validate data via REST API and client libraries.

### 3. Apache Iceberg Sink Connector Certification
To empower modern data lakehouse architectures, the **Apache Iceberg Sink Connector** is now officially certified. While installed from external repositories (like Maven Central), it is a validated part of the Cloudera ecosystem, enabling seamless ingestion into Iceberg tables.

### 4. Cloudera Surveyor Enhancements
Significant upgrades provide deeper visibility into your cluster’s physical layer:
* **New Broker Monitoring:** Dedicated Brokers and Broker Details pages to monitor health, disk usage, and alerts. Track topic partitions and manage log directories directly from the UI.
* **Automatic Key Generation:** Surveyor now automatically generates cryptographically secure 128-byte keys by default (except in FIPS mode), eliminating manual configuration steps.

### 5. Strimzi v1 API Stability
Version 1.6 introduces the **v1 API** version for all Strimzi Custom Resource Definitions (CRDs), providing a stable, production-ready foundation for managing Kafka resources.

---

## Getting the New Release
* **Upgrading:** To upgrade to v1.6, please check the [Upgrade Guide](https://docs.cloudera.com/csm-operator/1.6/upgrade/topics/csm-op-upgrade-overview.html).
* **First-time Install:** If you are installing the operator for the first time, consult the [Installation Overview](https://docs.cloudera.com/csm-operator/1.6/installation/topics/csm-op-install-overview.html).

---

## Resources
* [Cloudera Streams Messaging - Kubernetes Operator 1.6 Release Notes](https://docs.cloudera.com/csm-operator/1.6/release-notes/topics/csm-op-rn.html#concept_ksn_nwn_cbc)
* [Cloudera Community Announcement Post](https://community.cloudera.com/t5/What-s-New-Cloudera/Announcing-Cloudera-Streams-Messaging-Operator-for/ba-p/413559)
* [Strimzi 0.49.1 Release Notes](https://github.com/strimzi/strimzi-kafka-operator/releases/tag/0.49.1)
* [Kafka 4.1.1 Release Notes](https://archive.apache.org/dist/kafka/4.1.1/RELEASE_NOTES.html)
* [Schema Registry Documentation](http://docs.cloudera.com/csm-operator/1.6/schema-registry-overview/topics/csm-op-schema-registry-overview.html)
* [Updated Support Lifecycle Policy](https://www.cloudera.com/services-and-support/support-lifecycle-policy.html)

> **Note:** For specific technical questions, please refer to the internal documentation or the Cloudera Community forums.

As always, check out the entire [DOCS](https://docs.cloudera.com/csm-operator/1.6/index.html) for the CSM Operator.

If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about Cloudera Streams Messaging Operator please reach out to schedule a discussion.
