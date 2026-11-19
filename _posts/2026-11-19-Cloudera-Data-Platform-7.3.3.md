---
title:  "Cloudera Data Platform 7.3.3"
header:
  teaser: "/assets/images/Cloudera-Data-Platform.png"
categories:
  - release
tags:
  - cloudera
  - cdp
---

Cloudera is thrilled to announce the General Availability of Cloudera Runtime 7.3.3 and Cloudera Manager 7.13.3, marking a significant milestone in our vision of AI Anywhere, Cloud Anywhere, and Data Anywhere. This release introduces a transition to Semantic Versioning (SemVer) and carries forward full Long-Term Support (LTS) coverage through 2032, ensuring enterprise stability and accelerated access to new innovations.

## Release Highlights

1. **Semantic Versioning Transition:** Cloudera Runtime 7.3.3 and Cloudera Manager 7.13.3 officially transition to the Semantic Versioning (SemVer) model, moving away from legacy Service Packs (SP) and Cumulative Hotfixes (CHF) to align with industry-standard software delivery practices while maintaining operational predictability.
2. **Over 75% Fewer Critical and High CVEs:** The release substantially hardens Cloudera Runtime with 594 unique CVE resolutions, resulting in over 75% fewer Critical and High CVEs, 0 Known Exploited Vulnerabilities (KEVs), and the removal of eMudhra and Brotli 0-day vulnerabilities, with a shortened release cadence from monthly to twice a month.
3. **General Availability of Cloudera Cloud Bursting on-premises:** This feature allows administrators and practitioners to route jobs to cloud compute during demand spikes, protecting business continuity amid hardware procurement delays while keeping data and metadata on-premises under existing security policies to optimize TCO.
4. **Impala Multiple Trusted Token Identity Providers:** Impala enhancements include support for multiple trusted token identity providers with JWT issuer and audience validation, allowing one Impala deployment to accept tokens from several enterprise identity systems while following current token-security best practices.
5. **Impala Executor Groups for Workload Isolation:** Available in Technical Preview in Cloudera Manager, this feature allows administrators to split Impala executors into named groups of different sizes and route queries to a group through its resource pool, preventing resource-heavy ETL jobs from interfering with interactive queries.
6. **Cloudera Manager Audit-Ready Configuration History:** This feature records who changed which setting, when, and the before-and-after values, exposing that history through a supported API so security and compliance teams can feed configuration changes into their audit tooling without querying the Cloudera Manager database.

## Support Matrix and Upgrade Paths

![](/assets/images/release/9355c51dbb4d.png)

## Lifecycle Guarantees

Cloudera reaffirms its commitment to enterprise stability by preserving the full six-year Long-Term Support (LTS) lifecycle through 2032 for the 7.3 release line. All continuous releases starting with 7.3.2 (including 7.3.3, 7.3.4, and subsequent minor updates) share this comprehensive LTS coverage. If you’re currently running 7.3.2, you can update along the 7.3.x line to receive ongoing platform innovations, security updates, and active support.

Please note that this 2032 LTS commitment does not extend to Cloudera Platform 7.3.1 (EoS is December 2026). Any deployments running 7.3.1 must be moved to 7.3.2 or later to maintain active LTS coverage and receive ongoing security fixes.

## Upgrade Paths

Clusters running the following releases enjoy a direct, one-step, in-place upgrade path to Cloudera Runtime 7.3.3:

* 7.3.2, including all previous service packs
* 7.1.7 SP3
* 7.1.9 SP1 and SP2
* 7.2.18
* 7.3.1

Powered by Cloudera Manager 7.13.3, these direct upgrade paths leverage automated pre-checks and targeted component optimizations to minimize downtime and eliminate migration complexity. Teams on earlier releases can upgrade to a supported bridge version prior to transitioning to 7.3.3. For customers upgrading from 7.1.9 SP1, 7.1.9 SP2, or 7.3.1, Zero Downtime Upgrades ensure business continuity.

## Support Matrix

### New Support Dependency Options

Introducing support in Cloudera Runtime 7.3.3 and Cloudera Manager 7.13.3 for:

* RHEL 9.8 on-premises support has been retroactively added starting with 7.3.2 SP1.
* RHEL 9.8 public cloud support begins with the Cloudera Platform 7.3.3 release.

### Deprecated Support Dependency Options

Note that the following are deprecated:

* Replication from Cloudera Distribution for Hadoop (CDH) 5 source clusters in Replication Manager. Please upgrade source clusters to a supported Cloudera release before replicating.
* Apache Impala's legacy single-provider JWT and OAuth startup flags. Please move to the multiple identity provider configuration.

### Data Services Compatibility

Customers planning to deploy Cloudera Runtime 7.3.3 and Cloudera Manager 7.13.3 alongside Cloudera Data Services must run Data Services 1.5.5 SP2 to SP4. It is important to note that Cloudera Data Engineering support with 7.3.3 is only available starting with Data Services 1.5.5 SP4.

### Next Steps

Solution engineers are encouraged to help customers evaluate the impact of these updates on their specific workloads with upgrade strategy sessions. They can also request a Value Engineering Assessment to collaborate on an ROI evaluation customized to their cluster footprint to quantify potential compute, storage, and administrative cost reductions.

## Links

* [Cloudera on premises 7.3.3 Release Notes](https://docs.cloudera.com/cdp-private-cloud-base/7.3.3/private-release-notes/topics/rt-whats-new.html)
* [Cloudera on cloud 7.3.3 Release Notes](https://docs.cloudera.com/runtime/7.3.3/public-release-notes/topics/rt-whats-new.html)
* [Cloudera Manager 7.13.3 Release Notes](https://docs.cloudera.com/cloudera-manager/7.13.3/manager-release-notes/topics/cm-release-notes-7133.html)
* [JDK Upgrade documents](https://docs.cloudera.com/cdp-private-cloud-upgrade/latest/upgrade-cdp/topics/ug_jdk8-cdp.html)
* [Fixed CVEs in Cloudera Runtime 7.3.3](https://docs.cloudera.com/cdp-private-cloud-base/7.3.3/private-release-notes/topics/fixed-common-vulnerabilities-exposures-733.html)
* [Fixed CVEs in Cloudera Manager 7.13.3](https://docs.cloudera.com/cloudera-manager/7.13.3/manager-release-notes/topics/cm-cve-7133.html)
* [Cloudera support lifecycle policy](https://www.cloudera.com/services-and-support/support-lifecycle-policy.html)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
