---
title:  "RAG with Cloudera Streaming Operators"
excerpt: "Privacy-first, fully local semantic search & question-answering over your documents, Git repos, and URLs — powered by Kafka streaming, NiFi, Qdrant, and your RTX 4060 GPU."
header:
  teaser: "/assets/images/StreamToVLLM.png"
categories: 
  - blog
tags:
  - cloudera
  - operator
  - nifi
  - vllm
  - ai
author: "Steven Matison"
---

:warning: **Danger!** This is a Work in Progress article, content and code is updating frequently until this notice is removed.
{: .notice--danger}

Let's build: **StreamToVLLM** — a local RAG setup that turns your cloudera operator deployed cluster into a real-time, streaming-aware knowledge base. No cloud APIs. No data leaving your machine. Just pure Cloudera Streaming Operators (Kafka + NiFi + Flink) + vLLM inference + Qdrant vector search.  

Perfect for this GPU() RTX 4060 8 GB VRAM) setup — it comfortably runs Qwen2.5-3B-Instruct at speed while NiFi ingests documents in real time via Kafka.  

We already have the [Cloudera Streaming Operators](/blog/Cloudera-Streaming-Operators/) stack, [GPU-Accelerated Kubernetes: Setting up NVIDIA on Minikube](/blog/GPU-Setup-Minikube/), and some example [Deploying vLLM with Qwen Llama on Minikube](/blog/Deploying-vLLM-with-Qwen-Llama-on-Minikube/) working from previous sessions — now let’s wire it all together into a complete, production-grade local RAG pipeline.  

---

## 💻 Prerequisites

You should have:
- Minikube running with **GPU passthrough** (RTX 4060 confirmed)
- Cloudera Streaming Operators (CSM + CSA + CFM) installed in namespaces `cld-streaming` and `cfm-streaming`
- NiFi UI accessible at `https://mynifi-web.mynifi.cfm-streaming.svc.cluster.local/nifi/`

**Quick GPU double-check** (do this first!):

```bash
kubectl get nodes -o jsonpath='{.items[*].status.allocatable.nvidia\.com/gpu}'
# Should return: 1

# Run the official NVIDIA test pod
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: gpu-test
spec:
  restartPolicy: Never
  containers:
  - name: cuda-test
    image: nvcr.io/nvidia/k8s/cuda-sample:vectoradd-cuda12.5.0
    resources:
      limits:
        nvidia.com/gpu: 1
EOF

kubectl logs gpu-test -f
```

**Expected output:** `Test PASSED` ✅  

**Pro Tip!** Keep `watch nvidia-smi` running in another terminal — you’ll see your 4060 light up during inference.

---

## 📦 Step 1: Deploy vLLM Inference Server

We use the Qwen model now but you could use Lllama here too.

Save as `vllm-qwen.yaml`:

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
        - "0.80"
        - "--max-model-len"
        - "2048"
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

Apply it:

```bash
kubectl apply -f vllm-qwen.yaml
kubectl get pods -w
kubectl port-forward svc/vllm-service 8000:8000
```

**Test it** (OpenAI-compatible endpoint):

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-3B-Instruct",
    "messages": [{"role": "user", "content": "Hello! Tell me a short joke."}],
    "temperature": 0.7
  }'
```

**⚡ Ready for RAG!** Your GPU pod is now the brain of the system.

---

## 🗄️ Step 2: Deploy Qdrant Vector DB

Save as `qdrant-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qdrant
spec:
  replicas: 1
  selector:
    matchLabels:
      app: qdrant
  template:
    metadata:
      labels:
        app: qdrant
    spec:
      containers:
      - name: qdrant
        image: qdrant/qdrant:latest
        ports:
        - containerPort: 6333
        - containerPort: 6334
        volumeMounts:
        - name: qdrant-data
          mountPath: /qdrant/storage
      volumes:
      - name: qdrant-data
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: qdrant
spec:
  selector:
    app: qdrant
  ports:
  - name: http
    port: 6333
    targetPort: 6333
  - name: grpc
    port: 6334
    targetPort: 6334
  type: ClusterIP
