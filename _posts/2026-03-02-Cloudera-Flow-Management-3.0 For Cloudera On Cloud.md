---
title:  "Cloudera Data Flow 3.0 for Cloudera on Cloud"
header:
  teaser: "/assets/images/clouderadataflow.png"
categories: 
  - release
tags:
  - cloudera
  - nifi
  - dataflow
---


The Data In Motion Team is pleased to announce the release of **Cloudera Data Flow 3.0 for Cloudera on cloud**.

This landmark release represents the most significant architectural shift in the history of Cloudera Data Flow. Importantly, we’ve moved beyond a single-flow deployment model to now support **multi-flow deployments**, offering unprecedented control over cloud resource consumption and infrastructure costs. It also introduces enhancements to the developer experience with data provenance tools, and ensures compliance with the latest security and platform standards through new Kubernetes and NiFi version support.

---

### Release Highlights

* **Multi-Flow Deployments:** Users can now add and manage multiple flows within a single NiFi deployment. This allows for better optimization of workload resources and cloud infrastructure costs. The 1:1 flow-to-deployment model is still possible for use cases that need resource isolation.
* **Data Provenance in Flow Designer:** A new Provenance Events feature within Flow Designer allows users to search, audit, and inspect FlowFiles as they move through a running test session, providing a historical record of data transitions for easier debugging and observability. Records can be replayed after debugging to ensure healthy data reaches its final destination.
* **Project-Level Governance and Enforcement:** Admins can now enforce resource association with projects at the environment level, providing strict control over access to flow drafts, test sessions and deployments. This is paired with new project-level usage tracking in the Cloudera consumption reporting.
* **NiFi End-of-Support Protections:** To ensure environment stability, the upgrade process now includes automated NiFi end-of-support policy enforcement. It will proactively check for NiFi runtime compatibility and block upgrades if unsupported versions are detected, preventing potential service disruptions. Options for upgrading NiFi runtime include:
    * The upgrade process can automatically upgrade your NiFi runtime version to a supported one. ([doc](https://docs.cloudera.com/dataflow/cloud/service-upgrade/topics/cdf-upgrade-environment.html))
    * Per-deployment upgrades of NiFi runtime can be done via the “Change NiFi Version” action. ([doc](https://docs.cloudera.com/dataflow/cloud/managing-deployments/topics/cdf-changing-nifi-runtime-version.html))

#### Flow Designer Enhancements
* Scalability improvements to Flow Designer reduce infrastructure CPU utilization while building in the canvas.
* Test Session states are now similar to those of deployments (active, suspended, terminated). This improves flexibility in managing test sessions and provides better control over cloud resource costs, without state loss.

#### ReadyFlow Updates
The **RAG Query Pinecone** and **Airtable-to-Cloud-Storage** ReadyFlows have been refined with improved configuration parameters. To maintain a streamlined gallery, several deprecated or low-usage flows have been removed:
* ADLS to Chroma DB
* S3 to Chroma DB
* S3 to S3 Avro with S3 Notifications
* Slack to Chroma DB

#### Platform Upgrades
Added support for **Kubernetes 1.33** and **NiFi 1.28.1 / 2.6.0**.

---

### Upgrading to the New Release
Customers can perform an in-place upgrade from supported Cloudera Data Flow versions to 3.0. Before initiating the upgrade, please ensure that you have reviewed the [NiFi EoS requirements](https://docs.cloudera.com/dataflow/cloud/support-matrix/topics/cdf-eol-policy.html) and [upgrade prerequisites](https://docs.cloudera.com/dataflow/cloud/service-upgrade/topics/cdf-upgrade-prerequisites.html). Alternatively, disabling and re-enabling an existing Data Flow environment will result in the re-enabled environment running the latest version.

---

### Links
* [**Release Notes**](https://docs.cloudera.com/dataflow/cloud/release-notes/topics/cdf-whats-new.html)
* [**Documentation**](https://docs.cloudera.com/dataflow/cloud/index.html)

If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about Cloudera DataFlow 3.0 please reach out to schedule a discussion.
