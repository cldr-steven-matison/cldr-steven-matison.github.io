---
title:  "Cloudera Data Services On Premises 1.5.5 SP3 Release"
header:
  teaser: "/assets/images/Cloudera-Data-Platform.png"
categories: 
  - release
tags:
  - cloudera
  - data services
  - ai
---

Cloudera is pleased to announce the release of Cloudera Data Services on premises 1.5.5 SP3.

This milestone Service Pack delivers powerful, production-grade upgrades to the 1.5.5 product line, specifically engineered to advance enterprise AI initiatives, maximize administrative efficiency, and harden platform resilience.

Highlights include the General Availability (GA) of Cloudera AI Agent Studio for production-grade agentic workflows, the airgapped release of Cloudera Observability 3.7.1. The new Observability release brings comprehensive workload optimization, query debugging, and the ability to export all platform level metrics to 3rd party tools.

## Key Features and Benefits

### Cloudera AI

**Agent Studio**
* **Ready for big business:** Now Generally Available (3.0), delivering its powerful agentic capabilities in a more hardened, secure, and production-ready experience, enhanced with new capabilities.
* **Native function calling:** Agent Studio now uses native LLM function-calling protocols for agentic operations. This improves tool-call reliability and parameter accuracy, reduces latency caused by malformed retries, and enables agents to sustain complex, long-running workflows.
* **Smart planning:** “Task Planning” is a powerful workflow feature that empowers agents to manage complex, multi-step projects by creating structured, automated to-do lists before processing begins. It provides real-time visibility into agent progress, allowing you to track exactly how work is being completed. The agent systematically plans and performs each task in sequence, ensuring every step is completed and verified, thereby improving performance and accuracy of the workflow.
* **Guardrails:** Guardrails protect sensitive data and control how information is exchanged between workflows and Large Language Models (LLMs). They can:
  * Detect and block prompt injection attempts
  * Filter sensitive keywords
  * Anonymize Personally Identifiable Information (PII)
  * Enforce topic policies
  * Run custom guardrail logic written in Python
* **Full tracking:** The system now automatically logs who creates or changes tools, and tracks exactly how workflows run.

**Cloudera AI Registry**
* **Faster upgrades:** The new in-place upgrade preserves all Kubernetes resources, allowing the process to complete in a short time, typically within 15 minutes.
* **Complex Deployments:** Cloudera now supports deploying Cloudera AI Inference connecting to multiple Cloudera AI Registries.
* **Model export:** Added a new API endpoint to download specific MLFlow model versions.

**Cloudera AI Inference Service**
* **API Key support:** The Inference service now accepts the new Knox API Keys, enabling long-lived connectivity to Inference Model Endpoints.
* **Better security control:** Fine-grained access control allows Administrators to define specific access levels for Model Endpoints for individual users or groups.
* **Broader model support:** New Models are available following our upgrades of vLLM to 0.20 version.

**Cloudera AI Workbench**
* **Targeted resource limits:** Teams can now set limits on CPU and memory so one heavy job doesn't hog the whole system.
* **Low quota warning:** The UI will now warn you if you don't have enough resource quota before you launch a new job or session.
* **Self-healing apps:** If an app fails, it will now try to restart itself up to three times automatically to save you time.
* **Cleaner project lists:** A new filter separates your personal projects from your team's shared work, making things easier to find.
* **Easier service accounts:** Users can now assign service accounts to their own jobs without waiting for an admin, as long as they have the right permissions.
* **Better logs:** You can now download user logs directly from the diagnostics page to troubleshoot issues faster.

**ML Runtimes**
* **Extra security:** We added new, "Hardened" runtimes built on Chainguard images.
* **Updated base:** Standard Hadoop add-on images have been updated to Ubuntu 24.04 LTS.

### Cloudera Data Engineering
**Increased Operational Efficiency Through Enhanced Administration**
* **Accelerated Node Setup with Automated Taint Support:** Eliminates resource contention by automatically applying both Kubernetes taints and labels when a node profile is selected in Cloudera Manager, significantly speeding up ECS deployments.
* **Zero-Downtime Administration via Configuration Change Detection:** Empowers administrators to propagate Management Console updates (such as proxy, LDAP, or Kerberos) with a single click. This eliminates manual configurations and the need for service redeployments.

**Accelerate Project Delivery and Hardened Security with Practitioner enhancements**
* **Boosted Developer Productivity via Spark Connect (GA):** Bridges the gap between local development and production by allowing practitioners to build pipelines from familiar local IDEs (Python/Java/Scala) with long-running sessions and dynamic allocation.
* **Granular Pipeline Governance:** Hardens security by restricting access to sensitive Airflow UI elements - including connections, variables, and XCOM - to Administrator roles (DEAdmin, Service Admin, and VC Admin). Regular users retain the ability to manage and run their jobs.
* **Improved Workload Visibility:** Deepens integration with Cloudera Observability to provide faster root-cause resolution for complex engineering tasks. Refer to the Observability section for additional details.

