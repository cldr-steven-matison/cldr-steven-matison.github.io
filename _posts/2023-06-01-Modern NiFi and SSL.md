---
title:  "NIFI SSL in Modern Versions of NiFi"
header:
  teaser: "/assets/images/2023-06-01-Modern NiFi and SSL.png"
categories: 
  - blog
tags:
  - nifi
---

My original experiences with NiFi and SSL were not something I would call fun or easy.  Literally hours and days were spent configuring nifi cluster nodes to communicate with each other using SSL and enabling https Nifi UI.  Adding access and authentication controls was even more hard work. Last but not least, configuring SSL Context Services to communicate with external https endpoints was always a challenge.   I am happy to report that it is very easy to install modern versions of NiFi.  Out of the box these versions comes fully secured with ssl and an initial user and password for login. No more fully exposed IP addresses w/ nifi canvas ready for abuse.  Join me as I explore a new nifi install and create 2 sample SSL Context Services.  

You can read the full article over at the Cloudera Community:

[NIFI SSL in Modern Versions of NiFi](https://community.cloudera.com/t5/Community-Articles/NIFI-SSL-in-Modern-Versions-of-NiFi/ta-p/371937)