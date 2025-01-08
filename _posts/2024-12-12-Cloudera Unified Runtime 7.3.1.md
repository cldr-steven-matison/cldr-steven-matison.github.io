---
title:  "Introducing Cloudera’s Unified Runtime with 7.3.1"
header:
  teaser: "/assets/images/Cloudera-Data-Platform.png"
categories: 
  - blog
tags:
  - cloudera
  - cdp
---

We are thrilled to announce Cloudera’s first-ever unified release: Cloudera 7.3.1!  This is a single software release available for both cloud and on-premises environments that enable capabilities, workloads, and governance to work and feel the same everywhere.

With the cohesion of Cloudera on cloud 7.2.18 and Cloudera on premises 7.1.9 into a streamlined 7.3.1 version, customers can now benefit from our accelerated pace of innovation with simpler versioning. This unified release provides a consistent feature set across all deployment environments – whether on-premises or in the cloud.

This milestone release unleashes the power of true hybrid capabilities for data management, enabling data and analytics running on-premises and across multiple clouds to be managed cohesively and federated into a unified whole. Cloudera is the only platform transforming customers’ data management and data journeys by enabling the seamless movement of data and workloads across all environments.

<b><i>Welcome to the future of hybrid data solutions with Cloudera!</i></b>

# Release Highlights:

- Hive and Iceberg integration: The integration of Apache Hive with Apache Iceberg brings modern, open-table format capabilities to Hive’s powerful data warehousing features. With increased performance and scalability, Hive users can easily work with large, complex datasets across both cloud and on-premises environments. Iceberg's support for schema evolution, time travel, and ACID compliance allows Hive users to manage data changes seamlessly and query historical data snapshots without compromising on performance. This powerful combination streamlines data management, enhances flexibility, and opens new doors for efficient data operations in hybrid environments.

- Graviton support (tech preview): This release supports AWS Graviton processors, allowing our platform to harness the powerful, cost-efficient capabilities of Arm-based EC2 instances. Customers can now achieve up to 40% better price performance for data-intensive workloads, making large-scale data processing both faster and more accessible. Graviton support not only enhances processing speeds and reduces operational costs, but it also aligns with our commitment to flexible, cloud-optimized performance.

- SQL Assistant:  Hue now leverages Large Language Models (LLMs) to transform data interaction with its SQL AI assistant. Generate SQL queries from natural language, optimize, explain, and fix them effortlessly. Compatible with OpenAI’s GPT, Amazon Bedrock, and Azure’s OpenAI, Hue offers the flexibility to choose the AI service that suits you best.

- Support for Amazon S3 Express One Zone Storage: Cloud connectors now offer high-performance, single-availability Zone storage with consistent single-digit millisecond access. By storing data in the same Availability Zone as your compute resources, you can optimize performance, reduce costs, and accelerate workloads. This storage class supports hundreds of thousands of requests per second for seamless scalability.

- Improved security posture: This release addresses 225+ total Common Vulnerabilities and Exposures (CVEs) which reflects our strong commitment to safeguarding data and ensuring a secure, resilient environment for our users. Each CVE resolution bolsters the integrity and stability of our platform, protecting against potential threats across all deployment environments – whether on-premises or in the cloud, or hybrid.

# Additional Features:
1. Zero Downtime Upgrade (ZDU):  Building on the success of ZDU in version 7.1.9, by supporting ZDU in 7.3.1, we continue to simplify the upgrade process for hassle-free upgrades while maintaining high availability and minimizing disruptions to critical operations. 
2. Ozone HBase integration (tech preview): This integration provides an object storage solution for Apache HBase. On Ozone, HBase can now efficiently handle massive tables and provide random, realtime read/write access to your Big Data on S3 compliant storage.
3. Cloudera Replication Manager Enhancements:
  - Advanced Iceberg replication to support Iceberg V2 tables created by Hive, Impala, and Spark
  - Atlas Replication (tech preview) allows users to replicate Atlas metadata and data lineage for Hive external tables and Iceberg tables from on-premises to on-premises.
  - RM extends ozone replication from data only to metadata; ozone metadata replication can be scheduled via Hive external table replication.
4. Spark 3 Standardization:  For customers moving from Spark 2, this release simplifies the transition through enhanced tooling to ease the migration process. By upgrading to Spark 3, users can unlock superior performance, better resource utilization, and the ability to seamlessly integrate with modern data and AI workloads across hybrid and multi-cloud environments.
5. Unifying Cloudera On Cloud 7.2.18 and Cloudera On-Premises 7.1.9 now ensure feature consistency across deployment environments. For example, multi-authentication support for SAML and LDAP in the Apache Hive component is now available on Cloudera on-premises, while the OpenJPA 3 upgrade for Apache Oozie is now available on Cloudera On Cloud. For a complete list of new features on either platform, please refer to the release notes.  

# Multi Python Support
- Python 3.9: RHEL/Oracle 8.x, RHEL/Oracle 9.x, and Ubuntu 20. 
- Python 3.10: SLES 15 SP4 and SP5, and Ubuntu 22

# Upgrade Paths to Cloudera 7.3.1
- Cloudera on-premise: Direct upgrades (including downgrades and rollbacks) are supported from versions 7.1.9 SP1, 7.1.8, and 7.1.7 SP3.
- Cloudera on Cloud: Direct upgrades are supported from 7.2.18.0, 7.2.18.100, 7.2.18.300, and 7.2.17.200 through 7.2.17.500.
- Upgrades from other versions not listed above may require a two-hop upgrade.   

# Operating System, Database and JDK Support
RHEL 8.10: The latest release supports RHEL 8.10 for Cloudera on cloud.
JDK 17:  The latest release introduces JDK 17 support for Cloudera on cloud, delivering enhanced performance, security, and compatibility for modern cloud-native applications.
PostgreSQL 14: This support is now present for Cloudera on cloud.

# Removed Components
The following components have been removed and are no longer available in Cloudera 7.3.1:
- Apache Spark 2 (see [Deprecation notice](https://docs.cloudera.com/cdp-private-cloud-base/7.1.9/runtime-release-notes/topics/rt-pvc-deprecated-spark2.html) for Apache Spark 2)
- Apache Livy 2 (see [Deprecation notice](https://docs.cloudera.com/cdp-private-cloud-base/7.3.1/private-release-notes/topics/rt-deprecated-livy2.html) for Apache Livy 2)
- Apache Zeppelin (see [Deprecation notice](https://docs.cloudera.com/cdp-private-cloud-base/7.3.1/private-release-notes/topics/rt-deprecated-livy2.html) for Apache Zeppelin)

# Cloudera Data Services On Premises Support
Cloudera Data Services on premises are currently not supported with 7.3.1 and support will be coming down the road in subsequent CHFs and service packs.  Customers using Cloudera Data Services on premises are suggested to stay with 7.1.9, as upgrading to 7.3.1 will break compatibility. These customers should upgrade to 7.3.1 at a future date when support is available.      



Check out Cloudera Runtime [Release Notes](https://docs.cloudera.com/cdp-private-cloud-base/7.3.1/private-release-notes/topics/rt-runtime-overview.html)

Check out Public Cloud Runtime [Release Notes](https://docs.cloudera.com/runtime/7.3.1/index.html)

Check out [Fixed CVEs in 7.3.1](https://docs.cloudera.com/cdp-private-cloud-base/7.3.1/private-release-notes/topics/fixed_common_vulnerabilities_exposures_731.html)