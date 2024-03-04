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

There is no one textbook that covers all the unit topics, but the [unit
schedule](/schedule) lists recommended readings on various topics.

What you *do* need is access to a good C textbook -- see [here](#c-programming){ class="hi-pri" }.
C is a fairly small language, but some of the details relating to security are subtle.

An operating systems textbook will also be helpful -- see [here](#operating-systems){ class="hi-pri" }.

As noted on the [welcome page](/#assumed-knowledge), it's assumed you
are already familiar with a procedural or OO programming language.
It's also advisable to have completed [CITS2002 Systems
Programming][cits2002], which covers operating systems
and C programming, as well as the basics of using the Linux
command-line.
(For further information, see the unit FAQ, under
[**"Do I need to have completed CITS2002 before enrolling in
CITS3007?"**](/faq#advisable-study).)



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
You will need to have access to a good C **textbook** in order to do well in this
unit. YouTube videos or online tutorials will **not** be sufficient.

The following is an acceptable C textbook which covers the C11 standard.
(It actually uses the C17 standard, but the differences for our purposes
are minimal.)

- Robert C. Seacord, *[Effective C: An Introduction to Professional C
  Programming](https://nostarch.com/Effective_C)* (No Starch Press,
  2020)

The textbooks recommended for [CITS2002 Systems Programming][c-text]{ class="hi-pri" } are also suitable.
There is no need to use the Seacord text just because I have suggested
it -- you should pick a textbook that you feel comfortable with.

[c-text]: https://teaching.csse.uwa.edu.au/units/CITS2002/c-books.php

If you are already familiar with the C99 standard, the [Wikipedia page][wiki-c11]
on the C11 standard provides a good summary of the changes. Two of the
most useful features introduced in C11 (for our purposes) are

**[static assertions][static-assert]**{ class="hi-pri" }:

:   These are an improvement on
    preprocessor-based assertions using `#if` and `#error`, because they can
    make use of information known only by the compiler (as opposed to [the
    preprocessor][cpp-assert]) -- for instance, the result of `sizeof` and `alignof`
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

### Lecture slides

Lecture slides will be published here as the semester
progresses.



::: { .resource-list }

- Week 1
  - Lecture 1 -- introduction {% resourceList "lect01--intro", ["pdf", "md"] %}
  - Lecture 2 -- C and memory intro {% resourceList "lect02--memory", ["pdf", "md"] %}  \
    [undef_demo.zip](/lectures/undef_demo.zip)

<!--

- Week 2
  - Lecture 3 -- Buffer and integer vulnerabilities {% resourceList "lect03--memory2", ["pdf", "md"] %}
- Week 3
  - Lecture 4 -- Access control and "confused deputies" {% resourceList "lect04--access", ["pdf", "md"] %}
- Week 4
  - Lecture 5 -- Injection and input validation intro {% resourceList "lect05--validation", ["pdf", "md"] %}
- Week 5
  - Lecture 6 -- Program analysis {% resourceList "lect06--analysis", ["pdf", "md"] %}
- Week 8
  - Lecture 7 -- Race conditions {% resourceList "lect07--concurrency", ["pdf", "md"] %}
  - Lecture 8 -- Secure development processes and practices {% resourceList "lect09--dev", ["pdf", "md"] %}
  - Lecture 8b -- Secure development processes and practices, cont'd {% resourceList "lect09b--dev", ["pdf", "md"] %}
- Week 9
  - Lecture 9 -- Cryptography introduction {% resourceList "lect08--crypto", ["pdf", "md"] %}
- Week 9
  - Lecture 9b -- Cryptography and best practices {% resourceList "lect08b--crypto", ["pdf", "md"] %}
- Week 
  - Lecture 10 -- IPC {% resourceList "lect10--ipc", ["pdf", "md"] %}

-->
{#
- Week 9
  - Lecture 8 -- Cryptography introduction {% resourceList "lect08--crypto", ["pdf", "md"] %}
  - Project tips {% resourceList "lect-project-tips", ["pdf", "md"] %}
- Week 11
  - Lecture 9 -- Secure development processes and practices {% resourceList "lect09--dev", ["pdf", "md"] %}
- Week 11
  - Lecture 10 -- revision {% resourceList "lect10--revision", ["pdf", "md"] %}

#}


:::


-------

## Labs { #labs }

Labs begin in week 2.
Worksheets for the labs will be published here as the semester
progresses.



### Worksheets

::: { .resource-list }


- Week 2 -- intro
  - Lab worksheet {% resourceList "lab01", ["html", "md"] %}
  - [lab-01-code.zip](/labs/lab-01-code.zip)

{#
  - Sample worksheet solutions {% resourceList "lab01-solutions", ["html", "md"] %}
- Week 3 -- debugging
  - Lab worksheet {% resourceList "lab02", ["html", "md"] %}
  - Sample worksheet solutions {% resourceList "lab02-solutions", ["html", "md"] %}
- Week 4 -- string-handling and `setuid`
  - Lab worksheet {% resourceList "lab03", ["html", "md"] %}
  - Sample worksheet solutions {% resourceList "lab03-solutions", ["html", "md"] %}
  - Solutions to the week 4 quiz "long English answer" questions are
    available on {{ siteinfo.moodle }}
- Week 5 -- `setuid` vulnerabilities
  - Lab worksheet {% resourceList "lab04", ["html", "md"] %}
  - Sample worksheet solutions {% resourceList "lab04-solutions", ["html", "md"] %}
- Week 6 -- buffer overflow
  - Lab worksheet {% resourceList "lab05", ["html", "md"] %}
  - Source code ([zip]({{ "/labs/bufoverflow-code.zip" | url }}))
  - Sample worksheet solutions {% resourceList "lab05-solutions", ["html", "md"] %}
- Week 7 -- static and dynamic analysis
  - Lab worksheet {% resourceList "lab06", ["html", "md"] %}
  - Sample worksheet solutions {% resourceList "lab06-solutions", ["html", "md"] %}
- Week 8 -- injection
  - Lab worksheet {% resourceList "lab07", ["html", "md"] %}
  - Sample worksheet solutions {% resourceList "lab07-solutions", ["html", "md"] %}
- Week 9 -- API documentation and testing
  - Lab worksheet {% resourceList "lab09", ["html", "md"] %}
  - Source code ([zip]({{ "/labs/lab-08-code.zip" | url }}))
  - Project [test code]({{ "/assignments/test-code.zip" | url }}) (.zip file)
- Week 10 -- cryptography
  - Lab worksheet {% resourceList "lab10", ["html", "md"] %}
  - Sample worksheet solutions {% resourceList "lab08-solutions", ["html", "md"] %}
- Week 9 -- race conditions
  - Lab worksheet {% resourceList "lab08", ["html", "md"] %}
  - Sample worksheet solutions {% resourceList "lab08-solutions", ["html", "md"] %}
- Week 10 -- API documentation and testing
  - Lab worksheet {% resourceList "lab09", ["html", "md"] %}
  - Project ["skeleton" code]({{ "/assignments/curdle-skeleton-code.zip" | url }}) (.zip file)
  - Sample [API documentation]({{ "/assignments/docs/html" | url }})
  - Submission checker [submission-checker.txz]({{ "/assignments/submission-checker.txz" | url }})

#}

:::


<!--
  vim: tw=72
-->
