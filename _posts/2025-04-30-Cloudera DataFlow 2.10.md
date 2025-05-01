---
title:  "Cloudera Data Flow 2.10 for Cloudera on Cloud"
header:
  teaser: "/assets/images/nifi-logo.png"
categories: 
  - blog
tags:
  - Cloudera Data Flow
  - nifi
---

The Data In Motion Team is pleased to announce the release of Cloudera Data Flow 2.10 for Cloudera on Cloud.

This release introduces NiFi 2 as generally available in Data Flow. Along with seamless NiFi 2 migrations, this  positions Data Flow as the ideal platform to migrate, build, and deploy NiFi 2 flows with minimal operational effort. In addition, it includes features that improve developer productivity, operational costs and security. 

## Release Highlights
- Build and deploy on NiFi 2: Users can now develop flows in the Flow Designer as NiFi 2.3 flows by default. NiFi 2.3 will also be available as the NiFi 2 runtime for Flow Deployments. This marks the general availability of NiFi 2 in Data Flow.
- Time and cost savings on NiFi 2 migrations: Self-service migration is powered by Data Flow Catalog and Flow Designer. Users can organize NiFi 1 flows in Catalog, start migrations with one click, and make any required changes in Flow Designer. A comprehensive visual migration report clearly highlights items that require manual updates, while enabling users to effectively keep track of their progress.
- Improved developer productivity: Users can accelerate deployment processes by importing and referencing Shared Parameter Groups during deployment. This streamlined workflow significantly reduces development and deployment complexity and accelerates time to value for users by eliminating manual copy&paste of parameter values.
- Improved cost efficiency: Users can now specify tailored storage capacity, IOPS, and throughput sizes  for their NiFi repositories, making smaller deployments more cost-efficient.
- Strengthened security: Collections enhance security by enabling precise role based access control for cataloged flows. Users can organize cataloged flows into Collections and tightly manage user access to each Collection.
- Secured inbound connections: Users can specify trusted IP addresses for flows with inbound connections, which will limit traffic to only the specified IP addresses.   
- Better notifications: Users can now stay better informed with enhanced, customizable notifications:
  - Subscribe to deployment-specific alerts and customize notifications by event severity.
  - Set up KPI-level subscriptions and notifications, including a URL that directs you to the affected NiFi component on the NiFi Canvas.
  - Create distribution lists to ensure team-wide notification delivery.
  - Integrate notifications directly with Slack (Technical Preview).
- Platform upgrades: Added support for Kubernetes 1.31 and NiFi 1.28.

## Upgrading to the New Release
Customers can perform an in-place upgrade from supported Cloudera Data Flow  versions to 2.10. Alternatively, disabling and re-enabling an existing Data Flow environment will result in the re-enabled environment running the latest version. 

## Links
[Release notes](https://docs.cloudera.com/dataflow/cloud/release-notes/topics/cdf-whats-new.html)

[Documentation](https://docs.cloudera.com/dataflow/cloud/index.html)