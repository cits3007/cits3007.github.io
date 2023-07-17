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
and a final examination.

Assessments will normally be due at **5 pm**{ class="hi-pri" } on
<span title="Why Thursday? Because then if something goes wrong with
submission, there's still a weekday left to contact the UC and fix it." >**Thursdays**{ class="hi-pri" }</span>.
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
Instead, dates for assessments are listed on this site on the
unit [**Schedule**](/schedule){ class="hi-pri" }
(as well as here on the [**Assessments page**](/assessment){ class="hi-pri" }),
and any changes will be published here, as well as being announced
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

**No extensions are permitted**{ class="hi-pri" }
for quizzes, tests and exams: they must be
done on the dates specified (just as for face-to-face tests and exams).
For the purpose of "reasonable adjustments" made for students who
require them: quizzes, tests and exams count as "timed assessments"
(although the time limit is generous), and no extension of the due date
is possible.

Your submitted work or answers for any assessment item
may be submitted to plagiarism detectors
such as `JPlag`, `moss` or `turnitin` to detect plagiarism.


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


### What material is examinable/testable? { #examinable-material }

For any test, quiz or exam, you may assume that the following are
examinable:

- the contents of the lecture slides
- the spoken content of the lectures
- any recommended reading for the lecture
- any reading linked to from the lecture slides
- the lab sheets
- any recommended reading for the labs
- material contained in the solutions or model answers
  for lab worksheets or assessments
- applying any technique covered in the previous items
- any information that can reasonably be deduced
  from the previous items

for all weeks up to and including the week prior to the test, quiz or
exam.

### What are the expectations regarding citation of sources/academic conduct?

You **must**{ class="hi-pri" } act in accordance with
UWA's [academic conduct policy][acad-policy].
See the STUDYSmarter team's [Guide to Avoiding Academic
Misconduct][misconduct-guide] for additional details.

In particular, you **must not**{ class="hi-pri" } plagiarize any
work. Plagiarism is the unattributed use of
someone else's words, creations, ideas or
arguments as one's own. At UWA, it is extended to include paraphrasing
which is too close to the original.

Even when quizzes, tests and exams are open book, you are expected to:

a.  demonstrate an **understanding**{ class="hi-pri" } of the answers
    you write (and may be asked to demonstrate that understanding
    orally)
b.  ensure any answers you write are **in your own words**{ class="hi-pri" }
c.  properly **cite**{ class="hi-pri" } any sources you make use of.

