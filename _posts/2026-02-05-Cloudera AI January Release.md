---
title:  "Cloudera AI January Release"
header:
  teaser: "/assets/images/cloudera_ai_inference.png"
categories: 
  - release
tags:
  - cloudera
  - ai
---

We’re excited to announce the latest release of **Cloudera AI**. This update introduces **Production-Grade App Serving (Technical Preview)**, elevating the Cloudera AI Inference service beyond simple model serving. 

This new capability provides a unified environment where your custom applications and agents can live, run, and scale directly alongside your model endpoints.

---

## Key Features

### 1. Robust AI Inference and Serving
* **Production-Grade App Serving (Tech Preview):** Host applications and agents directly within the Inference service. Apps now scale dynamically with model endpoints for a unified AI architecture.
* **Extended Model Support:** Direct deployment for **XGBoost, PyTorch, and TensorFlow** models straight from the Cloudera AI Registry.
* **Advanced vLLM Task Specification:** Manually specify model tasks (e.g., `EMBED`, `RANK`, or `CLASSIFICATION`) via the API during deployment to unlock broader vLLM architecture support.
* **Guaranteed Compute (AWS):** Support for **AWS On-Demand Capacity Reservations** and capacity blocks ensures compute availability for critical workloads.

### 2. Accelerated AI Workbench Performance
* **Enhanced UI:** Faster page load times due to memory and query optimizations across projects and jobs.
* **Auto-Rollback Upgrades:** Safer, "one-click" side-by-side upgrades for the workbench with built-in automatic rollback support in case of failure.

### 3. Enhanced AI Registry and Catalog
* **Deep Lineage Tracking:** The Registry now displays structured metadata (provider, model ID, checksum) for all models imported from **Hugging Face** and **NVIDIA NGC**.

---

## Platform Updates
* **Unified Administration:** Consistent admin experience across the Workbench, Registry, and Inference services.
* **Latest Kubernetes Support:** Official support added for **Amazon EKS 1.33** and **Azure AKS 1.33**.

---

## Public Links
* [**Release Notes**](https://docs.cloudera.com/machine-learning/cloud/release-notes/topics/ml-whats-new.html#ml_workspace_resource_tags): Review the complete list of changes.
* [**Cloudera AI Portfolio**](https://www.cloudera.com/products/machine-learning.html): Deep dive into the Cloudera [AI Inference Service](https://www.cloudera.com/products/machine-learning/ai-inference-service.html) and [AI Workbench](https://www.cloudera.com/products/machine-learning/ai-workbench.html).
* [**Press Release**](https://www.cloudera.com/about/news-and-blogs/press-releases/2026-02-09-cloudera-unveils-next-phase-of-ai-inferencing-and-unified-data-access-capabilities.html): Learn more about Cloudera AI Inference on-premises (GA).



As always, check out the entire [DOCS](https://docs.cloudera.com/machine-learning/cloud/index.html) for Cloudera AI.


If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about Cloudera AI please reach out to schedule a discussion.


