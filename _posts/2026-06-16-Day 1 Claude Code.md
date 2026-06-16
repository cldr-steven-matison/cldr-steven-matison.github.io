---
title:  "Day 1: Claude Code"
excerpt: "First day with Claude Code on the MacBook — install, a few questions about my DesktopShare repo, and a commit + push, end to end from the terminal."
header:
  teaser: "/assets/images/Day1ClaudeCode.png"
categories:
  - blog
tags:
  - claude
  - claude-code
  - ai
  - cloudera
---

![Day 1 Claude Code](/assets/images/Day1ClaudeCode.png)

## Summary

Day 1 with Claude Code. Installed via `brew`, pointed it at my `DesktopShare` repo, and ran a handful of agent tasks end to end from the terminal — answering questions about the project, explaining the folder structure, capturing the session into `history/`, then committing and pushing the change to GitHub. By the end of the day, Claude Code was driving the repo work on the MacBook, my Telegram bot was syncing the same repo down to the Windows side, and this very post — the writeup, the front matter, the docs links — was drafted, placed, and published by Claude Code as another agent task. The terminal log below is the raw Day 1 session that kicked it off.

## Day 1: Claude Code

```
Last login: Tue Jun 16 09:40:53 on ttys006
steven.matison@FTF3XR2065 ~ % brew install --cask claude-code
✔︎ JSON API packages.arm64_tahoe.jws.json                                                                                                    Downloaded   15.2MB/ 15.2MB
==> Fetching downloads for: claude-code
✔︎ Cask claude-code (2.1.153)                                                                                                                Verified    214.5MB/214.5MB
==> Installing Cask claude-code
==> Linking Binary 'claude' to '/opt/homebrew/bin/claude'
🍺  claude-code was successfully installed!


steven.matison@FTF3XR2065 ~ % cd ~/Documents/GitHub/DesktopShare
steven.matison@FTF3XR2065 DesktopShare % claude
╭─── Claude Code v2.1.153 ──────────────────────────────────────────────────────────────────────────────────────────╮
│                 Welcome back!
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
❯ /login
❯ what does this project do?
  Read 1 file, listed 1 directory (ctrl+o to expand)
⏺ DesktopShare is your cross-platform workspace (macOS + Windows) for developing, testing, and sharing Markdown docs and supporting assets tied to Cloudera Streaming Operators work.
  Specifically:
  - Root holds in-progress, AI-drafted (Grok/Gemini) Markdown plans on topics like NiFi, Flink, Kafka, MiNiFi, Minikube/K8s, GPU work, custom processors, RAG, and edge devices (e.g., Jetson Nano).
  - blog/ — polished posts headed to your GitHub Pages blog.
  - completed/ — validated docs promoted out of root.
  - files/ — supporting YAML/Python/JSON/Dockerfile assets, synced to dedicated repos.
  - history/ — archived terminal output.
  It's the staging ground where ideas iterate from plan → tested → blog/completed, feeding several sibling repos (ClouderaStreamingOperators, NiFi-Templates, Flink-Kubernetes-Playground, etc.).

❯ what technologies does this project use?
⏺ Based on the README and file listing, this project covers:
  Cloudera Streaming Stack
  - NiFi / CFM (Cloudera Flow Management)
  - MiNiFi (edge agents, including Jetson Nano)
  - Flink / CSA (Cloudera Streaming Analytics)
  - Kafka / CSM (Cloudera Streaming for Kafka)
  - Schema Registry, SQL Stream Builder
  - EFM (Edge Flow Manager)
  - Cloudera DataFlow (CDF) on Kubernetes, Iceberg CDC
  Infrastructure & Orchestration
  - Kubernetes / Minikube (Mac + Windows with GPU)
  - Helm
  - ArgoCD
  - Airflow
  - Docker
  Languages & Custom Processors
  - Python (incl. NiPyAPI for NiFi automation)
  - Java / C++ custom processors
  - Spark 2 → Spark 3 migration work
  AI / ML / GPU
  - NVIDIA TensorRT, Jetson Nano, GPU on Minikube
  - Local LLMs (Grok, Gemini, NotebookLM)
  - RAG apps, audio transcription/sonification, fraud detection
  - Sparkplug B / IIoT
  Observability & Misc
  - Prometheus, Grafana, Kafka Surveyor
  - OpenSearch
  - Zeppelin notebooks
  - Zellij (terminal multiplexer)
  Authoring
  - Markdown (AI-drafted with Grok + Gemini, iterated until validated)
  - GitHub Pages blog output
  It's less a code project and more a knowledge/asset workspace — the "tech" is the streaming + K8s + AI ecosystem the docs describe and test against.

❯ explain the folder structure
⏺ Folder Structure
  DesktopShare/
  ├── README.md                ← Project overview
  │
  ├── *.md (root)              ← In-progress / "living" docs
  │                              AI-drafted plans being actively iterated.
  │                              Topics: agents, CFM/CSA/CSM, EFM, Jetson Nano,
  │                              Flink GPU, NiFi music, Spark migrations,
  │                              Sparkplug IIoT, RAG, Zeppelin, etc.
  │
  ├── blog/                    ← Polished posts ready for the GitHub Pages blog
  │                              (cldr-steven-matison.github.io). Examples:
  │                              "How to AI with NiFi and Python",
  │                              "Observability with CSO",
  │                              top-10 K8s round-ups.
  │
  ├── completed/               ← Validated docs promoted out of root.
  │                              Operationally tested guides — Minikube installs,
  │                              GPU/Qwen/Llama on K8s, MiNiFi setups, RAG.
  │
  ├── files/                   ← Supporting non-Markdown assets
  │                              (synced into dedicated repos):
  │                              • .json — NiFi flow definitions, Grafana dashboards
  │                              • .py   — custom processors, fraud detector, MIDI
  │                              • .yaml — K8s/Helm configs (Kafka, NiFi clusters)
  │                              • .sh   — install/reset/uninstall scripts
  │                              • .kdl  — Zellij layouts for kube port-forwards
  │
  ├── history/                 ← Archived terminal output (.txt)
  │                              Captures of past sessions: Windows setup,
  │                              EFM persistence, RAG testing, OpenClaw runs.
  │
  └── .git/
  Lifecycle flow: AI-drafted idea lands in root → tested → moves to completed/ (if validated) or blog/ (if it becomes a post). Supporting code/configs live in files/, terminal captures archive into history/.

❯ what can Claude Code do?
⏺ Claude Code is Anthropic's official CLI for Claude — an interactive coding agent that runs in your terminal (also available as desktop/web apps and IDE extensions for VS Code & JetBrains).
  Core capabilities
  Code work
  - Read, edit, and write files across your project
  - Run shell commands, tests, builds, linters
  - Navigate Git: diffs, commits, branches, PRs (via gh)
  - Search/grep the codebase, follow references
  - Launch the dev server and verify changes
  Workflow features
  - Plan mode — design an approach and get your sign-off before editing
  - Tasks — track multi-step work with a todo list
  - Subagents — delegate research, reviews, or parallel work to specialized agents (Explore, Plan, code-reviewer, etc.)
  - Worktrees — isolated git worktrees for parallel branches
  - Background tasks — long-running commands without blocking
  - Cron / scheduled wakeups — recurring or one-shot prompts
  Extensibility
  - Slash commands / Skills — /review, /security-review, /verify, /run, /init, /loop, plus your own
  - Hooks — shell commands triggered by events (pre/post tool use, prompt submit, stop)
  - MCP servers — plug in external tools (databases, APIs, custom services)
  - Settings — settings.json / settings.local.json for permissions, env vars, hooks
  - Memory — persistent notes across sessions (CLAUDE.md, memory files)
  - Custom keybindings — ~/.claude/keybindings.json
  Integrations
  - GitHub via gh (issues, PRs, reviews, releases)
  - Anthropic API / SDK development with prompt caching
  - Web fetch & search for up-to-date info
  Modes
  - Interactive REPL, plan mode, fast mode (Opus with faster output), permission modes (auto-allow vs. ask)
  In this repo specifically, it's most useful for drafting/iterating Markdown plans, running and testing the K8s/NiFi/Flink scripts in files/, and promoting docs through the root → completed/blog lifecycle.

❯ how do I create custom skills in Claude Code?
❯ can Claude Code work with Kubernetes?
⏺ Creating custom skills
  A skill is a reusable instruction set Claude Code invokes via the Skill tool (or /<skill-name>). Unlike slash commands (Claude-side prompts) or hooks (harness-side shell triggers), skills are markdown files with frontmatter that get loaded on demand.
  Locations
  - Project: .claude/skills/<skill-name>/SKILL.md
  - User: ~/.claude/skills/<skill-name>/SKILL.md
  - Plugin: namespaced as plugin:skill
  Format — SKILL.md with YAML frontmatter:
  ---
  name: my-skill
  description: One-line trigger description — when Claude should invoke this.
  ---
  # Instructions for Claude
  Steps, examples, references to other files in this folder...
  Discovery — Claude Code scans skill directories at startup; the description is what Claude matches against user intent. Keep it specific (the trigger sentence matters).
  Minimal layout
  .claude/skills/deploy-staging/
  ├── SKILL.md          ← instructions + frontmatter
  ├── checklist.md      ← optional supporting files
  └── scripts/run.sh
  Gotchas
  - Names are kebab-case; the directory name should match name:.
  - Skills only fire when listed in the available-skills system reminder — restart the session after adding one.
  - Vague descriptions = skill never triggers. Write the description as "use when X" with concrete cues.
  - For automated behavior ("every time X happens"), use hooks, not skills — skills are Claude-invoked, hooks are harness-invoked.
  Official docs: https://docs.claude.com/en/docs/claude-code/skills
  ---
  Can Claude Code work with Kubernetes?
  Yes, very well — and this repo is a great example. Claude Code can:
  - Run kubectl, helm, minikube, kind, k3d directly via Bash (apply manifests, check pods, describe resources, port-forward, exec into containers).
  - Edit YAML — Deployments, StatefulSets, Services, ConfigMaps, CRDs, Helm values (your files/ folder is full of these).
  - Debug clusters — read logs, inspect events, troubleshoot CrashLoopBackOff, RBAC, networking.
  - Drive operators — Cloudera Streaming Operators, ArgoCD, Flink/Spark/Kafka operators (exactly what your cso-*.md and csa-*.md plans cover).
  - GPU workloads — your gpu-minikube-* and flink-minikube-gpu-* docs show this in practice.
  - MCP servers — plug in a Kubernetes MCP server for richer cluster introspection if you want structured access beyond shell.
  - Generate / scaffold — Helm charts, Kustomize overlays, NiFi/Flink CRs, Prometheus scrape configs.
  For your workflow specifically: it can run the install scripts in files/agent-*.sh, test flows on Minikube, capture output into history/, then iterate the corresponding root .md plan until you promote it to completed/.

❯ what files have I changed?
⏺ Bash(git status && echo "---" && git diff --stat)
⏺ No tracked files modified. One untracked file:
  - history/claude-day-1.txt (new, not yet added to git)
  Working tree is otherwise clean and up to date with origin/main.

❯ commit my changes with a descriptive message
⏺ Bash(git add history/claude-day-1.txt && git commit -m "Add Claude Code day-1 terminal history")
  ⎿  [main 03c952e] Add Claude Code day-1 terminal history
      1 file changed, 312 insertions(+)
      create mode 100644 history/claude-day-1.txt
⏺ Committed as 03c952e. Branch is one commit ahead of origin/main; let me know if you want me to push.

❯ push that commit
⏺ Bash(git push)
  ⎿  To https://github.com/cldr-steven-matison/DesktopShare.git
        35c57c0..03c952e  main -> main
  Pushed — 35c57c0..03c952e is now on origin/main.
```

