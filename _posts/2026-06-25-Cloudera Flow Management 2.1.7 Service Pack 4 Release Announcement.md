---
title:  "Cloudera Flow Management 2.1.7 Service Pack 4 for Cloudera Data Platform 7.1.9 and 7.3.1"
header:
  teaser: "/assets/images/nifi-logo.png"
categories: 
  - release
tags:
  - cloudera
  - nifi
  - cfm
---

The Data in Motion team is pleased to announce the release of Cloudera Flow Management 2.1.7 Service Pack 4. This release is based on Apache NiFi 1.28.1 and supports Cloudera on-premises 7.1.9 (all service packs) and Cloudera on-premises 7.3.1 (all service packs).

This service pack improves stability and security through bug fixes and upgraded dependencies. Additionally, customers can use the NiFi 2 Pre-upgrade check to get ready for Cloudera Flow Management 4.12.0.1 (based on Apache NiFi 2). 

## Key features for this release

* Add nifi.web.request.timeout property to Cloudera Manager for user configuration: This setting allows users to increase the web request timeout property, allowing more time for cluster coordination, thereby reducing the occurrences of node dropouts from the cluster.
* Added FlowFile Expression Language support for Hostname and Share properties in PutSmbFile: This improvement allows for more flexibility and dynamic routing of files to SMB shares, reducing the number of PutSmbFile instances in the flow, which simplifies flow design.
* OAuth authentication with SASL Extensions support for Kafka components: This feature allows OAuth-based authentication to Kafka, important because as an industry standard many customers are required or are recommended to select OAuth as the authentication mechanism.
* Added Sawmill processors: Sawmill is a JSON transformation library enabling the user to enrich, transform, and filter your record-based FlowFiles. This, along with the JOLT and JSLT processors, provides a comprehensive set of Domain-Specific Languages (DSLs) with which to transform structured data.
* Cloudera Flow Management 2.1.7 Service Pack 4 is based on the latest Apache NiFi 1.x release (1.28.1): Cloudera continues to provide the newest features, upgrades, and patches to our on-premises customers. This effort ensures a secure application and minimizes vulnerabilities, covering essential CVEs necessary for compliance in most organizations.
* Bug fixes, security patches, performance improvements, and more.

We strongly encourage our customers to upgrade to this release.

## Use Cases

* For organizations, including self supporters, who cannot upgrade to NiFi 2.x soon, Cloudera Flow Management 2.1.7 SP4 is the most secure and stable release to run NiFi 1.x flows on and is [supported until September 2027](https://www.cloudera.com/services-and-support/support-lifecycle-policy.html).
* Cloudera is shipping a Pre-Upgrade check tool to analyze the customers' current flows and identify any known changes in NiFi 2.x that will require changes in their NiFi 1 flows.
* The Cloudera Flow Migration Tool 7.0.1 allows customers to migrate their Cloudera Flow Management 2.1.7 Service Pack 4 flows into a Cloudera Flow Management 4.12.0.1 (based on NiFi 2.x) compatible format.

## Links

* [Release notes](https://docs.cloudera.com/cfm/2.1.7/release-notes/topics/cfm-whats-new.html#concept_wlv_sl3_5gb)
* [Download](https://docs.cloudera.com/cfm/2.1.7/release-notes/topics/cfm-download-locations.html)

Sincere thanks to everyone who helped with this release. You each did an incredible job.

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.