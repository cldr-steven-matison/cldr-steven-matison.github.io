---
title:  "Installing Cloudera CFM Kubernetes Operator"
header:
  teaser: "/assets/images/kubernetes-logo.png"
categories: 
  - blog
tags:
  - kubernetes 
  - operator
  - cfm
---

Last week I had a chance to work out the installation of the Cloudera's CFM Operator.  In this post I am going to expose the lessons learned and command required to get this CFM Operator running on my macbook with [MiniKube](https://minikube.sigs.k8s.io/docs/start/).  Keep in mind, these Operators are GA for RedHat Openshift. This demonstration on how to locally install is for evaluation purposes and not meant for actual usage.

<figure>
  <img src="/assets/images/cfm-op-deployment-architecture.jpg">
  <figcaption>CFM Deployment Architecture</figcaption>
</figure>


First, lets start with the main page for the CFM Operator:

[CFM Operator 2.8](https://docs.cloudera.com/cfm-operator/2.8.0/index.html)

Next lets take a look at some requirements:

  1. Install Docker
  2. Install MiniKube
  3. Install Helm
  4. Install cfmctl

Now, onto the installation pages for detailed steps and instructions:

  1. [Installing CFM Operator](https://docs.cloudera.com/cfm-operator/2.8.0/installation/topics/cfm-op-install-overview.html)
  2. [Installing Apache Nifi](https://docs.cloudera.com/cfm-operator/2.8.0/nifi-deployment-configuration/topics/cfm-op-deploy-nifi-cluster.html)
  3. [Installing Apache NiFi Registry](https://docs.cloudera.com/cfm-operator/2.8.0/registry-deployment-configuration/topics/cfm-op-nifi-registry-deployment.html)


All the commands for this learning session are as follows:


```ruby
minikube start
helm install \\
  cert-manager jetstack/cert-manager \\
  --namespace cert-manager \\
  --create-namespace \\
  --version v1.15.2 \\
  --set crds.enabled=true
kubectl create namespace cfm-operator-system
kubectl create secret docker-registry docker-pull-secret \\
  --namespace cfm-operator-system \\
  --docker-server container.repository.cloudera.com \\
  --docker-username [License Username] \\
  --docker-password [License Password]
./cfmctl install --license ./license.txt --image-repository "container.repository.cloudera.com/cloudera/cfm-operator" --image-tag "2.8.0-b94" --namespace cfm-operator-system
kubectl create namespace cfm-operator-cluster
kubectl create secret docker-registry docker-pull-secret \\
  --namespace cfm-operator-cluster \\
  --docker-server container.repository.cloudera.com \\
  --docker-username [License Username] \\
  --docker-password [License Password]
kubectl apply -f nifi.yaml --namespace cfm-operator-cluster
```

The source of my nifi.yaml:

```ruby
apiVersion: cfm.cloudera.com/v1alpha1
kind: Nifi
metadata:
  name: mynifi
spec:
  replicas: 1
  image:
    repository: container.repository.cloudera.com/cloudera/cfm-nifi-k8s
    tag: 2.8.0-b94-nifi_1.25.0.2.3.13.0-36
    pullSecret: docker-pull-secret
  tiniImage:
    repository: container.repository.cloudera.com/cloudera/cfm-tini
    tag: 2.8.0-b94
    pullSecret: docker-pull-secret
  hostName: mynifi.localhost
  uiConnection:
    type: Ingress
  configOverride:
    nifiProperties:
      upsert:
        nifi.cluster.leader.election.implementation: "KubernetesLeaderElectionManager"
    authorizers: |
      <authorizers>
        <authorizer>
          <identifier>single-user-authorizer</identifier>
          <class>org.apache.nifi.authorization.single.user.SingleUserAuthorizer</class>
        </authorizer>
      </authorizers>
    loginIdentityProviders: |
      <loginIdentityProviders>
        <provider>
          <identifier>single-user-provider</identifier>
          <class>org.apache.nifi.authentication.single.user.SingleUserLoginIdentityProvider</class>
          <property name="Username">admin</property>
          <property name="Password">$2b$10$GRa8g9Z5rBENXPFNHFBosev9XmY6CSk0SdcBi5sQMRX92KD73asGG</property>
        </provider>
      </loginIdentityProviders>
  stateManagement:
   clusterProvider:
     id: kubernetes-provider
     class: org.apache.nifi.kubernetes.state.provider.KubernetesConfigMapStateProvider

```

Check out some commands I needed to see what was happening during install:

```ruby
kubectl get pods --all-namespaces
kubectl get pods --all-namespaces -o wide
kubectl describe pod mynifi-0 -n cfm-operator-cluster
kubectl logs -n cfm-operator-system cfm-operator-664598bf69-rm2lx
kubectl get events -n cfm-operator
kubectl get events -n cfm-operator-system
kubectl get events -n cfm-operator-cluster
kubectl get secrets -n cfm-operator-system
```

Things to watch out for:

1. When copy/pasting commands make sure you fix return lines and \\ syntax.
2. Be sure to get your correct License Username and Password with proper entitlements for these operators.
3. Allocate enough resources for your kubernetes cluster in docker. Recommend 16gb or more memory.
4. Ensure you have created the docker secret in both the operator and cluster namespaces.

And last but not least, my full kubernetes cluster after install:

<figure>
  <img src="/assets/images/cfm-kubectl-get-pods.png">
  <figcaption>CFM Operator and NiFi Deployment</figcaption>
</figure>


If you are interested in getting your hands on the NiFi Operators you can find more about Cloudera DataFlow starting right [here](https://www.cloudera.com/products/dataflow.html).

