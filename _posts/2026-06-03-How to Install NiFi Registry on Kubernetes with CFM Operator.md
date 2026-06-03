---
title:  "How to Install NiFi Registry on Kubernetes with CFM Operator"
excerpt: "A quick how to guide for installing NiFi Registry on minikube with the CFM Operator"
header:
  teaser: "/assets/images/NiFi_Registry_on_Kubernetes.png"
categories: 
  - blog
tags:
  - cloudera
  - nifi
  - nifi registry
  - operator
  - cfm
---

Quick and dirty guide for getting a NiFi Registry up and running on your CFM Operator deployed Kubernetes cluster using the native LoadBalancer route. No extra ingress nonsense, no custom routes—just a clean LoadBalancer service pointed straight at the pod.

This setup is perfect for edge deployments, local dev, or Minikube testing.

---

## 1. Create the Deployment File

Save the following as `nifi-registry.yaml`. It bundles the `NifiRegistry` custom resource **and** the LoadBalancer service in one shot.

```yaml
apiVersion: cfm.cloudera.com/v1alpha1
kind: NifiRegistry
metadata:
  name: nifi-registry-edge
  namespace: cfm-streaming
spec:
  image:
    repository: container.repository.cloudera.com/cloudera/cfm-nifiregistry-k8s
    tag: 3.0.0-b126-nifi_2.6.0.4.3.4.0-234
  tiniImage:
    repository: container.repository.cloudera.com/cloudera/cfm-tini
    tag: 3.0.0-b126
---
apiVersion: v1
kind: Service
metadata:
  name: nifi-registry-edge-svc
  namespace: cfm-streaming
spec:
  type: LoadBalancer
  ports:
    - name: http
      port: 18080
      targetPort: 18080
      protocol: TCP
  selector:
    statefulset.kubernetes.io/pod-name: nifi-registry-edge-0
```

## 2. Apply the Manifest

```bash
kubectl apply -f nifi-registry.yaml
```

## 3. Route the LoadBalancer (Minikube Only)

Minikube needs a little help to assign an external IP. In a **separate terminal**, run:

```bash
minikube tunnel
```

Leave this running in the background.

## 4. Verify External Access

Check the service:

```bash
kubectl get svc nifi-registry-edge-svc -n cfm-streaming
```

**Success criteria:** The `EXTERNAL-IP` column should show `127.0.0.1` (not `<pending>`).

## 5. Access the UI & Initialize the Bucket

Open your browser and go to:

**http://127.0.0.1:18080/nifi-registry/**

You’re in. Create your first bucket and start versioning those flows.

## Resources
* [Cloudera Flow Management (CFM) 3.0 Docs](http://docs.cloudera.com/cfm-operator/3.0.0/index.html)
* [Cloudera Streaming Operators GitHub Repo](https://github.com/cldr-steven-matison/ClouderaStreamingOperators)
* [Cloudera Streaming Operators Blog](https://cldr-steven-matison.github.io/blog/Cloudera-Streaming-Operators/)

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.