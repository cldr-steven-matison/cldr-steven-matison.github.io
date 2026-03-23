---
title: "Managing Multiple Services and Port-Forwards Efficiently in Minikube"
excerpt: "Stop drowning in open terminal tabs just to access your UIs. This guide shows you how to streamline your Cloudera Streaming Operators workflow by managing multiple Minikube services and port-forwards simultaneously using background execution and automation scripts."
header:
  teaser: "/assets/images/2026-03-23-minikube-services.png"
categories: 
  - blog
tags:
  - cloudera
  - minikube
  - kubernetes
author: "Steven Matison"
---


Running tons of `kubectl port-forward` or `minikube service` commands manually gets painful fast (one terminal per forward, easy to lose, conflicts, etc.). Here are practical ways to handle many at once without going insane.


## **Use Minikube Service List**
Before you start working with services, it is helpful to see the state of all your services in one view. You don't need to run a command for each just to check the status:

```terminal
minikube service list --namespace cld-streaming
```

Notice the following output:

```terminal
┌───────────────┬────────────────────────────────┬──────────────────┬─────┐
│   NAMESPACE   │              NAME              │   TARGET PORT    │ URL │
├───────────────┼────────────────────────────────┼──────────────────┼─────┤
│ cld-streaming │ cloudera-surveyor-service      │ http/8080        │     │
│ cld-streaming │ flink-operator-webhook-service │ No node port     │     │
│ cld-streaming │ my-cluster-kafka-bootstrap     │ No node port     │     │
│ cld-streaming │ my-cluster-kafka-brokers       │ No node port     │     │
│ cld-streaming │ schema-registry-service        │ application/9090 │     │
│ cld-streaming │ ssb-mve                        │ No node port     │     │
│ cld-streaming │ ssb-postgresql                 │ No node port     │     │
│ cld-streaming │ ssb-session-admin              │ No node port     │     │
│ cld-streaming │ ssb-session-admin-rest         │ No node port     │     │
│ cld-streaming │ ssb-sse                        │ No node port     │     │
└───────────────┴────────────────────────────────┴──────────────────┴─────┘
```

This generates a clean table showing the current running services.


## **Run In Background With &** 

   For `minikube service`:

   ```bash
minikube service cloudera-surveyor-service -n cld-streaming --url &
minikube service schema-registry-service -n cld-streaming --url & minikube service ssb-sse -n cld-streaming --url &
   ```
   - use `&` to chain multiple commands
   - use `&` on end to run in the background
   - use `--url` to just return the url w/o opening the browser


   For `kubectl port-forward`:

   ```bash
   kubectl port-forward svc/qdrant 6333:6333 &
   kubectl port-forward svc/vllm-service 8000:8000 &
   kubectl port-forward svc/embedding-service 8080:8080 &
   kubectl port-forward svc/mynifi-web 8443:443 &
   ```
   - Add `disown` after each to detach completely: `& disown`
   - Check running: `ps aux | grep port-forward`
   - Kill: `pkill -f "port-forward.*qdrant"` (or by PID)


## **Use Bash Scripts**  

  Create a file like `minikube-services.sh`:

```bash
#!/usr/bin/env bash

# List your services here
SERVICES=(
  "cloudera-surveyor-service"
  "schema-registry-service"
  "ssb-sse"
)
NAMESPACE="cld-streaming"

case $1 in
  start)
    for svc in "${SERVICES[@]}"; do
      # Use --url to prevent browser pop-up spam if preferred
      minikube service $svc --namespace $NAMESPACE & 
      echo "Starting tunnel for: $svc"
    done
    ;;
  stop)
    echo "Stopping all minikube service tunnels..."
    pkill -f "minikube service"
    ;;
  list)
    minikube service list -n $NAMESPACE
    ;;
  *)
    echo "Usage: ./streaming-ui.sh {start|stop|list}"
    ;;
esac
```

Then: `./minikube-services.sh start` / `stop` / `status`

Create a file like `port-forwards.sh`:

```bash
   #!/usr/bin/env bash
   forwards=(
     "svc/qdrant 6333:6333"
     "svc/vllm-service 8000:8000"
     "svc/embedding-service 8080:8080"
     "svc/mynifi-web 8443:443"
     # add more
   )

   case $1 in
     start)
       for f in "${forwards[@]}"; do
         kubectl port-forward $f &> /dev/null &
         echo "Started: $f"
       done
       ;;
     stop)
       pkill -f "kubectl port-forward"
       ;;
     status)
       ps aux | grep port-forward | grep -v grep
       ;;
   esac
```

Then: `./port-forwards.sh start` / `stop` / `status`


---

## **Summary: Choosing the Right Method**
While both minikube service and kubectl port-forward allow you to access your cluster, they serve slightly different purposes in a development workflow:

 * Use `minikube service` when you need to access Web UIs (like the Cloudera Surveyor or SSB) and want Minikube to automatically handle the URL generation. Use the `--url` flag to keep your terminal clean and prevent excessive browser pop-ups.

 * Use `kubectl port-forward` for more granular control, such as connecting to specific databases (Qdrant) or backend APIs (vLLM) on static local ports.

 * Use Scripts once your stack grows beyond two or three services. Automating the start, stop, and status of your tunnels ensures your local environment remains performant and organized.

By moving these processes to the background, you can keep your focus on developing your streaming applications rather than managing network plumbing.

___

## **{{ page.title }}**

If you have any questions about the integration between these components or you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further please reach out to schedule a discussion.