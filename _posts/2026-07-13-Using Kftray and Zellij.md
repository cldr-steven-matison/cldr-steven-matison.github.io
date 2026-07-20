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

## Update: split_direction is backwards from what you'd guess

I have a second layout on the Windows gaming PC (via WSL2) that fronts the `cld-streaming` cluster's EFM and Kafka external access for the rest of my array — `~/.config/zellij/layouts/kube-service-ports-efm.kdl`. It grew to 15 panes once I added Tailscale-bound forwards for a third array machine (a Beelink on Starlink): Kafka needs 4 separate forwards (bootstrap + one per broker), each doubled for LAN + Tailscale, plus EFM doubled the same way. All of that was `split_direction "Horizontal"`-stacked into one unreadable column.

**The gotcha**: `Horizontal` stacks panes top-to-bottom (splits along rows). `Vertical` puts panes side-by-side (splits along columns) — backwards from what the name suggests if your instinct is tmux's `-h`/`-v`. Confirmed straight from zellij's own source (`pane_size.rs`: `SplitDirection::Vertical => self.cols.is_percent()`, `SplitDirection::Horizontal => self.rows.is_percent()`) and the bundled `strider.kdl` example, which uses `split_direction="Vertical"` to put a narrow file-explorer sidebar next to a main pane.

To get a real left/right split — services on the left, all the Kafka forwards grouped on the right — nest a `pane` with its own `split_direction` inside a top-level pane. The container pane doesn't run a command itself; its children do:

```
layout {
    split_direction "Vertical"

    pane split_direction="Horizontal" size="50%" {
        pane {
            command "bash"
            args "-lc" "exec minikube tunnel"
        }

        pane {
            command "/usr/local/bin/kubectl"
            args "port-forward" "--address" "192.168.1.121" "svc/efm" "10090:10090" "-n" "cld-streaming"
        }

        pane {
            command "/usr/local/bin/kubectl"
            args "port-forward" "--address" "100.68.113.126" "svc/efm" "10090:10090" "-n" "cld-streaming"
        }
        # ... Surveyor, vLLM, cso-operator-app, MiNiFi agent panes follow the same pattern
    }

    pane split_direction="Horizontal" size="50%" {
        pane {
            command "/usr/local/bin/kubectl"
            args "port-forward" "--address" "192.168.1.121" "svc/my-cluster-kafka-external-bootstrap" "31623:9094" "-n" "cld-streaming"
        }

        pane {
            command "/usr/local/bin/kubectl"
            args "port-forward" "--address" "100.68.113.126" "svc/my-cluster-kafka-external-bootstrap" "31623:9094" "-n" "cld-streaming"
        }
        # ... same LAN + Tailscale pair repeated for my-cluster-combined-0/1/2
    }
}
```

Each Kafka/EFM service gets one pane bound to the LAN IP (`192.168.1.121`, for NvidiaNano and anything else on the local network) and a second pane bound to the Tailscale IP (`100.68.113.126`, for array machines outside the LAN — like the Beelink on Starlink). Same `svc` and port, different `--address`.

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