<figure>
  <img src="/assets/images/Day1ClaudeTokens.png" alt="Day 1 Claude Code token usage">
  <figcaption>How many tokens does it take for a Quickstart and First Commit?</figcaption>
</figure>

Wow, ok, I feel like all the work I have done up to this point was for you to read this. I now have claude doing my repo work in the macbook space. After I finished the commit, one simple chat to my telegram bot and the same repo is pulled in my windows space. 🤖🤖🤖🤖🤖

## Common Commands

| Command | What it does |
|---------|--------------|
| `claude` | Start an interactive session in the current directory |
| `claude -p "..."` | Non-interactive prompt — pipe in / out for scripting |
| `claude --help` | CLI flags and options |
| `/login` | Authenticate the CLI |
| `/init` | Generate a `CLAUDE.md` for the current project |
| `/help` | List slash commands available in the session |
| `/clear` | Clear conversation context |
| `/config` | View / change settings (theme, model, recap, etc.) |
| `/review` | Review a pull request |
| `/security-review` | Security review of pending changes |
| `/loop <interval> <cmd>` | Run a prompt on a recurring interval |
| `/desktop` | Hand off the terminal session to the Desktop app |


## Resources

- [https://github.com/cldr-steven-matison/DesktopShare](https://github.com/cldr-steven-matison/DesktopShare)
- [https://code.claude.com/docs/en/quickstart](https://code.claude.com/docs/en/quickstart)

## Suggested Reading

- [How Claude Code Works](https://code.claude.com/docs/en/how-claude-code-works)
- [Best Practices](https://code.claude.com/docs/en/best-practices)
- [Features Overview](https://code.claude.com/docs/en/features-overview)
- [Common Workflows](https://code.claude.com/docs/en/common-workflows)
- [Memory (CLAUDE.md and auto memory)](https://code.claude.com/docs/en/memory)
- [Skills](https://code.claude.com/docs/en/skills)
- [Model Context Protocol (MCP)](https://code.claude.com/docs/en/mcp)


