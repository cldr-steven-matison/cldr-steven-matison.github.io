---
title:  "Release of Cloudera Kubernetes Operators"
header:
  teaser: "/assets/images/kubernetes-logo.png"
categories: 
  - blog
tags:
  - kubernetes 
  - operator
  - csm
  - cfm
  - csa
---

I have been working on so many things related to my CDP Public Cloud and CDP Private Cloud customers that I just do not get enough time to blog.  Since my last post I am happy to report that Cloudera has finally GA'd 3 kubernetes Operators.

# Cloudera Kubernetes Operators

## CFM - Cloudera Flow Management Operator 
  Cloudera Flow Management (CFM) Operator allows you to deploy and manage NiFi clusters and NiFi Registry instances on Kubernetes. CFM Operator simplifies data collection, transformation, and delivery across your enterprise. Leveraging containerized infrastructure, the operator streamlines the orchestration of complex data flows.
  * [Apache NiFi](https://nifi.apache.org/)

## CSM - Cloudera Streams Messaging Operator
  CSM (Cloudera Streams Messaging) Operator allows you to deploy and manage Streams Messaging components as container applications on Kubernetes. CSM Operator simplifies the process of creating, managing, and troubleshooting Kafka deployments in a Kubernetes environment. CSM Operator includes several services and components such as Strimzi, Kafka, Cruise Control, and others.
  * [Apache Kafka](https://kafka.apache.org/)

## CSA - Cloudera Streams Analytics Operator
  Cloudera Streaming Analytics (CSA) Operator allows you to deploy and manage the Streaming Analytics components of Cloudera Data Platform (CDP), Flink and SQL Stream Builder (SSB), as container applications on Kubernetes. CSA Operator is based on the Apache Flink Kubernetes Operator (Flink Operator), and offers the same set of features as the Flink Operator supports. By extending the Kubernetes API, the Flink Operator acts as a control plane to manage the deployment lifecycle of Flink applications using the operator pattern.
  * [Apache Flink](https://flink.apache.org/)


Check out this [Deep Technical Dive with Pierre Villard](https://community.cloudera.com/t5/Community-Articles/Cloudera-Flow-Management-Operator-A-technical-deep-dive/ta-p/390473)


Find more about Cloudera DataFlow starting right [here](https://www.cloudera.com/products/dataflow.html).

You can learn more about Cloudera Stream Processing right [here](https://www.cloudera.com/products/stream-processing.html).


As always, check out the docs for each operator:

[CFM](https://docs.cloudera.com/cfm-operator/2.8.0/index.html)
[CSM](https://docs.cloudera.com/csm-operator/1.0/index.html)
[CSA](https://docs.cloudera.com/csa-operator/1.0/index.html)