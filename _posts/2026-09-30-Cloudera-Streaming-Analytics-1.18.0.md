---
title:  "Cloudera Streaming Analytics 1.18.0"
header:
  teaser: "/assets/images/CSA-Cloudera_Streaming_Analytics_Operator.png"
categories:
  - release
tags:
  - cloudera
  - csa
  - flink
  - iceberg
---

We are excited to announce the release of Cloudera Streaming Analytics 1.18.0 for Cloudera on premises 7.3.2.10000. This update reinforces our commitment to a stable, secure, and modern streaming offering by upgrading core components and enhancing source control capabilities.

## Release Highlights

1. **Upgraded Flink Runtime:** This release is based on Apache Flink Kubernetes Operator 1.13 and Apache Flink 1.20.5, bringing upstream stability and connector fixes to the embedded Flink runtime and Cloudera SQL Stream Builder images.
2. **Apache Iceberg 1.10.0:** The Iceberg connector and catalog integration are updated to Apache Iceberg 1.10.0. Custom jobs should reference the Cloudera Streaming Analytics 1.18.0 Maven artifacts.
3. **Selective Git Commits:** Cloudera SQL Stream Builder source control lets you push only the jobs, tables, User-Defined Functions (UDFs), and other assets you choose, instead of the entire project. Imports from Git show a change review before anything is applied to your local project, including when the project does not yet exist in the remote repository.
4. **TLS 1.3 by Default:** Cloudera Streaming Analytics services use the central TLS cipher and protocol settings from Cloudera Manager, and network endpoints accept TLS 1.3 connections only by default. New documentation covers securing Flink external REST endpoints when clients connect directly rather than through the YARN proxy or Knox, and configuring TLS manually for Flink internal and REST services when Cloudera Manager cannot yet generate Flink keystores.
5. **Connector JAR Validation:** Cloudera SQL Stream Builder checks uploaded custom connector JARs against the factory identifiers declared in the archive and reports clear errors for invalid types or non-connector files.
6. **1.6.1 Patch Improvements:** Kafka schema detection now uses topic assignment instead of joining a consumer group, and fixes cover LDAP login session handling, SCRAM authentication on deployed Flink jobs, and newly added connectors appearing in the Connectors list.
7. **Startup in Kerberos-only deployments:** Stability fix for startup in Kerberos-only deployments.
8. **Authentication on FreeIPA hosts with newer AES encryption types:** Stability fix for authentication on FreeIPA hosts with newer AES encryption types.
9. **DB2 CDC tables using the schema-name property:** Stability fix for DB2 CDC tables using the schema-name property.
10. **Uploaded custom connectors appearing in the UI and REST API:** Stability fix for uploaded custom connectors appearing in the UI and REST API.
11. **Concurrent session updates in Cloudera SQL Stream Builder:** Stability fix for concurrent session updates in Cloudera SQL Stream Builder.

## Links

https://docs.cloudera.com/csa/1.18.0/index.html

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
