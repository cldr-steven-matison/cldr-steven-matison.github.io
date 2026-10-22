---
title:  "Cloudera Flow Management 4.13.0.0"
header:
  teaser: "/assets/images/nifi-logo.png"
categories:
  - release
tags:
  - cloudera
  - nifi
  - cfm
  - streaming
---

The Data in Motion Team is pleased to announce the General Availability (GA) release of Cloudera Flow Management 4.13.0.0, which supports Apache NiFi 2.11 with Cloudera Manager on Cloudera on-premises and Cloudera on cloud (Data Hub) 7.3.2. This release includes critical enhancements and fixes from Cloudera Flow Management 4.12.0.0.

## Release Highlights

1. **OpenTelemetry Reporting Task:** The OpenTelemetry Reporting Task exports NiFi operational, flow, and JVM metrics to OpenTelemetry collectors and compatible observability platforms using the OpenTelemetry Protocol (OTLP). This allows Cloudera Flow Management instances to participate in observability platforms and activities.
2. **Flow Analysis rule to maximize throughput:** The RequireLoadBalancedConnectionAfterPrimaryNodeSourceProcessor flow analysis rule flags connections without load balancing downstream of source processors configured to run only on the Primary Node. The rule helps identify flow designs that could concentrate processing on a single node instead of distributing FlowFiles across the cluster.
3. **Cloudera Schema Registry additional support:** Cloudera Flow Management 4.13.0 adds JSON Schema support to the Cloudera Schema Registry Controller Service. You can register and retrieve JSON Schemas to validate records. Apache Avro schema support remains available. The service also supports OAuth authentication through an OAuth2AccessTokenProvider Controller Service, providing an alternative to Kerberos or Basic authentication. OAuth support is also available for Confluent Schema Registry.
4. **Apache Atlas lineage for Iceberg:** The Atlas Reporting Task now analyzes provenance events from Iceberg processors, allowing their data lineage to be tracked in Apache Atlas.
5. **Kerberos authentication for SMB:** The SmbjClientProviderService controller service now supports KerberosUserService, enabling Kerberos authentication when accessing SMB shares.

## Links

- [Release notes](https://docs.cloudera.com/cfm/4.13.0/release-notes/topics/cfm-whats-new.html)
- [Download](https://docs.cloudera.com/cfm/4.13.0/release-notes/topics/cfm-download-locations.html)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
