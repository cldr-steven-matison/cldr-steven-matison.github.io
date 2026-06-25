---
title:  "Cloudera Flow Management Migration Tool 7.0.1 Release Announcement"
header:
  teaser: "/assets/images/nifi-logo.png"
categories: 
  - release
tags:
  - nifi
  - cloudera
---


# Cloudera Flow Management Flow Migration Tool 7.0.1 General Availability

The Data in Motion Team is pleased to announce the General Availability (GA) release of Cloudera Flow Management Flow Migration Tool 7.0.1, supporting migrations from Cloudera Flow Management 2.1.7 Service Pack 3 to Cloudera Flow Management 4.12.0.1 on Cloudera on premises. This release offers new features and improvements as well as upgraded dependencies. 

## Key features for this release

* Support for protected sensitive keys: Flow Migration Tool 7.0.1 supports the migration of versioned flows when the sensitive properties key is itself encrypted with the AEG/GCM protection schema, enabling migration for flows with extra security configured.
* Fixes for pre-configured Migration Tool: The migration tool comes pre-configured with Cloudera Flow Management 2 and 4 libraries so that the tool can be conveniently run standalone without any dependencies, this release fixes all known issues.
* Fixes for component migrations: This release contains fixes for migrating processors with CRON scheduling and for Parameter Contexts populated by Parameter Providers.

## Support Matrix and Upgrade Paths

To upgrade, users should:

* Upgrade to Cloudera Flow Management 2.1.7 Service Pack (SP) 3 first
* Then use the Cloudera Flow Management Migration Tool version 7.0.1 to convert Cloudera Flow Management 2.1.7 SP3 flows to run on Cloudera Flow Management 4.12.0.1 instances

**Note:** Cloudera Flow Management 4.12.0.1 is supported on Cloudera Data Platform 7.3.2. In-place upgrades from Cloudera Flow Management 2 to Cloudera Flow Management 4 are not supported; flows must be migrated then transferred to the Cloudera Flow Management 4 instance(s).

**Note:** Upgrading from Cloudera Flow Management 4.10.0 or 4.11.0 to 4.12.0.1 using Cloudera Manager follows the [standard upgrade procedure](https://docs.cloudera.com/cfm/4.12.0/upgrading-cfm/topics/cfm-upgrade.html).

## Use Cases

**Migrate Flows from Cloudera Flow Manager version 2 to version 4:**

* Automated migration of NiFi 1 flows to NiFi 2 flows saves customers hours of time and effort
* Migrating flows with the standalone package prevents interference with existing Cloudera Flow Management instances, providing customers with a smooth migration experience with no external dependencies, including any with the Cloudera Platform runtime itself

## Links

* [Release notes](https://docs.cloudera.com/cfm/4.12.0/cfm-migration-tool/topics/cfm-mt-release-notes.html#concept_wlv_sl3_5gb)
* [Download](https://archive.cloudera.com/p/cfm-migrator-tool/7.0.1/redhat8/yum/tars/nifi-migration-tool/)

Sincere thanks to everyone who helped with this release. You each did an incredible job.

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.