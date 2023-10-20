---
title:  "Cloudera SQL Stream Builder Multiple Project Repo"
header:
  teaser: "/assets/images/2023-10-20-SSB-Multi-Project-Repo-3.png"
categories: 
  - blog
tags:
  - ssb 
  - cdp 
  - flink
---

I think I am always learning something new with Cloudera's Flink tool, [Sql Stream Builder](https://docs.cloudera.com/csa/1.11.0/ssb-overview/topics/csa-ssb-intro.html).   I have been demo-ing in it for almost 2 years going back to a [Fraud Detection Demo](https://github.com/cldr-steven-matison/Fraud-Prevention-With-Cloudera-SSB) that Andre built, to multiple customer facing POCs, to current releases with Iceberg features for my customers.   Today a lightbulb went off in my head around the Github Source Control Integration and the Project Name.   I tried a commit to create a second project folder within the [SSBDemo](https://github.com/cldr-steven-matison/SSBDemo) main repo as such:


<figure>
  <img src="/assets/images/2023-10-20-SSB-Multi-Project-Repo-1.png">
  <figcaption>Screen Shot of Repo</figcaption>
</figure>

Next, I go into the Streaing SQL Console and Import this Repo as a Project.  This time I choose the SSBDemo-Cloud.

<figure>
  <img src="/assets/images/2023-10-20-SSB-Multi-Project-Repo-2.png">
  <figcaption>Screen Shot Repot Import</figcaption>
</figure>

And ofcourse, it works.   

<figure>
  <img src="/assets/images/2023-10-20-SSB-Multi-Project-Repo-3.png">
  <figcaption>Screen Shot Import Success</figcaption>
</figure>

I can now use one main repo to host multiple deployments.  In this example, I need some project differences for the CDP Public Cloud version of my projects.  Will expose those differences in future post.

Check out Streaming SQL Console 

[CDP Public Cloud SSB](https://docs.cloudera.com/csa/1.11.0/ssb-overview/topics/csa-ssb-key-features.html)

As always, check out the docs:

[Cloudera Streaming Analytics DOCS](https://docs.cloudera.com/csa/1.11.0/index.html)

CDP [SSB](https://docs.cloudera.com/csa/1.11.0/ssb-overview/topics/csa-ssb-intro.html) [CSA](https://docs.cloudera.com/csa/1.11.0/index.html) [Flink](https://flink.apache.org/) 