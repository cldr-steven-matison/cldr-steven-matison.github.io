---
title:  "Cloudera Streams Messaging - Schema Registry"
header:
  teaser: "/assets/images/schemaregistry.png"
categories: 
  - blog
tags:
  - csm
  - schema
  - registry
  - cloudera
---

# How to get to Schema Registry UI with Cloudera Streams Messaging Operator 1.6

In this quick blog post I am going to show you how to install the CSM Operator's Schema Registry and expost the UI using my macbook and minikube.

First, lets skip the "hard install" [docs](https://docs.cloudera.com/csm-operator/1.6/installation/topics/csm-op-install-schema-registry-overview.html#ariaid-title2), and work with the basic evaluation [docs](https://docs.cloudera.com/csm-operator/1.6/installation/topics/csm-op-install-schema-registry-overview.html#ariaid-title3).  I just want to evaluate that this works and that I can get to and see the Schema Registry UI.  

We will need the following contents for sr-values.yaml:

```ruby
tls:
  enabled: false

authentication:
  oauth:
    enabled: false

authorization:
  simple:
    enabled: false

database:
  type: in-memory

service:
  type: NodePort
````

Having been through some of the troubles exposing UIs previouly, I was very happy to find minikube making exposing the service with NodePort easy.  In the docs you will find this command:

---
```ruby
kubectl get service schema-registry-service --namespace csm-operator
```

I was even happier for AI to share with me this command:

```ruby
minikube service schema-registry-service --namespace csm-operator
```

which swiftly moved me from terminal to the UI:

<img src="{{ site.url }}{{ site.baseurl }}/assets/images/schemaregistry.png" alt="">

You can still do port forward too:

```ruby
kubectl port-forward service/schema-registry-service 9090:9090 --namespace csm-operator
```

> **Note:** Check out my full command stream for the session above:

**Watch out!** Be careful with upstream documentation copy paste code boxes with \\\\ and return lines they will often times mess you up.
{: .notice--warning}


```ruby
minikube start
minikube addons enable ingress
helm registry login container.repository.cloudera.com\
kubectl create secret docker-registry docker-pull-secret \\n --namespace "csm-operator" \\n --docker-server "container.repository.cloudera.com" \\n --docker-username "username" \\n --docker-password "password"
kubectl create secret docker-registry docker-pull-secret --namespace "csm-operator" --docker-server "container.repository.cloudera.com" --docker-username "username" --docker-password "password"
cp path/to/my_license.txt ./license.txt
helm install strimzi-cluster-operator --namespace csm-operator --set 'image.imagePullSecrets[0].name=docker-pull-secret' --set-file clouderaLicense.fileContent=./license.txt --set watchAnyNamespace=true oci://container.repository.cloudera.com/cloudera-helm/csm-operator/strimzi-kafka-operator --version 1.6.0-b99
kubectl get deployments --namespace csm-operator
kubectl get pods --namespace csm-operator
nano sr-values.yaml
kubectl get pods --namespace csm-operator
kubectl get deployments --namespace csm-operator
kubectl get kafka -n csm-operator
helm install schema-registry \\
  --namespace csm-operator \\
  --values sr-values.yaml \\
  --set 'image.imagePullSecrets[0].name=docker-pull-secret' \\
  oci://container.repository.cloudera.com/cloudera-helm/csm-operator/schema-registry \\
  --version 1.6.0-b99
kubectl get deployments --namespace csm-operator
kubectl get service schema-registry-service --namespace csm-operator
minikube service schema-registry-service --namespace csm-operator
```

As always, check out the entire [DOCS](https://docs.cloudera.com/csm-operator/1.6/index.html) for the CSM Operator.

If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about Cloudera Streams Messaging Operator please reach out to schedule a discussion.