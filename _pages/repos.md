---
layout: archive
title: "My Projects"
permalink: /repos/
author_profile: true
---

Below is an automated list of my GitHub repositories:

<div class="grid__wrapper">
  {% for repo in site.data.repos %}
    <div class="grid__item">
      <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
        <h2 class="archive__item-title no_toc" itemprop="headline">
          <a href="{{ repo.url }}" rel="permalink">{{ repo.name }}</a>
        </h2>
        
        <p class="archive__item-excerpt" itemprop="description">
          {{ repo.description | truncate: 120 }}
        </p>

        <div class="page__meta">
          <span style="background: #0056b3; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.8em; margin-right: 5px;">
            <i class="fas fa-code"></i> {{ repo.lang }}
          </span>
          
          <span style="color: #666; font-size: 0.8em;">
            <i class="fas fa-database"></i> 
            {% if repo.size > 1000 %}
              {{ repo.size | divided_by: 1000 }} MB
            {% else %}
              {{ repo.size }} KB
            {% endif %}
          </span>
        </div>
      </article>
    </div>
  {% endfor %}
</div>
