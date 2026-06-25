---
title:  "Cloudera Data Services On Premises 1.5.5 SP3 GA Schedule Revised"
header:
  teaser: "/assets/images/Cloudera-Data-Platform.png"
categories: 
  - release
tags:
  - cloudera
  - data services
  - ai
---

To meet customer demand (e.g. Exxon, Mastercard, BofA, OCBC, Citibank, LaPoste, Australia DoD etc.) for key new features, we have moved the general availability of 1.5.5 SP3 from May 30, 2026, to the end of Q2, CY2026. This release will now contain the following capabilities added to the scope:

* General Availability of Cloudera AI Agent Studio for building production-grade agentic workflows.
* Key new Cloudera AI Inference service features including support for the latest AI models such as NVIDIA Cosmos, Qwen 3.6 and Gemma 4.
* Certification of RedHat OpenShift Container Platform (OCP) 4.18, providing customers a long-term supported OCP release, without losing support for the Data Services' clusters.

# Cloudera Data Services On Premises 1.5.5 SP2 Cumulative Hot Fix 1 Release

Cloudera is thrilled to announce the release of Cloudera Data Services On Premises 1.5.5 SP2 Cumulative Hotfix 1 (CHF1).

This cumulative hotfix fully certifies all data services, namely Cloudera Data Warehouse, Cloudera AI, and Cloudera Data Engineering, with Cloudera Base 7.3.2 and introduces support for Red Hat OpenShift long-term support releases, starting with OpenShift Container Platform (OCP) 4.18. Going forward, Data Services certification will align with even-numbered OpenShift releases.

The 1.5.5 SP2 CHF1 release builds on the 1.5.5 SP2 release by delivering additional performance enhancements and critical bug fixes to improve reliability and compatibility across supported deployment environments.

## Key Features and Benefits

### Platform
* **Network Traffic Performance and Scalability:** This release includes platform-level performance tuning for the Istio Gateway, improving the scalability and reliability of ingress traffic handling for Cloudera Data Services workloads.

### Cloudera AI
* **Enable High-Performance Spark Workloads via pushdown on Cloudera AI:** Cloudera AI now allows you to run high-performance Spark tasks directly in Cloudera, where your data is stored, which eliminates the need to move large datasets back and forth. By filtering data at the source, you avoid digital data bottlenecks and only transfer the exact pieces you need. This approach also slashes infrastructure costs by using your existing systems for the heavy lifting and maintains your existing security standards since the data never leaves its secure Cloudera environment.

### New Certifications
* Certified with Cloudera Base 7.3.2, OCP 4.18

## Links

* [Release Notes](https://docs.cloudera.com/cdp-private-cloud-data-services/1.5.5/release-notes/topics/cdppvc-cumulative-hotfixes-155-sp2-chf1.html)
* [Public Documentation for 1.5.5 SP2 CHF1](https://docs.cloudera.com/management-console/1.5.5/private-cloud-release-notes/topics/cdppvc-cumulative-hotfixes.html)
* [Cloudera Data Services on premises 1.5.5 SP2 CHF1 Archive](https://archive.cloudera.com/p/cdp-pvc-ds/1.5.5-h2100/)
* [Support Matrix](https://supportmatrix.cloudera.com/)

A sincere thank you to everyone who contributed to this release — your efforts were outstanding.

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
