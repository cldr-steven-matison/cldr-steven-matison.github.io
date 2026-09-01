---
title:  "Cloudera Flow Management Operator for Kubernetes 3.3"
header:
  teaser: "/assets/images/CFM-Cloudera_Flow_Management_Operator.png"
categories: 
  - release
tags:
  - cloudera
  - nifi
  - kubernetes
  - cfm
---

The Data In Motion Team is pleased to announce the release of Cloudera Flow Management Operator for Kubernetes version 3.3. This release focuses on improving security, streamlining deployments, and enhancing upgrade paths. The core highlights include first-class Apache Ranger authorization, seamless inter-cluster communication, declarative flow deployments, and rolling upgrades for NiFi 2 clusters.

## Release Highlights

1.  **Unified Security Governance Across NiFi Clusters:** Centralized, policy-based access control for Operator-Managed NiFi clusters is now possible by integrating customer-managed Apache Ranger with the Cloudera Flow Management Operator for Kubernetes.
2.  **Automated, Secure Cross-Cluster Communication:** The Operator now automatically provisions SSL context services using existing node keystores and truststores, eliminating manual TLS configuration for secure cluster-to-cluster data movement.
3.  **Zero-Downtime Rolling Upgrades for NiFi 2:** Upgrade between NiFi 2 versions smoothly without service interruption, keeping at least one node running throughout the upgrade process to maintain continuous availability.
4.  **Declarative Flow Deployments:** Treat flows as code by importing and automatically starting NiFi flow definitions directly from Kubernetes ConfigMaps or Secrets via a new ProcessGroup Custom Resource. Please be aware that at v1:
      * Deployed flows cannot be updated.
      * Changes to the source ConfigMap or Secret are not applied after deployment.
      * Parameters must be defined within the Flow Definition JSON.
      * External parameter contexts are not supported.
5.  **Automated Kubernetes Resource Cleanup:** Reduce cluster clutter and administrative overhead by automatically identifying and purging obsolete resources after upgrades or during configuration changes.

## Upgrading to the New Release

Reference the latest operator version in the Helm Install command. More details can be found in the [installation instructions](https://docs.cloudera.com/cfm-operator/3.3.0/installation/topics/cfm-op-install-overview.html).

## Links

  * [Release notes](https://docs.cloudera.com/cfm-operator/3.3.0/release-notes/topics/cfm-op-whats-new.html)
  * [Documentation](https://docs.cloudera.com/cfm-operator/3.3.0/index.html)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.