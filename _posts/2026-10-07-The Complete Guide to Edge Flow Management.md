---
layout: single
title: "The Complete Guide to Edge Flow Management"
date: 2026-10-07
excerpt: "NiFi in the datacenter is well documented. Edge Flow Manager is not, until now. 21 chapters, every one built and run on hardware."
classes: wide
categories:
  - blog
tags:
  - minifi
  - efm
  - edge
  - nifi
  - cloudera
  - kubernetes
header:
  teaser: /assets/images/efm-cloudera-edge-management.png
---

NiFi in the datacenter is well documented. Edge Flow Manager is not, until now. EFM is the central manager for agent Classes, Resources, and Edge Flows, and the hard problems are all out at the edge. A MiNiFi agent on a Jetson. A Windows box over Tailscale. A Kubernetes pod with no persistent identity. Binary delivery, agent enrollment, which processors exist in which build, custom processors and resources, and how to get a flow from a designer canvas onto a device that keeps changing its IP.

I wrote the map I wish I'd had the first time I tried to run a flow at the edge. It is published now as **[The Complete Guide to Edge Flow Management](https://github.com/cldr-steven-matison/EdgeFlowManager)**, 21 chapters, every one built and run on hardware. The processor catalogs are the ones the agent manifests report, not the ones the docs promise, and every flow is one that ran.

![Cloudera Data in Motion, MiNiFi edge devices feeding NiFi, Kafka, and Flink for ingest and transform, into data-at-rest and AI, over the SDX security and governance layer](/assets/images/efm-cloudera-edge-management.png)

## What the guide covers

The 21 chapters move from infrastructure out to the edge and then to the demos that tie it together.

- **EFM foundations on Kubernetes.** Get EFM running and persisted, and fed with agent binaries. This is the staging tree everything else rides on.
- **Processors, C++ and Java.** Which processors exist in each build, how `ExecuteScript` availability differs across builds, and how to author custom Python processors as their own types at the edge.
- **The MiNiFi playground.** Install plain MiNiFi in both runtimes, then bring EFM in to manage the agents and resources.
- **MiNiFi on Kubernetes.** Both runtimes as EFM-managed pods, then moving their FlowFiles into NiFi over secure Site-to-Site.
- **EFM at the edge.** A from-scratch ESP32 C2 agent enrolled directly in EFM, and Sparkplug B over MQTT on physical hardware.
- **AI at the edge.** The `nifi-and-ai` skill and its EFM machinery, NiFi plus Python, the same idea pushed down to a MiNiFi agent, and the StarlinkAI and Lemonade edge-AI router as a case study.
- **Sample gallery.** Runnable flows collected as the guide was built.
- **End-to-end demos.** EFM plus an NVIDIA Jetson, and the SparkPlug and IIoT demo, told start to finish.
- **Observability.** EFM's own metrics, the C++ agent's Prometheus publisher, and the smallest agents' heartbeat metrics, all into one Prometheus and Grafana stack.

## How to read it

The guide lives in its own repository and reads through the index on GitHub. There is no separate document to assemble and no other site to go to. Start at the [table of contents](https://github.com/cldr-steven-matison/EdgeFlowManager) and read it end to end, or jump to the chapter that matches the problem in front of you.

The ESP32 edge agent in the MicroFi chapter is Chris Burns's open-source clean-room MiNiFi C2 implementation for microcontrollers, [MicroFi](https://github.com/Christopheraburns/MicroFi). The firmware and its design are his. The guide documents fielding it as an EFM agent.

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
