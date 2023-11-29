---
title:  "Cloudera SQL Stream Builder Introducing DLQ"
header:
  teaser: "/assets/images/2023-11-29-SSB-Dead-Letter-Queue.png"
categories: 
  - blog
tags:
  - ssb 
  - cdp 
  - flink
---

Yesterday one of my customers asked about the ability to control deserialization errors in SSB applications.  Referencing our [Dead Letter Queue Documentation](https://docs.cloudera.com/csa/1.11.0/how-to-ssb/topics/csa-ssb-kafka-table-avro-error-handling.html) within the Deserialize Tab we can see there are quite a few options for exception handling:


<figure>
  <img src="/assets/images/csa-ssb-kafka-configuration-deserialization.png">
  <figcaption>Deserialization Failure Handler Policy</figcaption>
</figure>



This is actually a very important feature.  In production streaming applications, operators may not have realtime insights into data shapes that do not fit expected schema.  These exceptions need to be trapped versus ignored.   The Dead Letter Queue is how you trap those exceptions in a different Kafka Topic.

Check out this blog that goes into detailed explanation of configuring Dead Letter Queues for your Virtual Kafka Tables.
   [Using Dead Letter Queues with Sql Stream Builder](https://blog.cloudera.com/using-dead-letter-queues-with-sql-stream-builder/)

Check out Streaming SQL Console:

[CDP Public Cloud SSB](https://docs.cloudera.com/csa/1.11.0/ssb-overview/topics/csa-ssb-key-features.html)

As always, check out the docs:

[Cloudera Streaming Analytics DOCS](https://docs.cloudera.com/csa/1.11.0/index.html)

CDP [SSB](https://docs.cloudera.com/csa/1.11.0/ssb-overview/topics/csa-ssb-intro.html) [CSA](https://docs.cloudera.com/csa/1.11.0/index.html) [Flink](https://flink.apache.org/) 