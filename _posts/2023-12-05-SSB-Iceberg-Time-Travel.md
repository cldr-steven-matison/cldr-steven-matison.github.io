---
title:  "Time Travel with Sql Stream Builder and Iceberg"
header:
  teaser: "/assets/images/iceberg.png"
categories: 
  - blog
tags:
  - ssb 
  - iceberg 
  - flink
---

I have been working on my [SSB Iceberg Demo](https://github.com/cldr-steven-matison/SSB-Iceberg-Demo) for going on 2 months now.  This past week I have had a chance to build out some Iceberg Time Travel capabilities.   I have the code and samples added to my SSB Iceberg Demo but a more interesting time travel story is within the [Fraud Detection Demo](https://github.com/cldr-steven-matison/Fraud-Prevention-With-Cloudera-SSB) I have been running.     Let's take a look at the important details.


First, these are sample queries we can execute in Hue to get snapshot ids, query as of SYSTEM_VERSION, ROLLBACK to a version, and confirm current state of data is from rollback.

```javascript
-- Describe Table
DESCRIBE FORMATTED fraudulent_txn_iceberg; 

-- Get Current Count
select count(*) from fraudulent_txn_iceberg
 -- 1456146

-- Get Snap Shot Ids
DESCRIBE HISTORY fraudulent_txn_iceberg
-- copy 2 ids,  one older than the other

-- Get Totals Per Card Type As of SnapShot 1 
select card, sum(amount) from fraudulent_txn_iceberg FOR SYSTEM_VERSION AS OF 2163411949573389139 GROUP BY card
  -- mastercard       103930672
  -- americanexpress  105070827
  -- visa             104719497

-- Get Totals Per Card Type As of SnapShot 2
select card, sum(amount) from fraudulent_txn_iceberg FOR SYSTEM_VERSION AS OF 2013237884718568734 GROUP BY card
  -- mastercard       116812083
  -- americanexpress  115538225
  -- visa             116185432
 
-- Get Count as of SnapShot 2  
select count(*) from fraudulent_txn_iceberg FOR SYSTEM_VERSION AS OF 2013237884718568734  
 -- 348732
 
-- Roll back to Snapshot 2
ALTER TABLE fraudulent_txn_iceberg  EXECUTE ROLLBACK(2013237884718568734);

-- Confirm current table Count is Correct
select count(*) from fraudulent_txn_iceberg
 -- 348732
 
-- Show Database Totals match Query Line 15
select card, sum(amount) from fraudulent_txn_iceberg GROUP BY card 
  -- mastercard       116812083
  -- americanexpress  115538225
  -- visa             116185432
```

Next, lets take a look at some Sql Stream Builder queries using the SnapShot Ids to stream from a point in time or stream between a start and end snapshot:

```javascript
-- First, get snapshots ids for the iceberg table
/* In hue (hue-impala-iceberg DataWarehouse) execute the following query to get start-snapshot-id report
DESCRIBE HISTORY fraudulent_txn_iceberg; 
*/


-- Next, complete a basic select with snapshot-id
select * from fraudulent_txn_iceberg /*+OPTIONS('snapshot-id'='6619035083895556755')*/;

-- Time travel 1 sec stream starting from snap-shot-id
select * from fraudulent_txn_iceberg /*+OPTIONS('streaming'='true', 'monitor-interval'='1s', 'start-snapshot-id'='4263825941508588099')*/;

-- Select data from start snapshot to end snapshot
select * from fraudulent_txn_iceberg /*+OPTIONS('start-snapshot-id'='4263825941508588099', 'end-snapshot-id'='3724519465921078641')*/;
```


I think [Iceberg](https://iceberg.apache.org/) is pretty cool and it is definitely here to stay.  If you need any more information or help with Cloudera Sql Stream Builder or Iceberg reach out as I am always willing to demo, run a hands on lab, or help you with yours.

Check out Whats New in [CDP 7.1.9](https://docs.cloudera.com/cdp-private-cloud-base/7.1.9/runtime-release-notes/topics/rt-pvc-whats-new.html) 

Check out Whats new in [CSA 1.11](https://docs.cloudera.com/csa/1.11.0/release-notes/topics/csa-what-new.html).  

Check out Streaming SQL Console 

[CDP Public Cloud SSB](https://docs.cloudera.com/csa/1.11.0/ssb-overview/topics/csa-ssb-key-features.html)

As always, check out the docs:

[Cloudera Streaming Analytics DOCS](https://docs.cloudera.com/csa/1.11.0/index.html)

CDP [SSB](https://docs.cloudera.com/csa/1.11.0/ssb-overview/topics/csa-ssb-intro.html) [CSA](https://docs.cloudera.com/csa/1.11.0/index.html) [Flink](https://flink.apache.org/) 