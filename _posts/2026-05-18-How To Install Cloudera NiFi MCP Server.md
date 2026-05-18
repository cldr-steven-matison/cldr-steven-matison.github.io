---
layout: single
title: "How To Install Cloudera NiFi MCP Server"
excerpt: "How to build and locally test the Cloudera NiFi MCP Server with MCP Inspector using Cloudera Apache NiFi in a data hub."
header:
  teaser: "/assets/images/2026-05-18-how_to_install_nifi_mcp_server.png"
categories:
  - blog
tags:
  - nifi
  - mcp
---

The [Cloudera NiFi MCP Server](https://github.com/cloudera/NiFi-MCP-Server) is a standard **Model Context Protocol (MCP)** server (an open protocol originally from Anthropic but now client-agnostic). The Cloudera NiFi MCP Server simply exposes tools for reading/writing Apache NiFi flows via Knox. Any MCP-compatible client can talk to it.  In this post I am going to share how I used MCP Inspector to test the Cloudera NiFi MCP Server against a Cloudera on Cloud deployed NiFi Cluster.

## Test with **MCP Inspector** in Read-Only Mode

1. Clone and install the NiFI MCP Server:
   ```
   git clone https://github.com/cloudera/NiFi-MCP-Server.git
   cd NiFi-MCP-Server
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -e .
   ```

2. Set the required environment variables in your local environment:
   - `NIFI_API_BASE`= https://<your-nifi-host><data-hub-name>/cdp-proxy/nifi-app/nifi-api
   - `KNOX_TOKEN`= [token]
   - `NIFI_READONLY` true 
   - `KNOX_VERIFY_SSL` false

   ```bash
   NIFI_API_BASE=https://[datahub]-gateway.[env].cloudera.site/[datahub]/cdp-proxy/nifi-app/nifi-api
   KNOX_TOKEN=
   NIFI_READONLY=true
   KNOX_VERIFY_SSL=false
   ```

3. Run the **MCP Inspector**:
   ```
   npx @modelcontextprotocol/inspector .venv/bin/python -m nifi_mcp_server.server
   ```

## Connect NiFi MCP Server

Once the browser opens look at the "Command" text box in the left column of the MCP Inspector web page.   Notice it is `.venv/bin/python` and next notice the arguments we supplied `-m nifi_mcp_server.server`.

Now click Connect and you should see Connected `nifi-mcp-server` Version 1.27.1.
Once your MCP server is successfully **Connected**, the MCP Inspector acts as a GUI for the NiFi MCP Server's capabilities. 

## Listing NiFi MCP Server NiFi Tools

* Click on the **"Tools"** tab located at the top of the main interface.
* Click the **"List Tools"** button.

The Tools panel should display the `READ-ONLY` NiFi tools the server supports (e.g., `list_processors`, `get_nifi_version`, `create_process_group`).  Later we will take a look at the `WRITE` NiFi tools.

---

## Running Your First Test (`get_nifi_version`)

Testing the version is the best "smoke test" because it doesn't require complex JSON arguments and confirms the NiFi API connection is alive.

* **Select the Tool:** Click on **`get_nifi_version`** from the tool list on the left.
* **Review Arguments:** Since this tool requires no input, the **"Arguments"** box in the center of the screen will remain empty or show `{}`.
* **Execute:** Click the **"Run Tool"** button.   


You should see:

<b>Tool Result: <font color="green">Success</font></b>

Followed by the expected JSON output with the NiFi Version:

```json
{
  "result": {
    "version_info": {
      "about": {
        "title": "NiFi",
        "version": "1.28.1.2.2.9.700-181",
        "uri": "https://...../cdp-proxy/nifi-app/nifi-api/",
        "contentViewerUrl": "../nifi-content-viewer/",
        "timezone": "UTC",
        "buildTag": "nifi-1.28.1-RC3",
        "buildRevision": "5b8a56d",
        "buildBranch": "UNKNOWN",
        "buildTimestamp": "06/16/2025 09:34:52 UTC"
      }
    },
    "parsed_version": "1.28.1",
    "is_nifi_2x": false,
    "major_version": 1
  }
}

```

---

## Running a Parameterized Test

If the version check works, try **`list_processors`**:

* **Input:** This tool requires a `process_group_id`.
* **Action:** Paste a valid UUID from your NiFi canvas into the JSON argument box (e.g., `{"process_group_id": "root"}`).
* **Run:** Click "Call Tool" to see the list of processors in that group.


## Test with **MCP Inspector** in Write Mode

1. Set the env `NIFI_READONLY` environment variables to false:
   - `NIFI_READONLY` false 

2. Apply the changes:
   ```
   set -a
   source .env
   set +a
   ```
3. Run the **MCP Inspector**:
   ```
   npx @modelcontextprotocol/inspector .venv/bin/python -m nifi_mcp_server.server
   ```

## Listing NiFi MCP Server NiFi Tools in Write Mode

* Click on the **"Tools"** tab located at the top of the main interface.
* Click the **"List Tools"** button.

The Tools panel should now also display the `WRITE` NiFi tools the server supports (e.g., `start_processor`, `stop_processor`, `create_processor`).  

---


## Terminal History

```terminal
git clone https://github.com/cloudera/NiFi-MCP-Server.git\
cd NiFi-MCP-Server
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
nano .env
set -a
source .env
set +a
env | grep -E 'NIFI|KNOX'
brew install node
npx @modelcontextprotocol/inspector uvx git+https://github.com/cloudera/NiFi-MCP-Server@main run-server\
python -m nifi_mcp_server.server
source .venv/bin/activate
npx @modelcontextprotocol/inspector python3 server.py
echo $NIFI_BASE_URL
cat .env
export $(grep -v '^#' .env | xargs)
npx @modelcontextprotocol/inspector .venv/bin/python nifi_mcp_server/server.py
.venv/bin/python -m nifi_mcp_server.server
source .venv/bin/activate\
# Check if your variables are actually in the environment\
echo $NIFI_API_BASE\
echo $KNOX_TOKEN
npx @modelcontextprotocol/inspector .venv/bin/python -m nifi_mcp_server.server
pkill -f nifi_mcp_server
npx @modelcontextprotocol/inspector $(pwd)/.venv/bin/python -m nifi_mcp_server.server
kill -9 $(lsof -ti:6274,6277)
DANGEROUSLY_OMIT_AUTH=true npx @modelcontextprotocol/inspector $(pwd)/.venv/bin/python -m nifi_mcp_server.server
# Make sure you are in the root: NiFi-MCP-Server\
export $(grep -v '^#' .env | xargs)\
.venv/bin/python -m nifi_mcp_server.server

```

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.