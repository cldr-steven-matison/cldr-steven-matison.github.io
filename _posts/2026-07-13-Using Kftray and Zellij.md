---
title: "Using Kftray and Zellij"
excerpt: "Two small tools that make working against a Kubernetes cluster feel less like a chore — kftray for reusable port-forward configs, and Zellij for pinning every long-running dev command into one terminal workspace."
header:
  teaser: "/assets/images/SRM.png"
categories:
  - blog
tags:
  - kftray
  - zellij
  - kubernetes
---


If you spend any real time developing against a Kubernetes cluster — minikube on your laptop, a shared dev cluster, whatever — you end up with the same painful pattern: five terminal tabs, each holding a `kubectl port-forward`, a `minikube tunnel`, or a `minikube service` command that has to stay running for the day to make sense. Close the wrong tab and half your app stops working.

This post covers two small tools I keep coming back to that make that dance a lot less annoying. **Kftray** turns port-forwards into named, saved configs you can start and stop like services. **Zellij** is a Rust-based terminal multiplexer with layouts — a single command spins up every long-running process you need, in the right panes, at the right time. Together they replace the "wall of tabs" I used to keep open when working against my Cloudera Streaming Operators stack on minikube.

## Kftray

kftray Graphical UI to start/stop multiple saved port forward configs.
 
 - https://kftray.app/downloads
 - https://kftray.app/docs/getting-started/quick-start


Create the config `~/.config/kftray/config.json`:

```bash
[
  {
    "alias": "kafka",
    "context": "my-cluster",
    "namespace": "cld-streaming",
    "workload_type": "service",
    "service": "my-cluster-kafka-bootstrap",
    "protocol": "tcp",
    "local_port": 9092,
    "remote_port": 9092,
    "local_address": "0.0.0.0"
  },
  {
    "alias": "web-efm",
    "context": "my-cluster",
    "namespace": "cld-streaming",
    "workload_type": "service",
    "service": "efm",
    "protocol": "tcp",
    "local_port": 10090,
    "remote_port": 10090,
    "local_address": "0.0.0.0"
  }
]
```

Run it with this:

```bash
kftui
```

## Zellij

Zellij is a modern, Rust-based terminal workspace and multiplexer. 

- https://zellij.dev/about/
- https://zellij.dev/documentation/

Create the layout: `~/.config/zellij/layout/kube-service-ports-mac-cso-observability.kdl`

```bash
layout {
    split_direction "Horizontal"

    pane {
        command "/opt/homebrew/bin/minikube"
        args "mount" "/Users/steven.matison/Documents/GitHub/NiFi2 Processor Playground/nifi-custom-processors/:/extensions" "--uid" "10001" "--gid" "10001"
    }

    pane {
        command "bash"
        args "-lc" "sudo /opt/homebrew/bin/minikube tunnel"
    }

    pane {
        command "/opt/homebrew/bin/minikube"
        args "service" "efm" "-n" "cld-streaming"
    }

    pane {
        command "/opt/homebrew/bin/minikube"
        args "service" "cloudera-surveyor-service" "--namespace" "cld-streaming"
    }

    pane {
        command "/opt/homebrew/bin/minikube"
        args "service" "prometheus-grafana" "--namespace" "cld-streaming"
    }

    pane {
        command "/usr/local/bin/kubectl"
        args "port-forward" "--address" "0.0.0.0" "service/my-cluster-kafka-bootstrap" "9092:9092" "-n" "cld-streaming"
    }

    pane {
        command "/usr/local/bin/kubectl"
        args "port-forward" "--address" "0.0.0.0" "service/efm" "10090:10090" "-n" "cld-streaming"
    }

}
```

:trophy: **Pro Tip!** Notice the main command format.  Notice all additional args are each "individually" "quoted" "like" "this"
{: .notice--warning}


Run it with this:

```bash
zellij --layout kube-service-ports-mac-cso-observability
```

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
