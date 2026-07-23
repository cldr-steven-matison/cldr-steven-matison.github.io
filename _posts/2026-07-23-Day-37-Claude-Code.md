---
title: "Day 37 : Claude Code"
excerpt: "A previous Claude Code session fanned out six planning subagents and every one of them died on the same 401. Here's how I found the corpse, diagnosed the model-auth mismatch, re-ran the whole fan-out, and caught the subagents inventing a processor count during review — the day agentic doc cleanup actually shipped."
header:
  teaser: "/assets/images/Day_37_Claude_Code.jpg"
categories:
  - blog
tags:
  - claude-code
  - anthropic
  - ai
  - agentic
  - subagents
  - workflow
  - documentation
  - nifi
---

Most of my "Day N with Claude Code" posts are about building something. This one is about a session that had already failed — twice — before I sat back down at the keyboard. I'd asked Claude to fan out a batch of planning subagents to clean up my sprawling DesktopShare doc library. When I came back, nothing had been written. No error I could see, no half-finished files, just an empty `~/.claude/plans/` and a vague memory that "the agents did something."

This is the story of resuming that session from disk, finding out why it died, re-running the whole thing, and — the part I care most about — catching one of the subagents quietly making up a number during review. If you're running multi-agent workflows against a gateway-hosted API key, the root cause here is one you will hit too.

## The setup — six planning subagents, zero output

The plan had been to fan out **six read-only "eval + plan" subagents**, each one auditing a chunk of my docs and writing a single plan file to `~/.claude/plans/`:

1. `task1-minifi-playground-processors.md` — split the C++/Java MiNiFi processor doc
2. `task2-agent-commands-split.md`
3. `task3-cso-operator-app-mds.md`
4. `task4-efm-binaries-mds.md`
5. `task5-flink-minikube.md`
6. `task6-how-to-nifi-and-ai-reorg.md`

When I picked the work back up, none of those files existed. The plans directory only had two unrelated files, and I couldn't remember whether the session had even run. My instinct was `claude --resume` and scroll — but the session state was still on disk, so Claude went and read it directly instead.

## Diagnosis — everything on disk, including the corpse

The previous session's transcript was right where it should be:

```
~/.claude/projects/-Users-steven-matison/a57e3e1c-....jsonl   (1.2 MB)
```

1.2 MB, last modified at 10:49 — minutes before the new session started at 10:53. Next to it was a `subagents/` folder with **seven** transcripts (one explore agent plus the six planners). That's the "5–6 agent subtasks" I half-remembered. Rather than pull all 1.2 MB into context, Claude tailed the last line of each subagent transcript. Every single one ended the same way:

```
API Error: 401 key not allowed to access model.
This key can only access models=['claude-opus-4-7'].
Tried to access claude-sonnet...
```

There it was. My subagents were configured to run on `claude-sonnet`, but the API key — I run Claude Code through a gateway, not the public Anthropic endpoint — was only allowed to reach `claude-opus-4-7`. The **main** session's model was allowed, so the top-level loop worked fine and looked healthy. The subagents, on a different model, hit a hard 401 and died instantly. No plan files, no obvious failure in the main transcript. That was the ".env problem" I'd burned two sessions on without ever seeing the actual error.

The fix was already in place by the time I looked: the key now allows `opus-4-8`, and `CLAUDE_CODE_SUBAGENT_MODEL` is set to `claude-sonnet-4-6`, which is also in the allowlist. The lesson is the kind that's worth writing down permanently:

> On a gateway-hosted key, the main model and the subagent model are separate env vars checked against one allowlist. A mismatch breaks *only* the subagents, silently, while the main loop keeps humming. Before you fan out, confirm `CLAUDE_CODE_SUBAGENT_MODEL` is in the key's allowlist — or smoke-test a single subagent first.

## Re-running — smoke test, then fan out

Because this exact fan-out was what had 401'd, I didn't want to launch six agents into another wall of identical failures. So: **one smoke test first.** Claude pulled the full, verbatim prompts for all six tasks out of the old transcript, then dispatched just the smallest one (Task 2) on the default subagent model.

It came back clean — no 401, plan file written. Auth confirmed. Then the other five went out in parallel:

```
Task 1: C++/Java processors split plan · 24 tool uses · 90.7k tokens
Task 3: cso-operator-app MDs cleanup plan · 55 tool uses · 72.9k tokens
Task 4: efm-binaries MDs cleanup plan · 33 tool uses · 63.4k tokens
Task 5: flink-minikube cleanup + plan · 47 tool uses · 81.3k tokens
Task 6: how-to-nifi-and-ai reorganize plan · 11 tool uses · 47.8k tokens
```

All six plan files landed in `~/.claude/plans/`. The session that had failed twice was, finally, un-stuck.

## Reviewing before executing

I told Claude the headlines looked good and to review the plans properly before touching anything. This is where multi-agent work earns its keep or falls apart — a plan that reads well can still be quietly wrong. A few things surfaced:

