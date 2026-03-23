---
title: "Deploying vLLM with Qwen Llama on Minikube"
excerpt: "Unleash your local GPU! Learn how to deploy vLLM on Minikube to power real-time NiFi data pipelines using Llama 3.2 and Qwen 2.5."
header:
  teaser: "/assets/images/2026-03-18-minikube-vllm-qwen-lama.png"
categories: 
  - blog
tags:
  - cloudera
  - minikube
  - kubernetes
  - vllm
  - ai
author: "Steven Matison"
---

In my previous post [GPU-Accelerated Kubernetes: Setting up NVIDIA on Minikube](/blog/GPU-Setup-Minikube/), we successfully exposed the GPU to our Minikube pods which so far has been the hardest part of the WSL2/Docker Desktop stack! 🛠️

Now that the **RTX 4060** (8 GB VRAM) is visible, and **NiFi + Kafka + Flink** stack is humming, we can jump into the fun part: **Real-time Streaming AI Inference.** The 4060 is a sweet spot for local development; it can comfortably run 3B to 7B models with lightning-fast speeds, or even 13B models with some clever quantization. Our goal is to turn Minikube into a private AI endpoint that **NiFi** can call via the `InvokeHTTP` processor to summarize streams, classify events, or extract entities in real-time. 🚀

---

## 🤖 Deploying the vLLM Inference Server

vLLM is a high-throughput, memory-efficient inference engine. It is perfect for 40-series cards because it supports advanced quantization and paged attention.

We have two great options to get you started:

### Option A: Llama 3.2 (The Heavy Hitter)
Llama 3.2-3B is incredibly smart for its size, but it is a "gated" model.

{: .notice--warning}
:key: **Requirement:** This requires Hugging Face (HF) access to download. You must have an HF account and an API token. You'll need to create a Kubernetes secret named `hf-token` containing your token before deploying this.  Last but not least you need to complete user input form for access.

