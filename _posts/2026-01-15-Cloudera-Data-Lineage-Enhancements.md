---
title:  "Cloudera Data Lineage Enhancements"
header:
  teaser: "/assets/images/cloudera_data_lineage.png"
categories: 
  - blog
tags:
  - cloudera
  - octopai
  - data
  - lineage
---

### Cloudera Connectivity, Spark, Kafka, NiFi, Databricks, AI, and more!

The Cloudera Data Lineage Team is thrilled to announce a significant expansion of Cloudera Data Lineage. This release introduces deeper integrations for **Databricks**, enhanced security protocols for enterprise workloads, and expanded lineage support for **Snowflake**.

Our goal is to provide a seamless, high-performance environment that bridges the gap between raw data and actionable insights. By integrating AI-driven SQL conversion and strengthening our connector suite, we are empowering teams to work faster, more securely, and with greater visibility across the entire data lifecycle.

---

## New Features
This release focuses on three core pillars: advanced cloud-data integration, enterprise-grade security, and robust pipeline connectivity.

### 1. Enterprise-Grade Authentication
Prioritizing support for Cloudera authentication protocols:
* **Spark Lineage + Kerberos:** Secure your Spark lineage leveraging secure integration with industry-standard Kerberos authentication.
* **Secure Hive & Impala:** Supported authentication protocols for secure integration.

### 2. Databricks Ecosystem & AI Intelligence
*This release positions our Lineage as a more robust solution over the native Databricks offering!*
* **Unity Catalog Integration:** Lowering the barrier for complex data catalog analysis.
* **Enhanced Delta Live Tables:** Deepened support for Databricks Delta Tables to ensure high-performance ACID transactions and metadata handling.
* **AI & Python Support:** Supported lineage for **Databricks Notebooks AI** (outside Unity Catalog) and **Python jobs** operated by the Databricks compute engine.
* **Multi-Metastore Connector:** Seamlessly bridge Hive metadata with Databricks environments via the HMS Connector.

### 3. Streaming, Connectivity & Lineage
* **Snowflake Stage Enhancement:** Improved support for pipeline lineage and end-to-end visibility.
* **Apache Kafka & Kafka Connect:** New, robust connectors to support Kafka lineage.
* **DataStage Sequencers:** Enhanced analysis for IBM InfoSphere DataStage Sequencer jobs—**an industry-first integration!**
* **Apache NiFi Connector:** Full support for NiFi integration with Apache Knox authentication.

### 4. Internal Operations
* **Gainsight Rollout (Internal Only):** Deploying Gainsight to better track customer success metrics and platform health.

---

## Use Cases
### For Data Engineers & Analysts
Solve "metadata management" chaos by using Cloudera Data Lineage as a risk-mitigation tool that automatically maps the entire lineage across Cloudera and external systems (Databricks, Oracle, Snowflake).
* **End-to-End Lineage:** Audit and trace data flow with 100% confidence.
* **Seamless Ingestion:** Build real-time pipelines using new Kafka and NiFi connectors without custom coding.

### For Enterprise Security Teams
* **Unified Governance:** 5 Cloudera connectors enable governance that follows the data regardless of where it is stored.
* **Single Source of Truth:** Reduce "data silos" and gain insight into migration success with full Databricks lineage.

---

## Roadmap: Coming Soon
We are continuing to accelerate our release cycle. Upcoming features include:
* **Trino Integration:** Enabling a more holistic UDF solution.
* **MS Fabric Support.**
* **Revamped Universal Connector (Connector Factory):** Enhanced support for inner-system lineage and frequency refresh.

---

As always, check out the entire [DOCS](https://docs.cloudera.com/octopai/latest/index.html) for Cloudera Data Lineage.


If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about Cloudera Data Lineage,  please reach out to schedule a discussion.


