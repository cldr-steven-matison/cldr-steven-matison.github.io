---
title:  "Tune for Max CPU with NiFi on Minikube"
excerpt: "How I stress-tested a default Cloudera Flow Management NiFi deployment on Minikube — hitting 99% CPU with synthetic data, aggressive duplication, and heavy compression — while keeping the cluster completely stable."
header:
  teaser: "/assets/images/2026-03-20-MaxCPU-Nifi-minikube.png"
categories: 
  - blog
tags:
  - cloudera
  - kubernetes
  - nifi
author: "Steven Matison"
---

Yesterday I built a simple but brutal benchmark flow for Apache NiFi. The goal? Push a default minimal NiFi cluster on Minikube to the absolute limits of memory and CPU — without crashing it.  **Or Did I?** :bomb:

The flow JSON I used is here:  
**[NiFiBenchMarkTest.json](https://github.com/cldr-steven-matison/NiFi-Templates)**

I ran everything on a Windows-hosted **Minikube** cluster (6 CPUs, 16 GB RAM) using a default Cloudera Flow Management (CFM) evaluation deployment. The results were excellent: I hit 99% CPU usage while keeping NiFi rock-solid stable.

All of this setup is fully documented in my blog [Cloudera Streaming Operators](https://cldr-steven-matison.github.io/blog/Cloudera-Streaming-Operators/) and in my repo:  
[ClouderaStreamingOperators](https://github.com/cldr-steven-matison/ClouderaStreamingOperators).

## :package: Setting Up the NiFi Flow

Getting this NiFi Flow going is pretty easy, use the Flow Definition File I provided and follow along in the NiFi UI.

1. Download the benchmark flow JSON linked above.
2. In the NiFi UI, go to the canvas, drag out a new process group and click the button outlined in red to upload: ![Upload](/assets/images/2026-03-20-process-group-upload.png)
3. The imported flow should look as follows: ![NiFi Benchmark Test](/assets/images/2026-03-20-sample-flow.png)
4. **Do not change anything** — leave all concurrency settings, thread pools, and queue back-pressure at their factory defaults.

5. Start the entire flow.

You’ll immediately see data flowing. The flow generates synthetic records, duplicates them aggressively, and compresses them — exactly the kind of workload that hammers both CPU and memory.


:warning: **Danger!** This next section are settings from my final iteration.  Depending on your enviornment you need to scale your settings from default to higher number as I describe here.  For example I started with 10gb, 10,000, and 2 concurrency and slowly incremement over iterations.
{: .notice--danger}


## :chart_with_upwards_trend: Tuning for Maximum Load

Once you confirm the flow is stable with defaults, it’s time to open the throttle.

### Set Concurrency on CompressContent
- Right-click the **CompressContent** processor → **Configure**
- Go to the **Scheduling** tab
- Change **Concurrent Tasks** from the default (usually 1) to **`16`**

![Concurrency](/assets/images/2026-03-20-concurrency.png)

This lets 16 parallel threads chew through the heavy compression work.

### Increase the Active Thread Pool
- Open your NiFi controller settings 
- Raise the **Maximum Timer Driven Thread Pool Size** to **`32`** (roughly 4× my CPU cores for aggressive tuning)

![Adjusting Maximum Timer Driver Thread Count](/assets/images/2026-03-20-screenshot-6.png)

This gives NiFi far more total threads to work with across the entire cluster.

### Crank Up Queue Sizes
- Click each connection arrow 
  - GenerateFlowFile → DuplicateFlowFile
  - DuplicateFlowFile → CompressContent
- Edit the connection properties
- Set **Back Pressure Object Threshold** to **`500 GB`** (or as high as your volume allows)
- Optionally bump the object **Size Threshold** to **`500,000`**+** as well

![Back Pressure](/assets/images/2026-03-20-back-pressure.png)

These changes prevent early back-pressure and let the system queue massive amounts of data before throttling.

Apply the changes, restart the affected processors, and watch the magic happen.

:trophy: **Pro Tip!** You can also set the Run Duration of a processor while tuning.  In the test above I set my DuplicateFlowfile to 25 ms.  Definitely consider how long you want each process thread to run.
{: .notice--warning}

## :stopwatch: Results 

With the tuned settings applied, the cluster performed beautifully:
- CPU hit **99%** sustained load
- Memory stayed comfortable at **~40–41%**
- Queues ballooned to over **500 GB** and **500,000+ flowfiles**
- The desktop PC fan started spinning slowly… then went to **full blast** — the best analog indicator that real work is happening!
- NiFi never crashed, even when the monitoring tool screamed “Critical CPU level!”
- I did press stop at this point, no sense in :fire: for a fun test!

A default minimal evaluation NiFi cluster on Minikube is surprisingly capable once you give it the right concurrency, thread pool, and queue headroom.

Here are the shots I captured during the test runs.

*Minikube + k9s View of the cluster building load on CPU.*

<img src="/assets/images/2026-03-20-screenshot-5.png" width="200">

*Minikube + k9s view showing 99% CPU utilization.*

<img src="/assets/images/2026-03-20-screenshot-1.png" width="200">

*K9s firing a red “Critical CPU level!” warning.*

<img src="/assets/images/2026-03-20-screenshot-2.png" width="200">

*Pink “Warning CPU level!” alert during sustained load.*

<img src="/assets/images/2026-03-20-screenshot-3.png" width="200">

*NiFi flow statistics — over 500 GB queued after DuplicateFlowFile and heavy compression*

![Tuning NiFi Flow](/assets/images/2026-03-20-screenshot-4.png)


If your k9s is not showing MEM and CPU metrics execute the following command and give a few moments for the metrics to start updating.  

```terminal
minikube addons enable metrics-server
```

___

## :checkered_flag: Summary

This experiment confirms that even a minimal, default deployment of Apache NiFi on a local Kubernetes environment like Minikube is an absolute powerhouse—provided you know which dials to turn. By simply adjusting the concurrent tasks, expanding the timer-driven thread pool, and giving your queues enough room to breathe, you can transform a modest 6-core setup into a high-performance data processing lab.

The most impressive takeaway wasn't just hitting 99% CPU utilization; it was that NiFi remained completely stable and the UI stayed responsive throughout the entire stress test. Whether you are running on a massive production cluster or a local laptop, the same principles apply: Test, Tune, and don't be afraid to listen for the :cyclone:!

Happy tuning — go push your NiFi clusters to the limit! 🚀 

## 📚 Resources
* [Cloudera Flow Management (CFM) 3.0 Docs](http://docs.cloudera.com/cfm-operator/3.0.0/index.html)
* [Cloudera Streaming Operators](https://cldr-steven-matison.github.io/blog/Cloudera-Streaming-Operators/)
* [ClouderaStreamingOperators](https://github.com/cldr-steven-matison/ClouderaStreamingOperators)

---

## {{ page.title }}

If you have any questions about the integration between these components or you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }},  please reach out to schedule a discussion.