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
---

:warning: **Danger!** This is a Work in Progress article, content and code is updating frequently until this notice is removed.
{: .notice--danger}


Let's build: **StreamToVLLM** — a local RAG setup that turns your cloudera operator deployed cluster into a real-time, streaming-aware knowledge base. No cloud APIs. No data leaving your machine. Just pure Cloudera Streaming Operators (Kafka + NiFi) + vLLM inference + Qdrant vector search.  

![RAG with Cloudera Streaming Operators](/assets/images/2026-03-22-architecture.png)

Perfect for this GPU() RTX 4060 8 GB VRAM) setup — it comfortably runs Qwen2.5-3B-Instruct while NiFi ingests documents in real time via Kafka.  

We already have the [Cloudera Streaming Operators](/blog/Cloudera-Streaming-Operators/) stack, [GPU-Accelerated Kubernetes: Setting up NVIDIA on Minikube](/blog/GPU-Setup-Minikube/), and some example [Deploying vLLM with Qwen Llama on Minikube](/blog/Deploying-vLLM-with-Qwen-Llama-on-Minikube/) working from previous sessions — now let’s wire it all together into a complete local RAG pipeline.  

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

Notice the response:

```terminal

```

:trophy: **Pro Tip!** Keep `watch nvidia-smi` running in another terminal — you’ll see your 4060 light up during inference.
{: .notice--warning}


---

## 📦 Step 1: Deploy vLLM Qwen Inference Server

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

Apply the Qwen YAML:

```bash
kubectl apply -f vllm-qwen.yaml
kubectl get pods -w
kubectl port-forward svc/vllm-service 8000:8000
```

**Test** 

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-3B-Instruct",
    "messages": [{"role": "user", "content": "Hello! Tell me a short joke."}],
    "temperature": 0.7
  }'
```

Notice the response:

```terminal

```

:warning: **Warning!** If your curl command crashes the port forward, your vllm-server is not ready yet.  Watch the vllm-server logs until you see `Application startup complete`. 
{: .notice--warning}

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

Apply the Qdrant YAML:

```bash
kubectl apply -f qdrant-deployment.yaml
kubectl port-forward svc/qdrant 6333:6333
```

Let's use curl to test and to create our first sample collection to use later:
```bash
create collection curl
```

Notice the response:

```terminal

```

:trophy: **Pro Tip!** With `port-forward` on visit http://localhost:6333/dashboard and have a look at Qdrant 
{: .notice--primary}

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
      app: embedding-server
  template:
    metadata:
      labels:
        app: embedding-server
    spec:
      dnsPolicy: ClusterFirstWithHostNet
      containers:
        - name: tei-container
          image: ghcr.io/huggingface/text-embeddings-inference:cpu-1.5
          # This is the magic part: it forces the token into the binary's face
          command: ["/bin/sh", "-c"]
          args: 
            - |
              text-embeddings-router \
              --model-id nomic-ai/nomic-embed-text-v1 \
              --port 80 \
              --hf-api-token "[hf-token]"
          ports:
            - containerPort: 80
          resources:
            limits:
              memory: "2Gi"
              cpu: "2"
          volumeMounts:
            - name: model-cache
              mountPath: /data
      volumes:
        - name: model-cache
          emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: embedding-server-service
spec:
  selector:
    app: embedding-server
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
```

I had some difficulties in getting the hf model and token secret into the mix during pod creation.  The working setup I ended up with was to download the model locally, mount that during pod creation, and explictly use the hf-token string.   

Supporting Commands:

```terminal
mkdir -p /mnt/c/hf-models/nomic-embed
cd /mnt/c/hf-models/nomic-embed
sudo apt install python3-pip
python3 -c "from huggingface_hub import snapshot_download; snapshot_download(repo_id='nomic-ai/nomic-embed-text-v1', local_dir='/mnt/c/hf-models/nomic-embed', token='[hf-token]]')"
minikube mount /mnt/c/hf-models/nomic-embed:/mnt/c/hf-models/nomic-embed
```

Apply the Emedding Server YAML:

```bash
kubectl apply -f embedding-server.yaml
kubectl port-forward svc/embedding-server-service 8080:80
```

**Test**

```bash
curl -X POST http://localhost:8080/embed -d '{"inputs":"The streaming pipeline is finally complete."}'   -H 'Content-Type: application/json'
```

Notice the response:

```terminal

```

---

## 🌊 Step 4: Document Ingestion with NiFi

:warning: **Warning!** First version operation flow is here: [StreamToVLLM.json](https://github.com/cldr-steven-matison/NiFi-Templates).  
{: .notice--warning}


If vLLM is the brain, Apache NiFi is the nervous system. We need to move data from Kafka, chunk it, turn it into vectors, and store it in Qdrant — all in NiFi. 

To make this easy, I've exported the complete NiFi flow as a JSON file: `StreanTovLLM.json`. You can download it and import it directly into your NiFi UI by dragging a new `Process Group` onto the canvas and uploading the flow definition file.

### 🛠️ StreamTovLLM NiFi Flow


The flow processes each document through a "Retrieve-then-Generate" loop:

1.  **ConsumeKafka_2_6**: Ingests raw text from the `new_documents` topic using the `#{Kafka Broker Endpoint}` parameter.
2.  **SplitText**: Chunks the incoming data into **20-line segments** to ensure the context remains efficient for the 3B model.
3.  **ReplaceText (Format for Embedding)**: Wraps the text chunk into the JSON format required by the embedding server: `{"inputs": "$1"}`.
4.  **InvokeHTTP (Embed)**: Calls the `embedding-service` to generate a 768-dimension vector.
5.  **EvaluateJsonPath**: Extracts the resulting vector from the JSON response into a FlowFile attribute named `vector_data`.
6.  **ReplaceText (Format for Qdrant)**: format the body required for Qdrant Upsert.
7.  **InvokeHTTP (Qdrant Upsert)**: The flow upserts the original chunk and its embedding into Qdrant so the system "learns" the document for future queries.
8. **PublishKafkaRecord**: The final response is published to the `streamtovll_results` for evaluation.


:warning: **Danger!** First version operation flow is here: [StreamToVLLM.json](https://github.com/cldr-steven-matison/NiFi-Templates).  I had to create the collection first.  Need to update markdown to include how to open qdrant ui, etc. 
{: .notice--warning}


Start the flow — documents arrving into our topic now stream though NiFi and land in Qdrant and able to be used at context in calls to our vllm service!


---

## 🌊 Step 5: Query Time — Ask Questions!

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

Notice the response:

```terminal

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

## :checkered_flag: The "StreamToVLLM" Takeaway

This project isn't about building a final product; it’s about establishing a foundational dev pipeline that actually works on local hardware. By wiring these components together on an **RTX 4060**, we’ve brought a local GPU for functional development.

* **Foundational RAG Plumbing**: We’ve built the "boring" but essential infrastructure—moving data from a stream, through a vectorizer, and into a searchable brain—all within a single Minikube cluster.
* **The Power of Context**: By chunking and embedding our own data, we’ve moved the LLM from "guessing" to "referencing." We aren't just asking Qwen to be smart; we’re giving it an open-book exam using the specific context we’ve provided.
* **Unlocking the Sandbox**: The real win here isn't the chatbot—it's the capability. Now that the pipeline exists, you can swap models, change embedding strategies, or pipe in entirely different data sources (Git, Jira, Slack) to see how they interact with local inference. 
* **Zero-Cost Iteration**: Because this is 100% local, we can break things, re-index the collection, and run 1,000 test queries in iterations.

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
