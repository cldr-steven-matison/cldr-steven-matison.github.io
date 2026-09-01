---
title:  "Announcing Cloudera Streams Messaging Operator for Kubernetes v1.7"
header:
  teaser: "/assets/images/CSM-Cloudera_Streams_Messaging_Operator.png"
categories: 
  - release
tags:
  - csm
  - kafka
  - kubernetes
  - cloudera
---

Cloudera’s Data In Motion Team is pleased to announce the release of the Cloudera Streams Messaging Operator for Kubernetes v1.7. This milestone release centers on a major platform update to Strimzi 1.0.1 and Apache Kafka 4.2.0, a redesigned Cloudera Surveyor experience, mandatory API standardization, and high-availability maintenance tooling with Strimzi Drain Cleaner.

## Release Highlights

### Rebase to Strimzi 1.0.1 and Kafka 4.2.0

This release updates the Operator to Strimzi 1.0.1 (up from 0.49.1) and Apache Kafka 4.2.0 (up from 4.1.1). This upgrade delivers upstream enhancements, including per-listener Kafka configurations, advertised port templates for predictable external broker port mapping, environment variable-based rack awareness without requiring ClusterRoleBindings, and on-demand KafkaUser certificate renewal via annotations.

### Cloudera Surveyor Enhancements & UI Redesign

Cloudera Surveyor features a redesigned user interface and operational additions:

  * **Client Configurations Download**: A new tab allows users to preview and download connection materials and Certificate Authority (CA) certificates configured via Kubernetes Secrets.
  * **Read-Only Broker Configurations**: Operators can set readOnlyBrokerConfigs to prevent UI edits from overriding Strimzi reconciliation loops.
  * **Enhanced Diagnostics & Monitoring**: report.sh now automatically captures full diagnostic bundles for Cloudera Surveyor instances. Additionally, UI updates add configurable instance naming, KRaft metadata displays, and an updated Entity Details drawer.

### Strimzi v1 API Enforcement

The v1 API is now the sole supported API version for all Strimzi Custom Resource Definitions (CRDs). Legacy v1alpha1, v1beta1, and v1beta2 API versions have been removed. Custom resources must be converted to v1 using the bundled API conversion tool prior to upgrading.

### Strimzi Drain Cleaner Support

The release introduces Strimzi Drain Cleaner as an optional, separately installable component. Utilizing a validating admission webhook, it coordinates rolling Pod restarts through the Strimzi Cluster Operator during Kubernetes node maintenance to keep Kafka partitions in sync.

## Getting the New Release

To upgrade to Cloudera Streams Messaging Operator for Kubernetes v1.7, check out the [upgrade guide](https://docs.cloudera.com/csm-operator/1.7/upgrade/topics/csm-op-upgrade-overview.html#concept_bj1_cxq_y1c). If you are installing this operator for the first time, consult the [installation overview](https://docs.cloudera.com/csm-operator/1.7/installation/topics/csm-op-install-overview.html).

## Resources

Interested to try out the operator? Find out more here:

  * New - [Cloudera Streams Messaging - Kubernetes Operator 1.7 Release Notes](https://docs.cloudera.com/csm-operator/1.7/release-notes/topics/csm-op-rn.html#concept_ksn_nwn_cbc)
  * [Strimzi 1.0.1 Release notes](https://github.com/strimzi/strimzi-kafka-operator/releases/tag/1.0.1)
  * [Kafka 4.2.0 Release notes](https://archive.apache.org/dist/kafka/4.2.0/RELEASE_NOTES.html)
  * Updated - [Cloudera Stream Processing & Analytics Support Lifecycle Policy](https://www.cloudera.com/services-and-support/support-lifecycle-policy.html)

* [Updated Support Lifecycle Policy](https://www.cloudera.com/services-and-support/support-lifecycle-policy.html)


## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
