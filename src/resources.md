---
title: "Resources"
tags: ['toppage']
layout: page-toc-layout.njk
customStyle: |
  .resource-list > ul > li {
    padding-top: 1ex;
    padding-bottom: 1ex;
  }

---


## Textbooks

The main textbook for the unit is:

- Kohnfelder, L,
  [*Designing Secure Software*][kohnfelder] (No Starch Press, 2021)

[kohnfelder]: https://www.amazon.com/Designing-Secure-Software-Guide-Developers/dp/1718501927

As noted on the [welcome page](/#assumed-knowledge), it's assumed you
are already familiar with a procedural or OO language.
It's also advisable to have completed [CITS2002 Systems
Programming][cits2002], which covers operating systems
and C programming, as well as the basics of using the Linux
command-line.

[cits2002]: https://teaching.csse.uwa.edu.au/units/CITS2002/

If you are after textbooks which cover the recommended prior
knowledge, the following sections give some suggestions.

### The Linux command line

The content of this unit assumes you understand how to
navigate a Unix-like operating system using the command-line,
perform basic file operations, and build C projects using
[`gcc`][gcc] and [GNU Make][make].

[gcc]: https://gcc.gnu.org
[make]: https://www.gnu.org/software/make/

(If you've not used the command-line interface of a Unix-like operating system
much, you should get familiar with it. Besides being useful for this unit,
often in industry when working with cloud VMs, the command-line is the
only way you have of accessing them.)

One good tutorial on the Linux command-line is

- <https://ryanstutorials.net/linuxtutorial/>

and there's also a free PDF guide to using the Linux command line: [*The Linux
Command Line*][lincomm], by William Shotts.

[lincomm]: http://linuxcommand.org/tlcl.php

The recommended editor for this unit is [`vim`](https://www.vim.org),
though if you are already familiar with Emacs you are welcome to use
that instead. You will not always be able to use a GUI editor such
as [Visual Studio Code](https://code.visualstudio.com) – the
configuration details we give for some debuggers and static analysers
work only with `vim`.

### C programming { #c-programming }

The content of this unit assumes you already have a basic working knowledge of
the C programming language.
You will need to have access to a good C textbook in order to do well in this
unit. YouTube videos or online tutorials will not be sufficient.

The following is an acceptable C textbook which covers the C11 standard.
(It actually uses the C17 standard, but the differences for our purposes
are minimal.)

- Robert C. Seacord, *[Effective C: An Introduction to Professional C
  Programming](https://nostarch.com/Effective_C)* (No Starch Press,
  2020)

If you are already familiar with the C99 standard, the [Wikipedia page][wiki-c11]
on the C11 standard provides a good summary of the changes. Two of the
most useful features introduced in C11 (for our purposes) are

**[static assertions][static-assert]**{ class="hi-pri" }:

:   these are an improvement on
    preprocessor-based assertions using `#if` and `#error`, because they can
    make use of information known only by the compiler (as opposed to [the
    preprocessor][cpp-assert]) such as the result of `sizeof` and `alignof`
    expressions.\
    &nbsp;

**the [atomic operations library][atomics]**{ class="hi-pri" }:

:   This allows some [race conditions][race-cond] to be avoided.\
    &nbsp;


[wiki-c11]: https://en.wikipedia.org/wiki/C11_(C_standard_revision)
[static-assert]: https://en.wikipedia.org/wiki/Assertion_(software_development)#Static_assertions
[cpp-assert]: https://stackoverflow.com/questions/4079243/how-can-i-use-sizeof-in-a-preprocessor-macro
[atomics]: https://en.cppreference.com/w/c/atomic
[race-cond]: https://en.wikipedia.org/wiki/Race_condition

<!--
also suggested:

https://gustedt.gitlabpages.inria.fr/modern-c/
-->

### Operating systems

The content of this unit assumes you already have a basic working knowledge of
operating system fundamentals.
It is recommended you have access to a good operating systems textbook in order
to do well in this unit.

The following are acceptable operating systems textbooks:

- Remzi H. Arpaci-Dusseau, Andrea C. Arpaci-Dusseau, and Peter Reiher,
  *[Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)*
  (Arpaci-Dusseau Books, August 2018, Version 1.00)
- Ian Wienand, *[Computer Science from the Bottom Up](https://bottomupcs.com/index.html)*
- Randal Bryant and David O'Hallaron, *[Computer Systems: A Programmer's
  Perspective][cs-prog-persp]* (3rd edn; Pearson, 2015)

[cs-prog-persp]: https://www.amazon.com/Computer-Systems-Programmers-Perspective-3rd-dp-013409266X/dp/013409266X

-----

## Lectures

### Streamed lectures

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


### Lecture slides

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
- Week 8
  - Lecture 7 -- Race conditions {% resourceList "lect07--concurrency", ["pdf", "md"] %}
- Week 9
  - Lecture 8 -- Cryptography introduction {% resourceList "lect08--crypto", ["pdf", "md"] %}
  - Project tips {% resourceList "lect-project-tips", ["pdf", "md"] %}
- Week 11
  - Lecture 9 -- Secure development processes and practices {% resourceList "lect09--dev", ["pdf", "md"] %}
- Week 11
  - Lecture 10 -- revision {% resourceList "lect10--revision", ["pdf", "md"] %}



:::

-------

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
  - Sample worksheet solutions {% resourceList "lab05-solutions", ["html", "md"] %}
- Week 8 -- injection
  - Lab worksheet {% resourceList "lab06", ["html", "md"] %}
  - Sample worksheet solutions {% resourceList "lab06-solutions", ["html", "md"] %}
- Week 9 -- race conditions
  - Lab worksheet {% resourceList "lab07", ["html", "md"] %}
- Week 10 -- API documentation and testing
  - Lab worksheet {% resourceList "lab08", ["html", "md"] %}
  - Project ["skeleton" code]({{ "/assignments/curdle-skeleton-code.zip" | url }}) (.zip file)
  - Sample [API documentation]({{ "/assignments/docs/html" | url }})
  - Submission checker [submission-checker.txz]({{ "/assignments/submission-checker.txz" | url }})
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



<!--
  vim: tw=72
-->
