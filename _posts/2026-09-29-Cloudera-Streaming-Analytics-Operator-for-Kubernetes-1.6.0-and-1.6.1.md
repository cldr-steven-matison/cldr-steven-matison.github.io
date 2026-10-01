---
title:  "Cloudera Streaming Analytics Operator for Kubernetes 1.6.0 and 1.6.1"
header:
  teaser: "/assets/images/CSA-Cloudera_Streaming_Analytics_Operator.png"
categories:
  - release
tags:
  - cloudera
  - csa
  - kubernetes
  - flink
---

We are excited to announce the release of Cloudera Streaming Analytics Operator for Kubernetes 1.6.0, together with the 1.6.1 patch release. These updates reinforce our commitment to a stable, secure, and high-performance streaming offering on Kubernetes by moving to Apache Flink 1.20.5 and Flink Kubernetes Operator 1.13, while expanding deployment flexibility and security options for Apache Flink and Cloudera SQL Stream Builder.

## Release Highlights

1. **Upgraded Flink Runtime:** This release is based on Apache Flink Kubernetes Operator 1.13 and Apache Flink 1.20.5, bringing upstream stability and connector fixes to the embedded Flink runtime and Cloudera SQL Stream Builder images.
2. **Gateway API HTTPRoute Support:** You can now expose Cloudera SQL Stream Builder with a Kubernetes Gateway API HTTPRoute in addition to the existing Ingress resource, configured directly in the Helm chart.
3. **Flexible Database Credentials:** The Helm chart supports reading PostgreSQL credentials from an existing Kubernetes Secret, including Secrets managed in another namespace (for example CloudNativePG). Additionally, the default hardened PostgreSQL image has been updated to version 18.4.
4. **Install-Time Sampling Kafka Configuration:** Sampling Kafka connection settings can now be supplied through a Kubernetes Secret during Helm install. Cloudera SQL Stream Builder allows you to establish these settings, preventing unwanted edits in the future.
5. **Project File Upload:** You can upload certificates, connector JARs, configuration directories, and other artifacts as project files in Cloudera SQL Stream Builder and reference them from Flink SQL DDL and connector properties.
6. **FIPS Deployment Guidance:** Configuration steps for running on FIPS-enabled OpenShift clusters are now documented, and Java component images use FIPS-enabled JDK 17 base images.
7. **1.6.1 Patch Improvements:** Kafka schema detection now uses topic assignment instead of joining a consumer group, and fixes cover LDAP login session handling, SCRAM authentication on deployed Flink jobs, and newly added connectors appearing in the Connectors list.

## Links

- [Release notes](https://docs.cloudera.com/csa-operator/1.6/release-notes/topics/csa-op-release-notes-161.html)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
