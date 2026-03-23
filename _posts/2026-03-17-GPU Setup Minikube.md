---
title: "GPU-Accelerated Kubernetes: Setting up NVIDIA on Minikube"
excerpt: "Stop fighting the drivers and start shipping AI. A step-by-step guide to exposing your RTX 40-series GPU to Minikube using WSL2 and Docker."
header:
  teaser: "/assets/images/2026-03-17-minikube-gpu-setup.png"
categories: 
  - blog
tags:
  - minikube
  - kubernetes
  - nvidia
  - ai
author: "Steven Matison"
---

If you’ve ever tried to get a GPU working inside a local Kubernetes cluster on Windows, you know the "Driver Dance" is real. 💃 But with **WSL2**, **Docker Desktop**, and a **GEEKOM G1 (RTX 4060)**, we can finally bridge the gap between local development and production-grade AI inference.

This post covers the exact path I took to get `nvidia-smi` results inside a Minikube pod—saving you the headache of trial and error.

---

## 🛠️ Step 1: The Pre-Flight Checklist
Before we even touch Kubernetes, your underlying Windows and WSL2 layers must be solid. If the host can't see the GPU, the cluster won't stand a chance.

* **NVIDIA Drivers:** Ensure you have the latest Game Ready or Studio drivers (550+ series) installed on Windows.
* **WSL2 Backend:** In Docker Desktop Settings, ensure **"Use the WSL 2 based engine"** is checked.
* **NVIDIA Container Toolkit:** This is the most critical piece. Run these commands inside your **WSL Ubuntu terminal** to allow Docker to pass GPU instructions through to the hardware.

```bash
# Install the toolkit in WSL Ubuntu
curl -fsSL [https://nvidia.github.io/libnvidia-container/gpgkey](https://nvidia.github.io/libnvidia-container/gpgkey) | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L [https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list](https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list) | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

{: .notice--success}
**ProTip:** Test plain Docker GPU access first! Run `docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi`. If this doesn't show your RTX 4060, do not proceed to Minikube—reboot Windows and check your drivers.

---

## 🚀 Step 2: Launching Minikube with the "Secret Sauce"
Standard `minikube start` commands often fail to map the WSL libraries correctly. To make this work, we need to explicitly mount the WSL driver path into the Minikube node.

**The Working Pattern:**

```bash
# 1. Start fresh
minikube delete

# 2. Launch with the critical WSL mount flags
minikube start \
  --driver=docker \
  --container-runtime=docker \
  --gpus=all \
  --mount \
  --mount-string="/usr/lib/wsl:/usr/lib/wsl" \
  --force-systemd=true \
  --extra-config=kubelet.cgroup-driver=systemd \
  --cpus=6 \
  --memory=16384

