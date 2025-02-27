---
title:  "Cloudera Apache NiFi Operator"
header:
  teaser: "/assets/images/kubernetes-logo.png"
categories: 
  - blog
tags:
  - kubernetes 
  - operator
  - nifi
---

:warning: This is a Work In Progress article, be sure to check back again soon if you see this notation. :warning:


In a previous article ([Installing Cloudera CFM Kubernetes Operator](https://cldr-steven-matison.github.io/blog/Install-CFM-Operator/)) I exposed steps necessary to deploy the Cloudera Apache NiFi Operator on MiniKube.  In this article I am going to share some tips and tricks I have learned after completing this install in Openshift, Rancher, and recently EKS.

<figure>
  <img src="/assets/images/cfm-op-deployment-architecture.jpg">
  <figcaption>CFM Deployment Architecture</figcaption>
</figure>


First, lets start with the most recent version of the documenation for the Cloudera Apache NiFi Operator:

[CFM Operator 2.9.1](https://docs.cloudera.com/cfm-operator/2.9.1/index.html)

💡 There are already two new versions since my first article! 💡



# User Authentication

There are several ways that you can role nifi user authentication.  First, no auth at all.  Just access the ui and NiFi is there.  Second, a self generated username and password upon install. Third, provide a kubernetes secret with your desired username and password.  Last but not least, [LDAP](https://docs.cloudera.com/cfm-operator/2.9.1/configure-nifi-cr/topics/cfm-op-config-nifi-ic-ldap.html) which I will cover in a future post specifically.


[Configuring Authentication Docs](https://docs.cloudera.com/cfm-operator/2.9.1/configure-nifi-cr/topics/cfm-op-configure-nifi-auth.html)


In order to secure the login for the NiFi UI, it is required that NiFi installation itself be secured.  Be sure to complete this step w/ your security cert issuer and then provide the correct tag in the nifi yaml.   In this example I am using a self signed cert, which you can find in my YAML repo at the end of this page.

```ruby
kubectl apply -f self-signed-ca-issuer.yaml 
```

```ruby
  security:
    initialAdminIdentity: nifiadmin
    nodeCertGen:
      issuerRef:
        name: self-signed-ca-issuer
        kind: ClusterIssuer
``` 

With the cert applied and referenced in the nifi.yaml, lets take a look at the requirements for enabling authentication methods.


## Auto Generated Password

```ruby
spec:
  security:
    singleUserAuth:
      enabled: true
```

## Provided Credential

```ruby
spec:
  security:
    singleUserAuth:
      enabled: true
      credentialsSecretName: nifi-credential

```

```ruby
kubectl create secret generic nifi-credential --from-literal=username="username" --from-literal=password="123456789101112"
```

💡 It is important to know, if your kubernetes secret is less than 12 characters, it will be ignored and nifi will still role with an auto generated username and password.💡 

# Ingress and uiConnection 

The most important part of the Apache NiFi Operator installation are the steps required to expose the NiFI UI.   

## Route

```ruby
  uiConnection:
    type: Route
    routeConfig:
      tls:
        termination: passthrough

  uiConnection:
    type: Route
    serviceConfig:
      sessionAffinity: ClientIP
    routeConfig:
      tls:
        termination: passthrough
```

## Ingress

```ruby
  uiConnection:
    type: Ingress
    serviceConfig:
      sessionAffinity: ClientIP
```

When using an ingress, there are annotations that may or may not be needed depending on your kubernetes environment

```ruby
uiConnection:
    type: Ingress
    annotations:
      nginx.ingress.kubernetes.io/affinity: cookie
      nginx.ingress.kubernetes.io/affinity-mode: persistent
      nginx.ingress.kubernetes.io/backend-protocol: HTTPS
      nginx.ingress.kubernetes.io/ssl-passthrough: "true"
      nginx.ingress.kubernetes.io/ssl-redirect: "true"
```

##  Service

```ruby
  uiConnection:
    type: Service
```


# When to Delete and Apply

It is important to know when to delete your nifi deployment and apply again for a fresh install.  When doing things like above with authentication and security the initial nifi installation takes different and appropriate paths.   When you change these things, delete nifi, wait for termination to complete, and then apply again in order to take a full fresh install.   Be careful when applying changes and expecting the changed yaml to fully re-install nifi.

# Customizations For NiFi Sizing

When testing deployment processes in a small or limited kubernetes environment, it may be required to provide some limits on the resources nifi needs.  

 ```ruby
resources:
    nifi:
      requests:
        cpu: "1"
        memory: 2Gi
      limits:
        cpu: "4"
        memory: 4Gi
    log:
      requests:
        cpu: 50m
        memory: 128Mi
```

Some important Sizing docs:

[Resource Recommendations](https://docs.cloudera.com/cfm-operator/2.9.1/configure-nifi-cr/topics/cfm-op-configure-nifi-cr-resource.html) and [Configuring Cluster Size](https://docs.cloudera.com/cfm-operator/2.9.1/configure-nifi-cr/topics/cfm-op-configure-nifi-cr-cluster.html)

You can find a full example NiFI chart [here](https://docs.cloudera.com/cfm-operator/2.9.1/configure-nifi-cr/topics/cfm-op-resource-example.html).


If you have gotten this far, then you may want to bookmark the [NiFi Config Reference](https://docs.cloudera.com/cfm-operator/2.9.1/nifi-config-reference/topics/cfm-op-nifi-config-reference.html) and [NiFi Connection Reference](https://docs.cloudera.com/cfm-operator/2.9.1/connection-reference/topics/cfm-op-nifi-connection-reference.html) which outline all of the yaml object types for the Cloudera Apache NiFi Operator.


Check out this repo I created with my sample YAMLs [here](https://github.com/cldr-steven-matison/ClouderaOperatorYAML).


If you are interested in getting your hands on Cloudera's Apache NiFi Operator you can find more right [here](https://www.cloudera.com/products/dataflow.html).  You can also reach out to me directly if you are ready for demos, hands on labs, or licensed trials for your organization.

