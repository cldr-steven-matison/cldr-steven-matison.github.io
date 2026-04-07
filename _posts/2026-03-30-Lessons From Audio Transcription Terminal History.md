---
title:  "Lessons Learned Audio Transcription Terminal History"
date: 2026-03-30
last_modified_at: 2026-03-30
excerpt: "Terminal History to go along with Audio Transcription RAG post."
header:
  teaser: "/assets/images/2026-03-30-StreamToWhisper-lessons.png"
categories: 
  - blog
tags:
  - cloudera  
  - operator  
  - nifi  
  - kafka  
  - whisper  
  - vllm  
  - rag  
  - gpu

---

This post is comprised of the backing lessons from [Insanely Fast Audio Transcription with Cloudera Streaming Operators](/blog/Audio-Transcription-with-Cloudera-Streaming-Operators/) with a [summary of the hurdles](), a [log of the terminal commands], [terminal output 1]() [terminal output 2](), and [terminal output 3]().  



## Terminal History

```terminal
mkdir whisper
cd whisper
nano Dockerfile.whisper
docker build -t streamwhisper:latest -f Dockerfile.whisper .
nano Dockerfile.whisper.2
docker build -t streamwhisper:latest -f Dockerfile.whisper.2 .
nano Dockerfile.whisper.3
docker build -t streamwhisper:latest -f Dockerfile.whisper.3 .
nano Dockerfile.whisper.4
docker build -t streamwhisper:latest -f Dockerfile.whisper.4 .
nano Dockerfile.whisper.5
docker build -t streamwhisper:latest -f Dockerfile.whisper.5 .
nano Dockerfile.whisper.6
docker build -t streamwhisper:latest -f Dockerfile.whisper.6 .
nano Dockerfile.whisper.7
docker build -t streamwhisper:latest -f Dockerfile.whisper.7 .
nano Dockerfile.whisper.8
docker build -t streamwhisper:latest -f Dockerfile.whisper.8 .
nano Dockerfile.whisper.9
docker build -t streamwhisper:latest -f Dockerfile.whisper.9 .
nano Dockerfile.whisper.10
docker build -t streamwhisper:latest -f Dockerfile.whisper.10 .
nano Dockerfile.whisper.11
docker build -t streamwhisper:latest -f Dockerfile.whisper.11 .
nano Dockerfile.whisper.12
docker build -t streamwhisper:latest -f Dockerfile.whisper.12 .
export MY_TOKEN=$(kubectl get secret hf-token -o jsonpath='{.data.token}' | base64 --decode)
docker build -t streamwhisper:latest --build-arg HF_TOKEN=$MY_TOKEN -f Dockerfile.whisper.12 .
minikube service whisper-server-service --url
curl -X POST http://whisper-server-service:8001/transcribe   -H "Content-Type: multipart/form-data"   -F "file=@test-speech.wav"
curl -X POST http://127.0.0.1:8001/transcribe   -H "Content-Type: multipart/form-data"   -F "file=@test-speech.wav"
wget -O test-speech.wav https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/samples/cpp/windows/console/samples/whatstheweatherlike.wav
curl -X POST http://127.0.0.1:8001/transcribe   -H "Content-Type: multipart/form-data"   -F "file=@test-speech.wav"
nano whisper-server.yaml
kubectl apply -f whisper-server.yaml
kubectl describe pod whisper-server-779f955f5c-j2vr7
kubectl delete -f whisper-server.yaml
kubectl apply -f whisper-server.yaml
kubectl delete -f vllm-qwen.yaml
kubectl delete -f whisper-server.yaml
kubectl apply -f whisper-server.yaml
kubectl describe pod whisper-server-6486568f56-xrcg2
kubectl rollout restart deployment whisper-server
kubectl describe pod whisper-server-6486568f56-xrcg2
kubectl logs whisper-server-6486568f56-xrcg2
kubectl delete -f whisper-server.yaml
kubectl apply -f whisper-server.yaml
kubectl logs whisper-server-6486568f56-gzvqs
kubectl delete -f whisper-server.yaml
kubectl apply -f whisper-server.yaml
kubectl delete -f whisper-server.yaml
kubectl apply -f whisper-server.yaml
kubectl delete -f whisper-server.yaml
kubectl apply -f whisper-server.yaml
kubectl logs whisper-server-6486568f56-bbz6z
kubectl delete -f whisper-server.yaml
export MY_TOKEN=$(kubectl get secret hf-token -o jsonpath='{.data.token}' | base64 --decode)
kubectl rollout restart deployment whisper-server
kubectl apply -f whisper-server.yaml
kubectl port-forward deployment/whisper-server 8001:8001
kubectl delete -f whisper-server.yaml
kubectl port-forward deployment/whisper-server 8001:8001
kubectl port-forward deployment/whisper-server 8001:8001 -n cfm-streaming
kubectl apply -f whisper-server.yaml
kubectl delete -f whisper-server.yaml
kubectl apply -f whisper-server.yaml
kubectl port-forward deployment/whisper-server 8001:8001 -n cfm-streaming
kubectl port-forward deployment/whisper-server 8001:8001
kubectl delete -f whisper-server.yaml
kubectl apply -f whisper-server.yaml
kubectl delete -f whisper-server.yaml
kubectl exec -it mynifi-0 -n cfm-streaming -- curl -s -o /dev/null -w "%{http_code}" http://whisper-server-service.default.svc.cluster.local:8001/transcribe
kubectl apply -f vllm-qwen.yaml

```