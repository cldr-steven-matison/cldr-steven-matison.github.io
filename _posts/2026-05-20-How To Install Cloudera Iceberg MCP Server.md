---
layout: single
title: "How To Install Cloudera Iceberg MCP Server"
excerpt: "How to build and locally test the Cloudera Iceberg MCP Server with MCP Inspector using Cloudera Apache Iceberg deployed on AWS in a Cloudera Data Warehouse."
header:
  teaser: "/assets/images/how_to_install_iceberg_mcp_server.png"
categories:
  - blog
tags:
  - iceberg
  - ai
  - mcp
---

This next guide walks you through **Option 2 (Local Install)** of the [Cloudera Iceberg MCP Server](https://github.com/cloudera/iceberg-mcp-server) on a local machine. The instructions mirror the style and detail of my previous guide: [How To Install Cloudera NiFi MCP Server](https://stevenmatison.com/blog/How-To-Install-Cloudera-NiFi-MCP-Server/).  The Iceberg MCP Server is a Model Context Protocol (MCP) server that gives LLMs and AI agents read-only access to Iceberg tables via Apache Impala. It exposes two powerful tools:  
- `get_schema()` – Lists all tables available in the current database.  
- `execute_query(query: str)` – Runs any SQL query on Impala and returns results as JSON.  

This setup is tested against a **Cloudera Public Cloud (CDP) on AWS** environment and confirmed to work perfectly with **MCP Inspector** on macbook.  Other environments and instances; including AI clients of the MCP Server(s) should behave the same.   This excercise is good to understand how it works or even better to master the tools and contribute back to the tool(See Appendix).  

---

## Prerequisites

Before you begin, make sure you have the following on your Mac:

1. **Git** – `brew install git` (or already installed via Xcode Command Line Tools).
2. **Node.js** – Required for `npx` and MCP Inspector. Install with:  
   ```bash
   brew install node
   ```
3. **uv** – Modern Python package manager (used by the Iceberg MCP Server). Install with:  
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```
   Then restart your terminal or run `source $HOME/.cargo/env`.
4. **Cloudera Public Cloud (AWS) access** – You need Impala connection details (see next section).

---

## Step 1: Obtain Impala Connection Details from Cloudera Public Cloud on AWS

The MCP Server connects to your **Impala Virtual Warehouse** (or Data Hub cluster with Impala) in CDP Public Cloud on AWS. Connection is via the Knox gateway (HTTPS, port 443).

### How to get the details:
1. Log in to the **Cloudera Management Console** → **Data Warehouse** service.
2. Select your **Virtual Warehouse** (Impala type).
3. In the **Details** tab or **Connection** section, click **Copy JDBC URL** (or find the Impala coordinator endpoint).
4. The JDBC URL will look similar to this:  
   ```
   jdbc:impala://coordinator-default-impala-aws.[dw name].[env name].cloudera.site:443/default;AuthMech=12;transportMode=http;httpPath=cliservice;ssl=1;auth=browser
   ```

5. Extract these values for the MCP Server environment variables:
   - **IMPALA_HOST** → `coordinator-default-impala-aws.[dw name].[env name].cloudera.site` (the hostname only)
   - **IMPALA_PORT** → `443`
   - **IMPALA_USER** → Your workload username (e.g., `srv_cia_test_user` or IAM user)
   - **IMPALA_PASSWORD** → The corresponding password
   - **IMPALA_DATABASE** → Usually `default` (or your target database)

**Tip**: Use a **workload user** or service account with appropriate Impala permissions.

---

## Step 2: Clone the Repository

```bash
git clone https://github.com/cldr-steven-matison/iceberg-mcp-server.git
cd iceberg-mcp-server
```

---

## Step 3: Set Environment Variables

Create a `.env` file in the root of the repository for easy loading (recommended):

```bash
cat > .env << EOF
IMPALA_HOST=coordinator-default-impala-aws.[dw name].[env name].cloudera.site
IMPALA_PORT=443
IMPALA_USER=yourworkloaduser
IMPALA_PASSWORD=yourpassword
IMPALA_DATABASE=default
# Optional: Change transport if needed (default is stdio)
# MCP_TRANSPORT=stdio
EOF
```

Load the variables in your current terminal session:

```bash
set -a; source .env; set +a
```

---

## Step 4: Run the MCP Server with MCP Inspector

MCP Inspector is the easiest way to test the server locally.

```bash
npx @modelcontextprotocol/inspector uv run src/iceberg_mcp_server/server.py
```

This command:
- Opens the MCP Inspector in your browser.
- Launches the Iceberg MCP Server locally using `uv`.

---

## Step 5: Testing – Confirmation Iceberg MCP Services Work with MCP Inspector

Once the MCP inspector loads:

1. **Connect** to the server (it auto-detects the running process).
2. Confirm the server version and status.
3. **List Tools** – You should see:
   - `get_schema()`
   - `execute_query(query: str)`

### Example Tests

**Test 1: Get Schema**

   Click Run Tool

      → Returns a JSON list of all tables in the `IMPALA_DATABASE`.

**Test 2: Execute a Simple Query**

   `SHOW TABLES`

   Click Run Tool

      → Returns table names as JSON.

**Test 3: Real Iceberg Query**

   `SELECT * FROM your_iceberg_table LIMIT 5`

    Click Run Tool

      → Returns actual data rows.

### Success

All tests complete without errors, tools are listed correctly, and queries return valid JSON results from your Cloudera Public Cloud Impala/Iceberg environment. The Cloudera Iceberg MCP Server is ready for use with Claude Desktop, LangChain, or any MCP client.  

---

## Cloudera MCP Servers

* [Cloudera NiFi MCP Server](https://github.com/cloudera/NiFi-MCP-Server)
* [Cloudera Iceberg MCP Server](https://github.com/cloudera/iceberg-mcp-server)
* [Cloudera AI WorkBech MCP Server](https://github.com/cloudera/CAI_Workbench_MCP_Server)
* [Cloudera Dataviz MCP Server](https://github.com/cloudera/CDV-MCP-Server)

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.


## Appendix

### 1. Contributing Back – Example PR from Develop Branch

The goal of this exercise post installation — is to teach **how to contribute** back to the upstream Cloudera project.

#### Suggested Contribution (Easy Starter PR)
**Item/Adjustment**: Add more local-install instructions + `.env` support to the README.

**Why this is valuable**:
- The current upstream README (`cloudera/iceberg-mcp-server`) only has minimal Option 2 instructions.

#### How to Contribute (Step-by-Step)

1. In **your fork** (`cldr-steven-matison/iceberg-mcp-server`):
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

2. Make the change (example):
   - Update `README.md` with the steps you just followed.

3. Commit and push:
   ```bash
   git add README.md
   git commit -m "feat: update readme local install"
   git push
   ```

4. Open a **Pull Request**:
   - Go to your fork on GitHub → Compare & pull request → Base repository: `cloudera/iceberg-mcp-server` → Base branch: `main`
   - Title: "Update Readme for Local Install"
   - Link back to this blog post for context.

This PR would be merged quickly because it improves documentation for the entire community.

---