**Create `vllm-llama.yaml`:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vllm-server
  template:
    metadata:
      labels:
        app: vllm-server
    spec:
      containers:
      - name: vllm-server
        image: vllm/vllm-openai:latest
        env:
        - name: HF_TOKEN
          valueFrom:
            secretKeyRef:
              name: hf-token
              key: HF_TOKEN
        resources:
          limits:
            [nvidia.com/gpu](https://nvidia.com/gpu): "1"
          requests:
            [nvidia.com/gpu](https://nvidia.com/gpu): "1"
        args:
        - "meta-llama/Llama-3.2-3B-Instruct"
        - "--quantization"
        - "bitsandbytes"
        - "--load-format"
        - "bitsandbytes"
        - "--gpu-memory-utilization"
        - "0.80"
        - "--max-model-len"
        - "4096"
        - "--enforce-eager"
        ports:
        - containerPort: 8000
        volumeMounts:
        - name: shm
          mountPath: /dev/shm
      volumes:
      - name: shm
        emptyDir:
          medium: Memory
          sizeLimit: "2Gi"
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-service
spec:
  selector:
    app: vllm-server
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: ClusterIP
```

---

### Option B: Qwen 2.5 (The "Easy" Path)
Without waiting for approval, **Qwen 2.5-3B-Instruct** is a world-class, free, non-gated model that performs exceptionally well. It is roughly comparable to Llama 3.2 in quality but loads without any approvals.

{: .notice--info}
**ProTip:** You still need your `hf-token` but you wont have to wait for approval.
s
**Create `vllm-qwen.yaml`:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vllm-server
  template:
    metadata:
      labels:
        app: vllm-server
    spec:
      containers:
      - name: vllm-server
        image: vllm/vllm-openai:latest
        env:
        - name: HF_TOKEN
          valueFrom:
            secretKeyRef:
              name: hf-token
              key: HF_TOKEN
        resources:
          limits:
            nvidia.com/gpu: 1
        args:
        - "Qwen/Qwen2.5-3B-Instruct"
        - "--quantization"
        - "bitsandbytes"
        - "--load-format"
        - "bitsandbytes"
        - "--gpu-memory-utilization"
        - "0.80"             # Fits comfortably in 6.92 GiB
        - "--max-model-len"
        - "2048"             # 2k is a solid sweet spot for 3B models
        - "--enforce-eager"
        volumeMounts:
        - name: shm
          mountPath: /dev/shm
      volumes:
      - name: shm
        emptyDir:
          medium: Memory
          sizeLimit: "2Gi"
---
apiVersion: v1
kind: Service
metadata:
  name: vllm-service
  namespace: default
spec:
  selector:
    app: vllm-server
  ports:
  - protocol: TCP
    port: 8000
    targetPort: 8000
  type: ClusterIP
```

---

## 🛠️ How to Apply and Test

### 1. Fire it up
Apply your chosen YAML file and watch the logs. The first run will download several gigabytes of model weights, so grab a coffee! ☕

```bash
kubectl apply -f vllm-qwen.yaml
kubectl logs -f deployment/vllm-server -c vllm-server
```

### 2. Connect via Port-Forward
Since we are in Minikube, we need to bridge the gap to our local machine:

```bash
kubectl port-forward svc/vllm-service 8000:8000
```

### 3. Test with `curl`
vLLM uses an OpenAI-compatible API, making it very easy to test from your terminal.

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-3B-Instruct",
    "messages": [{"role": "user", "content": "Tell me a short joke about a data engineer."}],
    "temperature": 0.7
  }'
```

---

## 📮 Setting up Postman

Postman works perfectly since vLLM mimics the OpenAI API. Use it to test your prompts before automating them in NiFi.

1.  **New Collection:** Create one named `vLLM Local Server`.
2.  **Environment Variables:** Add `base_url` as `http://localhost:8000/v1`.
3.  **The Request:**
    * **Method:** `POST`
    * **URL:** `{{base_url}}/chat/completions`
    * **Body:** Select `raw` -> `JSON`.
    * **Paste this:**
    ```json
    {
      "model": "Qwen/Qwen2.5-3B-Instruct",
      "messages": [
        {"role": "system", "content": "You are a helpful NiFi assistant."},
        {"role": "user", "content": "How do I use InvokeHTTP with vLLM?"}
      ],
      "stream": false
    }
    ```

{: .notice--info}
**ProTip:** Set `"stream": true` in the JSON body if you want to see Postman render the response chunk-by-chunk in real-time!

---

## 💻 Terminal Commands for this Session


```terminal
# working with vLLM
kubectl apply -f vllm-llama.yaml
kubectl delete -f vllm-llama.yaml  
kubectl logs deployment/vllm-server --previous
kubectl describe pod -l app=vllm-server
minikube service vllm-service --url
kubectl exec -it mynifi-0 -n cfm-streaming -- curl -v http://vllm-service.default.svc.cluster.local:8000/v1/models

# debug vLLM
kubectl get pods
kubectl logs vllm-server-8548fd9959-rzbdl --previous
kubectl logs -f deployment/vllm-server -c vllm --tail=300

# test vLLM
minikube service vllm-service --url
kubectl port-forward svc/vllm-service 8000:8000

    curl http://localhost:8000/v1/chat/completions   -H "Content-Type: application/json"   -d '{
      "model": "Qwen/Qwen2.5-3B-Instruct",
      "messages": [{"role": "user", "content": "Yo, you finally woke up! Tell me something mind-blowing about space in under 100 words."}],
      "temperature": 0.8,
      "max_tokens": 120
    }'

    curl http://localhost:8000/v1/chat/completions   -H "Content-Type: application/json"   -d '{
      "model": "Qwen/Qwen2.5-3B-Instruct",
      "messages": [{"role": "user", "content": "Yo, you finally woke up! Tell me something mind-blowing about space in under 100 words."}],
      "temperature": 0.8,
      "max_tokens": 120
    }'

    curl http://localhost:8000/v1/chat/completions   -H "Content-Type: application/json"   -d '{
      "model": "Qwen/Qwen2.5-3B-Instruct",
      "messages": [{"role": "user", "content": "Yo, you finally woke up! Tell me something mind-blowing about space in under 100 words."}],
      "temperature": 0.8,
      "max_tokens": 120
    }'

    curl http://localhost:8000/v1/chat/completions   -H "Content-Type: application/json"   -d '{
      "model": "Qwen/Qwen2.5-3B-Instruct",
      "messages": [{"role": "user", "content": "Yo, you finally woke up! Tell me something mind-blowing about space in under 100 words."}],
      "temperature": 0.8,
      "max_tokens": 120,
      "stream": true
    }'

```

---

## Questions?
If you have any questions about the integration between these components or you would like a deeper dive, hands-on experience, or demos, please reach out to schedule a discussion. 🤝