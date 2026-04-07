---
title:  "Introducing Cloudera Runtime 7.3.2"
header:
  teaser: "/assets/images/2026-04-02-Cloudera-Runtime-7.3.2.png"
categories: 
  - release
tags:
  - cloudera
---

We are excited to announce the delivery of **Cloudera runtime 7.3.2**! This represents our most enduring Long-Term Support (LTS) release to date, with support extending through **2032**. This release builds upon the unified code base for both Cloudera on premises and Cloudera on cloud that was established in the previous release in support of the hybrid cloud strategy.

---

### Key Highlights

* **Cloudera Lakehouse Optimizer:** Through Iceberg optimization on Cloudera on premises, Cloudera now delivers 38× faster query performance and up to 36% reduction in storage costs.
* **Cloudera Data Sharing:** This capability helps organizations to now maintain data gravity and governance within Cloudera while sharing Iceberg table data with external platforms like Databricks and Snowflake via Apache Iceberg REST Catalog APIs.
* **Cloudera Object Store powered by Apache Ozone:** Enhancements in Ozone improve metadata handling and cluster coordination, add new diagnostic tooling, and bring deeper insights into cluster health.
* **Cloudera Cloud Bursting:** A breakthrough in hybrid data management, Cloud Bursting introduces a truly hybrid-native foundation that removes the complexity of fragmented management and the burden of costly, convoluted workload migrations.
* **Enhanced Data Security and Scalability:** This release advances platform resilience by integrating the latest open-source rebases and IPv6 support, resolving over 90 critical and high CVEs to ensure a secure, future-proof environment capable of meeting modern regulatory standards and demanding AI workloads.

---

### Why this release matters to our customers

This release serves as a critical bridge for customers looking to trade the risks of aging infrastructure for a modern, high-performance foundation. By upgrading to this stable, long-term foundation, our customers gain the advanced AI capabilities, hardened security, and improved performance required for today’s workloads, backed by the guaranteed longevity your enterprise needs for the next several years.

| If a customer is running… | Why it matters | The “Bottom Line” |
| :--- | :--- | :--- |
| **7.1.7 (EOS)** | You are currently operating on EOL software without official support or security patches. | 7.3.2 is your modern, secure "safe harbor" that restores full support and compliance, offering a direct in-place upgrade that eliminates the complexity of the past. |
| **7.1.9 (LTS till 2028)** | While 7.1.9 is supported until 2028, 7.3.2 is optimized for modern data workloads and AI readiness. | Stay on LTS, but gain the performance required for modern AI and high-scale data workloads. |
| **7.3.1 (STS till 2026)** | 7.3.1 version hits EOS later this year. | Move to 7.3.2 now to lock in years of stability and avoid another upgrade cycle this winter. |
| **7.2.18** | Public Cloud environments demand the highest security and efficiency. 7.3.2 optimizes resource utilization and lowers TCO. | Better performance on cloud infrastructure translates directly to lower monthly credits/spend. |

---

### Upgrade Paths

Clusters running the following releases are fully supported for a direct, one-step, in-place upgrade to Cloudera runtime 7.3.2:
* 7.1.7 SP3
* 7.1.9 SP1
* 7.2.18
* 7.3.1

Leveraging **Cloudera Manager 7.13.2**, these direct upgrade paths utilize pre-check validations and component-specific optimizations to minimize your downtime and reduce the operational complexity typically associated with multi-step migrations. Users on versions other than those listed above are advised to perform an intermediary upgrade to a supported “bridge” version before transitioning to 7.3.2.

---

### Key Features of this release:

* **IPv6 Support:** The following components now enable IPv6 client-side support: Cloudera Data Explorer (previously known as Hue), Apache Kafka, Apache Phoenix, Apache Kudu, Apache Hive, Apache Zookeeper, Apache HBase, and Apache Impala. Over the next several years, we will enable IPv6 for the rest of the components as part of the 7.3.2 roadmap.
* **JDK Updates:** Cloudera has standardized on **JDK 17** as the default compilation and runtime baseline, retiring support for JDK 8 and 11. This upgrade strengthens performance, security, and maintainability across our platform while aligning with enterprise modernization trends.
* **Cloudera Cloud Bursting:** This feature helps customers maximize their existing on premises investment while dynamically and temporarily extending their private data center into the cloud, thus unlocking on-demand elasticity without data duplication or application rewrites.
* **Cloudera Lakehouse Optimizer:** This feature delivers intelligent automation for all Iceberg table maintenance operations with scalable execution and dynamic scheduling. In addition, both Cloudera Lakehouse Optimizer on cloud and on premises now include Ranger integration, providing fine grained access control and enhanced data security across environments.
* **Cloudera Data Sharing:** This capability delivers seamless, secure, and scalable access to live data—without duplication or migration. By sharing Iceberg table data from Cloudera on AWS with an external analytics platform, Cloudera opens interoperability while maintaining data gravity, security, and governance within the Cloudera environment.
* **Automated Data Lifecycle Management with Ozone:** This feature (in technical preview) improves storage efficiency by safely converting 3 way replicated blocks to erasure coding, thus saving up to 50% physical storage on disk.