An exception to \(c\) is that you need not cite lecture slides or
worksheets provided for this unit as being a source of ideas.
You still may not reproduce the
content of them directly -- copying and pasting in the text of a slide from the
lecture slides as one of your answers
is still plagiarism -- but you need not cite them as a source
of ideas
(it's assumed they are a common source of ideas for all answers).


[acad-policy]: https://www.uwa.edu.au/students/Getting-started/Student-conduct
[misconduct-guide]: https://www.student.uwa.edu.au/__data/assets/pdf_file/0007/2748139/R3-Avoiding-Academic-Misconduct.pdf

Marking rubrics for an assessment item will usually be
published with that assessment item. In particular, the
unit project will have a breakdown of marks available,
and how they can be achieved.

Wherever possible, we adopt a rubric based on the
scheme outlined in the unit FAQ
(see [**"What is the marking rubric?"**](/faq#marking-rubric){ class="hi-pri" }.

For information on whether quizzes/tests/exams are open book, and other details
of test conduct, see the unit FAQ
(under [**"Are the quizzes/tests/exams open book?"**](/faq#test-conduct){ class="hi-pri" }.

## Assessment item details


### Week 3 quiz

- This quiz will be available on the {{ siteinfo.moodle }}.


<!--!
<details>
<summary>Quiz details (click to expand)</summary>
<div style="border: inset 5pt var(--accent-v-light); margin: 2em; padding: 1em; border-radius: 5pt;">
!-->


- Ensure you leave at least 1-2 hours available in which to complete it.
  If you wait until 2 hours before the due time, and
  don't complete it, you will be awarded 0 marks.
- The quiz will need to
  be completed in one sitting, and students are allowed only one attempt
  at it. There is a time limit of 4 hours (though the quiz should take
  much less than that).
- Once you've started the quiz, it's best not to leave your browser
  or computer unattended -- the quiz may time out, or the browser
  may refresh, and LMS will record you as not having completed
  the quiz.
- You will not be able to correct your answer to a question once you
  have answered it.
- The quiz is open-book; you can make use of any book, website or
  software you like, but the answers must be your own work (not that
  of anyone else), and you must not distribute your answers to other
  people.
- Questions may be drawn from any content contained in lectures, lecture
  slides, lab/workshop exercises or assigned readings up until the end
  of week 2, or may require
  you to make reasonable inferences from that material or to investigate
  questions arising from that material.
- Ensure you have a good Internet connection when sitting the quiz -- you
  should sit it either on a UWA lab computer, or at home, but not using
  WiFi or a mobile device, as these could drop out part-way through.
- If you use a WiFi or mobile connection and it fails, you won't be
  given extra time to complete the quiz.
  If for some reason you can't access the quiz on the LMS, email me
  immediately from your University email account with a screenshot or
  photo showing the problem.
- Once you've finished the quiz, **take and keep** a
  **screenshot** of your completed attempt. You should see the LMS display a
  dialog like the following; screenshot and save it:
  <!--!<div style="display: flex; justify-content: center;">!-->
  ![]({{ '/images/successful-quiz-submission.png' | url }} "quiz submission dialog")
  <!--!</div>!-->

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

[quiz-sol-pdf]: {{ "/assignments/quiz-solutions.pdf" | url }}
[quiz-sol-md]:  {{ "/assignments/quiz-solutions.md" | url }}
#}


### Week 7 mid-semester test { #mid-sem-test }

The week 7 mid-semester test will be made available
in week 7 on the
{{ siteinfo.moodle }}, under "Week 7 mid-semester test". You will have 24
hours to complete the test
{#
(which should only take about an hour)
#}, and
should submit it via the {{ siteinfo.moodle }}.

{#

The questions contained in the exercise should be
good practice for the [exam](#exam).

The marking rubric is available [here][exercise-rubric] (PDF).

[exercise-rubric]: {{ "/assignments/exercise-rubric.pdf" | url }}

Marks are now available on csmarks, and sample solutions
are available [as a PDF][ex-sol].

[ex-sol]: {{ "/assignments/exercise-solutions.pdf" | url }}

#}

### Project

The project for the unit, worth
{{ siteinfo.assessments.project.marksPercent }}%
of the unit's marks is due on
{{ siteinfo.assessments.project.dates.due | dateFormat("dddd D MMM") }}.

It includes both programming work and written work, and is to be
completed individually.

{#

The spec for the project is available here ([PDF][project-spec])
([markdown][project-spec-md]). A marks breakdown/rubric is available as
well ([HTML][project-rubric]) ([markdown][project-rubric-md]).

Other useful resources:

- Project ["skeleton" code]({{ "/assignments/curdle-skeleton-code.zip" | url }}) (.zip file)
- Sample [API documentation]({{ "/assignments/docs/html" | url }})
- Submission checker [submission-checker.txz]({{ "/assignments/submission-checker.txz" | url }})

Other useful resources:

- Project ["skeleton" code]({{ "/assignments/curdle-skeleton-code.zip" | url }}) (.zip file)
- Sample [API documentation]({{ "/assignments/docs/html" | url }})
- Submission checker [submission-checker.txz]({{ "/assignments/submission-checker.txz" | url }})

[project-spec]: {{ "/assignments/project-spec.pdf" | url }}
[project-spec-md]: {{ "/assignments/project-spec.md" | url }}
[project-rubric]: {{ "/assignments/rubric.html" | url }}
[project-rubric-md]: {{ "/assignments/rubric.md" | url }}
#}

{#

**Update**{ style="color: #B72240;" }: Please note that [revisions were
made]{ style="color: #B72240;" }  to the project on 9th May
and 12th May -- make sure you're working from the most up-to-date
version. Announcements about revisions were posted in the
[Help5501][help5501] forum.

[help5501]: {{ forum_url }}

#}

{#

The details are available [here][project-pdf] (PDF)

[project-pdf]: {{ "/workshops/project.pdf" | relative_url }}

Sample solutions are available
[**here**][project-solutions]{: class="hi-pri" :} (PDF file).

[csmarks]: https://secure.csse.uwa.edu.au/run/csmarks
[project-solutions]: {{ "workshops/project-solutions.pdf" | relative_url }}

#}


### Exam

The exam is a face-to-face, laboratory-based practical exam, held during
the UWA exam period. This page will be updated with further details of
the exam in due course.

{#
take-home exam, so open-book and not invigilated.

To maintain exam integrity, students may be selected for a short (less than 10 mins)
follow-up meeting (either face-to-face, or via MS Teams) with a marker,
where they should expect to answer some basic questions about their exam responses.

The exam will be available for 48 hours from its publication on LMS
to its due date, and can be submitted at any time within that range.
It should take about 2 hours' work to complete.
Refer to the table of assessments under
"[About the Unit Assessments](#about-the-unit-assessments)" for
details of the publication date and due date.

As this is the first year in which CITS3007 has run, no past exams are
available. Sample exam-style questions will be discussed in the final
lecture (week 12).
#}

{#

#### Past exam papers

Exam papers from several previous years are available
via the {{ siteinfo.lms }} -- look under "Previous exams".
These exam papers are provided only to CITS5501 students for study
purposes, and may not be published or distributed elsewhere.

(Note that although the UWA Library's ["OneSearch" search][onesearch]
facility lists some past exams as being available via OneSearch
when "CITS5501" is entered as a query, the content
of the unit has changed significantly since they were
released, and they are no longer a good guide to what you can
expect.)

The best use of past exams is for your practice purposes --
if possible, try writing answers and timing how long you
take. I do *not* publish answers to past exams
for two reasons:

- For many of the questions, there *is* no one correct answer.
  The exam questions often require you to analyse a scenario and argue
  in favour of a particular decision or test design. Questions
  like this are assessed on your ability to identify relevant
  factors and justify a decision/conclusion, and not on whether you
  have mentioned particular things in your answer.
- Providing an "answer" often encourages students to
  think that if they have read through the answers and understood it,
  they have revised well for the exam. This is not correct!
  You need to actually go through the process of writing
  an answer yourself.

However, if you have attempted
a previous year's exam, I encourage you to drop in
during my
[**consultation time**]({{ "/#unit-coordinator" | url }})
(or make an appointment with me)
during weeks 11--13,
and I can provide feedback on your answers.

[onesearch]: https://onesearch.library.uwa.edu.au/

#}

## Why is this page so long?

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 0.5em 2em; border-radius: 5pt; margin-top: 0.5em; margin-bottom: 0.5em">

For every rule, there is a story ... Sometimes the story is obvious
such as a sign that reads "Do not drive on the ice" or "No Smoking" at
the fuel pump. Other times, reading the instruction manual of a
consumer device has specific instructions such as "Do not use
television in water" or "Do not put oatmeal in the CD drive".

</div>

> - J. Matthews, "Every Rule Has a Story..." in *IEEE Communications
>   Standards Magazine*, vol. 6, no. 1, pp. 4-4, March 2022, doi:
>   [10.1109/MCOMSTD.2022.9762870](https://doi.org/10.1109/MCOMSTD.2022.9762870)


See also [r/AskReddit][askreddit], "[What rule exists because of
you?][what-rule]".

[askreddit]: https://www.reddit.com/r/AskReddit/
[what-rule]: https://www.reddit.com/r/AskReddit/comments/576qaw/what_rule_exists_because_of_you/

<!--
  vim: tw=72
-->
