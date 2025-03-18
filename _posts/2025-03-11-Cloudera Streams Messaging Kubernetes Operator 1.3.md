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
For more information, see the Kafka 3.9 Release Notes and the list of notable changes.

## Rebase to Strimzi 0.45.0
For more information, see the Strimzi 0.44.0 Release Notes and Strimzi 0.45.0 Release Notes.

## KRaft (Kafka Raft) is generally available
You can now deploy Kafka clusters that use KRaft instead of ZooKeeper for metadata management. Additionally, you can migrate existing ZooKeeper-based Kafka clusters to use KRaft. 
With the addition of KRaft, ZooKeeper is deprecated. Deploying new or using existing Kafka clusters running in ZooKeeper mode is deprecated. Additionally, ZooKeeper will be removed in a future release. When deploying new Kafka clusters, deploy them in KRaft mode. Cloudera encourages you to migrate existing clusters to KRaft. 
For cluster deployment instructions, see Deploying a Kafka cluster.  For migration instructions, see Migrating Kafka clusters from ZooKeeper to KRaft.

## Auto-rebalancing when scaling the cluster
You can now enable auto-rebalancing for Kafka clusters. If auto-rebalancing is enabled, the Strimzi Cluster Operator automatically initiates a rebalance with Cruise Control when you scale the Kafka cluster. 
Cloudera recommends that you enable this feature as it makes scaling easier and faster. For more information, see  Scaling brokers.

## Offset management through KafkaConnector resources is now available
Connector offsets can now be managed directly by configuring your KafkaConnector resources. 
Cloudera recommends that you use this feature over the Kafka Connect REST API to manage connector offsets.

For more information, see Managing connector offsets and  Configuring data replication offsets. These are the recommended methods for managing replication offsets when replicating data with Kafka Connect-based replication has also changed.

Please see the Release Notes for the complete list of fixes and improvements

## Getting to the New Release
To upgrade to Cloudera Streams Messaging - Kubernetes Operator 1.3, check out this upgrade guide. If you are installing for the first time use this installation overview.

## Use Cases
Flexible, agile, and rapid Kafka deployments: Deploy Apache Kafka in seconds on existing Kubernetes infrastructure. Cloudera Streams Messaging-Kubernetes Operator has very lightweight dependencies and system requirements for Kafka-centric deployments. It simplifies and standardizes Kafka deployments and provides auto-scaling support for variable workloads.

Operational efficiency with simple upgrades: The complexity of Kafka rolling upgrades is handled by Cloudera Streams Messaging - Kubernetes Operator, making them simpler and safer to execute.

Loading and unloading data from Kafka: Kafka Connect gives Kafka users a simple way to access data quickly from a source and feed it to a Kafka topic. It also allows them to get data from a topic and copy it to an external destination. Cloudera Streams Messaging - Kubernetes Operator includes Kafka Connect support to give our customers a tool for moving data in and out of Kafka, efficiently. 

Replicating data to other sites: Disaster resilience is an important aspect of any Kafka production deployment. Cloudera Streams Messaging - Kubernetes Operator supports configuring and running Kafka replication flows across any two Kafka clusters. These clusters could be in different data centers to provide increased resilience against disasters.

Kafka migrations: Customers can migrate or replicate data between containerized Kafka clusters and on-premises or cloud-based clusters.  Using Cloudera Streams Messaging - Kubernetes Operator, data can be replicated in any direction and between two or more clusters at a time.

## Public Resources
  - New - [What’s New in Cloudera Streams Messaging - Kubernetes Operator 1.3]()
  - New - [What’s New post in Cloudera Community]()
  - New - [LinkedIn announcement]() (to share)
  - Updated - [Cloudera Streams Messaging - Kubernetes Operator Documentation]()
  - [Cloudera Stream Processing Product Page]()
  - [Cloudera Kubernetes Operators documentation homepage]()
  - [Cloudera Stream Processing Community Edition]()
  - [Accelerate Streaming Pipeline Deployments with New Kubernetes Operators]() (webinar recording)
  - Updated - [Cloudera Stream Processing & Analytics Support Lifecycle Policy]()


As always, check out the entire [DOCS]() for the CSM Operator.
