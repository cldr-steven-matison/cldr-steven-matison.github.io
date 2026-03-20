---
title:  "Test & Tune for Max CPU with NiFi on Minikube"
header:
  teaser: "/assets/images/2026-03-20-MaxMem&CPU-Nifi-minikube.png"
categories: 
  - blog
tags:
  - cloudera
  - kubernetes
  - nifi
---

Yesterday I built a simple but brutal benchmark flow for Apache NiFi. The goal? Push a default minimal NiFi cluster on Minikube to the absolute limits of memory and CPU — without crashing it :bomb:.  **Or Did I?**

The flow JSON I used is here:  
**[NiFiBenchMarkTest.json](https://raw.githubusercontent.com/cldr-steven-matison/NiFi-Templates)**

I ran everything on a Windows-hosted **Minikube** cluster (6 CPUs, 16 GB RAM) using a default Cloudera Flow Management (CFM) evaluation deployment. The results were excellent: I hit 99% CPU usage while keeping NiFi rock-solid stable.

All of this setup is fully documented in my blog [Cloudera Streaming Operators](https://cldr-steven-matison.github.io/blog/Cloudera-Streaming-Operators/) and in my repo:  
[ClouderaStreamingOperators](https://github.com/cldr-steven-matison/ClouderaStreamingOperators).

## Setting Up the NiFi Flow (Default Settings Only)

Once you have the NiFi UI open:

1. Download the benchmark flow JSON linked above.
2. In the NiFi UI, go to the canvas → **Import** → upload the JSON file.
3. The imported flow contains exactly these processors in sequence:
   - **GenerateFlowFile**
   - **DuplicateFlowFile**
   - **CompressContent**

4. **Do not change anything** — leave all concurrency settings, thread pools, and queue back-pressure at their factory defaults.

5. Start the entire flow.

You’ll immediately see data flowing. The flow generates synthetic records, duplicates them aggressively, and compresses them — exactly the kind of workload that hammers both CPU and memory.

## Tuning for Maximum Load (After the Flow Is Running)

Once you confirm the flow is stable with defaults, it’s time to open the throttle.

### Set Concurrency on CompressContent
- Right-click the **CompressContent** processor → **Configure**
- Go to the **Scheduling** tab
- Change **Concurrent Tasks** from the default (usually 1) to **`16`**

This lets 16 parallel threads chew through the heavy compression work.

### Increase the Active Thread Pool
- Open your NiFi controller settings 
- Raise the **Maximum Timer Driven Thread Pool Size** to **`32`** (roughly 4× my CPU cores for aggressive tuning)

This gives NiFi far more total threads to work with across the entire cluster.

### Crank Up Queue Sizes
- Click each connection arrow (especially between GenerateFlowFile → DuplicateFlowFile and DuplicateFlowFile → CompressContent)
- Edit the connection properties
- Set **Back Pressure Data Size Threshold** to **`500 GB`** (or as high as your volume allows)
- Optionally bump the object count threshold to 500,000+ as well

These changes prevent early back-pressure and let the system queue massive amounts of data before throttling.

Apply the changes, restart the affected processors, and watch the magic happen.

:trophy: **Pro Tip!** You can also set the Run Duration of a processor while tuning.  In the test above I set my DuplicateFlowfile to 25 ms.  Definitely consider how long you want each process thread to run.
{: .notice--warning}

## Results Summary

With the tuned settings applied, the cluster performed beautifully:
- CPU hit **99%** sustained load
- Memory stayed comfortable at **~40–41%**
- Queues ballooned to over **500 GB** and -100,000+ flowfiles
- The desktop PC fan started spinning slowly… then went to **full blast** — the best analog indicator that real work is happening!
- NiFi never crashed, even when the monitoring tool screamed “Critical CPU level!”
- I did press stop at this point, no sense in :fire: for a fun test

A default minimal evaluation NiFi cluster on Minikube is surprisingly capable once you give it the right concurrency, thread pool, and queue headroom.

Here are the screenshots I captured on my phone during the test runs.


*Minikube + k9s View of the cluster building load.*
<img src="/assets/images/2026-03-20-screenshot-5.jpg" width="200">


*Minikube + k9s view showing 99% CPU utilization.*
<img src="/assets/images/2026-03-20-screenshot-1.jpg" width="200">

*Monitoring tool firing a red “Critical CPU level!” warning.*
<img src="/assets/images/2026-03-20-screenshot-2.jpg" width="200">

*Pink “Warning CPU level!” alert during sustained load.*
<img src="/assets/images/2026-03-20-screenshot-3.jpg" width="200">

*NiFi flow statistics — 102 GB queued after DuplicateFlowFile and heavy compression (tuning in progress)*
![Tuning NiFi Flow](/assets/images/2026-03-20-screenshot-4.jpg)




Happy tuning — go push your NiFi clusters to the limit! 🚀 

### 📚 Resources
* [Cloudera Streams Messaging (CSM) 1.6 Docs](https://docs.cloudera.com/csm-operator/1.6/index.html)
* [Cloudera Streaming Analytics (CSA) 1.5 Docs](https://docs.cloudera.com/csa-operator/1.5/index.html)
* [Cloudera Flow Management (CFM) 3.0 Docs](http://docs.cloudera.com/cfm-operator/3.0.0/index.html)
* [ClouderaStreamingOperators](https://github.com/cldr-steven-matison/ClouderaStreamingOperators)

---

### {{ page.title }}

If you have any questions about the integration between these components or you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }},  please reach out to schedule a discussion.