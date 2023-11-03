---
title:  "Cloudera SQL Stream Builder Compatibility between CDP Public Cloud and CDP Private Cloud."
header:
  teaser: "/assets/images/2023-11-03-SSB-Data-Hub-Service-Discovery.png"
categories: 
  - blog
tags:
  - ssb 
  - cdp 
  - flink
---

In my previous post [Cloudera SQL Stream Builder Multiple Project Repo](https://cldr-steven-matison.github.io/blog/SSB-Multi-Project-Repo/) I described how I was able to create a separate folder in the project repo to use for a cloud deployment.   That worked great, but I am more happy to report that I was able to remove all the differences so another project folder is not needed.   The SSB-Iceberg-Demo project will now import into any SQL Stream Builder on Private Cloud or Public cloud and not require any modifications to the sample jobs.

A few things to note when deploying on CDP Public Cloud

1.  You need 2 Data Hubs:   [Streaming Analytics Light Duty with Apache Flink](https://docs.cloudera.com/cdf-datahub/7.2.17/concepts-streaming-analytics.html) & [Streams Messaging Light Duty: Apache Kafka, Schema Registry, Streams Messaging Manager, Streams Replication Manager, Cruise Control](https://docs.cloudera.com/cdf-datahub/7.2.17/concepts-streams-messaging.html)
2.  There are differences in the [nifi flow](https://github.com/cldr-steven-matison/NiFi-Templates/blob/main/SSB-Iceberg-Demo-PC-DataFlow.json).  Those differences are the addition of a Default SSL Context Service.  For my testing I created a DataFlow catalog flow SSB-Iceberg-Demo.  You can deploy the flow in [DataFlow](https://docs.cloudera.com/dataflow/cloud/index.html), in [DataHub](https://docs.cloudera.com/cdf-datahub/7.2.17/concepts-flow-management.html), or any other nifi.  
3.  You can easily complete the keytab setup with your username and password.  Downloading, uploading keytab not required.
4.  You will need to make a Kafa Data Source against your Kafka Data Hub.  You just need your brokers.  
5.  CDP PC will auto discover your environment's services. Check out the [Data Hub Service Discovery](https://docs.cloudera.com/cdf-datahub/7.2.17/how-to-ssb/topics/csa-ssb-auto-discovery.html).

<figure>
  <img src="/assets/images/2023-11-03-SSB-Data-Hub-Service-Discovery.png">
  <figcaption>Data Hub Service Discovery</figcaption>
</figure>



Check out Streaming SQL Console 

[CDP Public Cloud SSB](https://docs.cloudera.com/csa/1.11.0/ssb-overview/topics/csa-ssb-key-features.html)

As always, check out the docs:

[Cloudera Streaming Analytics DOCS](https://docs.cloudera.com/csa/1.11.0/index.html)

CDP [SSB](https://docs.cloudera.com/csa/1.11.0/ssb-overview/topics/csa-ssb-intro.html) [CSA](https://docs.cloudera.com/csa/1.11.0/index.html) [Flink](https://flink.apache.org/) 