---

### Additional Features

* **Component rebases:** Hadoop 3.4, Kafka 3.9, Atlas 2.4, Knox 2.1, Ranger 2.6, Spark 3.5, Zookeeper 3.8, Phoenix 5.2.1, HBase 2.6.3
* **Atlas Features:** Atlas is now upgraded to a ReactJS-based UI, replacing BackboneJS. This modernization brings a more intuitive interface, and a smoother, more reliable experience for users. Furthermore and now available in technical preview, Atlas now supports automatic purging of deleted entities, improving metadata hygiene and system performance by removing stale data on schedule.
* **Ranger RAZ:** Ranger RAZ now supports S3A-compatible object stores for Cloudera Base on premises with ID broker, delivering consistent, fine-grained security across deployments.
* **Replication Manager:** Iceberg replication is now supported across AWS regions. Other Replication Manager features include on-prem replication for Ozone storage, Atlas replication for Hive external tables and Iceberg to ensure enterprise readiness, Ranger on-prem to cloud replication for hybrid governance, and FIPS 140-2 compliance for enhanced security and regulatory assurance.
* **Hue:** Hue becomes **Cloudera Data Explorer**, marking the first phase of a product evolution and UI enhancements.
* **Impala Improvements:**
    * Intermediate results caching encryption for improved performance.
    * Lazy materialization improving Parquet file scanning performance.
    * Catalog quality improvements with hierarchical event processing.
    * OpenTelemetry integration for improved observability reporting.
    * Iceberg diagnostics metrics exposed in Query Profiling for optimizations.
    * Data security improvements with AES encryption and decryption.
    * On premises S3-compatible object store certification.
    * Support for ARM-based processors.
* **Kudu Improvements:**
    * Support for ARM-based processors.
    * New Array data type support.
    * Flink-based, real-time replication support.
    * Simplified Python integration.
    * Improved cluster density.
    * Enhanced memory tracking and out-of-memory prevention.
* **HBase:** Upgrade improvements with cache persistence resilience.
* **Phoenix:** Support for high-availability (HA) configuration.
* **Solr:** Introduced ARM architecture support for Data Hub and updated the HBase Indexer to align with the 2.6.3 rebase.
* **Hive Improvements:**
    * Iceberg v2 Improvements
    * Introducing Branching and Tagging
    * Expire snapshots
    * Truncate partition support
    * INSERT INTO and INSERT OVERWRITE PARTITION support
    * Copy on Write
    * Iceberg RESTful API for HMS
    * DROP partition support
    * Compaction support
    * Common Table Expressions optimization using Common Based Optimizer
    * Enable Hive to run on host with ARM architecture
    * Hive Observability with OTEL (OpenTelemetry)

---

### Data Services Compatibility

To ensure a smooth transition and a fully supported environment, please note the essential compatibility requirements for this release. Cloudera runtime 7.3.2 is integrated with **Data Services 1.5.5 SP2** and **Cloudera Manager 7.13.2**.

### New Operating Systems and Database Certifications
* **Operating Systems:** RHEL 9.6, Rocky Linux 9.6, Ubuntu 24.04, SLES 15 SP6
* **Databases:** MariaDB 11.4

### End of Support of OS and DBs
* **Operating Systems:** Ubuntu 20.04, Oracle 19c, SLES 15 SP4, SLES 12 SP5, RHEL 8.6
* **Databases:** MariaDB 10.4, MariaDB 10.5, Postgres 12, Postgres 13, MySQL 5.7

---

### Next Steps

Reach out to your Cloudera contact to learn more about the 7.3.2 General Availability (GA) features or to request access to our current technical previews.

### Public Links
* [Cloudera on premises 7.3.2 Release Notes](https://docs.cloudera.com/cdp-private-cloud-base/7.3.2/private-release-notes/topics/rt-whats-new.html)
* [Cloudera on cloud 7.3.2 Release Notes](https://docs.cloudera.com/runtime/7.3.2/public-release-notes/topics/rt-whats-new.html)
* [Cloudera Manager 7.13.2 Release Notes](https://docs.cloudera.com/cloudera-manager/7.13.2/manager-release-notes/topics/cm-release-notes-7132.html)
* [JDK Upgrade documents](https://docs.cloudera.com/cdp-private-cloud-upgrade/latest/upgrade-cdp/topics/ug_jdk8-cdp.html)
* [Fixed CVEs in runtime 7.3.2](https://docs.cloudera.com/cdp-private-cloud-base/7.3.2/private-release-notes/topics/fixed-common-vulnerabilities-exposures-732.html)
* [Fixed CVEs in Cloudera Manager 7.13.2](https://docs.cloudera.com/cloudera-manager/7.13.2/manager-release-notes/topics/cm-cve-7132.html)
* [Cloudera support lifecycle policy](https://www.cloudera.com/services-and-support/support-lifecycle-policy.html)


If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.


