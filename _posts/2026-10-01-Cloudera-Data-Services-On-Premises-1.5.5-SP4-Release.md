---
title:  "Cloudera Data Services On Premises 1.5.5 SP4 Release"
header:
  teaser: "/assets/images/Cloudera-Data-Platform.png"
categories:
  - release
tags:
  - cloudera
  - cdp
  - data-services
  - on-premises
---

Cloudera Data Services 1.5.5 SP4 is now Generally Available, enhancing business continuity and accelerating AI capabilities across the platform. This release introduces full disaster recovery for Embedded Container Service clusters, native NVIDIA HGX/DGX and Multi-Instance GPU support, and a 100% reduction in known exploited vulnerabilities. Customers on SP2 or later can upgrade directly to SP4 without intermediate steps, ensuring a smoother transition to the latest features.

## Release Highlights

1. **Full disaster recovery across the entire stack:** Backup and restore for Embedded Container Service clusters now cover Data Engineering and Data Warehouse workloads, including scheduled, ad-hoc, and incremental backups with guided restoration to a secondary cluster.
2. **Enterprise GPU support for AI workloads:** Support for NVIDIA HGX/DGX infrastructure with RDMA and GPUDirect, Multi-Instance GPU (MIG) for partitioning A100/H100 GPUs, and distributed training scaling to 32+ GPUs.
3. **Zero known exploited vulnerabilities:** A 100% reduction from SP3, achieved through Chainguard-based images and Ubuntu 24.x upgrades, significantly shrinking the CVE footprint for security-conscious buyers.
4. **Skip-version upgrades:** Customers on SP2 can upgrade directly to SP4 without installing SP3, reducing downtime, risk, and change windows via multi-hop Longhorn upgrades.
5. **Unified observability with OpenTelemetry:** Telemetry export across AI, Data Engineering, and Data Warehouse to customer-managed endpoints, enabling integration with tools like Datadog, Splunk, and Grafana.
6. **Embedded database HA:** Automatic failover for the platform database eliminates the single-point-of-failure.
7. **Non-root container images:** Support for arbitrary user IDs without custom images simplifies security compliance.
8. **Networking updates:** Includes Istio 1.30 and Kubernetes Gateway API 1.5.
9. **Cloudera AI Inference:** LoRA adapter support for serving multiple fine-tuned models from one endpoint, persistent model storage, and vLLM 0.27 with broader model coverage.
10. **Cloudera AI Workbench:** MIG and HGX/DGX support, multi-node distributed training (32+ GPUs, Ray/PyTorch/MPI, 400G RDMA).
11. **Cloudera AI Registry:** Async model downloads with job tracking and progress UI.
12. **Cloudera AI ML Runtimes:** R 4.6, Python 3.14 RAZ support, Ubuntu 24.x base, and Chainguard images for lower CVE footprint.
13. **Data Engineering Auto config sync:** LDAP/proxy changes from Cloudera Manager propagate automatically to Cloudera Data Engineering.
14. **Data Engineering Istio Ambient Mode:** Sidecar-free service mesh providing less overhead with the same security.
15. **Data Engineering Observability Premium:** Workload consumption metrics and OpenTelemetry export of Spark event logs.
16. **Data Engineering Data Connectors:** Support for HBase, Kafka, and Phoenix with simplified credential management for Spark.
17. **Data Engineering Stable endpoints on upgrade:** In-place upgrades from SP3+ ensure no broken integrations.
18. **Data Warehouse Disaster recovery:** Full disaster recovery including Virtual Warehouses, Data Visualization, and Data Explorer (Formerly known as Hue).
19. **Data Warehouse Config change alerts:** Kerberos and certificate changes are surfaced in the Management Console.
20. **Data Warehouse Automatic mTLS:** Ambient mode enrollment with STRICT mutual TLS across warehouse services.
21. **Data Warehouse Centralized telemetry:** OpenTelemetry export for Hive and Impala Virtual Warehouses.
22. **Observability GPU metrics:** Now available in the Cloudera AI SaaS observability experience.
23. **Security Chainguard images:** Ubuntu freshline runtimes replaced with lower-CVE-footprint alternatives.

## Links

- [Release Notes](https://docs.cloudera.com/cdp-private-cloud-data-services/1.5.5/release-notes/topics/cdppvc-service-packs-155-sp4.html)
- [Public Documentation for 1.5.5 SP4](https://docs.cloudera.com/cdp-private-cloud-data-services/1.5.5/release-notes/topics/cdppvc-whats-new-sp4.html)
- [Cloudera Data Services on premises 1.5.5 SP4 Archive](https://archive.cloudera.com/p/cdp-pvc-ds/1.5.5-h40000/)
- [Supported Upgrades](https://docs.cloudera.com/cdp-private-cloud-data-services/1.5.5/release-notes/topics/cdppvc-ds-in-place-upgrade-paths-sp4.html)
- [Support Matrix](https://supportmatrix.cloudera.com/)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
