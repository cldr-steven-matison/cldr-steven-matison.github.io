---
layout: archive
title: "My Projects"
permalink: /repos/
---

Below is an automated list of my GitHub repositories:

{% for repo in site.data.repos %}
  <div class="repo-card" style="border: 1px solid #eee; padding: 1rem; margin-bottom: 1rem;">
    ### [{{ repo.name }}]({{ repo.url }})
    <p>{{ repo.description }}</p>
    <span>⭐ {{ repo.stars }}</span>
  </div>
{% endfor %}