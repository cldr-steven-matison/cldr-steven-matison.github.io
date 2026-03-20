---
title:  "Cloudera Data Engineering 1.25.2"
header:
  teaser: "/assets/images/2026-03-18-CDE-1.25.2.png"
categories: 
  - release
tags:
  - cloudera
  - kubernetes
  - cde
---

We are excited to announce the latest release of **Cloudera Data Engineering (CDE) on Cloud**. This update introduces enhanced cost management controls, security posture for Microsoft Azure users, and expanded scalability to meet the needs of the most demanding data engineering workloads.

---

### Key Features

* **Virtual Cluster Suspend and Resume [Generally Available]:** This feature allows users to temporarily suspend individual CDE Virtual Clusters during idle periods, providing granular cost control over infrastructure deployment.
* **Job-level Spot Instance Override [Technical Preview]:** Gain flexibility by specifying Spot override at the job level. This allows practitioners to match hardware precisely to the computational needs of specific Spark workloads.
* **Graviton-based Database Instances by Default:** To improve price-performance, AWS deployments now utilize Graviton-based database instances as the default for service metadata.
* **Python Environment Support for External IDE [Technical Preview]:** Enhances the developer experience by allowing practitioners to leverage CDE-managed Python environments directly within their favorite local IDEs.
* **Azure Workload Identity Migration:** CDE has transitioned from Azure Pod Identity to Azure Workload Identity, aligning with the latest security best practices for identity management on Kubernetes.
* **Atlas Lineage for Spark Iceberg Tables:** Strengthen data governance with automated lineage tracking for Spark operations on Apache Iceberg tables, integrated directly with Cloudera Atlas.
* **Expanded Scaling Range:** CDE now supports scaling up to 250 nodes per virtual cluster, enabling larger scale data processing.
* **Kubernetes Version Upgraded to 1.33**

---

### Use Cases

#### Enhanced Cost Management
With the GA of **Virtual Cluster Suspend and Resume**, teams can pause individual virtual clusters when not in use. Combined with the new **Job-level Spot Instance Type Overrides (AWS only)**, customers can more granularly tradeoff SLA needs with reduced cost within the same Virtual Cluster instead of having different Virtual Clusters (which can also be costly). Also by switching to **Graviton based RDS on AWS**, customers will see a further reduction in TCO.

#### Advanced Enterprise Security and Governance
The switch to **Workload Identity on Azure** provides a more secure and scalable way to manage service permissions. Additionally, the integration of **Atlas Lineage for Iceberg** ensures that data practitioners and compliance officers can trace data movement across the Lakehouse with full transparency.

#### Accelerated Developer Productivity
By supporting **Python Environments for External IDEs**, CDE removes the friction between local development and cloud execution. Data engineers can now develop and test complex pipelines locally with the exact environment specifications used in production.

---

### Links for Customers
* [Product Release Notes](https://docs.cloudera.com/data-engineering/cloud/release-notes/topics/cde-whats-new.html)
* [Compatibility and Runtime Components](https://docs.cloudera.com/data-engineering/cloud/release-notes/topics/cde-dl-compatibility.html)
* [[New] Product Website](https://www.cloudera.com/products/data-engineering.html)
* [[New] Reprise Demo](https://www.cloudera.com/products/data-engineering/cdp-tour-data-engineering.html)
* [[New] Free 5-day trial for Cloudera Data Engineering on cloud](https://www.cloudera.com/products/cloudera-public-cloud-trial.html)
* [Demo of External IDE Connectivity and CI/CD pipeline](https://www.youtube.com/watch?v=d7X5UY8o56k)
* [Datasheet](https://www.cloudera.com/content/dam/www/marketing/resources/datasheets/cde-data-sheet.pdf.landing.html)


If you would like a deeper dive, hands on experience, demos, or are interested in speaking with me further about {{ page.title }} please reach out to schedule a discussion.


