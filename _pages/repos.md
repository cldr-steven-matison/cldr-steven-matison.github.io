---
layout: archive
title: "GitHub Repositories"
permalink: /repos/
author_profile: true
---

Automated showcase of my GitHub repositories, synchronized daily via GitHub Actions.

<div class="grid__wrapper">
  {% for repo in site.data.repos %}
    <div class="grid__item">
      <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
        <h2 class="archive__item-title no_toc" itemprop="headline">
          <a href="{{ repo.url }}" rel="permalink">{{ repo.name }}</a>
        </h2>
        
        {% if repo.description %}
          <p class="archive__item-excerpt" itemprop="description">
            {{ repo.description | truncate: 120 }}
          </p>
        {% else %}
          <p class="archive__item-excerpt" itemprop="description">
            <em>No description provided.</em>
          </p>
        {% endif %}

        <div class="page__meta" style="margin-top: 10px;">
          
          {% if repo.lang %}
          <span class="btn btn--info" style="padding: 0.2em 0.6em; font-size: 0.7em; cursor: default; pointer-events: none; margin-bottom: 5px;">
            <i class="fas fa-code" aria-hidden="true"></i> {{ repo.lang }}
          </span>
          {% endif %}
          
          <span class="btn btn--inverse" style="padding: 0.2em 0.6em; font-size: 0.7em; cursor: default; pointer-events: none; opacity: 0.8; margin-bottom: 5px;">
            <i class="fas fa-database" aria-hidden="true"></i> 
            {% if repo.size > 1000 %}
              {{ repo.size | divided_by: 1024 | round: 1 }} MB
            {% else %}
              {{ repo.size }} KB
            {% endif %}
          </span>

          <span class="btn" style="padding: 0.2em 0.6em; font-size: 0.7em; cursor: default; pointer-events: none; margin-bottom: 5px; background-color: #eeeeee; color: #444444; border: 1px solid #dddddd;">
            <i class="fas fa-calendar-alt" aria-hidden="true"></i> {{ repo.updated }}
          </span>

        </div>
      </article>
    </div>
  {% endfor %}
</div>