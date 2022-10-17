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

Assessments will normally be due at **5 pm**{ class="hi-pri" } on **Thursdays**{ class="hi-pri" }.
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
unit [**Schedule**](schedule){ class="hi-pri" }
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
time -- even if you think a website such as the LMS will not stop you
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

### What is the marking rubric?

Marking rubrics for an assessment item will usually be
published with that assessment item. In particular, the
unit project will have a breakdown of marks available,
and how they can be achieved.

Wherever possible, we adopt a rubric based on the
following scheme:

**Multiple choice/multiple selection/numeric answer/short answer question**{ class="hi-pri" }

:   These will normally be worth only a small amount each (e.g. 10 or 20
    marks out of a 200-mark quiz or test), and are marked automatically.
    100% is awarded for a correct answer, and 0% for an incorrect
    answer.

    Make sure to read these questions carefully, and answer exactly as
    requested. (E.g., if an answer asks for "Only a number", then
    answering "20 bytes", for example, would be marked incorrect.)
    Mis-reading the instructions will not be grounds for
    appealing an assessment decision.

    If answering a multiple choice or multiple selection question, you
    should give the best answer of those offered – if you think multiple
    answers are correct, but only one is allowed, give the one that's
    most correct. (Or, if you think none are correct, give the one that's
    least incorrect.)

    If a question is ambiguous, you may make reasonable assumptions in
    order to answer it. (If the assessment item provides space to record
    your assumptions, then make sure to write them down -- make sure you
    paste in the **full question text** your assumption relates to, as
    not all students get the questions in the same order -- and give each
    question a clear, bolded heading.)

**"Long answer" questions requiring C code**{ class="hi-pri" }

:   These will typically be (partly or wholly) automatically marked.
    It's important to make sure your answer does not contain any
    HTML/rich text formatting, or control characters like non-breaking
    spaces – these will cause compilation to fail.

    Therefore, you **should**{ class="hi-pri" } write these in a text
    editor, and **paste**{ class="hi-pri" } the answer directly into the input box provided.
    You **should not type**{ class="hi-pri" }
    your answer in the input box: often, that will result in
    formatting being applied or control characters being inserted, even
    if you can't see them.

    Unless specified otherwise:

    - answers should be self-contained, and `#include` all necessary headers
    - code should be clearly written, well-formatted, and easy for others
      to understand
    - function bodies should not contain excessive inline comments
    - code should compile without errors or warnings with `gcc`, using
      the compilation flags "-std=c11 -pedantic -Wall -Wextra".
    - code should follow sound programming practices, including:
      - the use of meaningful comments
      - well chosen identifier names
      - appropriate choice of basic data-structures, data-types, and functions
      - appropriate choice of control-flow constructs
      - proper error-checking of any library functions called, and
      - cleaning up/closing any files or resources used.

**"Long answer" questions requiring an answer in English:**{ class="hi-pri" }

:   These will typically present a fact-based scenario, and require you
    to answer a question or make a recommendation.
    The aim of these questions is for you to demonstrate that you can:

    - distinguish the relevant from irrelevant facts in the problem description
    - identify what topics we have covered which apply in this case, and how
    - come up with a clear recommendation or answer
    - justify that recommendation (logically, or via evidence covered in
      classes).

    "Identifying relevant facts/topics" and "justifying answers
    appropriately" are the key things we are looking for in answers to
    these questions. If an answer is provided with **no** justification,
    it will be awarded 0 (even if otherwise correct), as it does not
    satisfy the criteria for an acceptable answer.

    When answering such questions, you **should**{ class="hi-pri" }:

    - Make sure your answer is comprehensible. If we can't understand
      your answer, we can't give you credit!
    - Try to keep your answer concise. But value comprehensibility over concision.
    - Make sure your answers are **self-contained**{ class="hi-pri" },
      and do not refer to your answers to other questions. Different
      questions may be marked by different people!

    For each such question:

    - 50% of the marks are awarded for correctly identifying the
      relevant facts or topics or principles to apply, and not
      discussing irrelevant facts/topics/principles.
    - 50% of the marks are awarded for appropriately justifying your answers

    Guidance as to how the "relevance" and "justification" components
    are assessed is given in the following table. A *proficient* answer
    will be awarded 70–100% of the marks for that component; a
    *satisfactory* answer will be awarded 50–69% of the mark for that
    component; and a *not yet satisfactory* answer will be awarded 0–49%
    of the mark for that component.

    ![](https://cits3007.github.io/images/rubric-table.png)

### Are the quizzes/tests/exam open book? (Test conduct) { #test-conduct }

Unless specified otherwise, all quizzes, tests and exams are "take-home"
and open-book. You **may**{ class="hi-pri" } make use of any book,
website or software you like, but the answers must be your own work (not
that of anyone else), and you must not distribute the questions or your
answers to any other person.

The tests are not invigilated but – as with all open assessments – any
statistical anomalies will be investigated, and anybody may be asked
to (orally) explain their thought process in coming up with their
answers.


**Checking your answers**{ class="hi-pri" }

:   You **should**{ class="hi-pri" }:

    - check your answers for spelling, punctuation and grammatical errors
      before submitting
    - where relevant, feel free to check your answers by writing and
      compiling C code
    - consult the [C11 standard][c11-std] or a good reference site
      (such as the "C" language sections of
      [cppreference.com](https://en.cppreference.com))

[c11-std]: https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1548.pdf

**Contacting other people**{ class="hi-pri" }

:   You **may**{ class="hi-pri" } contact the unit coordinator if you
    are unable to access the quiz/test/exam or have difficulties submitting
    it.

    However, other than that, **you may not**{ class="hi-pri" } contact
    any other person (student, staffmember or anyone else) during the
    test. If you have a
    question or comment about the test, or would like to alert the unit
    coordinator to a perceived error, include a comment in your working,
    if appropriate, to indicate how you interpreted the question. If
    applicable, your comments may be considered when marking. No
    action can be taken during the test. You are advised to answer to
    the best of your ability and are assured that you will not be
    disadvantaged if there is an error on the question paper. [Source:
    UWA rules for online exams]



## Assessment item details


### Week 3 quiz

- This quiz will be available on the {{ siteinfo.lms }}.


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

Marks for the quiz are now available
in [csmarks](https://secure.csse.uwa.edu.au/run/csmarks/),
and solutions are available here ([PDF][quiz-sol-pdf],
[Markdown][quiz-sol-md]). The Blackboard {{ siteinfo.lms }} should show your mark for individual
questions.

[quiz-sol-pdf]: {{ "/assignments/quiz-solutions.pdf" | url }}
[quiz-sol-md]:  {{ "/assignments/quiz-solutions.md" | url }}

### Week 7 take-home test { #mid-sem-test }

The week 7 exercise will be made available
in week 7 on the
{{ siteinfo.lms }}, under "Week 7 take-home test". You will have 24
hours to complete the test (which should only take about an hour), and
should submit it via the {{ siteinfo.lms }}.

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

The exam is a take-home exam, so open-book and not invigilated.

To maintain exam integrity, students may be selected for a short (less than 10 mins)
follow-up meeting (either face-to-face, or via MS Teams) with a marker,
where they should expect to answer some basic questions about their exam responses.

The exam will be available for 48 hours from its publication on LMS
to its due date, and can be submitted at any time within that range.
It should take about 2 hours' work to complete.

As this is the first year in which CITS3007 has run, no past exams are
available. Sample exam-style questions will be discussed in the final
lecture (week 12).

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
