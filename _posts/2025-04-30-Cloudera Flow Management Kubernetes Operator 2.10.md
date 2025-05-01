---
title:  "Cloudera Flow Management - Kubernetes Operator 2.10"
header:
  teaser: "/assets/images/kubernetes-logo.png"
categories: 
  - blog
tags:
  - cloudera
  - nifi
  - kubernetes
---

The Data In Motion Team is pleased to announce the release of Cloudera Flow Management - Kubernetes Operator version 2.10.

This release introduces NiFi 2 to the Cloudera Flow Management - Kubernetes Operator. In addition, it includes features that help with developer productivity, flow stability, operational overhead, and quality of life. 

## Release Highlights
- NiFi 2 general availability: NiFi 2 is now an available option when deploying NiFi in a Kubernetes cluster using the Cloudera Flow Management - Kubernetes Operator.
- FIPS mode: Customers can now declare additional security providers, such  as CryptoComply for Java and Bouncy Castle, to ensure FIPS (Federal Information Processing Standard) compliance.
- Out of memory (OOM) recovery: The Operator can now recover proactively from OOM events in NiFi based on user-provided configuration parameters. 
- Cluster scheduling: The NiFi custom resource now contains a schedule spec that can define the times during which a NiFi cluster will run.
- Environment variables: In the NiFi spec, users can set custom environment variables on the NiFi container for use in Flows or Python scripts. 
- NAR volume providers: NARs can be landed in a networked filesystem or object storage and provided to NiFi by way of a CSI driver, i.e. EFS or S3.
- OIDC authentication: Support for OpenID Connect authentication has been added to the NiFi Registry spec. This enables integration of the NiFi Registry with Keycloak. 
- Additional CA bundles reference: Additional CA certificates can now be provided by a Secret or ConfigMap reference instead of in-line in the NiFi spec yaml, greatly reducing file length and improving readability.
- Additional proxy hosts: A NiFi spec field has been added, and multiple hostnames can now be provided to NiFi. This allows configuration of alternate DNS names for the NiFi service beyond the hostName spec field.
- Platform upgrades: Added support for Kubernetes 1.31, NiFi 1.28, and NiFi 2.3.
- Bug fixes:
 - NiFi Registry resources not cleaned up on delete, i.e. PVCs and Certificate Secrets.
 - NiFi Registry hostname not added to Node Certificate.
 - NiFi Registry users and authorizations incorrectly persisted.
 - NiFi not restarting when additional CA bundles are provided.


## Upgrading to the New Release
Reference the latest operator version in the Helm Install command. More details can be found in the [installation instructions](https://docs.cloudera.com/cfm-operator/2.9.0/installation/topics/cfm-op-install-cfm-op.html). 

## Links
[Release notes](https://docs.cloudera.com/cfm-operator/2.9.0/release-notes/topics/cfm-op-whats-new.html)

[Documentation](https://docs.cloudera.com/cfm-operator/2.9.0/index.html)