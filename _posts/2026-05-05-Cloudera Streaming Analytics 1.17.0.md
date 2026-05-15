---
title:  "Announcing Cloudera Streaming Analytics 1.17.0"
header:
  teaser: "/assets/images/Cloudera_Streaming_Analytics_1.17.0.png"
categories: 
  - release
tags:
  - cloudera
  - csa
  - flink
---

We are excited to announce the release of **Cloudera Streaming Analytics 1.17.0** for on-premises deployments. This update reinforces our commitment to a stable, secure, and high-performance streaming offering. By aligning with Cloudera 7.3.2.0 and modernizing our User-Defined Function (UDF) framework, we’re providing a more robust foundation for **Apache Flink** and **Cloudera SQL Stream Builder**.

---

### New Features:

* **Cloudera Platform Alignment:** Full support for Cloudera on-premises 7.3.2.0, ensuring seamless integration with the latest operating systems, databases, and JDK versions.
* **Advanced Kafka Control:** You can now specify custom properties for Kafka connections directly within the Kafka Data Source form, allowing for more granular control over your data streams.
* **Flexible Security Protocols:** Added explicit support for JKS, PKCS12, and BCFKS truststore and keystore types, making it easier to connect to highly secured Kafka clusters.
* **Python-First Extensibility:** Modernizing the development experience, Cloudera Streaming Analytics 1.17.0 transitions away from JavaScript UDFs to more powerful and scalable Python UDFs.

---

### Use Cases

**Seamless Enterprise Security Compliance:**
This release will enable customers to explicitly define security certificate types (like BCFKS) for Kafka. This matters because it allows organizations with strict federal or enterprise security standards to maintain compliance without complex manual workarounds.

**Modernizing Logic with Python:**
This release enables developers to leverage the vast Python ecosystem for data processing. This matters because Python UDFs offer better performance and a richer library set than the legacy JavaScript implementation, leading to more maintainable and sophisticated streaming logic.

---

### Links

* [Release notes](https://docs.cloudera.com/csa/1.17.0/release-notes/topics/csa-what-new.html)
* [Download Information](https://docs.cloudera.com/csa/1.17.0/download/topics/csa-download-location.html)
* [Cloudera Streaming Analytics 1.17 Docs](https://docs.cloudera.com/csa/1.17.0/index.html)

[Cloudera Stream Processing Product Page](https://www.cloudera.com/products/stream-processing.html)

[Cloudera Kubernetes Operators documentation homepage](https://docs.cloudera.com/index.html?tab=kubernetes-operators)

[Cloudera Stream Processing Community Edition](https://docs.cloudera.com/csp-ce/latest/index.html)

[Cloudera Stream Processing & Analytics Support Lifecycle Policy](https://www.cloudera.com/services-and-support/support-lifecycle-policy.html)


## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
