---
title:  "Cloudera Flow Management 4.0.0 Technical Preview for Cloudera 7.3.1"
header:
  teaser: "/assets/images/nifi-logo.png"
categories: 
  - blog
tags:
  - cloudera
  - nifi
---

The Data in Motion (DiM) team is pleased to announce the release of Cloudera Flow Management 4.0.0 as a Technical Preview for running Apache NiFi 2.0 with Cloudera Manager on Cloudera 7.1.9 and 7.3.1 Private Cloud Base clusters (all service packs).

This release offers a number of new features and improves stability and security through bug fixes and upgraded dependencies.

# Key features for this release
  - NiFi 2.0: Apache NiFi 2.0 comes with a number of structural and security improvements that allow for more robust deployments as well as upgraded libraries providing several security enhancements and addressing many common vulnerabilities.
  - Native Python processor development: NiFi 2.0 provides a Python SDK for which processors can be rapidly developed in Python and deployed in flows. Some common document parsing processors written in Python are included in the release.
  - Flow Analysis Rules Engine: NiFi 2.0 provides a rules engine for developing flow analysis rules that recommend and enforce Best Practices for flow design. CFM 4.0 provides several Flow Analysis Rules for such aspects as thread management and recommended components.
  - Critical Component Support: CFM 4 includes several components that were removed in Apache NiFi 2.0 such as Hive, Iceberg, Ranger, and Kudu. CFM 4.0 continues to support all aspects of the Cloudera Data Platform (CDP), and going forward, Cloudera's distribution of NiFi 2.0 will be the only possibility to get access to and support for these components.
  - Updates and Patches: And, as usual, bug fixes, security patches, performance improvements, etc.

# Support Matrix and Upgrade Paths
Users will be able in the future to exercise the upcoming migration tool to convert existing flows to run on CFM 4 instances. CFM 4 is supported on CDP 7.1.9 and CDP 7.3.1.

# Use Cases

Leverage NiFi 2.0 capabilities with Cloudera enhancements:
  - Try out new NiFi 2 capabilities with Cloudera’s first NiFi 2 based on-prem release (in Technical Preview)
  - Flow administrators can enforce Best Practices for flow designers to ensure robust, reliable solutions
  - Create RAG pipelines for GenAI, Data Engineering, and Machine Learning model scoring using new processors and integrations


Check out the [Release Notes](https://docs.cloudera.com/cfm/4.0.0/release-notes/topics/cfm-whats-new.html)

As always, check out the entire [DOCS](https://docs.cloudera.com/cfm/4.0.0/index.html) for the Cloudera Flow Management.