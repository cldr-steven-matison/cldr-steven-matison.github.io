---
title:  "Cloudera Data Flow 3.2.1 for Cloudera on Cloud"
header:
  teaser: "/assets/images/nifi-logo.png"
categories:
  - release
tags:
  - cloudera
  - data-flow
---

The Data In Motion Team is pleased to announce the release of Cloudera Data Flow 3.2.1 for Cloudera on Cloud. This release provides customers with a seamless way to change instance types for their Cloudera Data Flow environments and adds support for Apache NiFi 2.11, delivering critical enhancements to ensure workload stability.

## Release Highlights

1. **Flexible Instance Type Management:** Users can now modify and upgrade obsolete or insufficient instance types running Cloudera Data Flow workloads, improving resource optimization and performance without recreating environments.
2. **Apache NiFi 2.11 Support:** Flow Deployments and Test Sessions now fully support the latest Apache NiFi 2.11 release, enabling the latest processors, capabilities, and security patches.
3. **Modernized Defaults for New Enablements:** Cloudera Data Flow now defaults to recommended target instance profiles—including memory-optimized types for the PostgreSQL flexible server with automatic regional fallbacks—to safeguard baseline workload capacity.
4. **Key Improvements:**
   - **Component Validation:** The Default Node SSL Context Service is now protected as a read-only configuration in Flow Designer to prevent accidental modification or deletion. Additionally, disabling a referenced Controller Service now immediately raises an upfront validation exception instead of failing silently.
   - **Flow Designer Optimizations:** Property sensitivity is now properly honored for custom component types, and unnecessary metrics caching tasks have been removed from Flow Designer containers to eliminate false errors.

## Upgrading to the New Release

Customers can perform in-place upgrades from supported Cloudera Data Flow versions to 3.2.1. Alternatively, disabling and re-enabling an existing Data Flow environment will cause the re-enabled environment to run the latest version. 

- **Note:** If you are already running Cloudera Data Flow 3.2, this update does not require a Kubernetes upgrade and can be applied with minimal operational overhead.
- **Note:** Before initiating the upgrade, please ensure that you have reviewed the upgrade [prerequisites](https://docs.cloudera.com/dataflow/cloud/service-upgrade/topics/cdf-upgrade-prerequisites.html).

## Data Flow Functions Sunset Notice

Due to very low utilization, Cloudera Data Flow Functions will be phased out in the next release, allowing us to concentrate on core capabilities. Customers actively using Data Flow Functions should plan to transition these workloads to standard deployments prior to the next upgrade.

## Looking Ahead: NiFi 1 End of Support (September 2027)

To ensure we deliver the most advanced and secure data streaming capabilities, Cloudera will end support for Apache NiFi 1.x in September 2027. We are sharing this in advance so you can start planning your migration to NiFi 2.x. In the meantime, Cloudera Data Flow 3.2.1 provides full support for both NiFi 1.28.1 and NiFi 2.6.0.

## Links

1. [Release notes](https://docs.cloudera.com/dataflow/cloud/release-notes/topics/cdf-whats-new.html)
2. [Documentation](https://docs.cloudera.com/dataflow/cloud/index.html)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
