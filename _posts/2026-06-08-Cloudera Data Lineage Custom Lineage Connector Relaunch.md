---
title:  "Cloudera Data Lineage Custom Lineage Connector Relaunch"
header:
  teaser: "/assets/images/2026-02-03-cloudera_data_lineage.png"
categories: 
  - blog
tags:
  - cloudera
  - octopai
  - data
  - lineage
---

## Executive Summary
The Cloudera Data Lineage team is pleased to announce that we've enhanced the Custom Lineage Connector (F.K.A Universal Connector) to support inner system lineage and transformations. This update effectively closes the visibility gap for source systems we don't natively support yet.

## Bridging the Visibility Gap for Legacy and Niche Systems
While Cloudera Data Lineage provides native harvesting for various BI systems, many organizations rely on niche, homegrown, or legacy tools that aren't covered by our standard support. To bridge this gap, we previously offered the "Universal Connector," enabling users to import lineage from ETL tools, reports, or databases using CSV templates.

However, a significant hurdle remained: while SQL scripts power many processes and reports, users were forced to manually define every source column and its associated logic. Furthermore, the platform lacked a way to represent the actual scripts or the specific logic they contained. 

## The Solution: Custom Lineage Connector
The latest update to this capability introduces the ability to include Source SQL scripts directly within CSV files. This update allows direct injections of source SQL queries for databases, ETL/ELT tools, and BI tools via CSV. To emphasize this new flexibility and acknowledge the manual setup involved, the "Universal Connector" is being rebranded as the Custom Lineage Connector. 

## Key Benefits
* **Automated Lineage Creation:** The injected metadata is automatically analyzed, creating unified lineage that behaves exactly like a native connector across the entire platform - fully integrated into all lineage layers, discovery, and the Knowledge Hub.
* **Streamlined Manual Mapping:** By parsing SQL scripts from within CSV files, we now automatically detect sources and transformations. This streamlines manual mapping by integrating them into the lineage platform alongside existing metadata.
* **Enhanced Script Visibility:** The update provides visibility into the actual scripts themselves, addressing the previous inability to represent specific logic.
* **Unified Perspective:** This allows for the consolidation of manual entries with native metadata to create a unified perspective of the data environment.
* **Clearer Product Identity:** The updated name highlights our capacity to ingest lineage from sources beyond our standard out-of-the-box support while clearly indicating that some manual configuration is required. 

## Key Use Cases
* Integrating ETL processes or reports from systems lacking native support that utilize SQL queries instead of direct table references.
* Documenting embedded logic within database objects that exceed the scope of our standard compatibility. 

## Limitations of the Custom Connector
* Please note that parsing for sources is restricted to SQL only at this time.
* This connector does not include harvesting the metadata, the CSV templates need to be filled by the customer or professional services. 

## The Bottom Line
If you have customers or prospects running systems we don't currently cover, check with your SE to see if we can bring them into the fold using this new functionality.

## Resources
* Technical Documentation: [Custom Lineage Connector Guide](https://docs.cloudera.com/octopai/latest/howto/topics/oct-custom-lineage-connector-overview.html)

Congratulations to everyone who supported and contributed to this release!

---

## {{ page.title }}
If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.
