---
title:  "Cloudera Streams Messaging - Kubernetes Operator 1.3"
header:
  teaser: "/assets/images/csm-op-deployment-architecture.jpg"
categories: 
  - blog
tags:
  - csm
  - kafka
  - kubernetes
  - cloudera
---

Cloudera’s Data In Motion Team is pleased to announce the release of Cloudera Streams Messaging - Kubernetes Operator 1.3, an integral component of Cloudera Streaming - Kubernetes Operator. With this release, customers receive a rebase to Kafka 3.9, automatic cluster rebalance, better offset management capabilities for Kafka connectors, and more! 

# Release Highlights
## Rebase to Kafka 3.9
For more information, see the [Kafka 3.9 Release Notes](https://archive.apache.org/dist/kafka/3.9.0/RELEASE_NOTES.html) and the [list of notable changes](https://kafka.apache.org/documentation/#upgrade_390_notable).

## Rebase to Strimzi 0.45.0
For more information, see the [Strimzi 0.44.0 Release Notes](https://github.com/strimzi/strimzi-kafka-operator/releases/tag/0.44.0) and [Strimzi 0.45.0 Release Notes](https://github.com/strimzi/strimzi-kafka-operator/releases/tag/0.45.0).

## KRaft (Kafka Raft) is generally available
You can now deploy Kafka clusters that use KRaft instead of ZooKeeper for metadata management. Additionally, you can migrate existing ZooKeeper-based Kafka clusters to use KRaft. 
With the addition of KRaft, ZooKeeper is deprecated. Deploying new or using existing Kafka clusters running in ZooKeeper mode is deprecated. Additionally, ZooKeeper will be removed in a future release. When deploying new Kafka clusters, deploy them in KRaft mode. Cloudera encourages you to migrate existing clusters to KRaft. 
For cluster deployment instructions, see [Deploying a Kafka cluster](https://docs.cloudera.com/csm-operator/1.3/kafka-deploy-configure/topics/csm-op-deploying-kafka.html#concept_oks_bgz_z1c).  For migration instructions, see [Migrating Kafka clusters from ZooKeeper to KRaft](https://docs.cloudera.com/csm-operator/1.3/upgrade/topics/csm-op-kraft-migration.html#concept_aty_ylh_j2c).

## Auto-rebalancing when scaling the cluster
You can now enable auto-rebalancing for Kafka clusters. If auto-rebalancing is enabled, the Strimzi Cluster Operator automatically initiates a rebalance with Cruise Control when you scale the Kafka cluster. 
Cloudera recommends that you enable this feature as it makes scaling easier and faster. For more information, see [Scaling brokers](https://docs.cloudera.com/csm-operator/1.3/kafka-operations/topics/csm-op-scaling-brokers.html#concept_jt1_qhz_z1c).

## Offset management through KafkaConnector resources is now available
Connector offsets can now be managed directly by configuring your KafkaConnector resources. 
Cloudera recommends that you use this feature over the Kafka Connect REST API to manage connector offsets.

For more information, see [Managing connector offsets](https://docs.cloudera.com/csm-operator/1.3/kafka-connect-operations/topics/csm-op-connect-managing-connectors.html#ariaid-title8) and [Configuring data replication offsets](https://docs.cloudera.com/csm-operator/1.3/kafka-replication-deploy-configure/topics/csm-op-connect-configuring-replication-offsets.html#task_jfl_lsg_jcc). These are the recommended methods for managing replication offsets when replicating data with Kafka Connect-based replication has also changed.

Please see the [Release Notes](https://docs.cloudera.com/csm-operator/1.3/release-notes/topics/csm-op-rn.html#concept_ksn_nwn_cbc) for the complete list of fixes and improvements

## Getting to the New Release
To upgrade to Cloudera Streams Messaging - Kubernetes Operator 1.3, check out this [upgrade guide](https://docs.cloudera.com/csm-operator/1.3/upgrade/topics/csm-op-upgrade.html). If you are installing for the first time use this [installation overview](https://docs.cloudera.com/csm-operator/1.3/installation/topics/csm-op-install-overview.html).

## Use Cases
Flexible, agile, and rapid Kafka deployments: Deploy Apache Kafka in seconds on existing Kubernetes infrastructure. Cloudera Streams Messaging-Kubernetes Operator has very lightweight dependencies and system requirements for Kafka-centric deployments. It simplifies and standardizes Kafka deployments and provides auto-scaling support for variable workloads.

Operational efficiency with simple upgrades: The complexity of Kafka rolling upgrades is handled by Cloudera Streams Messaging - Kubernetes Operator, making them simpler and safer to execute.

Loading and unloading data from Kafka: Kafka Connect gives Kafka users a simple way to access data quickly from a source and feed it to a Kafka topic. It also allows them to get data from a topic and copy it to an external destination. Cloudera Streams Messaging - Kubernetes Operator includes Kafka Connect support to give our customers a tool for moving data in and out of Kafka, efficiently. 

Replicating data to other sites: Disaster resilience is an important aspect of any Kafka production deployment. Cloudera Streams Messaging - Kubernetes Operator supports configuring and running Kafka replication flows across any two Kafka clusters. These clusters could be in different data centers to provide increased resilience against disasters.

Kafka migrations: Customers can migrate or replicate data between containerized Kafka clusters and on-premises or cloud-based clusters.  Using Cloudera Streams Messaging - Kubernetes Operator, data can be replicated in any direction and between two or more clusters at a time.

## Public Resources
  - New - [What’s New in Cloudera Streams Messaging - Kubernetes Operator 1.3](https://docs.cloudera.com/csm-operator/1.3/release-notes/topics/csm-op-rn.html#ariaid-title2)
  - New - [What’s New post in Cloudera Community](https://community.cloudera.com/t5/What-s-New-Cloudera/RELEASED-Cloudera-Streams-Messaging-Kubernetes-Operator-1-3/ba-p/403888)
  - New - [LinkedIn announcement](https://www.linkedin.com/posts/asdaraujo_released-cloudera-streams-messaging-kubernetes-activity-7305092097919897600-4KpQ/) (to share)
  - Updated - [Cloudera Streams Messaging - Kubernetes Operator Documentation](https://docs.cloudera.com/csm-operator/1.3/index.html)
  - [Cloudera Stream Processing Product Page](https://www.cloudera.com/products/stream-processing.html)
  - [Cloudera Kubernetes Operators documentation homepage](https://docs.cloudera.com/index.html?tab=kubernetes-operators)
  - [Cloudera Stream Processing Community Edition](https://docs.cloudera.com/csp-ce/latest/index.html)
  - [Accelerate Streaming Pipeline Deployments with New Kubernetes Operators](https://www.cloudera.com/events/webinars/accelerate-streaming-pipeline-deployments-with-new-kubernetes-operators.html) (webinar recording)
  - Updated - [Cloudera Stream Messaging Support Lifecycle Policy](https://www.cloudera.com/services-and-support/support-lifecycle-policy.html)


As always, check out the entire [DOCS](https://docs.cloudera.com/csm-operator/1.3/index.html) for the CSM Operator.
