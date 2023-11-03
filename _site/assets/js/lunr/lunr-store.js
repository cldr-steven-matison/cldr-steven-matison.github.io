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
      }]