- **Task 3 (cso-operator-app docs)** came back as effectively a no-op: keep all six files separate, no merges justified, defer a session-history split until the file crosses ~2,000 lines. A good "do nothing yet" answer is still an answer.
- **Task 4 (efm-binaries)** was a clean rename — `efm-binaries-claude.md` → `efm-binaries-windows-python.md`, because the `-claude` suffix recorded *where* the file was written, not *what it's about*.
- **Task 5 (Flink)** confirmed my GPU experiment was a one-time proof of concept on the gaming PC's RTX 4060, with no live CUDA anywhere in the array today — so both GPU docs get archived and a fresh `flink-plan.md` gets written grounded in what's actually running.
- **Task 6 (the big reorg)** proposed splitting an overgrown section so the "wild processors stacked on top of each other" canvas-layout note I'd flagged becomes a first-class section instead of a buried paragraph.

Execution order: quick wins first (the split and the rename), then the two big authoring jobs, then the reorg last.

## Executing — and catching the subagent making things up

The quick wins went in cleanly. The two big authoring tasks — a new Flink plan and the split of my MiNiFi processor doc into a C++ doc and a Java doc — I handed to subagents, then reviewed the output before committing. That review is the whole point of this section.

The MiNiFi C++ doc has a **verified processor catalog** — the exact list of processors present in Cloudera's stock `apacheminificpp:latest` image. When I diffed the subagent's new catalog against the source, it claimed **"75 entries"** with a confused note about the source "listing 55." Neither number was right. The actual source lists **74 processors**. The subagent had inherited a wrong figure from the plan, gotten confused reconciling it against reality, **dropped `ConsumeJournald`**, and mislabeled a whole section ("Kafka Ecosystem" — containing processors that have nothing to do with Kafka).

So I diffed it properly, both directions:

```bash
# every processor name in the source
sed -n '14,87p' C++-processors.md | sed -E 's/^- ## //' | sort -u > src.txt
# every processor name the new doc put in its catalog
grep -oE '^- \*\*[A-Za-z0-9]+\*\*' minifi-playground-cpp-processors.md \
  | sed -E 's/^- \*\*//; s/\*\*//' | sort -u > doc.txt
comm -23 src.txt doc.txt   # in source, missing from doc
comm -13 src.txt doc.txt   # in doc, not in source (inventions)
```

The good news: **zero invented names** — every processor in the new doc traced back to the source. The bad news was exactly one omission (`ConsumeJournald`) and a wrong count. I restored the missing processor, fixed the count to 74, corrected the mislabeled section, and reworded four dead citations to the old filename that the subagent had left dangling.

That's the takeaway I keep relearning: **subagents are fast and mostly right, and "mostly right" is not the same as shippable.** The 401 earlier was a loud failure — it stopped everything. This was a quiet failure: a plausible, confidently-written number that happened to be wrong. Loud failures cost you time. Quiet ones cost you credibility if they ship. The diff took two minutes and was worth every second.

The rest went in as five clean commits:

| Commit    | What landed |
|-----------|-------------|
| `ca5b5e5` | Split the Streamers commands into their own file; added the missing PublishClip start/stop commands |
| `4371a50` | Renamed `efm-binaries-claude.md` → `efm-binaries-windows-python.md`; fixed all three references |
| `4de9036` | Split the processor doc into a C++ doc and a Java doc; updated cross-links |
| `d967bbd` | New `flink-plan.md`; archived the GPU experiment docs |
| `85fe80d` | Reorganized the NiFi/AI playbook for external readability |

Then, once I'd read it all: `git push`. `ef7a4b7..85fe80d`, local matches remote.

## Summary — what this day was really about

None of the five commits are dramatic on their own. The story is the *shape* of the work: a session that failed silently, got resurrected from its own on-disk transcript, diagnosed down to a one-line auth mismatch, re-run with a smoke test before the fan-out, and then reviewed hard enough to catch a subagent inventing a number.

Three things I'm taking forward:

1. **Gateway keys make the model/subagent split a real failure mode.** The main loop working tells you nothing about whether your subagents can authenticate. Smoke-test one before you fan out six.
2. **The transcript on disk is the real save file.** I didn't need `--resume` and a lot of scrolling — the previous session, its subagent transcripts, and its exact failure were all sitting in `~/.claude/projects/`, readable and greppable. When a session "disappears," it usually didn't.
3. **Fan-out for speed, review for truth.** Six agents wrote six plans in parallel in a couple of minutes. But the value showed up in the review pass — the diff that proved zero inventions and caught the one real omission. Trusting the summary would have shipped a wrong processor count to a doc I intend to publish.

Agentic coding isn't "the model does it and you watch." It's the model doing the wide, fast, parallel part, and you owning the narrow, slow, adversarial part where correctness actually lives. Day 37 was a good reminder of exactly where that line sits.

*Raw session capture that this post is [here](https://github.com/cldr-steven-matison/DesktopShare/blob/main/blog/claude-day-37.md).*

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
