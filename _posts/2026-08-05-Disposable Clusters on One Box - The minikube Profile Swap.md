---
title: "Disposable Clusters on One Box: The minikube Profile Swap"
excerpt: "How I proved MiNiFi → NiFi Site-to-Site without risking 123 days of a live Cloudera stack — a second, disposable minikube profile swapped in and out on the same box, with the long-lived cluster preserved untouched."
header:
  teaser: "/assets/images/Minikube-Profile-Swap.jpg"
categories:
  - blog
tags:
  - minikube
  - kubernetes
  - cloudera
  - cfm
  - nifi
  - efm
  - minifi
---

I had 123 days of a Cloudera stack running on one minikube node — NiFi, EFM, Kafka, Flink, SSB, Prometheus, a whole RAG app, MiNiFi Agents, and more — and I needed to prove out MiNiFi → NiFi Site-to-Site without risking any of it. The obvious move, standing up another operator-managed NiFi on that same minikube, is exactly what took the cluster down. This is the technique that let me experiment safely instead: a second, disposable cluster on the same machine, swapped in and out, with the long-lived one preserved untouched.

## The war story that motivates the whole thing

Proving EFM/MiNiFi → NiFi Site-to-Site, I first did the sensible-sounding thing: experiment *on* the shared, long-lived CFM/CSO minikube. It was already carrying the full stack. Standing an extra operator-managed NiFi alongside it spiked CPU, and the **kube API server started returning `TLS handshake timeout`.** On single-node minikube the control plane shares the one node with your workloads, so another heavyweight JVM booting next to an already-full stack starved the API server itself — the thing you need responsive to *fix* the problem.

The lesson wrote itself: **experiments get their own cluster.** I didn't need to tear down 123 days of stack to run a two-hour experiment. I needed a second cluster, and minikube already supports exactly that.

## The core idea: named profiles are real, separate clusters

minikube supports multiple named **profiles** (`--profile <name>` / `-p <name>`). Each profile is a fully independent single-node cluster — its own container, its own kubeconfig context, its own storage and addons. The default profile is named `minikube`; everything you've ever run without `-p` lives there.

The catch on a RAM-bound host: only **one** profile can realistically run at a time. So you don't run them side by side — you *swap*. Stop the heavy long-lived cluster (preserving it on disk), spin a fresh lightweight one for the experiment, and when you're done, delete the experiment and start the original right back up.

## The profile-swap technique

```bash
# 1. Preserve the current cluster — everything survives on disk.
minikube stop                       # graceful; flushes etcd. Do NOT delete.

# 2. Fresh, isolated cluster for the experiment.
minikube start --profile s2s-lab --driver=docker --cpus 6 --memory 16384
#    kubectl's context auto-switches to the new profile.

# 3. ...build and experiment in the fresh cluster...

# 4. Tear down the experiment; restore the original exactly as it was stopped.
minikube delete --profile s2s-lab
minikube start                      # the original profile is back
```

The two verbs that matter: **`stop` preserves** (recoverable with `start`), **`delete` is permanent.** Use `stop` for the cluster you want back, `delete` for the throwaway. In the S2S work this let me set the shared profile aside for a few hours and get it back afterward exactly as I'd left it, 123 days of state intact.

## Per-profile commands (and the footguns)

Once more than one profile exists, *every* minikube and kubectl command that talks to a cluster needs to be pointed at the right one. This is where the sharp edges are:

- **`minikube profile list`** — shows all profiles and which is active. Run it whenever you're unsure which cluster you're about to hit.
- **`minikube start -p <name>`** auto-switches the kubectl context. If you didn't just start it, switch by hand: **`kubectl config use-context <name>`**.
- **`eval $(minikube docker-env -p <name>)`** — points your Docker CLI at *that profile's* Docker daemon for `docker pull` / image pre-staging. Easy to run against the wrong profile and stage an image into a cluster that isn't the one running your pods.
- **`minikube tunnel -p <name>`** and **`minikube service … -p <name>`** — both need the `-p` flag too. A tunnel started against the wrong profile silently does nothing useful.

The failure mode with all of these is quiet: no error, just an action applied to the cluster you didn't mean. When something "isn't taking," the first thing to check is which profile the command actually targeted.

## Right-size the throwaway

The experiment cluster is not a clone of the big one — that would just reproduce the overload that started this. Deploy only what the experiment needs. For the S2S proof, the throwaway `s2s-lab` profile ran **NiFi + EFM + MiNiFi only**, not the whole CSO stack. It started fast, left the API server plenty of headroom, and never came close to the `TLS handshake timeout` wall the shared cluster hit.

## Reusable lessons

- A named profile is a **real separate cluster**; `minikube delete -p` is a clean teardown that leaves the original completely untouched.
- Only one profile runs at a time on limited host RAM — **plan the swap.** A session that assumes the default `minikube` is up will be confused when it's stopped.
- **Trim the throwaway** to just the pieces under test. Fast to start, and it avoids repeating the overload that made you reach for a second cluster in the first place.
- **`stop` = recoverable, `delete` = permanent.** Keep the two straight and you can experiment against production-shaped infrastructure without gambling it.
- The footguns are all the same shape: `docker-env`, `tunnel`, `service`, and every `kubectl` call must target the intended profile. When in doubt, `minikube profile list`.

A concrete run of this: on 2026-08-03 the default `minikube` profile (the 123-day CSO/CFM stack) was `stop`ped and preserved, a fresh `s2s-lab` profile came up with `minikube start --profile s2s-lab --driver=docker --cpus 6 --memory 16384` (minikube v1.37.0) carrying only NiFi + EFM + MiNiFi, the Site-to-Site proof ran to completion there, and then `minikube delete -p s2s-lab` + `minikube start` restored the original exactly as it had been stopped.

## {{ page.title }}

If you would like a deeper dive, hands-on experience, demos, or are interested in speaking with me further about {{ page.title }}, please reach out to schedule a discussion.
