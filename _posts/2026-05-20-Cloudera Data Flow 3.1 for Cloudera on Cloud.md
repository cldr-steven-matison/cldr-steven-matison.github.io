---
title:  "Cloudera Data Flow 3.1 for Cloudera on Cloud"
header:
  teaser: "/assets/images/clouderadataflow.png"
categories: 
  - release
tags:
  - cloudera
  - nifi
  - dataflow
---

The Data In Motion Team is pleased to announce the release of Cloudera Data Flow 3.1 for Cloudera on cloud.

In this release, we've focused on removing friction that slows teams down. By introducing command-line interface (CLI) automations and advanced debugging tools, we're giving developers more visibility and admins more control. These efficiency gains are backed by a leaner, more performant Flow Designer and a hardened foundation that stays ahead of evolving security standards.

## Release Highlights:

* **Command-Line Test Session Management:** Users can now manage Flow Designer test sessions via the CLI. This update enables seamless automation of test session workflows, eliminating repetitive manual steps in the UI.
* **Streamlined Parameter Orchestration:** We've extended full CLI support to Shared Parameter Groups, including the ability to reference them by CRN. By removing the need for exhaustive group details during CLI deployment and enabling full Create, Read, Update, Delete (CRUD) operations via the CLI, we've simplified your Continuous Integration/Continuous Delivery (CI/CD) pipelines and established a secure, centralized source of truth for sensitive configurations.
* **Automate Workspace Cleanup:** Keeping your development environment organized is significantly faster. Users can now list and delete unused flow drafts directly via the CLI, replacing manual, one-by-one user interface (UI) deletions with automated commands.
* **Native Sparkplug IoT Support:** Customers managing industrial data can now ingest Sparkplug-compliant streams natively. The new ConsumeMQTTIIoT processor and MQTTIIoTReader remove the requirement for custom NiFi Archive (NAR) files or external Python processors. This streamlines Sparkplug IoT architectures and eliminates the overhead of managing custom components in production.

### A Faster, More Efficient Flow Designer:
* **Optimized Performance:** Component referencing now loads in a fraction of a second—down from over a minute in large flows—ensuring a fluid experience even in high-concurrency environments.
* **Reduced Overhead:** Overall central processing unit (CPU) usage for canvas event processing has been reduced by 60–80%, resulting in a snappier, more cost-effective canvas.
* **Enhanced Visibility:** We have extended full Data Provenance support to NiFi 1.x flow drafts, giving you the deep diagnostics to troubleshoot drafts with the same precision as NiFi 2.x drafts.

### ReadyFlow Updates:
* Kafka to Snowflake and Confluent Cloud to Snowflake ReadyFlows updated to use key-pair authentication (StandardPrivateKeyService) to comply with Snowflake's mandatory multi-factor authentication requirement.
* S3 to IBM watsonx ReadyFlow updated to enable choice of LLM model, from available options, versus forcing a default.

### Platform and Security Updates:
* **Seamless Ingress Migration:** We've transitioned to Traefik as our cluster ingress controller, delivering more robust routing and enhanced Transport Layer Security (TLS) handling. To ensure zero friction, this migration is performed automatically during a standard upgrade process.
* **Hardened Security Posture:** To stay ahead of evolving threats, we've replaced Valkey and cert-manager base images with Chainguard equivalents. This significantly reduces the attack surface of your Cloudera Data Flow environment without requiring any changes to your flows.
* **Proactive Cost Governance:** New alerts for unused Inbound Connections help you maintain a lean environment. By identifying gateways no longer in use, you can proactively eliminate unnecessary cloud costs and minimize your security footprint.
* **Up-to-date Infrastructure and Runtime:** Cloudera Data Flow 3.1 introduces official support for Kubernetes 1.34 and provides the latest security and stability hot fixes for NiFi 1.28.1 and 2.6.0, ensuring your environment remains current and compliant.

## Upgrading to the New Release:

Customers can perform in-place upgrades from supported Cloudera Data Flow versions to 3.1. Alternatively, disabling and re-enabling an existing Data Flow environment will result in the re-enabled environment running the latest version. Note: Before initiating the upgrade, please ensure that you have reviewed the [NiFi EoS requirements](https://docs.cloudera.com/dataflow/cloud/support-matrix/topics/cdf-eol-policy.html) and upgrade [prerequisites](https://docs.cloudera.com/dataflow/cloud/service-upgrade/topics/cdf-upgrade-prerequisites.html).

**Important Advisory for Cloudera Data Flow on Azure:** To maintain a seamless, standard upgrade experience, we recommend upgrading to Cloudera Data Flow 3.1 by July 31, 2026. This timeline ensures your upgrade path is as straightforward as possible.

## Links:

* [Release notes](https://docs.cloudera.com/dataflow/cloud/release-notes/topics/cdf-whats-new.html)
* [Documentation](https://docs.cloudera.com/dataflow/cloud/index.html)

Big thanks to everyone who supported and contributed to this release!

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
