---
title:  "Cloudera Data Flow 3.2"
header:
  teaser: "/assets/images/nifi-logo.png"
categories:
  - release
tags:
  - cloudera
  - data-flow
---

Cloudera is pleased to announce the release of Cloudera Data Flow 3.2 for Cloudera on Cloud, delivering major architectural modernization and eliminating friction across the development lifecycle. This release introduces zero-touch, cross-cluster authentication, smarter cloud resource management, and a massive upgrade to our underlying infrastructure to provide a more resilient, secure, and intuitive data streaming experience.

## Release Highlights

1. **Frictionless Cross-Cluster Communication:** We introduced DefaultNodeSSLContextService, which allows you to seamlessly send data from one NiFi cluster to another within the same Cloudera Data Flow environment, completely removing the overhead of manually managing and rotating certificates.
2. **Optimized Parameter Groups in Drafts:** Drafts that import Shared Parameter Groups benefit from dramatically improved performance, timeout resilience, and reliability when managing parameters at scale.
3. **Primary Node Execution Protection:** Processors that require primary-node execution (such as ListS3 or QueryDatabaseTable) now default to and are validated against “Primary Node” execution, preventing invalid multi-node configurations.
4. **Cloud Resource Cleanup:** Canceling a new test session now automatically removes all underlying resources (e.g., volumes and namespaces) to prevent wasted cloud spend.
5. **Deployment and Test Session Stability:** Resolved issues causing orphaned test sessions to block environment disablement, and ensured that terminating a deployed flow succeeds even if its underlying NiFi process group was previously deleted.
6. **Test Session Resiliency:** Eliminated reconfiguration errors when suspending or resuming test sessions that utilize Custom NARs.
7. **Deployment Wizard Fixes:** Fixed state-validation bugs in the deployment wizard and ensured file uploads to processor properties are correctly recognized as asset-capable.
8. **Latest Kubernetes Support:** Cloudera Data Flow 3.2 introduces official support for EKS/AKS 1.36, ensuring your environments run on the latest infrastructure with maximum leeway for underlying support.
9. **Automated Database Upgrades:** The underlying PostgreSQL database is now automatically upgraded alongside your Cloudera Data Flow environment, with this release upgrading PostgreSQL to version 17.
10. **Hardened Security Posture:** OpenBao has officially replaced HashiCorp Vault, and critical security patches have been applied to ensure JWT authentication tokens cannot be extended indefinitely.
11. **Streamlined Architecture:** As part of our ongoing effort to reduce complexity and backend component overhead, we have completely removed Apache ZooKeeper from Cloudera Data Flow.
12. **Latest Runtime Enhancements:** This release maintains NiFi 2.6.0 and NiFi 1.28.1.

## Links

- [Release notes](https://docs.cloudera.com/dataflow/cloud/release-notes/topics/cdf-whats-new.html)
- [Documentation](https://docs.cloudera.com/dataflow/cloud/index.html)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
