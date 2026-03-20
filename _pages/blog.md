---
layout: single
author_profile: true
permalink: /blog/
title: "Blog"
excerpt: "My Blog"
---


## My Posts
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>