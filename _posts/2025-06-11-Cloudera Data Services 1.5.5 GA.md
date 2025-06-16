---
title:  "Cloudera Data Services On Premises 1.5.5 General Availability"
header:
  teaser: "/assets/images/Cloudera-Data-Platform.png"
categories: 
  - blog
tags:
  - cloudera
---



Cloudera is thrilled to announce the general availability (GA) of Data Services 1.5.5*. This is a significant milestone tailored to meet the security, reliability, and scalability requirements of many on-premises Data Services customers. Key capabilities of this release are: Cloudera AI Inference tech preview, cert-manager integration for non-wildcard certificates, Cloudera AI Workbench scalability and performance improvements, Cloudera Data Engineering Access Control Lists (ACLs), Cloudera Data Warehouse Hive query history, and a significant reduction in common vulnerabilities and exposures (CVE). 

# Key features and benefits of this release

 * Cloudera AI Workbench: 
   * AI Studios [Technical Preview]
     * Low-code tools simplify the development, customization, and deployment of generative AI solutions
   * Cloudera Copilot [Technical Preview]
     * AI-powered coding assistant for seamless integration within JupyterLab ML Runtimes
   * Model Hub [Technical Preview]
     * Catalog of top-performing LLM and generative AI models
   * Spark in Cloudera AI Improvements
   * User and Team Sync enabled by default
   * Multiple Docker registry account support
   * Support for Cloudera Base 7.3.1.300 for Cloudera AI Workbench-only deployments
   * Removal of wildcard Certificate requirement through use of Cert Manager

 * Cloudera AI Inference (New Data Service):
   * Technical Preview of our AI Inference service for on-premises
   * Capability to deploy both open-source and NVIDIA NIM-based LLMs on GPUs
 * Cloudera Data Engineering: 
   * Multi-tenant / Multi-team security model (ECS only) 
     * New User Management Service (UMS)  roles for granular access controls: administrative delegation and access restrictions per VC  (by group & user)
     * Application artifact ACLs:  Virtual cluster artifacts including jobs, job runs, resources, sessions, and repositories are now controlled by object level access control lists
   * Streamlined onboarding
     * Self-service user onboarding:  Users that will execute applications on the cluster, can on-board their Kerberos credentials using a new self-service workflow.  Removes the need for the previous administrative utility scripts
     * Removal of wild card certificates: During service and VC creation, the system will automatically set up self-signed certs, which can later be updated with custom certificates by an administrator via UI/API/CLI. Third-party certificate manager Venafi is also supported
   * Improved security posture via hardened Images
     * Spark runtimes now use Chainguard to reduce CVEs and include upgraded components, like Python 3.10 and 3.11
 * Cloudera Data Warehouse: 
   * Hive and Impala query history
     * A scalable solution for storing and analyzing historical Hive query data. It captures detailed information about completed queries, such as runtime, accessed tables, errors, and metadata, and stores it in an efficient Iceberg table format
   * Cloudera Data Warehouse provides you with the option to enable logging Impala queries on an existing Virtual Warehouse or while creating a new Impala Virtual Warehouse
   * OpenTelemetry support for Hive
   * Enhancements for Hue SQL AI Assistant including support for Cloudera AI Inference  connectivity, multi-database querying, and user input validation controls 
 * Cloudera Data Visualization:
   * Version 7.2.9 is now available, bringing improvements for job and user management, dataset versioning, and AI Visual creation 
 * Data Services Platform: 
   * Automated certificate management via cert manager integration (ECS only)
     * Cert-manager is an open-source tool for Kubernetes that automates the provisioning, management, and renewal of TLS certificates. It gives customers an option to not use wildcard certificates by default and instead use their certificate issuers to provision certificates
   * Istio support (ECS only)
     * Istio integration in Cloudera’s platform enables Cloudera Data Engineering’s ACL features as well as Cloudera AI Inferencing authorization capabilities.The Control plane uses Istio in ambient mode, while Cloudera AI and Cloudera Data Engineering are currently using Istio in sidecar mode
   * Improved ECS upgrade reliability via prechecks
     * Host Health Status, EcsHostDnsInspection, Security Software Inspection, Control plane health check, Docker registry health check
   * Better quota management and resource utilization for multi-base cluster deployment
     * Manage and allocate quotas: setup, at time of the service or workload, sets the logical boundaries (quotas)
     * Enforce quotas: applies the logical boundaries, runtime, queues new workloads that do not fit in quota
     * Enables multiple Base clusters to interact with a single control plane
   * Cloudera support for Apache Iceberg version 1.5.2
   * Certifications include 7.1.9 Service Pack 1 Cumulative Hot Fix (CHF) 5, Red Hat Enterprise Linux 9.5, Openshift Container Platform 4.17, Rancher Kubernetes Engine 2 1.30
 * CVEs:
   * 91% reduction in total CVEs in those images, bringing the count down from 98,000 (in 1.5.4 Cumulative Hot Fix 1) to 8,000

# Support Matrix and Upgrade Paths
To upgrade to the 1.5.5 release, you must ensure Cloudera Manager is upgraded to 7.13.1.300 with a supported base cluster version - 7.1.7 SP3, 7.1.9, 7.1.9 SP1. In case a customer intends to use cert manager for data services, it can only be supported via a fresh installation on 1.5.5 ECS; upgrades are not supported at this time.1.5.5 will be upgradeable from 1.5.3, 1.5.4, 1.5.4 CHF1, 1.5.4 CHF2, 1.5.4 CHF3, 1.5.4 SP1, and 1.5.4 SP2. 

For Cloudera AI Workbench-only cluster deployments, the 1.5.5 release is certified to work with Cloudera Base 7.3.1.300 release. 7.3.1 certification for other data services will follow soon.

# Links
 * [Release notes](https://docs.cloudera.com/cdp-private-cloud-data-services/1.5.5/release-notes/topics/cdppvc-release-notes.html)
 * [Download](https://docs.cloudera.com/cdp-private-cloud-data-services/1.5.5/release-notes/topics/cdppvc-1-5-5-Repository-Locations.html)
 * [Support Matrix](https://supportmatrix.cloudera.com/)
 * [Support lifecycle policy](https://www.cloudera.com/services-and-support/support-lifecycle-policy.html)