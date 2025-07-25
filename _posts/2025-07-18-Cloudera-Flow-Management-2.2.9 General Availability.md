---
title:  "Cloudera Flow Management on DataHub 2.2.9 GA for Cloudera 7.3.1.400"
header:
  teaser: "/assets/images/nifi-logo.png"
categories: 
  - blog
tags:
  - cloudera
  - nifi
---


The Data in Motion Team is pleased to announce the General Availability (GA) release of Cloudera Flow Management 2.2.9 supporting Apache NiFi 2.3.0 and 1.28.1 for Cloudera Data Platform 7.3.1.400.

This release offers a number of new features and improvements as well as upgraded dependencies.

### Key features for this release

* **NiFi 2.3:** Cloudera Flow Management 2.2.9 for DataHub contains an image based on Apache NiFi 2.3.0 and adds several new features not available in previous versions of Apache NiFi.
    * **New Features and Components in Apache NiFi 2.3:**
        * Support for copying and pasting flow definitions between separate NiFi deployments
        * Several new processors integrating with Box, allowing users to leverage Box as a cloud storage solution
        * GetS3ObjectTags - Retrieves object tags for a file in S3
        * PEMEncodedSSLContextProvider - an SSLContext Provider configurable using PEM Private Key and Certificate files, providing a more secure solution for TLS-based connections
        * StandardDatabaseDialectService - A controller service to generate SQL statements for the specified database dialect (MySQL, Oracle, e.g.), providing a simpler approach for configuring database-related processors to support various SQL dialects
    * **New Components in Cloudera Flow Management 2.2.9 for DataHub (based on Apache NiFi 2.3.0):**
        * SawmillTransformRecord and SawmillTransformJSON - Uses the Sawmill transformation DSL to transform incoming FlowFiles, providing an additional and powerful method to transform FlowFile content
        * New controller services providing better integration with Cloudera Flow Management Registry
        * PhoenixThickConnectionPool and PhoenixThinConnectionPool - Database Connection Pool controller services integrating with Phoenix (SQL on HBase) either using the thin or thick driver (both included), enabling more connections from NiFi, such as to Cloudera Operational Database
        * RESTCatalogService (in Technical Preview) - Catalog controller service for integrating with external REST-based Iceberg catalogs such as Apache Polaris

* **New GenAI Python Processors:** Cloudera Flow Management 2.2.9 for DataHub adds four new Python processors to help develop RAG pipelines. PromptClaude, TokenCount, PromptAzureOpenAI, and PromptOpenAI are included in the release. For the associated applications, users can design a full RAG pipeline.

* **New Flow Analysis Rules:** Cloudera Flow Management 2.2.9 for DataHub adds two new Flow Analysis Rules: RequireMergeBeforePutIceberg and RestrictFlowFileExpiration. The former ensures FlowFiles will not be too small as to affect the performance of Iceberg; the latter restricts the minimum time for a FlowFile to expire in the system and be removed, which helps prevent data loss if FlowFiles remain idle in a connection past the specified threshold.

* **Critical Component Support:** CFM 2.2.9 includes the Solr, Spark, and Elasticsearch Beats components that were removed in Apache NiFi 2.0. For users with existing flows that use these, or looking to take advantage of them in new flows, Cloudera's distribution of NiFi 2.0 will be the only way to gain access to and support for these components.

* **Updates and Patches:** For additional stability, performance, and security.

### Support Matrix and Upgrade Paths

To upgrade, users should:

1.  Upgrade their CFM DataHubs to Cloudera Flow Management 2.2.9 (based on Apache NiFi 1.28.1) first
2.  Then utilize the Cloudera Flow Management Migration tool to convert existing Cloudera Flow Management flows to run on Cloudera Flow Management 2.2.9 (based on Apache NiFi 2.3.0) instances.

Cloudera Flow Management 2.2.9 for DataHub is supported on Cloudera Cloudera Data Platform 7.3.1 Service Pack 2. In-place upgrades from Cloudera Flow Management for DataHub (based on Apache NiFi 1.x) to Cloudera Flow Management for DataHub (based on Apache NiFi 2.x) are not supported; flows must be migrated then transferred to the Cloudera Flow Management 4 instance(s).

### Use Cases

Leverage NiFi 2.x capabilities with Cloudera enhancements:

* Exercise NiFi 2 capabilities in production with Cloudera’s first NiFi 2 based Generally Available release for DataHub.
* Flow administrators can enforce best practices for flow designers to ensure robust, reliable solutions using the Flow Analysis Rules Engine and Cloudera-provided flow analysis rules.
* Create RAG pipelines for GenAI, Data Engineering, and Machine Learning model scoring using new processors and integrations.

### Links

[Release Notes](https://docs.cloudera.com/cdf-datahub/7.3.1/release-notes/topics/cdf-datahub-whats-new.html)

[What's New with Nifi 1](https://docs.cloudera.com/cdf-datahub/7.3.1/release-notes/topics/cdf-datahub-whats-new-flow-management.html)

[What's New with  Nifi 2](https://docs.cloudera.com/cdf-datahub/7.3.1/release-notes/topics/cdf-datahub-whats-new-flow-management-nifi2.html)

[What's New with MiNiFi](https://docs.cloudera.com/cdf-datahub/7.3.1/release-notes/topics/cdf-datahub-whats-new-edge-management.html)
