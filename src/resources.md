---
title: "Resources"
tags: ['toppage']
layout: page-layout.njk
customStyle: |
  .resource-list > ul > li {
    padding-top: 1ex;
    padding-bottom: 1ex;
  }

---

## Guides to the Linux command line

If you've not used the command-line interface of a Unix-like operating system
much, it's worth getting familiar with it. Besides being useful for this unit,
often in industry when working with cloud VMs, the command-line is the
only way you have of accessing them. One good tutorial on the Linux
command-line is

- <https://ryanstutorials.net/linuxtutorial/>

and there's also a free PDF guide to using the Linux command line: [*The Linux
Command Line*][lincomm], by William Shotts.

[lincomm]: http://linuxcommand.org/tlcl.php

## Streamed lectures

If attending a lecture online, details of how
to join the relevant Microsoft Teams meeting are:

- **{{ siteinfo.lecture_time }}**:
  [Click here](https://teams.microsoft.com/l/meetup-join/19%3ae7cbb9ffe0414d65b23ef97512e881c2%40thread.tacv2/1658109714208?context=%7b%22Tid%22%3a%2205894af0-cb28-46d8-8716-74cdb46e2226%22%2c%22Oid%22%3a%22e72c5de6-8733-4bc9-95bc-08b3eb1354a2%22%7d) \
  Or call in (audio only): +61 8 6118 1761, conference id 776 371 603#

If you have any difficulty attending the streamed lecture,
you can still access recordings of the lectures via the
university's [LMS][lms]{ target="_blank" } (Learning Management System).

{# _x #}

[lms]: http://www.lms.uwa.edu.au/


## Lecture slides

Lecture slides will be published here as the semester
progresses.





::: { .resource-list }

- Week 1
  - Lecture 1 -- introduction {% resourceList "lect01--intro", ["pdf", "md"] %}
- Week 2
  - Lecture 2 -- C and memory intro {% resourceList "lect02--memory", ["pdf", "md"] %}
- Week 3
  - Lecture 3 -- Buffer and integer vulnerabilities {% resourceList "lect03--memory2", ["pdf", "md"] %}
- Week 5
  - Lecture 4 -- Access control and "confused deputies" {% resourceList "lect04--access", ["pdf", "md"] %}
- Week 6
  - Lecture 5 -- Injection and input validation intro {% resourceList "lect05--validation", ["pdf", "md"] %}
- Week 7
  - Lecture 6 -- Program analysis {% resourceList "lect06--analysis", ["pdf", "md"] %}
{#
- Week 3
  (continuing slides from week 2)
- Week 4
  - Lecture 4a -- input space partitioning intro {% resourceList "lect04a--isp-intro", ["pdf", "md"] %}
  - Lecture 4b -- input space partitioning {% resourceList "lect04b--isp", ["pdf", "md"] %}
- Week 5
  - Lecture 5a -- model-based testing {% resourceList "lect05a--intro", ["pdf", "md"] %}
  - Lecture 5b -- graph-based testing {% resourceList "lect05b--graph", ["pdf", "md"] %}
  - Lecture 5c -- logic-based testing {% resourceList "lect05c--logic", ["pdf", "md"] %}
- Week 6--7
  - Lecture 6a -- syntax-based testing {% resourceList "lect06a--syntax", ["pdf", "md"] %}
  - Lecture 6b -- random testing       {% resourceList "lect06b--random", ["pdf", "md"] %}
- Week 8
  - Lecture 7A, integration and system testing {% resourceList "lect07a--system", ["pdf", "md"] %}
  - Lecture 7B, reviews and quality assurance  {% resourceList "lect07b--quality", ["pdf", "md"] %}
- Week 9
  - Lecture 8A, Risk                  {% resourceList "lect08a--risk", ["pdf", "md"] %}
  - Lecture 8A, Formal methods intro  {% resourceList "lect08b--formal", ["pdf", "md"] %}
  - Case study -- Knight Capital trading loss {% resourceList "lect08c--knight", ["pdf", "md"] %}
- Week 10
  - Lecture 9, Program verification {% resourceList "lect09a--verification", ["pdf", "md"] %}
  - Other material -- "[Mocks, stubs and spies with Mockito](https://youtu.be/xXO8ft-tsrY)" (YouTube) \
    (see also ch 12 of the textbook)
- Week 11
  - Lecture 10, Program specification -- alloy {% resourceList "lect10--alloy", ["pdf", "md"] %}
#}


:::

## Labs { #labs }

Labs begin in week 2.
Worksheets for the labs will be published here as the semester
progresses.

### Attending labs online

If you are enrolled in {{ siteinfo.unitcode }} online,
you can attend your lab/workshop by going to the
{{ siteinfo.unitcode }} team in MS Teams, finding the
"channel" for your lab, and clicking "join"
to join the online lab/workshop. The channels will become
available in week 2.

### Worksheets


::: { .resource-list }

- Week 2 -- intro
  - Lab worksheet {% resourceList "lab01", ["html", "md"] %}
  - Sample worksheet solutions {% resourceList "lab01-solutions", ["html", "md"] %}
- Week 3 -- debugging
  - Lab worksheet {% resourceList "lab02", ["html", "md"] %}
  - Sample worksheet solutions {% resourceList "lab02-solutions", ["html", "md"] %}
- Week 5 -- `setuid`
  - Lab worksheet {% resourceList "lab03", ["html", "md"] %}
  - Sample worksheet solutions {% resourceList "lab03-solutions", ["html", "md"] %}
- Week 6 -- buffer overflow
  - Lab worksheet {% resourceList "lab04", ["html", "md"] %}
  - Source code ([zip]({{ "/labs/lab04-code.zip" | url }})) 
  - Sample worksheet solutions {% resourceList "lab04-solutions", ["html", "md"] %}
- Week 7 -- static and dynamic analysis
  - Lab worksheet {% resourceList "lab05", ["html", "md"] %}
{#
  - Source code ([zip]({{ "/workshops/workshop-01-code.zip" | url }}))
  - Sample worksheet solutions {% resourceList "workshop01-solutions", ["pdf", "md"] %}
- Week 3 -- data-driven tests
  - Lab worksheet {% resourceList "workshop02", ["pdf", "md"] %}
  - Source code ([zip]({{ "/workshops/workshop-02-code.zip" | url }}))
  - Sample worksheet solutions {% resourceList "workshop02-solutions", ["pdf", "md"] %}
- Week 4 -- ISP
  - Lab worksheet {% resourceList "workshop03", ["pdf", "md"] %}
  - Sample worksheet solutions {% resourceList "workshop03-solutions", ["pdf", "md"] %}
- Week 5 -- graphs
  - Lab worksheet {% resourceList "workshop04", ["pdf", "md"] %}
  - Sample worksheet solutions {% resourceList "workshop04-solutions", ["pdf", "md"] %}
- Week 6 -- logic
  - Lab worksheet {% resourceList "workshop05", ["pdf", "md"] %}
  - Sample worksheet solutions {% resourceList "workshop05-solutions", ["pdf", "md"] %}
- Week 7 -- syntax
  - Lab worksheet {% resourceList "workshop06", ["pdf", "md"] %}
  - Source code ([zip]({{ "/workshops/workshop-06-code.zip" | url }}))
  - Sample worksheet solutions {% resourceList "workshop06-solutions", ["pdf", "md"] %}
- Week 8 -- code reviews
  - Lab worksheet               {% resourceList "workshop07", ["pdf", "md"] %}
  - Sample worksheet solutions  {% resourceList "workshop07-solutions", ["pdf", "md"] %}
- Week 9 -- risk
  - Lab worksheet               {% resourceList "workshop08", ["pdf", "md"] %}
  - Sample worksheet solutions  {% resourceList "workshop08-solutions", ["pdf", "md"] %}
- Week 10 -- program verification
  - Lab worksheet               {% resourceList "workshop09", ["pdf", "md"] %}
  - Sample worksheet solutions  {% resourceList "workshop09-solutions", ["pdf", "md"] %}
- Week 11 -- specification languages
  - Lab worksheet               {% resourceList "workshop10", ["pdf", "md"] %}

#}

:::




