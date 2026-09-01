---
title:  "Announcing Cloudera Streaming Analytics 1.17.1"
header:
  teaser: "/assets/images/CSA-Cloudera_Streaming_Analytics_Operator.png"
categories: 
  - release
tags:
  - cloudera
  - csa
  - flink
---

We are excited to announce the release of Cloudera Streaming Analytics 1.17.1 for on-premises deployments. This patch update reinforces our commitment to a stable, secure, and high-performance streaming offering. By upgrading key dependencies and refining the Cloudera SQL Stream Builder experience, we’re providing an even more robust foundation for Apache Flink and Cloudera SQL Stream Builder.

## New Features:

1.  **Security Updates:** Dependency versions were upgraded to address critical and high severity vulnerabilities identified in security scans, including updates to the embedded Apache Tomcat (CVE-2026-29145 and related findings) and Apache Log4j (2.24.3) components used by Cloudera SQL Stream Builder and Apache Flink.
2.  **Reliable Kafka Table Viewer:** The Kafka Table Viewer in Cloudera SQL Stream Builder now loads event time, deserialization, schema, and topic metadata reliably when you open an existing Kafka table.
3.  **Improved Stability and UI:** Cloudera SQL Stream Builder now starts successfully in Kerberos-only deployments when TLS is disabled, session access is synchronized so concurrent requests no longer cause queries such as DESCRIBE to fail, and the Dashboard New Widget job list now scrolls correctly when many jobs are available.

## Use Cases

  * **Staying Secure and Compliant:** This release upgrades vulnerable third-party libraries across Cloudera SQL Stream Builder and Apache Flink. This matters because organizations with strict security and compliance requirements can keep their production streaming pipelines protected against known critical and high severity CVEs without waiting for a major release.
  * **Trustworthy Table Management:** This release ensures that Kafka table metadata is always displayed completely and that concurrent sessions behave predictably. This matters because developers can inspect, describe, and manage their Kafka tables with confidence, reducing friction in day-to-day streaming SQL development.

---

## Links

* [Release notes](https://docs.cloudera.com/csa/1.17.0/release-notes/topics/csa-release-notes-1171.html)
* [What's New](https://docs.cloudera.com/csa/1.17.0/release-notes/topics/csa-what-new-1171.html)
* [Download Information](https://docs.cloudera.com/csa/1.17.0/download/topics/csa-download-location.html)
* [Cloudera Streaming Analytics 1.17 Docs](https://docs.cloudera.com/csa/1.17.0/index.html)
* [Cloudera Stream Processing Product Page](https://www.cloudera.com/products/stream-processing.html)
* [Cloudera Kubernetes Operators documentation homepage](https://docs.cloudera.com/index.html?tab=kubernetes-operators)
* [Cloudera Stream Processing Community Edition](https://docs.cloudera.com/csp-ce/latest/index.html)
* [Cloudera Stream Processing & Analytics Support Lifecycle Policy](https://www.cloudera.com/services-and-support/support-lifecycle-policy.html)

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
