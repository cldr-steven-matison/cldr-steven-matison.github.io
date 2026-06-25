---
title:  "Cloudera Flow Management Operator for Kubernetes 3.1"
header:
  teaser: "/assets/images/kubernetes-logo.png"
categories: 
  - release
tags:
  - cloudera
  - nifi
  - kubernetes
  - cfm
---

The Data In Motion Team is pleased to announce the release of Cloudera Flow Management Operator for Kubernetes version 3.1. This release introduces powerful new security and automation features, focusing on programmatic identity and access management, automated certificate generation, and intelligent cluster lifecycle enhancements that significantly reduce admin overhead and streamline user onboarding. 

## Release Highlights:

* **Programmatic User Group Management via UserGroup Custom Resource Definition (CRD):** This new CRD enables admins to configure NiFi user groups directly in YAML. By managing user groups as code within the Kubernetes environment, it streamlines the organization of users, reduces manual configuration, and ensures consistent group management across clusters, significantly improving overall admin efficiency.
* **Streamlined Access Control with AccessPolicyProfile CRD:** This new CRD allows admins to define sets of access policies and roles for users programmatically. By consolidating access policies into a profile, it simplifies the assignment of permissions, ensures security policies are consistently enforced, and reduces the manual overhead of managing individual access rights.
* **Automated Authentication via User CRD Certificate Generation:** The User CRD has been enhanced to support the automatic generation of certificates. These certificates can be used to seamlessly authenticate users, removing the need for manual certificate provisioning. This automation accelerates secure user onboarding and strengthens security by ensuring standardized authentication mechanisms are deployed automatically.
* **Intelligent Lifecycle Management with NiFi Version Detection:** The Cloudera Flow Management Operator for Kubernetes can now automatically detect the NiFi version directly from the image tag. This eliminates the need for manual version specification, reducing human error and ensuring that the operator applies the correct configurations automatically, which simplifies operations and improves reliability.
* **Out-of-the-Box FIPS 140-3 Support for NiFi 2:** The Cloudera Flow Management Operator for Kubernetes now provides built-in FIPS 140-3 compliant NiFi 2 images. By simply deploying or upgrading to the latest NiFi 2 images, using this operator version, admins can meet FIPS 140-3 standards without requiring complex manual configurations.

## Upgrading to the New Release:

Reference the latest operator version in the Helm Install command. More details can be found in the [installation instructions](https://docs.cloudera.com/cfm-operator/3.0.0/installation/topics/cfm-op-install-overview.html).

## Links:

* [Release notes](https://docs.cloudera.com/cfm-operator/3.1.0/release-notes/topics/cfm-op-whats-new.html)
* [Documentation](https://docs.cloudera.com/cfm-operator/3.1.0/index.html)

Big thanks to everyone who supported and contributed to this release!

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.