### Cloudera Observability
* **Observability Airgapped release:** Observability 3.7.1 covers Cloudera Data Warehouse and Cloudera Data Engineering essential for Data Services on premises customers.
  * Release covers workload optimization, query/job history and debugging, usage analysis at workload, user and table level.
  * **Metrics Export:** ability to export all platform level metrics collected by Observability across Cloudera Data Warehouse, Cloudera Data Engineering and Cloudera AI via open telemetry protocol to 3rd party tools.

### Cloudera Data Warehouse
* **Protect Cluster Stability via Proactive Configuration Change Detection:** Cloudera Data Warehouse on premises proactively identifies configuration drift to improve cluster stability, simplify troubleshooting, and strengthen compliance tracking.
* **Eliminate Manual Storage Setup: Automated Ozone Integration:** Streamlines object-store workloads by automatically applying centrally managed S3A credentials and endpoints to Hive, Impala, and Trino Virtual Warehouses at launch.
* **Guaranteed Operational Continuity via Instant Upgrade Rollbacks:** Provides peace of mind by allowing administrators to instantly revert failed Hive or Impala Virtual Warehouse upgrades to their last working state.
* **Faster Failure Resolution through Proactive Troubleshooting:** Automatically captures OOM heap dumps and JVM crash dumps, accelerating root-cause analysis for infrastructure and service failures.
* **Mitigate Security and Performance Vulnerabilities with Modernized Ingress:** Migrates Cloudera Data Warehouse on RKE from NGINX to Istio (via Kubernetes Gateway API), delivering superior long-term support, enhanced security, and improved memory stability.
* **Ensure Predictable Query Performance via Core Impala Standardization:** Standardize Virtual Warehouses on the core Impala architecture following the removal of legacy Unified Analytics.
  * *Note: Practitioners may need to migrate legacy Hive snippets and saved Hue queries to ensure they continue to run correctly.*

### Platform
**Increased Audit Accuracy Through Enhanced Security & Compliance**
* **Accurate user activity tracking:** Cloudera AI audit events now capture the real client IP improving accuracy for user activity tracking and audit investigations.
* **Secure Ozone S3 access for Data Services applications:** This enables Data Service applications to securely access Ozone-backed S3 storage and improves integration with object-store-based workloads.

**Enhanced Reliability and Scalability With Improved Performance and Resource Optimization**
* **Workload isolation enhancement:** The platform now supports node labeling and tainting to help administrators dedicate specific nodes for selected workloads, reducing resource contention across services.
* **Improved traffic management:** Platform ingress capabilities have been enhanced to improve reliability and enable more scalable traffic management across Data Services.

**Improved Resilience Through Better Troubleshooting and Supportability**
* **Enhanced log handling for faster troubleshooting:** The logging architecture has been enhanced to better handle large and variable log volumes, memory pressure and log collection failures. This improves troubleshooting efficiency and supportability for Data Services environments.
* **Scalable Diagnostic Bundle collection:** Diagnostics processing has been redesigned to use memory more efficiently when handling large data volumes, reducing the risk of out-of-memory failures and failed bundle generation.

**New Certifications:**
* Certified with Cloudera Base 7.3.2, 7.3.1 SP3, 7.1.9 SP2; Cloudera Manager 7.13.1.800, 7.13.2; OCP 4.20, and RKE2 1.33, Longhorn 1.9, RHEL 9.7.

### Security and CVE Reduction
Cloudera Data Services on premises 1.5.5 SP3 represents a major hardening of the platform, driving aggressively toward a zero-vulnerability posture for enterprise peace of mind.
* **KEV Milestone:** Successfully eliminated virtually all Known Exploited Vulnerabilities (KEVs) across the vast majority of platform components and services. Only two KEVs remain under approved exceptions.
* **Continued Risk Reduction:** Total CVE instances dropped by 19% since 1.5.5 SP2 release.

---
### Links
* [Release Notes](https://docs.cloudera.com/cdp-private-cloud-data-services/1.5.5/release-notes/topics/mc-private-cloud-whats-new-155-sp3.html)
* [Public Documentation for 1.5.5 SP3](https://docs.cloudera.com/cdp-private-cloud-data-services/1.5.5/release-notes/topics/cdppvc-service-packs-155-sp3.html)
* [Cloudera Data Services on premises 1.5.5 SP3 Archive](https://archive.cloudera.com/p/cdp-pvc-ds/latest/)
* [Support Matrix](https://supportmatrix.cloudera.com/)

A massive thank you to everyone who helped bring this release across the finish line — your efforts were outstanding.

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
