---
layout: tags
title: Tags
permalink: /tags/
---

{% assign tags = site.tags | sort %}
<div class="feature__wrapper">
  {% assign tags = site.tags | sort %}
  {% for tag in tags %}
    <a href="#{{ tag[0] | slugify }}" class="btn btn--info" style="margin-bottom: 5px;">
      {{ tag[0] }} <span class="badge">{{ tag[1].size }}</span>
    </a>
  {% endfor %}
</div>

{% for tag in tags %}
  <h2 id="{{ tag[0] | slugify }}">{{ tag[0] }}</h2>
  <ul>
    {% for post in tag[1] %}
      <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}