---
title:  "Cloudera Flow Management 4.12.0 General Availability for Cloudera 7.3.2"
header:
  teaser: "/assets/images/2026-04-01-Cloudera-Flow-Management-4.12.0.png"
categories: 
  - release
tags:
  - cloudera
  - nifi
  - cfm
---

The Data in Motion Team is pleased to announce the General Availability (GA) release of **Cloudera Flow Management 4.12.0**, supporting **Apache NiFi 2.6** with Cloudera Manager on Cloudera on premises and Cloudera on cloud (Data Hub) 7.3.2. This release offers a number of new features and improvements as well as upgraded dependencies.

---

### Key features for this release

**NiFi 2.6:** Cloudera Flow Management 4.12.0 is based on Apache NiFi 2.6.0 and adds several new features not available in previous versions of Apache NiFi.

**New Components in Apache NiFi 2.6:**
* **ConsumeKinesis** - a new processor that enables users to receive messages from an AWS Kinesis source
* **PutIcebergRecord** - a new processor that enables users to put record-based FlowFiles into Iceberg tables
* **AzureDevOpsFlowRegistryClient** - a new flow registry client that enables users to leverage Azure DevOps as a Flow Registry

**New and Improved Components in Cloudera Flow Management 4.12:**
* Now offering **ConsumeMQTTIIoT** and **MQTTIIoTReader**, allowing flows to receive and parse Sparkplug messages, enabling Industrial Internet of Things (IIoT) and edge use cases via an industry-standard format.
* Support for **OAuth2 (OAUTHBEARER)** authentication has been added for Kafka components. This enhancement enables secure access to Kafka brokers using an OAuth2 Token Provider controller service to obtain and manage access tokens.

**New Flow Analysis Rule:** Cloudera Flow Management 4.12.0 adds the **RequireServerSSLContext** Flow Analysis Rule to ensure no servers (via ListenHttp or ListenTCP) can be created without a secure communications layer.

**Migration Tool version 7.0.0:** Includes bug fixes and supports migrations from Cloudera Flow Management 2.1.7 Service Pack 3 to Cloudera Flow Management 4.12.

**Updates and Patches:** Additionally, updates and patches have been implemented for additional stability, performance and security.

---

### Support Matrix and Upgrade Paths

To upgrade, users should:
1. Upgrade to **Cloudera Flow Management 2.1.7 Service Pack (SP) 3** first.
2. Then utilize the **Cloudera Flow Management Migration tool version 7.0.0** to convert existing Cloudera Flow Management 2.1.7 SP3 flows to run on Cloudera Flow Management 4.12.0 instances.

**Note:** Cloudera Flow Management 4.12.0 is supported on Cloudera Data Platform 7.3.2. In-place upgrades from Cloudera Flow Management 2 to Cloudera Flow Management 4 are not supported; flows must be migrated then transferred to the Cloudera Flow Management 4 instance(s).

Upgrading from Cloudera Flow Management 4.10.0 or 4.11.0 to 4.12.0 using Cloudera Manager follows the standard upgrade procedure.

---

### Use Cases

**Leverage NiFi 2 capabilities with Cloudera enhancements:**
* Exercise NiFi 2 capabilities in production with Cloudera’s NiFi 2 based Generally Available release.
* Flow administrators can enforce best practices for flow designers to ensure robust, reliable solutions using the Flow Analysis Rules Engine and Cloudera-provided flow analysis rules.
* Create RAG pipelines for GenAI, Data Engineering, and Machine Learning model scoring using new processors and integrations.
* Implement IIoT solutions at the edge to ingest messages from edge devices and process them using the full power of Cloudera Flow Management.

---

### Links
* [**Release Notes**](https://docs.cloudera.com/cfm/4.12.0/release-notes/topics/cfm-whats-new.html)
* [**Download**](https://docs.cloudera.com/cfm/4.12.0/release-notes/topics/cfm-download-locations.html)
* [**Docs**](https://docs.cloudera.com/cfm/4.12.0/index.html)

If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
