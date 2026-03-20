---
layout: single
title: Categories
permalink: /categories/
---

<div class="category-list">
  {% assign categories = site.categories | sort %}
  {% for category in categories %}
    <a href="#{{ category[0] | slugify }}" class="category-link" style="margin-right: 15px; font-weight: bold;">
      {{ category[0] | upcase }} ({{ category[1].size }})
    </a>
  {% endfor %}
</div>

<hr>

{% for category in categories %}
  <section id="{{ category[0] | slugify }}">
    <h2>{{ category[0] }}</h2>
    <ul>
      {% for post in category[1] %}
        <li>
          <span style="color: #666;">{{ post.date | date: "%Y-%m-%d" }}</span> — 
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </li>
      {% endfor %}
    </ul>
    <a href="#top" style="font-size: 0.8em;">Back to top ↑</a>
  </section>
{% endfor %}