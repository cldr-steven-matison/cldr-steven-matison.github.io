---
layout: single
title: Tags
permalink: /tags/
---

{% assign tags = site.tags | sort %}
<div class="tag-cloud">
  {% for tag in tags %}
    <a href="#{{ tag[0] | slugify }}" style="margin-right: 10px;">{{ tag[0] }} ({{ tag[1].size }})</a>
  {% endfor %}
</div>

<hr>

{% for tag in tags %}
  <h2 id="{{ tag[0] | slugify }}">{{ tag[0] }}</h2>
  <ul>
    {% for post in tag[1] %}
      <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}