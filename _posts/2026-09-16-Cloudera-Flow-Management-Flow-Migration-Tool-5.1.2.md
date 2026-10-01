---
title:  "Cloudera Flow Management Flow Migration Tool 5.1.2"
header:
  teaser: "/assets/images/nifi-logo.png"
categories:
  - release
tags:
  - cloudera
  - nifi
  - cfm
  - migration
---

The Data in Motion Team is pleased to announce the General Availability (GA) release of Cloudera Flow Management Flow Migration Tool 5.1.2, supporting migrations from Cloudera Flow Management 2.1.7 Service Packs 3 and 4 to Cloudera Flow Management 4.11.0.0 on Cloudera on premises. This release offers new features, automations, and improvements as well as upgraded dependencies.

## Release Highlights

1. **Support for protected sensitive keys:** Flow Migration Tool 5.1.2 supports the migration of versioned flows when the sensitive properties key is itself encrypted with the AEG/GCM protection schema, enabling migration for flows with extra security configured.
2. **Fixes for pre-configured Migration Tool:** The migration tool comes pre-configured with Cloudera Flow Management 2 and 4 libraries so that the tool can be conveniently run standalone without any dependencies, this release fixes all known issues.
3. **Fixes for component migrations:** This release contains fixes for migrating processors with CRON scheduling and for Parameter Contexts populated by Parameter Providers.
4. **Fixed issue: Circular references in Parameter Contexts:** A “Circular references in Parameter Contexts not allowed error” was reported when migrating process groups that use variables inherited through multiple levels of parent process groups. This has been resolved to streamline migration.

## Links

- [Release notes](https://docs.cloudera.com/cfm/4.11.0/cfm-migration-tool/topics/cfm-mt-release-notes.html#concept_wlv_sl3_5gb)
- [Download](https://archive.cloudera.com/p/cfm-migrator-tool/5.1.2/redhat8/yum/tars/nifi-migration-tool/)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
