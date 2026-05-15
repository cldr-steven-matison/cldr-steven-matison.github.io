---
layout: collection
title: Categories
permalink: /categories/
classes: wide
---

<div class="feature__wrapper">
  {% assign categories = site.categories | sort %}
  {% for category in categories %}
    <a href="#{{ category[0] | slugify }}" class="btn btn--primary" style="margin-bottom: 5px;">
      {{ category[0] }} <span class="badge">{{ category[1].size }}</span>
    </a>
  {% endfor %}
</div>

{% for category in categories %}
  <section id="{{ category[0] | slugify }}">
    <h2 class="archive__subtitle">{{ category[0] }}</h2>
    
    <div class="entries-grid">
      {% for post in category[1] %}
        {% include archive-single.html type="grid" %}
      {% endfor %}
    </div>
    
    <a href="#top" class="back-to-top" style="font-size: 0.8em; display: block; margin-top: 20px;">Back to top ↑</a>
    <hr>
  </section>
{% endfor %}