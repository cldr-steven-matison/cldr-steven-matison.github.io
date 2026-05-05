---
title:  "Persisting Schema Registry with PostgreSQL"
excerpt: "Learn how to use CSA Operator's PostgreSQL pod to persist schemas in the Schema Registry."
header:
  teaser: "/assets/images/2026-05-04-Schema_Registry_PostgreSQL.png"
categories: 
  - blog
tags:
  - cloudera
  - kafka
  - schema registry
  - operator
---

If you deploy the Cloudera Schema Registry using the default Helm values, it uses an `in-memory` database. This means that if your pod crashes or restarts (e.g., from an Out of Memory error), all of your registered schemas instantly vanish. 

To make your schemas immortal, we need a persistent backend. While you could spin up a dedicated database, a much more efficient approach for this lab is to piggyback on the PostgreSQL instance already running for SQL Stream Builder (SSB).

Here is how to create a dedicated user and database for Schema Registry inside the existing SSB Postgres pod.

## Setup the Database and User

First, find the name of your SSB Postgres pod:
```bash
kubectl get pods -n cld-streaming | grep postgres
```

Next, execute into the pod to create the database, create a dedicated `registry` user, and grant the proper ownership. *(Replace `<ssb-postgresql-pod-name>` with your actual pod name)*:

```bash
# Create the database
kubectl exec -it <ssb-postgresql-pod-name> -n cld-streaming -- psql -U postgres -c "CREATE DATABASE registry;"

# Create the dedicated user
kubectl exec -it <ssb-postgresql-pod-name> -n cld-streaming -- psql -U postgres -c "CREATE USER registry WITH PASSWORD 'cloudera';"

# Grant ownership to the new user
kubectl exec -it <ssb-postgresql-pod-name> -n cld-streaming -- psql -U postgres -c "ALTER DATABASE registry OWNER TO registry;"
```

## Create the Kubernetes Secret

The Schema Registry Helm chart strictly requires passwords to be passed via a Kubernetes Secret. Run this command to store our password:

```bash
kubectl create secret generic sr-db-pass \
  --from-literal=password=cloudera \
  --namespace cld-streaming
```

## Full Helm Values Configuration

Create a file named `sr-values-postgres.yaml` with the full configuration. This disables TLS/OAuth for the lab, sets up the PostgreSQL connection using the secret we just created, and adds resource limits to prevent OOM restarts.

```yaml
tls:
  enabled: false
authentication:
  oauth:
    enabled: false
authorization:
  simple:
    enabled: false
database:
  type: postgresql
  jdbcUrl: "jdbc:postgresql://ssb-postgresql.cld-streaming.svc:5432/registry"
  username: "registry"
  password:
    secretKeyRef:
      name: "sr-db-pass"
      key: "password"
service:
  type: NodePort
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

## Install and Verify

Now, run the full Helm install command to deploy Schema Registry with your new configuration:

```bash
helm install schema-registry \
--namespace cld-streaming \
--version 1.6.0-b99 \
--values sr-values-postgres.yaml \
--set "image.imagePullSecrets[0].name=cloudera-creds" \
oci://container.repository.cloudera.com/cloudera-helm/csm-operator/schema-registry 
```

Check the status of your pods to ensure they initialize successfully. The init container will authenticate as the new `registry` user and permanently persist your schemas!

```bash
kubectl get pods -l app=schema-registry -n cld-streaming -w
```

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.