# 3. Enable the device plugin
minikube addons enable nvidia-device-plugin
```

{: .notice--info}
**ProTip:** The `--mount-string="/usr/lib/wsl:/usr/lib/wsl"` flag is the "magic" that allows the inner cluster to see the NVIDIA libraries provided by WSL2.

---

## ✅ Step 3: Verification
Once the cluster is up, we need to verify that Kubernetes recognizes the GPU as an allocatable resource.

### Check Node Capacity
```bash
kubectl describe node minikube | grep -A 5 [nvidia.com/gpu](https://nvidia.com/gpu)
```
You should see `nvidia.com/gpu: 1` under both **Capacity** and **Allocatable**.

### The Ultimate Test: `nvidia-smi` inside a Pod
Run this one-liner to spin up a temporary CUDA container and check the hardware visibility:

```bash
kubectl run gpu-test --rm -it --restart=Never \
  --image=nvidia/cuda:12.4.0-base-ubuntu22.04 \
  --overrides='{"spec":{"containers":[{"name":"gpu-test","resources":{"limits":{"[nvidia.com/gpu](https://nvidia.com/gpu)":"1"}}}]}}' \
  -- nvidia-smi
```

If you see the glorious ASCII table showing your **RTX 4060**, you are officially ready to run local LLMs! 🎊

---

## 🛑 Troubleshooting
If your pod stays in `Pending` with an `Insufficient gpu` error:
1.  **Check Plugin Logs:** `kubectl -n kube-system logs -l name=nvidia-device-plugin-daemonset`
2.  **Resource Limits:** Ensure your pod YAML explicitly requests `nvidia.com/gpu: 1`. Without this, K8s won't inject the drivers into the container.

---

## 💻 Terminal Commands for this Session


```terminal
# Initial Setup
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey   | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list   | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g'   | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo apt install unzip
wget https://github.com/derailed/k9s/releases/latest/download/k9s_Linux_amd64.deb
sudo apt install ./k9s_Linux_amd64.deb
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

#some docker stuff
sudo usermod -aG docker $USER
newgrp docker
docker run --rm hello-world
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi
docker rm -f $(docker ps -aq) 2>/dev/null

#minikube commands
minikube start --driver=docker --container-runtime=docker --gpus=all --mount --mount-string="/usr/lib/wsl:/usr/lib/wsl" --force-systemd=true --extra-config=kubelet.cgroup-driver=systemd --cpus=6 --memory=16384

minikube addons enable metrics-server
minikube addons enable nvidia-device-plugin
minikube ip
minikube tunnel
minikube delete

# Iterations Testing to Operational GPU

minikube start   --driver=docker   --container-runtime=docker   --gpus=all   --force-systemd=true   --feature-gates=DevicePlugins=true   --extra-config=kubelet.feature-gates=DevicePlugins=true   --cpus=6   --memory=16384

kubectl describe node | grep -i nvidia

minikube stop
minikube delete --all --purge
sudo rm -rf ~/.minikube
sudo rm -rf /var/lib/minikube
docker rm -f $(docker ps -aq) 2>/dev/null
docker rmi -f $(docker images -q) 2>/dev/null

minikube start   --driver=docker   --container-runtime=docker   --gpus=all   --force-systemd=true   --extra-config=kubelet.cgroup-driver=systemd   --feature-gates=DevicePlugins=true   --extra-config=kubelet.feature-gates=DevicePlugins=true   --cpus=6   --memory=16384

minikube stop
minikube delete --all --purge
sudo rm -rf ~/.minikube
sudo rm -rf /var/lib/minikube
docker rm -f $(docker ps -aq) 2>/dev/null
docker rmi -f $(docker images -q) 2>/dev/null

minikube start   --driver=docker   --container-runtime=docker   --gpus=all   --force-systemd=true   --extra-config=kubelet.cgroup-driver=systemd   --cpus=6   --memory=16384

kubectl describe node | grep -i nvidia
docker inspect minikube | grep -i runtime
docker rm -f $(docker ps -aq) 2>/dev/null
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi
docker exec -it minikube nvidia-smi

sudo apt install jq
kubectl get node minikube -o jsonpath='{.status.capacity}' | jq '."nvidia.com/gpu"'
kubectl describe node minikube | grep -A 10 -E 'Capacity:|Allocatable:|nvidia.com/gpu'

# this was obviously needed
minikube addons enable nvidia-device-plugin

kubectl get node minikube -o jsonpath='{.status.capacity}' | jq '."nvidia.com/gpu"'
kubectl describe node minikube | grep -A 5 nvidia.com/gpu
kubectl run gpu-test --rm -it --restart=Never   --image=nvidia/cuda:12.4.0-base-ubuntu22.04   --limits=nvidia.com/gpu=1   -- nvidia-smi
kubectl run gpu-test --rm -it --restart=Never   --image=nvidia/cuda:12.4.0-base-ubuntu22.04   --overrides='{"apiVersion":"v1","spec":{"containers":[{"name":"gpu-test","image":"nvidia/cuda:12.4.0-base-ubuntu22.04","resources":{"limits":{"nvidia.com/gpu":1}},"command":["nvidia-smi"]}]}}'
kubectl run gpu-visual --rm -it --restart=Never   --image=ghcr.io/rapidsai/gpu-ascii-mandelbrot:cuda12.2   --overrides='{"apiVersion":"v1","spec":{"containers":[{"name":"gpu-visual","image":"ghcr.io/rapidsai/gpu-ascii-mandelbrot:cuda12.2","resources":{"limits":{"nvidia.com/gpu":1}}}]}}'
kubectl run gpu-visual --rm -it --restart=Never   --image=ghcr.io/rapidsai/gpu-ascii-mandelbrot:cuda12.2   --overrides='{
      "apiVersion":"v1",
      "spec":{
        "containers":[{
          "name":"gpu-visual",
          "image":"ghcr.io/rapidsai/gpu-ascii-mandelbrot:cuda12.2",
          "resources":{"limits":{"nvidia.com/gpu":1}},
          "command":["bash","-c","/app/mandelbrot && sleep 5"]
        }]
      }
    }'
kubectl run gpu-top --restart=Never -it   --image=nvidia/cuda:12.4.0-base-ubuntu22.04   --overrides='{"apiVersion":"v1","spec":{"containers":[{"name":"gpu-top","image":"nvidia/cuda:12.4.0-base-ubuntu22.04","resources":{"limits":{"nvidia.com/gpu":1}},"command":["bash","-c","watch -n 1 nvidia-smi"]}]}}'
 
kubectl run gpu-test --rm -it --image=nvcr.io/nvidia/cuda:12.6.0-base-ubuntu22.04 --limits=nvidia.com/gpu=1 -- nvidia-smi
kubectl run gpu-test --rm -it --image=nvcr.io/nvidia/cuda:12.6.0-base-ubuntu22.04 --overrides='{"spec": {"containers": [{"name": "gpu-test", "resources": {"limits": {"nvidia.com/gpu": "1"}}}]}' -- nvidia-smi
docker run --rm --gpus all nvcr.io/nvidia/cuda:12.0.0-base-ubuntu22.04 nvidia-smi
kubectl run gpu-smi --rm -it --image=nvcr.io/nvidia/cuda:12.0.0-base-ubuntu22.04 --overrides='{"spec":{"containers":[{"name":"gpu-smi","resources":{"limits":{"nvidia.com/gpu":1}}}]}' -- nvidia-smi

docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi
docker exec -it minikube nvidia-smi
 
kubectl get node minikube -o jsonpath='{.status.capacity}' | jq '."nvidia.com/gpu"'
kubectl describe node minikube | grep -A 5 nvidia.com/gpu
```

---

## Questions?
Getting GPU passthrough to work is the "final boss" of local Kubernetes setup. If you're stuck or want to see how we use this for real-time NiFi AI pipelines, please reach out to schedule a discussion!