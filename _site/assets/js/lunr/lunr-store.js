var store = [{
        "title": "Welcome to My Cloudera Blog!",
        "excerpt":"This is my first post for my new GitHub Pages deployed website. This was something I did in my previous role @Datastax and you can find that page here. Please give me some time to get familar with the Minimal Mistakes theme and the changes in capability and functionality with...","categories": ["blog"],
        "tags": ["cdp"],
        "url": "/blog/welcome/",
        "teaser": "/assets/images/SRM.png"
      },{
        "title": "Newest NiFi @Cloudera",
        "excerpt":"I wrote my first @Cloudera Community article on how to Operationalize NiFi with CDP Public Cloud’s DataFlow Data Service. NiFi is something I have been excited about for a very long time. A major focus of this blog and my social media content will be around all of the new...","categories": ["blog"],
        "tags": ["nifi"],
        "url": "/blog/dataflow/",
        "teaser": "/assets/images/2023-05-18-dataflow.png"
      },{
        "title": "Converting NiFi XML to JSON with NiFi",
        "excerpt":"I wanted to work with some old nifi xml templates in DataFlow which requires new nifi json flow definition files. To get these templates converted I had to import them to an operational nifi, drag them onto the screen, and download the flow definition file I needed. This seemed like...","categories": ["blog"],
        "tags": ["nifi"],
        "url": "/blog/dataflow-xml-to-json/",
        "teaser": "/assets/images/2023-05-19-dataflow-xml-to-json.png"
      },{
        "title": "Contributing to NiFi-11608",
        "excerpt":"Today I finished my second Pull Request on the Apache NiFi Project for JIRA NiFi 11608. This JIRA describes an issue with PutBigQuery proccessor evaluating expression language inside the processor’s properties for the Dataset and Tablename. I came into the issue when a community user posted a question asking why...","categories": ["blog"],
        "tags": ["nifi"],
        "url": "/blog/NIFI-11608/",
        "teaser": "/assets/images/2023-05-31-NIFI%2011608-1.png"
      },{
        "title": "NIFI SSL in Modern Versions of NiFi",
        "excerpt":"My original experiences with NiFi and SSL were not something I would call fun or easy. Literally hours and days were spent configuring nifi cluster nodes to communicate with each other using SSL and enabling https Nifi UI. Adding access and authentication controls was even more hard work. Last but...","categories": ["blog"],
        "tags": ["nifi"],
        "url": "/blog/Modern-NiFi-and-SSL/",
        "teaser": "/assets/images/2023-06-01-Modern%20NiFi%20and%20SSL.png"
      },{
        "title": "NiFi 1.22 Release Voting",
        "excerpt":"In my previous post Contributing to NiFi-11608 I share a JIRA and associated PR I worked on which was included in the next 1.22 release of NiFi. As part of the release process nifi community members are allowed to vote. Here are the commands from my terminal to build, test,...","categories": ["blog"],
        "tags": ["nifi"],
        "url": "/blog/NiFi-1.22-Release-Voting/",
        "teaser": "/assets/images/nifi-logo.png"
      },{
        "title": "NiFi 1.23 Release Voting",
        "excerpt":"I have been so busy working on customer projects and with my intern that I have not had time to blog. As time is flying by, here we are with another NiFi release voting process. NiFi 1.23 is ready. Here are the steps I executed on my machine to build...","categories": ["blog"],
        "tags": ["nifi"],
        "url": "/blog/NiFi-1.23-Release-Voting/",
        "teaser": "/assets/images/nifi-logo.png"
      },{
        "title": "NiFi For Dummies Second Edition",
        "excerpt":"Last year I had the amazing opportunity to transpose Mark Payne’s 4 video series on NiFi Best Practices into text for the Second Edition of the NiFi For Dummies book. You can find those Nifi Best Practices videos here: Apache NiFi Anti-Patterns Part 1 Apache NiFi Anti-Patterns Part 2 Apache...","categories": ["blog"],
        "tags": ["nifi"],
        "url": "/blog/NiFi-For-Dummies/",
        "teaser": "/assets/images/thumb-apache-nifi-for-dummies.png"
      },{
        "title": "NiFi 1.23.1 Release Voting",
        "excerpt":"Once again, here we are with another NiFi release voting process. NiFi 1.23.1 is ready. At this point after 3 releases, the process is easy for me to duplicate. Below are the steps I executed on my machine to build and test NiFi 1.23.1: wget https://dist.apache.org/repos/dist/dev/nifi/nifi-1.23.1/nifi-1.23.1-source-release.zip wget https://dist.apache.org/repos/dist/dev/nifi/nifi-1.23.1/nifi-1.23.1-source-release.zip.asc wget https://dist.apache.org/repos/dist/dev/nifi/nifi-1.23.1/nifi-1.23.1-source-release.zip.sha256...","categories": ["blog"],
        "tags": ["nifi"],
        "url": "/blog/NiFi-1.23.1-Release-Voting/",
        "teaser": "/assets/images/nifi-logo.png"
      },{
        "title": "CDP Sql Stream Builder Iceberg Demo",
        "excerpt":"CDP 7.1.9 came out recently alongside CSA 1.11.  These releases brought some new features around flink and iceberg and I had the opportunity to create a sample project showing the capability.   SSB-Iceberg-Demo  ","categories": ["blog"],
        "tags": ["ssb"],
        "url": "/blog/SSB-Iceberg-Demo/",
        "teaser": "/assets/images/2023-05-18-dataflow.png"
      },{
        "title": "Cloudera Public Cloud 5 Day Trial",
        "excerpt":"I finally got a chance to test out the CDP Data In Motion Trial within Cloudera’s new 5 Day Public Cloud Trial. I followed the link below and within 24 hours after signing up I got an email with a link to get started. Three simple clicks later I am...","categories": ["blog"],
        "tags": ["nifi"],
        "url": "/blog/CDP-5-Day-Trial/",
        "teaser": "/assets/images/2023-10-16-cdptrial.png"
      },{
        "title": "Cloudera SQL Stream Builder Multiple Project Repo",
        "excerpt":"I think I am always learning something new with Cloudera’s Flink tool, Sql Stream Builder. I have been demo-ing in it for almost 2 years going back to a Fraud Detection Demo that Andre built, to multiple customer facing POCs, to current releases with Iceberg features for my customers. Today...","categories": ["blog"],
        "tags": ["ssb","cdp","flink"],
        "url": "/blog/SSB-Multi-Project-Repo/",
        "teaser": "/assets/images/2023-10-20-SSB-Multi-Project-Repo-3.png"
      },{
        "title": "Cloudera SQL Stream Builder Compatibility between CDP Public Cloud and CDP Private Cloud.",
        "excerpt":"In my previous post Cloudera SQL Stream Builder Multiple Project Repo I described how I was able to create a separate folder in the project repo to use for a cloud deployment. That worked great, but I am more happy to report that I was able to remove all the...","categories": ["blog"],
        "tags": ["ssb","cdp","flink"],
        "url": "/blog/SSB-CDP-PC-PVC-Compatibility/",
        "teaser": "/assets/images/2023-11-03-SSB-Data-Hub-Service-Discovery.png"
      },{
        "title": "NiFi 2.0 is Getting Hot",
        "excerpt":"NiFi 2.0 is getting closer and closer to a reality as we approach the end of 2023. Version 2.0.0-M1 was released November 25, 2023 and is the first milestone version of Apache NiFi 2.0.0. This version includes over 900 issues resolved, with new features, numerous improvements, and bug fixes. Features...","categories": ["blog"],
        "tags": ["nifi"],
        "url": "/blog/NiFi-2.0/",
        "teaser": "/assets/images/nifi-logo.png"
      },{
        "title": "Cloudera SQL Stream Builder Introducing DLQ",
        "excerpt":"Yesterday one of my customers asked about the ability to control deserialization errors in SSB applications. Referencing our Dead Letter Queue Documentation within the Deserialize Tab we can see there are quite a few options for exception handling: Deserialization Failure Handler Policy This is actually a very important feature. In...","categories": ["blog"],
        "tags": ["ssb","cdp","flink"],
        "url": "/blog/SSB-Dead-Letter-Queue/",
        "teaser": "/assets/images/2023-11-29-SSB-Dead-Letter-Queue.png"
      },{
        "title": "Time Travel with Sql Stream Builder and Iceberg",
        "excerpt":"I have been working on my SSB Iceberg Demo for going on 2 months now. This past week I have had a chance to build out some Iceberg Time Travel capabilities. I have the code and samples added to my SSB Iceberg Demo but a more interesting time travel story...","categories": ["blog"],
        "tags": ["ssb","iceberg","flink"],
        "url": "/blog/SSB-Iceberg-Time-Travel/",
        "teaser": "/assets/images/iceberg.png"
      },{
        "title": "Release of CEM 2.1.2",
        "excerpt":"Wow I have been so busy I have not had a chance to think about posting here. Here is a quick release I wanted to share. Release of CEM 2.1.2 Key Features Cloudera Manager integration Jetty and Spring upgrades Improved EFM caching Oracle database support Improved import/export functionality Agent class...","categories": ["blog"],
        "tags": ["cem","nifi","minifi"],
        "url": "/blog/CEM-2.1.2-Release/",
        "teaser": "/assets/images/cem.png"
      },{
        "title": "Release of Cloudera Kubernetes Operators",
        "excerpt":"I have been working on so many things related to my CDP Public Cloud and CDP Private Cloud customers that I just do not get enough time to blog. Since my last post I am happy to report that Cloudera has finally GA’d 3 kubernetes Operators. Cloudera Kubernetes Operators CFM...","categories": ["blog"],
        "tags": ["kubernetes","operator","csm","cfm","csa"],
        "url": "/blog/Kubernetes-Operator/",
        "teaser": "/assets/images/kubernetes-logo.png"
      },{
        "title": "Installing Cloudera CFM Kubernetes Operator",
        "excerpt":"Last week I had a chance to work out the installation of the Cloudera’s CFM Operator. In this post I am going to expose the lessons learned and command required to get this CFM Operator running on my macbook with MiniKube. Keep in mind, these Operators are GA for RedHat...","categories": ["blog"],
        "tags": ["kubernetes","operator","cfm"],
        "url": "/blog/Install-CFM-Operator/",
        "teaser": "/assets/images/kubernetes-logo.png"
      },{
        "title": "Cloudera Streaming Analytics 1.13 for Private Cloud Base",
        "excerpt":"The Data In Motion team is pleased to announce the release of the Cloudera Streaming Analytics 1.13 for Cloudera Private Cloud Base 7.1.9 SP1. This release includes improvements to SQL Stream Builder as well as updates to Apache Flink 1.19.1. These changes are focused on enhancing the user experience and...","categories": ["blog"],
        "tags": ["csa","flink","cdp"],
        "url": "/blog/CSA-1.13-Release/",
        "teaser": "/assets/images/csa-architecture.png"
      },{
        "title": "Cloudera Streams Messaging Operator 1.1",
        "excerpt":"Moving rapidly here at Cloudera and the Streams Messaging Operator. Happy to announce the latest release of Cloudera Streams Messaging Operator for Apache Kafka is now ready. Lots of features including Kafka Replication without Mirrormaker 2. See What’s New with Cloudera Streams Messaging Operator 1.1. Release of Cloudera Streams Messaging...","categories": ["blog"],
        "tags": ["csm","cloudera","streams messaging","operator"],
        "url": "/blog/Cloudera-Streams-Messaging-Operator-1.1/",
        "teaser": "/assets/images/Cloudera%20Streams%20Messaging%20Operator.png"
      },{
        "title": "Introducing Cloudera’s Unified Runtime with 7.3.1",
        "excerpt":"We are thrilled to announce Cloudera’s first-ever unified release: Cloudera 7.3.1! This is a single software release available for both cloud and on-premises environments that enable capabilities, workloads, and governance to work and feel the same everywhere. With the cohesion of Cloudera on cloud 7.2.18 and Cloudera on premises 7.1.9...","categories": ["blog"],
        "tags": ["cloudera","cdp"],
        "url": "/blog/Cloudera-Unified-Runtime-7.3.1/",
        "teaser": "/assets/images/Cloudera-Data-Platform.png"
      },{
        "title": "Cloudera Streaming Analytics 1.14 for Cloudera Data Platform 7.3.1",
        "excerpt":"The Data In Motion team is pleased to announce the release of the Cloudera Streaming Analytics 1.14 for Cloudera Public Cloud and Private Cloud Base 7.3.1. This release includes improvements to SQL Stream Builder as well as updates to Apache Flink 1.19.1. These changes are focused on enhancing the user...","categories": ["blog"],
        "tags": ["csa","flink","cdp"],
        "url": "/blog/CSA-1.14-Release/",
        "teaser": "/assets/images/csa-architecture.png"
      },{
        "title": "Cloudera Streams Messaging - Kubernetes Operator 1.2",
        "excerpt":"Cloudera’s Data In Motion Team is pleased to announce the release of Cloudera Streams Messaging - Kubernetes Operator 1.2, an integral component of Cloudera Streaming - Kubernetes Operator. With this release, customers receive better security integration and an update to Kafka 3.8, besides other improvements. Release Highlights Rebase on Kafka...","categories": ["blog"],
        "tags": ["csm","kafka","kubernetes","cdp"],
        "url": "/blog/CSM-Kubernetes-Operator1-2-Release/",
        "teaser": "/assets/images/csm-op-deployment-architecture.jpg"
      },{
        "title": "Cloudera Migration Assistant 3.5.0",
        "excerpt":"Cloudera is excited to announce the General Availability of Cloudera Migration Assistant with the release of the 3.5.0 version. Cloudera’s go-to migration tool now supports migrating Spark2 and Spark3 workloads from Cloudera on premises to Cloudera on cloud, as well as automated execution of migrated workloads with Livy, for a...","categories": ["blog"],
        "tags": ["cloudera","spark","kubernetes","cdp"],
        "url": "/blog/Cloudera-Migration-Assistant-3.5.0/",
        "teaser": "/assets/images/Cloudera-Data-Platform.png"
      },{
        "title": "Cloudera Flow Management 4.0.0 Technical Preview for Cloudera 7.3.1",
        "excerpt":"The Data in Motion (DiM) team is pleased to announce the release of Cloudera Flow Management 4.0.0 as a Technical Preview for running Apache NiFi 2.0 with Cloudera Manager on Cloudera 7.1.9 and 7.3.1 Private Cloud Base clusters (all service packs). This release offers a number of new features and...","categories": ["blog"],
        "tags": ["cloudera","nifi"],
        "url": "/blog/Cloudera-Flow-Management-4.0.0/",
        "teaser": "/assets/images/nifi-logo.png"
      },{
        "title": "Cloudera DataFlow - Nifi 2.0 Python Processors",
        "excerpt":"Recently a task came up for one of my customers whom asked how to rebuild python processes they have running with ExecuteScript or ExecuteStreamCommand within NiFi 2.0 as a new python processor. This customer already has deep experience with nifi, python, and even custom java processors. As a user of...","categories": ["blog"],
        "tags": ["cloudera","dataflow","nifi"],
        "url": "/blog/NIFI-2-Python-Processor/",
        "teaser": "/assets/images/nifi-python-processor.png"
      },{
        "title": "Cloudera Apache NiFi Operator",
        "excerpt":"In a previous article (Installing Cloudera CFM Kubernetes Operator) I exposed steps necessary to deploy the Cloudera Apache NiFi Operator on MiniKube. In this article I am going to share some tips and tricks I have learned after completing this install in Openshift, Rancher, and recently EKS. CFM Deployment Architecture...","categories": ["blog"],
        "tags": ["kubernetes","operator","nifi"],
        "url": "/blog/Cloudera-Apache-NiFi-Operator/",
        "teaser": "/assets/images/kubernetes-logo.png"
      },{
        "title": "Cloudera Streams Messaging - Kubernetes Operator 1.3",
        "excerpt":"Cloudera’s Data In Motion Team is pleased to announce the release of Cloudera Streams Messaging - Kubernetes Operator 1.3, an integral component of Cloudera Streaming - Kubernetes Operator. With this release, customers receive a rebase to Kafka 3.9, automatic cluster rebalance, better offset management capabilities for Kafka connectors, and more!...","categories": ["blog"],
        "tags": ["csm","kafka","kubernetes","cloudera"],
        "url": "/blog/Cloudera-Streams-Messaging-Kubernetes-Operator-1.3/",
        "teaser": "/assets/images/csm-op-deployment-architecture.jpg"
      },{
        "title": "Cloudera Streaming Analytics - Kubernetes Operator 1.2",
        "excerpt":"Cloudera’s Data In Motion Team is pleased to announce the release of the Cloudera Streaming Analytics - Kubernetes Operator 1.2, an integral component of Cloudera Streaming - Kubernetes Operator. This release includes the general availability of Cloudera SQL Stream Builder for Kubernetes, as well as a rebase to Apache Flink...","categories": ["blog"],
        "tags": ["csa","cloudera","flink","operator"],
        "url": "/blog/Cloudera-Streams-Analytics-Kubernetes-Operator-1.2/",
        "teaser": "/assets/images/csa-architecture.png"
      },{
        "title": "Cloudera Flow Migration Tool - Migrate Nifi 1.0 flows to NiFi 2.0",
        "excerpt":"The Data in Motion (DiM) team is pleased to announce the release of the Cloudera Flow Management Migration Tool 1.0.0 in Technical Preview for assistance in migrating flows from Cloudera Flow Management 2.1.7 to Cloudera Flow Management 4.0. This release is a new product offering flow migration capabilities exclusive to...","categories": ["blog"],
        "tags": ["nifi","cloudera"],
        "url": "/blog/Nifi-1.0-to-Nifi-2.0-Migration-Tool/",
        "teaser": "/assets/images/nifi-logo.png"
      },{
        "title": "Cloudera Streaming Analytics 1.15 for Cloudera 7.3.1",
        "excerpt":"The Data In Motion team is pleased to announce the release of Cloudera Streaming Analytics 1.15 for Cloudera 7.3.1. This release focuses on enhancing the user experience and adding new important features to the product, and includes improvements to SQL Stream Builder as well as a rebase to Apache Flink...","categories": ["blog"],
        "tags": ["Cloudera Streaming Analytics","flink","cloudera"],
        "url": "/blog/CSA-1.15-Release/",
        "teaser": "/assets/images/csa-architecture.png"
      },{
        "title": "Cloudera Data Flow 2.10 for Cloudera on Cloud",
        "excerpt":"The Data In Motion Team is pleased to announce the release of Cloudera Data Flow 2.10 for Cloudera on Cloud. This release introduces NiFi 2 as generally available in Data Flow. Along with seamless NiFi 2 migrations, this positions Data Flow as the ideal platform to migrate, build, and deploy...","categories": ["blog"],
        "tags": ["Cloudera Data Flow","nifi"],
        "url": "/blog/Cloudera-DataFlow-2.10/",
        "teaser": "/assets/images/nifi-logo.png"
      },{
        "title": "Cloudera Flow Management - Kubernetes Operator 2.10",
        "excerpt":"The Data In Motion Team is pleased to announce the release of Cloudera Flow Management - Kubernetes Operator version 2.10. This release introduces NiFi 2 to the Cloudera Flow Management - Kubernetes Operator. In addition, it includes features that help with developer productivity, flow stability, operational overhead, and quality of...","categories": ["blog"],
        "tags": ["cloudera","nifi","kubernetes"],
        "url": "/blog/Cloudera-Flow-Management-Kubernetes-Operator-2.10/",
        "teaser": "/assets/images/kubernetes-logo.png"
      },{
        "title": "Cloudera Flow Management Migration Tool 3.0.0 for NiFi 1 to NiFi 2 migrations now GA",
        "excerpt":"The Data in Motion team is pleased to announce the generally available (GA) release of Cloudera Flow Management Migration Tool 3.0.0. This tool assists Cloudera customers in migrating from Cloudera Flow Management 2.1.7 Service Pack 2 (powered by NiFi 1) to Cloudera Flow Management 4.10.0 (powered by NiFi 2). Key...","categories": ["blog"],
        "tags": ["nifi","cloudera"],
        "url": "/blog/Cloudera-Nifi-2.0-Migration-Tool-GA/",
        "teaser": "/assets/images/nifi-logo.png"
      },{
        "title": "Cloudera Data Services On Premises 1.5.5 General Availability",
        "excerpt":"Cloudera is thrilled to announce the general availability (GA) of Data Services 1.5.5*. This is a significant milestone tailored to meet the security, reliability, and scalability requirements of many on-premises Data Services customers. Key capabilities of this release are: Cloudera AI Inference tech preview, cert-manager integration for non-wildcard certificates, Cloudera...","categories": ["blog"],
        "tags": ["cloudera"],
        "url": "/blog/Cloudera-Data-Services-1.5.5-GA/",
        "teaser": "/assets/images/Cloudera-Data-Platform.png"
      },{
        "title": "Cloudera Flow Management on DataHub 2.2.9 GA for Cloudera 7.3.1.400",
        "excerpt":"The Data in Motion Team is pleased to announce the General Availability (GA) release of Cloudera Flow Management 2.2.9 supporting Apache NiFi 2.3.0 and 1.28.1 for Cloudera Data Platform 7.3.1.400. This release offers a number of new features and improvements as well as upgraded dependencies. Key features for this release...","categories": ["blog"],
        "tags": ["cloudera","nifi"],
        "url": "/blog/Cloudera-Flow-Management-2.2.9-General-Availability/",
        "teaser": "/assets/images/nifi-logo.png"
      },{
        "title": "Cloudera Streaming Analytics - Kubernetes Operator 1.3",
        "excerpt":"Cloudera’s Data In Motion Team is pleased to announce the release of the Cloudera Streaming Analytics - Kubernetes Operator 1.3, an integral component of Cloudera Streaming - Kubernetes Operators. This release includes rebases to Apache Flink 1.20 and Apache Flink Kubernetes Operator 1.11.0. Other changes and updates are focused on...","categories": ["blog"],
        "tags": ["Cloudera Streaming Analytics","flink","cloudera","kubernetes"],
        "url": "/blog/Cloudera-Streaming-Analytics-Kubernetes-Operator-1.3/",
        "teaser": "/assets/images/csa-architecture.png"
      },{
        "title": "Cloudera Streams Messaging - Kubernetes Operator 1.4",
        "excerpt":"The Data In Motion team is thrilled to announce the release of Cloudera Streams Messaging - Kubernetes Operator 1.4 and the exciting new Cloudera Surveyor! This release marks a significant step forward in simplifying and enhancing your Apache Kafka management experience on Kubernetes, focusing on intuitive user experience and powerful...","categories": ["blog"],
        "tags": ["csm","kafka","kubernetes","cloudera"],
        "url": "/blog/Cloudera-Streams-Messaging-Kubernetes-Operator-1.4/",
        "teaser": "/assets/images/csm-op-deployment-architecture.jpg"
      },{
        "title": "Get Up To Speed With Cloudera AI 2026",
        "excerpt":"Happy New Year!!! It’s been quite some time since I had a moment to blog, and I figured the start of the new year was a good time to post about how much Cloudera has been doing in the AI space. Now, what kind of human would I be if...","categories": ["blog"],
        "tags": ["cloudera","ai","agent","ai studio","cml","amp","ai workbench"],
        "url": "/blog/Cloudera-AI/",
        "teaser": "/assets/images/clouderaai.png"
      }]
