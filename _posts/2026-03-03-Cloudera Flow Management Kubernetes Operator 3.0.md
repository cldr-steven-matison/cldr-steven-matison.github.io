---
title:  "Cloudera Flow Management Operator for Kubernetes 3.0"
header:
  teaser: "/assets/images/kubernetes-logo.png"
categories: 
  - blog
tags:
  - cloudera
  - nifi
  - kubernetes
---

The Data In Motion Team is pleased to announce the release of **Cloudera Flow Management Operator for Kubernetes version 3.0**. This release introduces productivity and usability features.

---

### Release Highlights

#### Easier Onboarding with Programmatic User Management via New Customer Resource Definition (CRD)
This new CRD eliminates manual user setup by bringing NiFi identity management directly into a Kubernetes environment. Admins can now define user identities and associated access policies alongside cluster configuration in the yaml config file, enabling rapid, automated onboarding. By treating users as code, we reduce administrative overhead and ensure consistent security across all environments.

#### Absolute Stability with Enhanced Leader Election Guardrails for Cluster Scaling
A new "safety-first" scaling mechanism guarantees NiFi flow integrity by preventing accidental configuration erasure during cluster expansion. This prevents new nodes from inadvertently declaring themselves leaders with empty flows and overwriting production environments, ensuring absolute stability for GitOps-managed clusters.

---

### Upgrading to the New Release
Reference the latest operator version in the Helm Install command. More details can be found in the [installation instructions](https://docs.cloudera.com/cfm-operator/3.0.0/installation/topics/cfm-op-install-cfm-op.html).

---

### Links
* [Release notes](https://docs.cloudera.com/cfm-operator/3.0.0/release-notes/topics/cfm-op-whats-new.html)
* [Documentation](https://docs.cloudera.com/cfm-operator/3.0.0/index.html

If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about  {{ page.title }} please reach out to schedule a discussion.