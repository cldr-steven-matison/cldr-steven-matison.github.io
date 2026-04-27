---
title:  "Cloudera AI April Release"
header:
  teaser: "/assets/images/cloudera_ai_inference.png"
categories: 
  - release
tags:
  - cloudera
  - ai
---

We are excited to announce the latest release of Cloudera AI. This update focuses on streamlining model deployment, enhancing user experience, and expanding our ecosystem integrations within the Cloudera AI Inference service. Key highlights include the introduction of long-lived API keys for persistent authentication, new model additions, and a new public Model Hub Catalog to accelerate model discovery, alongside several key performance and stability fixes within the Cloudera AI Workbench.

## Key Features

### AI Inference service

* **Long-Lived API Key Support:** Authenticate application requests and test model endpoints using newly supported long-lived API keys.To improve management of API security, you can now generate these persistent credentials directly from the Model Endpoint Details page to streamline your application integration. Note:** This feature requires Cloudera Base version 7.3.2.

* **Wizard-Based Model Endpoint Creation:** Experience a redesigned, guided flow for creating and editing model endpoints. This unifies model version selection, resource profiles, autoscaling configuration, and final review into a single, seamless user experience.

* **Task Selection for Hugging Face Models:** Specify the model task (e.g., text generation, reranking, or embedding) during deployment. Persisting this context in the payload ensures proper vLLM interface configuration, broadening support for Hugging Face models.

* **NVIDIA Magpie TTS Multilingual NIM:** Deploy high-quality text-to-speech (TTS) workloads with new support for the NVIDIA Magpie TTS NIM runtime. Using the new TEXT_TO_SPEECH task, you can seamlessly generate multilingual synthetic speech in both offline (WAV) and streaming (LPCM) formats.

* **NVIDIA Whisper Large v3 NIM:** Power high-accuracy automatic speech recognition (ASR) workloads using the newly supported NVIDIA Whisper Large v3 NIM. Deploying the latest runtime significantly improves transcription performance, while maintaining full backward compatibility to ensure earlier deployments remain uninterrupted.

### AI Registry

* **Public Model Hub Catalog:** Browse and evaluate recommended NVIDIA NIMs and Hugging Face models before importing them using the newly introduced [public catalog](https://cloudera.github.io/Model-Hub/). This curated, standalone repository accelerates model selection and simplifies collaboration by granting stakeholders outside the Cloudera environment direct visibility into supported AI assets.

## Public Links

* **Release Notes:** [Review the complete list of changes.](https://docs.cloudera.com/machine-learning/cloud/release-notes/topics/ml-whats-new.html#ml_workspace_resource_tags)
* **Public Model Hub Catalog:** [Cloudera Github](https://cloudera.github.io/Model-Hub/)
* **[Cloudera AI](https://www.cloudera.com/products/machine-learning.html) Portfolio:** Dive deeper into [Cloudera AI Inference](https://www.cloudera.com/products/machine-learning/ai-inference-service.html) service and [Cloudera AI Workbench.](https://www.cloudera.com/products/machine-learning/ai-workbench.html)


As always, check out the entire [DOCS](https://docs.cloudera.com/machine-learning/cloud/index.html) for Cloudera AI.


## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
