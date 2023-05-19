---
title:  "Converting NiFi XML to JSON with NiFi"
header:
  teaser: "/assets/images/2023-05-19-dataflow-xml-to-json.png"
categories: 
  - blog
tags:
  - nifi
---

I wanted to work with some old nifi xml templates in DataFlow which requires new nifi json flow definition files.  To get these templates converted I had to import them to an operational nifi, drag them onto the screen, and download the flow definition file I needed.  This seemed like a job for NiFi, not for me.   Since templates are going away,  I would suspect someday to see the upload template feature to go away in future nifi releases.  This potentially leaves a gap that I realized I could build an API to fill.

Enter NIFI Rest API [docs](https://nifi.apache.org/docs/nifi-docs/rest-api/index.html)


After a few working sessions I was able to come up with a nifi api using HandleHttpRequest/HandleHttpResponse with 4 internal Nifi Rest API calls using InvokeHttp.   You simply post an XML file to this api and the api will respond with HTTP 200 and the JSON flow definition file.


{% capture fig_img %}
![Foo]({{ "/assets/images/2023-05-19-dataflow-xml-to-json.png" | relative_url }})
{% endcapture %}

<figure>
  {{ fig_img | markdownify | remove: "<p>" | remove: "</p>" }}
  <figcaption>{{ fig_caption | markdownify | remove: "<p>" | remove: "</p>" }}</figcaption>
</figure>


You can find the Flow Definition File for my flow here:

[NiFi_Template_XML_to_Flow_Definition_JSON](https://github.com/cldr-steven-matison/NiFi-Templates/blob/main/NiFi_Template_XML_to_Flow_Definition_JSON.json)