```

```bash
kubectl apply -f qdrant-deployment.yaml
kubectl port-forward svc/qdrant 6333:6333
curl http://localhost:6333/
```

---

## 🔢 Step 3: Lightweight Embedding Server

Save as `embedding-server.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: embedding-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: embedding
  template:
    metadata:
      labels:
        app: embedding
    spec:
      containers:
      - name: embedder
        image: ghcr.io/huggingface/text-embeddings-inference:1.5
        args: ["--model-id", "nomic-ai/nomic-embed-text-v1", "--pooling", "cls"]
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "2"
            memory: 4Gi
---
apiVersion: v1
kind: Service
metadata:
  name: embedding-service
spec:
  selector:
    app: embedding
  ports:
  - port: 8080
    targetPort: 8080
```

```bash
kubectl apply -f embedding-server.yaml
kubectl port-forward svc/embedding-service 8080:8080
```

Test: `curl -X POST http://localhost:8080/embed -d '{"inputs":"Hello world"}'`

---

## 🌊 Step 4: Real-Time Ingestion with NiFi

1. Open NiFi UI → Create process group **StreamToVLLM-Ingestion**
2. Build this flow (drag & drop):

   **ConsumeKafka** (topic: `new-documents`)  
   ↓  
   **ExtractText** / **ConvertRecord** (PDF, JSON, GitHub webhooks)  
   ↓  
   **SplitText** (512-token chunks)  
   ↓  
   **InvokeHTTP** → `http://embedding-service:8080/embed` (get vector)  
   ↓  
   **InvokeHTTP** → `http://qdrant:6333/collections/my-rag-collection/points` (POST vector + payload)

**Pro Tip!** For GitHub repos add **GetHTTP** + **JoltTransformJSON**. For URLs use **GetHTTP**.

Start the flow — documents now stream in real time and land in Qdrant!

---

## 🔍 Step 5: Query Time — Ask Questions!

Simple Python script (or curl) — save as `query-rag.py`:

```python
import requests, json

def ask(question):
    # Embed question
    emb = requests.post("http://localhost:8080/embed", json={"inputs": question}).json()[0]
    
    # Search Qdrant
    search = requests.post("http://localhost:6333/collections/my-rag-collection/points/search", json={
        "vector": emb,
        "limit": 5,
        "with_payload": True
    }).json()
    
    context = "\n\n".join([hit["payload"]["text"] for hit in search["result"]])
    
    # Call vLLM
    resp = requests.post("http://localhost:8000/v1/chat/completions", json={
        "model": "Qwen/Qwen2.5-3B-Instruct",
        "messages": [
            {"role": "system", "content": "Answer using only this context."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
        ]
    })
    print(resp.json()["choices"][0]["message"]["content"])

ask("What is StreamToVLLM?")
```

**Boom** — instant, context-aware answers from your live streaming documents.

---

## 🧹 Cleanup

```bash
kubectl delete -f vllm-qwen.yaml
kubectl delete -f qdrant-deployment.yaml
kubectl delete -f embedding-server.yaml
```

---

## 📚 Resources & Further Reading

- [Cloudera Streaming Operators](/blog/Cloudera-Streaming-Operators/)
- [GPU-Accelerated Kubernetes: Setting up NVIDIA on Minikube](/blog/GPU-Setup-Minikube/)
- [Deploying vLLM with Qwen Llama on Minikube](/blog/Deploying-vLLM-with-Qwen-Llama-on-Minikube/)

---

:warning: **Danger!** This is a Work in Progress article, content and code is updating frequently until this notice is removed.
{: .notice--danger}


### {{ page.title }}

If you have any questions about the integration between these components or you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }},  please reach out to schedule a discussion.
