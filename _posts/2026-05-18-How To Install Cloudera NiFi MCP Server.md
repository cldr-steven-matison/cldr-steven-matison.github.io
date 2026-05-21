---
layout: single
title: "How To Install Cloudera NiFi MCP Server"
excerpt: "How to build and locally test the Cloudera NiFi MCP Server with MCP Inspector using Cloudera Apache NiFi deployed on AWS in a Data."
header:
  teaser: "/assets/images/2026-05-18-how_to_install_nifi_mcp_server.png"
categories:
  - blog
tags:
  - nifi
  - mcp
  - ai
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

The Tools panel should display the `READ-ONLY` NiFi tools the server supports (e.g., `list_processors`, `get_nifi_version`, `get_processor_details`).  Later we will take a look at the `WRITE` NiFi tools.

---

## Running Your First Test (`get_nifi_version`)

Testing the version is the best "smoke test" because it doesn't require any arguments and confirms the NiFi API connection is alive.

* **Select the Tool:** Click on **`get_nifi_version`** from the tool list on the left.
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

Next lets use `get_root_process_group` to get the `UUID` for the root process group.  You could also just use any UUID from the NiFi Canvas.

* **Select the Tool:** Click on **`get_root_process_group`** from the tool list on the left.
* **Run:** Click "Run Tool" to see the list of processors in that group.
* **Copy:** Save the UUID such as `25d98a86-0182-1000-9624-7b3ffa192883` for use later.

Now that we have our `process_group_id`, let's try **`list_processors`**:

* **Input:** Paste the `process_group_id` you got in the previous step.
* **Run:** Click "Run Tool" to see the list of processors in that group.

```bash
{
  "result": {
    "permissions": {
      "canRead": true,
      "canWrite": true
    },
    "processGroupFlow": {
      "id": "25d98a86-0182-1000-9624-7b3ffa192883",


  [ truncated ]
```

:warning: **Danger!** The JSON output is substantial so I have truncated it here.  If you have a big NiFi canvas with a lot of process groups on the root canvas you can expect over 10,000 lines of JSON response.
{: .notice--danger}

---

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
---

## Listing NiFi MCP Server NiFi Tools in Write Mode

* Click on the **"Tools"** tab located at the top of the main interface.
* Click the **"List Tools"** button.

The Tools panel should now also display the `WRITE` NiFi tools the server supports (e.g., `start_processor`, `stop_processor`, `create_processor`).  

---

## Summary

You’ve now successfully installed and configured the Apache NiFi MCP Server from Cloudera and connected it to your Cloudera Public Cloud NiFi cluster. With the NiFI MCP Server up and running, you can explore processors, process groups, check versions, and manage dataflows — all through natural-language commands via any MCP-compatible AI client. This setup turns your governed NiFi environment into an AI-native data orchestration platform, unlocking true agentic workflows inside any Cloudera secured Nifi environment. 

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

---

## Cloudera MCP Servers

* [Cloudera NiFi MCP Server](https://github.com/cloudera/NiFi-MCP-Server)
* [Cloudera Iceberg MCP Server](https://github.com/cloudera/iceberg-mcp-server)
* [Cloudera AI WorkBech MCP Server](https://github.com/cloudera/CAI_Workbench_MCP_Server)
* [Cloudera Dataviz MCP Server](https://github.com/cloudera/CDV-MCP-Server)

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.