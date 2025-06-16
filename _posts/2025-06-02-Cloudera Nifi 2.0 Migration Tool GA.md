---
title:  "Cloudera Flow Management Migration Tool 3.0.0 for NiFi 1 to NiFi 2 migrations now GA"
header:
  teaser: "/assets/images/nifi-logo.png"
categories: 
  - blog
tags:
  - nifi
  - cloudera
---


The Data in Motion team is pleased to announce the generally available (GA) release of Cloudera Flow Management Migration Tool 3.0.0.  This tool assists Cloudera customers in migrating from Cloudera Flow Management 2.1.7 Service Pack 2 (powered by NiFi 1) to Cloudera Flow Management 4.10.0 (powered by NiFi 2).  

# Key features and benefits of this release

 * Streamlined NiFi 1 to NiFi 2 migrations: The Cloudera Flow Management Migration Tool dramatically simplifies migrating data flows designed for NiFi 1 to run in NiFi 2, and helps you transition to Cloudera Flow Management 4.x more efficiently.  It facilitates migrations in compliance with the NiFi 1.28-to-2.3 GA ruleset to ensure a smooth and effective migration experience, covering missing, modified, and replaced components. The tool also automates complex and repetitive tasks in updating flow configurations, reducing manual effort.
 * Aligned with NiFi 2 features: This command-line tool transforms variables and components to align with NiFi 2 features.
 * Improved flexibility: This release allows you to migrate a flow in its “flow.json.gz” form, where no unzipping/rezipping need to take place.

# Support Matrix and Upgrade Paths

Cloudera Flow Management Migration Tool 3.0.0 is a standalone product that supports the conversion of flows from Cloudera Flow Management 2.1.7 Service Pack 2 to run on Cloudera Flow Management 4.10.0.0 instances. This release supports on-premises environments.

# Links
 * [Release notes](https://docs.cloudera.com/cfm/4.10.0/cfm-migration-tool/topics/cfm-mt-release-notes.html)
 * [Download](https://archive.cloudera.com/p/cfm-migration-tool/)