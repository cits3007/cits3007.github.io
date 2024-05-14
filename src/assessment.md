---
title: "Assessment"
layout: page-toc-layout.njk
customStyle: |
  ul, ol, dl, li p {
    margin: 0 0 0.70em;
  }

  /* small */
  @media (max-width: 767px) {
    .assessment-table-ctr {
      width: 100%;
      overflow-x: scroll;
    }

    .assessment-table-ctr table {
      width: 110%;
      min-width: 500px;
    }
  }
  /* big */
  @media (min-width: 768px) {
    .assessment-table-ctr table {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .assessment-table-ctr th {
    background-color: var(--accent-v-v-light);
  }

  .assessment-table-ctr table {
    border-bottom: 1pt solid black;
    border-collapse: collapse;
  }

  .assessment-table-ctr th {
    text-align: center;
    border-top: 1pt solid black;
    border-bottom: 1pt solid black;
  }

  .assessment-table-ctr th,
  .assessment-table-ctr td
  {
    padding-top: 1ex;
    padding-left: 1em;
    padding-right: 1em;
    vertical-align: top;
  }

  /* col 1 */
  .assessment-table-ctr td:nth-child(1)
  {
    text-align: left;
    width: 24%;
  }

  /* col 2 */
  .assessment-table-ctr td:nth-child(2)
  {
    text-align: right;
    padding-right: 3em;
    width: 18%;
  }

  /* col 3 */
  .assessment-table-ctr td:nth-child(3)
  {
    text-align: left;
    width: 40%;
    padding-left: 2em;
  }


  /* col 4 */
  .assessment-table-ctr td:nth-child(4)
  {
    text-align: left;
    padding-left: 3em;
    width: 18%;
  }
---

{% set csmarks_url = siteinfo.csmarks_url %}
{% set cssubmit_url = siteinfo.cssubmit_url %}

{% set help_forum = siteinfo.help_forum %}
{% set forum_url  = siteinfo.forum_url %}

## About the unit assessments

### What are the assessment items, when are they due, and what are they worth?

The assessment for {{ siteinfo.unitcode }} consists of
an online quiz, a mid-semester take-home test, a project,
and a final examination:

::: { class="assessment-table-ctr" }

```{list-table}
:header-rows: 1
- {%- for header_item in siteinfo.assessment_table.header %}
  - {{ header_item }}
  {%- endfor %}
{%- for row in siteinfo.assessment_table.body %}
- {%- for el in row %}
  - {{ el }}
  {%- endfor %}
{%- endfor %}
```

:::


Assessments will normally be due at **5 pm**{ class="hi-pri" } on
<span
 class="tooltip"
 data-tooltip-text="Then if submission fails, there's a weekday left to contact the UC and fix it.">
**Thursdays**{ class="hi-pri" }</span>.
Any changes to this will be announced in the
[**{{help_forum}}**]({{forum_url}}){ class="hi-pri" target="_blank" }
help forum,
as well being noted on this website.

<!--

_x

-->

**Do not**{ class="hi-pri" } rely on the [Unit Outline]({{outline_url}})
for exact
assessment due dates -- the software used to generate the unit outlines
is known to be buggy, and may insert incorrect due dates.
Instead, use the assessment dates published here (also available from
the [**Schedule**](/schedule){ class="hi-pri" }).
Any changes will be published here, as well as being announced
on the unit [**discussion forum**]({{forum_url}}){ target="_blank" }.

<!--

x_

-->

Online quizzes, tests and exams **must**{ class="hi-pri" } be submitted by the
due date and time – this will be enforced strictly (just as it is for
face-to-face tests and exams), and late submissions will receive a mark
of 0. It is your responsibility to ensure you submit by the due date and
time -- even if you think a website such as Moodle will not stop you
from making a late submission.

[No extensions are permitted](/faq#extensions){ class="hi-pri" }
for quizzes and tests: they must be
done on the dates specified (just as for face-to-face tests and exams).
For more details, see [**"Can I get an extension on the deadline for an
assessment?"**](/faq#extensions){ class="hi-pri" } in the unit FAQ.

Your submitted work or answers for any assessment item
[may be submitted](/faq#plagiarism-checks) to plagiarism detectors
such as `JPlag`, `moss` or `turnitin` to detect plagiarism.

The quizzes, tests and exam do contain theoretical questions, but are
also intended to assess *practical* skills and knowledge.
They're not completed on paper, but instead on computer
(your own, for quizzes and tests, or a lab computer, for the exam)
and they may ask you to write compileable and executable code, or to
investigate the properties of the standard [CITS3007 development
environment](/faq/#cits3007-sde). So make sure you have
access to the development environment while you complete assessments --
you're encouraged to use it to work out or to check your answers.


### Common questions about assessments { #assessment-faqs # }

Several common questions about assessment are answered on the
unit [**FAQ**](/faq){ class="hi-pri" } (Frequently Asked Questions) page.

These include the following:

- [What material is examinable/testable?](/faq#examinable-material)
- [What are the expectations regarding citation of sources/academic
  conduct?](/faq#source-citation-conduct-expectations)<br>
  (In brief: abide by UWA's academic conduct policy; be careful not to
  plagiarize.) 
- [What is the marking rubric for assessments?](/faq#marking-rubric)
- [Are the quizzes/tests/exams open book?](/faq#test-conduct)


## Assessment item details


### Week 4 quiz

- This quiz will be available on {{ siteinfo.moodle }}.

{#

- *2024-0X-XX*: Solutions to the "long English answer" questions are
  now available on {{ siteinfo.moodle }}.
- 
#}

<!--!
<details>
<summary>Quiz details (click to expand)</summary>
<div style="border: inset 5pt var(--accent-v-light); margin: 2em; padding: 1em; border-radius: 5pt;">
!-->


- Ensure you leave at least 1-2 hours available in which to complete it.
  If you wait until 2 hours before the due time, and
  don't complete it, you will be awarded 0 marks for incomplete
  questions.
- The quiz will need to
  be completed in one sitting, and students are allowed only one attempt
  at it. There is a time limit of 2 hours (though the quiz should take
  less than that).
- Once you've started the quiz, it's best not to leave your browser
  or computer unattended -- the quiz may time out, or the browser
  may refresh, and Moodle may record you as not having completed
  the quiz.
- The quiz is open-book; you can ***look at*** any book, website or
  software you like. However, the answers must be your own work (not that
  of anyone else) and in your own words, and you must not distribute your answers to other
  people.
- Ensure you have a good Internet connection when sitting the quiz -- you
  should sit it either on a UWA lab computer, or at home, but not using
  WiFi or a mobile device, as these could drop out part-way through.
- If you use a WiFi or mobile connection and it fails, you won't be
  given extra time to complete the quiz.
  If for some reason you can't access the quiz on {{ siteinfo.moodle }}, email me
  immediately from your University email account with a screenshot or
  photo showing the problem.
- Once you've finished the quiz, **take and keep** a
  **screenshot** of your completed attempt.

<!--!
</div>
</details>
!-->



{#
Marks for the quiz are now available
in [csmarks](https://secure.csse.uwa.edu.au/run/csmarks/),
and solutions are available here ([PDF][quiz-sol-pdf],
[Markdown][quiz-sol-md]). The Blackboard {{ siteinfo.lms }} should show your mark for individual
questions.


#}


### Week 7 mid-semester test { #mid-sem-test }

The week 7 mid-semester test will be made available
in week 7 on
{{ siteinfo.moodle }}, under "Week 7 mid-semester test". You will have 24
hours to complete the test
{#
(which should only take about an hour)
#}, and
should submit it via {{ siteinfo.moodle }}.

The same instructions apply to the mid-semester test as for the week 4
quiz:

<!--!
<details>
<summary>Test details (click to expand)</summary>
<div style="border: inset 5pt var(--accent-v-light); margin: 2em; padding: 1em; border-radius: 5pt;">
!-->

- Ensure you leave at least 1-2 hours available in which to complete the test.
  If you wait until 2 hours before the due time, and
  don't complete it, you will be awarded 0 marks for incomplete
  questions.
- The test will need to
  be completed in one sitting, and students are allowed only one attempt
  at it. There is a time limit of 2 hours.
- Once you've started the test, it's best not to leave your browser
  or computer unattended -- the test may time out, or the browser
  may refresh, and Moodle may record you as not having completed
  the test.
- The test is open-book; you can ***look at*** any book, website or
  software you like. However, the answers must be your own work (not that
  of anyone else) and in your own words, and you must not distribute your answers to other
  people.
- Ensure you have a good Internet connection when sitting the test -- you
  should sit it either on a UWA lab computer, or at home, but not using
  WiFi or a mobile device, as these could drop out part-way through.
- If you use a WiFi or mobile connection and it fails, you won't be
  given extra time to complete the test.
  If for some reason you can't access the test on {{ siteinfo.moodle }}, email me
  immediately from your University email account with a screenshot or
  photo showing the problem.
- Once you've finished the test, **take and keep** a
  **screenshot** of your completed attempt.

<!--!
</div>
</details>
!-->


### Project

The project for the unit, worth
{{ siteinfo.assessments.project.marksPercent }}%
of the unit's marks, is due on
{{ siteinfo.assessments.project.dates.due | dateFormat("dddd D MMM") }}.

It is to be completed individually.


The spec for the project is available here ([PDF][project-spec])
([markdown][project-spec-md]).

- Project [code]({{ "/assignments/project-code.zip" | url }}) (.zip file)

[project-spec]: {{ "/assignments/project-spec.pdf" | url }}
[project-spec-md]: {{ "/assignments/project-spec.md" | url }}

(**Project spec and code updated to version 0.2 on 14 May 2024.
Make sure you are working off the most up-to-date version.**)

{#

Sample solutions are available
[**here**][project-solutions]{: class="hi-pri" :} (PDF file).

[csmarks]: https://secure.csse.uwa.edu.au/run/csmarks
[project-solutions]: {{ "workshops/project-solutions.pdf" | relative_url }}

#}


### Exam

The exam is a **face-to-face**{ class="hi-pri" }, laboratory-based practical exam, held during the UWA exam period.
Details of the date and time will be available from your exam timetable.
Once available, the exact venues will be published on the University
Blackboard {{ siteinfo.lms }}.

Note that you **must**{ class="hi-pri" } be present in person to sit
your exam (even if you are granted a deferred exam or supplementary
assessment).

The exam will be completed in {{ siteinfo.moodle }}, using laboratory
computers.

The exam is *not* open-book, but (in addition to Moodle) you are permitted access to the
following tools and materials:

- a printed or hand-written A4 page of notes (written both sides).
- copies of the lecture slides and lab worksheets (although not the lab
  solutions). These will be downloadable from Moodle during the exam.
- a PDF copy of the draft C11 standard. This will be downloadable from Moodle during the exam.

<!--

- any compiler or editor available on the lab computer being used for
  the exam. For details of what software is available on lab computers,
  you are welcome to attend a lab in person.

-->


#### Past exam papers

See ["Are past exams available?"](/faq#past-exams-availability) in the
unit FAQ.


<!--
  vim: tw=72
-->
