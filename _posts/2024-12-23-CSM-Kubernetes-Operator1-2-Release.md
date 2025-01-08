---
title:  "Cloudera Streams Messaging - Kubernetes Operator 1.2"
header:
  teaser: "/assets/images/csm-op-deployment-architecture.jpg"
categories: 
  - blog
tags:
  - csm
  - kafka
  - kubernetes
  - cdp
---

Cloudera’s Data In Motion Team is pleased to announce the release of Cloudera Streams Messaging - Kubernetes Operator 1.2, an integral component of Cloudera Streaming - Kubernetes Operator. With this release, customers receive better security integration and an update to Kafka 3.8, besides other improvements.

## Release Highlights

- Rebase on Kafka 3.8:
  - For more information, see the Kafka 3.8 [Release Notes](https://archive.apache.org/dist/kafka/3.8.0/RELEASE_NOTES.html) and [list of notable changes](https://kafka.apache.org/documentation/#upgrade_380_notable).

- Rebase on Strimzi 0.43.0:
  - For more information, see the Strimzi 0.43.0 [Release Notes](https://github.com/strimzi/strimzi-kafka-operator/releases/tag/0.43.0).

- Apache Ranger authorization: Support for Apache Ranger authorization is now available. Customers can now integrate Kafka clusters, deployed with Cloudera Streams Messaging - Kubernetes Operator, with a remote Ranger service that is running on Cloudera Private Cloud Base. If configured, the Ranger service can provide authorization for your Kafka cluster. 
  - For more information, see [Apache Ranger authorization](https://docs.cloudera.com/csm-operator/1.2/kafka-security/topics/csm-op-authz-ranger.html).

- Improvements to Kafka replication: Rebased and backported changes to make Kafka replication more resilient and reliable when handling heartbeats and offset translation.

- Performance improvements for the Cloudera diagnostics tool: The report.sh tool, used by clients to provide Cloudera support with key information when dealing with support cases now runs its subprocesses in parallel, accelerating run times. 
  - For more information, see [Diagnostics](https://docs.cloudera.com/csm-operator/1.2/monitoring-diagnostics/topics/csm-op-diagnostics.html).

For the complete list of fixes and improvements read these [Release Notes](https://docs.cloudera.com/csm-operator/1.2/release-notes/topics/csm-op-rn.html).

Getting to the new release
To upgrade to Cloudera Streams Messaging - Kubernetes Operator 1.2, check out this [upgrade guide](https://docs.cloudera.com/csm-operator/1.2/upgrade/topics/csm-op-upgrade.html). Please note, if you are installing for the first time use this installation overview.

## Use Cases
- Flexible, agile, and rapid Kafka deployments: Deploy Apache Kafka in seconds on existing Kubernetes infrastructure. Cloudera Streams Messaging - Kubernetes Operator has very lightweight dependencies and system requirements for Kafka-centric deployments. It simplifies and standardizes Kafka deployments and provides auto-scaling support for variable workloads.

- Operational efficiency with simple upgrades: The complexity of Kafka rolling upgrades is handled by Cloudera Streams Messaging - Kubernetes Operator, making them simpler and safer to execute.

- Loading and unloading data from Kafka: Kafka Connect gives Kafka users a simple way to access data quickly from a source and feed it to a Kafka topic. It also allows them to get data from a topic and copy it to an external destination. The operator includes Kafka Connect support to give our customers a tool for moving data in and out of Kafka, efficiently. 

- Replicating data to other sites: Disaster resilience is an important aspect of any Kafka production deployment. Cloudera Streams Messaging - Kubernetes Operator supports configuring and running Kafka replication flows across any two Kafka clusters. These clusters could be in the same or in different data centers to provide increased resilience against disasters.

- Kafka migrations: Customers can migrate or replicate data between containerized Kafka clusters and on-prem or cloud-based clusters.  Using Cloudera Streams Messaging - Kubernetes Operator, data can be replicated in any direction and between two or more clusters at a time.





Check out what is new in [Cloudera Streams Messaging Kubernetes Operator 1.2](https://docs.cloudera.com/csm-operator/1.2/release-notes/topics/csm-op-rn.html#ariaid-title2) 


Check out [Deployment Architecture](https://docs.cloudera.com/csm-operator/1.2/overview/topics/csm-op-deployment-architecture.html)

Check out [Installation Information](https://docs.cloudera.com/csm-operator/1.2/installation/topics/csm-op-install-overview.html)


As always, check out the entire [DOCS](https://docs.cloudera.com/csm-operator/1.2/index.html) for the CSM Operator.
