---
title:  "Trino SQL Engine in Cloudera Data Warehouse for On-Premises"
header:
  teaser: "/assets/images/cloudera_trino.png"
categories: 
  - blog
tags:
  - cloudera
  - trino
---

## Trino SQL Engine in Cloudera Data Warehouse (CDW) Now General Availability (GA) for On-Premises

We’re excited to announce the general availability of the **Trino SQL Engine in Cloudera Data Warehouse** for On-Premises environments (Data Services 1.5.5 SP2). 

This release brings a fully managed, containerized Trino experience to your data estate. It delivers a high-performance, distributed SQL query engine wrapped in an enterprise-grade **Virtual Warehouse**, eliminating the complexity of manual configuration while offering auto-scaling, auto-suspend, and seamless Cloudera integration.

---

## Key Benefits
* **Seamless Data Federation:** Connect to 30+ data sources to analyze data where it lives without complex ETL.
* **Elastic Scalability & Cost Control:** Automatically scale workers based on load and utilize auto-suspend to eliminate idle compute costs.
* **Unified Security:** Full integration with **Apache Ranger** ensures rigorous data protection policies.
* **Simplified Operations:** New UI for connector management and built-in diagnostic tools.

---

## Feature Highlights

### 1. Universal Connectivity & Storage
* **Certified Enterprise Connectors:** Fully supported for Oracle, Snowflake, AWS Redshift, PostgreSQL, MySQL, Hive (HMS), Iceberg, and MariaDB.
* **Expansive Ecosystem:** Support for Kafka, MongoDB, Delta Lake, Google BigQuery, Druid, and MS SQL Server.
* **Teradata Connector:** Now available in **Tech Preview**.
* **Connector Management UI:** User-friendly interface to create, configure, and test connectors before deployment.
* **Hybrid Storage:** Full read/write to **Ozone (OFS protocol)** with local SSD caching for maximum performance.

### 2. Automated Lifecycle Management
* **Virtual Warehouses:** Easily manage the lifecycle of Trino coordinators and workers.
* **Intelligent Auto-Scaling:** Custom scaling parameters (min/max workers) to handle peak loads.
* **Graceful Shutdown:** Auto-suspend for "T-shirt sizes" (XS to L) ensures resources are released without interrupting queries.
* **Disaster Recovery:** Full Backup and Restore support for virtual warehouses and connectors.

### 3. Enterprise Security & Governance
* **Fine-Grained Access:** Ranger integration for authorization, dynamic column masking, and row filtering.
* **Secure Connectivity:** Support for LDAP authentication and a dedicated **Secrets Management** system for external credentials.

### 4. Empowering All Users
* **Talk-to-Your-Data:** AI SQL Assistance allows users to generate optimized Trino SQL from natural language.
* **Analyst Ready:** Full Trino syntax support and autocomplete within the **Hue SQL Editor**.
* **Developer Friendly:** Includes CDW CLI and a built-in Coordinator Web UI for deep-dive monitoring.
* **Visual Insights:** Native integration with **Cloudera Data Visualization**.

---

## Primary Use Cases
* **Federated Data Access:** Connect to external sources like Snowflake and Postgres with **zero-copy data**.
* **Interactive Reporting:** Use distributed SQL and SSD caching to power low-latency dashboards.
* **Cost-Efficient Ad Hoc Analytics:** Spin up "right-sized" warehouses that automatically shut down after analysis is complete.

---

## Links
* [Release Notes](https://docs.cloudera.com/data-warehouse/1.5.5/release-notes/topics/dw-private-cloud-whats-new-155-sp2.html)
* [What'sNew](https://docs.cloudera.com/data-warehouse/1.5.5/release-notes/topics/dw-private-cloud-whats-new-155-sp2.html#dw-private-cloud-whats-new-155-sp2__Trino_155_sp2)
* [Trino Documentation](https://docs.cloudera.com/data-warehouse/1.5.5/administration/topics/dw-trino-connectors.html)


As always, check out the entire [DOCS](https://docs.cloudera.com/data-warehouse/1.5.5/index.html) for Cloudera Data Warehouse.


If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about Cloudera please reach out to schedule a discussion.