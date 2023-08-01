---
title: "Frequently Asked Questions"
tags: ['toppage']
layout: page-toc-layout.njk
customStyle: |
  .resource-list > ul > li {
    padding-top: 1ex;
    padding-bottom: 1ex;
  }

  div.toc > ul > li {

    margin-bottom: 1rem;

  }

  main h2, main h3 {
    margin-left: -1.5rem;
  }

---

{% set year         = siteinfo.year %}
{% set help_forum   = siteinfo.help_forum %}
{% set forum_url    = siteinfo.forum_url %}
{% set help3007     = help_forum | extLink(forum_url) | safe %}
{% set outline_url  = siteinfo.unit_outline_url %}
{% set moodle_url   = siteinfo.moodle_url %}
{% set quiz_percent  = siteinfo.assessments["week3_quiz"]["marksPercent"] %}

{% set blank  = "{ target=\"_blank\" }" %}

{#
  x_
#}

-----

## Study practices

### How can I do well in CITS3007? { #how-can-I-do-well-in-CITS3007 }

Some suggestions on [working effectively][work-effectively] in Computer
Science and Software Engineering are available from the
[CSSE teaching website][csse-teaching-server] – you might like to review
those, as well as the UWA Library's [Study support][study-support] page.

The [STUDY*Smarter* pages][study-smarter]
and workshops may be useful to you.
CITS3007 assessments may ask you to *think critically* about software
security, and to *justify a position*, so the Academic
English workshops (such as "Critical thinking & academic culture" and
"Writing justifications") may prove especially useful.

[study-smarter]: https://www.uwa.edu.au/students/Support-services/Academic-support
[work-effectively]: https://teaching.csse.uwa.edu.au/units/unitinfo/workingeffectively.php
[csse-teaching-server]: https://teaching.csse.uwa.edu.au/units/unitinfo/
[study-support]: https://www.uwa.edu.au/library/Help-and-support/Study-support

It's also useful to remember that [active learning][active-learning]
has been demonstrated[^deslauriers] to be a more effective learning approach than
passive learning. Some active learning strategies include:

- linking new knowledge to areas you're already familiar with
- solving problems (for instance, from labs and past exams)
- writing, running and debugging code
- constructing a "[mind map][mind-map]" of unit topics.

A good resource containing more information on these strategies
and others is the University of Melbourne [page on active
learning][active-learning].

[active-learning]: https://students.unimelb.edu.au/academic-skills/resources/studying-effectively/active-learning
[mind-map]: https://en.wikipedia.org/wiki/Mind_map

[^deslauriers]: For an overview, see for instance: Deslauriers et al,
  "Measuring Actual Learning versus Feeling of Learning in Response to
  Being Actively Engaged in the Classroom." *Proceedings of the National
  Academy of Sciences* 116, no. 39 (September 24, 2019): 19251--19257.
  Available at <https://doi.org/10.1073/pnas.1821936116>.

### Do I need to have completed CITS2002 before enrolling in CITS3007? { #advisable-study } 

[CITS2002 Systems Programming][cits2002] is not a prerequisite for
enrolling in CITS3007.

However, based on statistics from last year (2022), you are likely to do
somewhat better in the unit if you *have* already done CITS2002.

The mean CITS3007 mark of students last year who had already completed
CITS2002 was 66.3, whereas the mean mark of student who had not was
59.9. (Both groups started with a mean WAM from the previous year of
69.6.)

[cits2002]: https://teaching.csse.uwa.edu.au/units/CITS2002/

### How much study time will CITS3007 require? { #how-much-study-time }

See the [site welcome page][time-required], under ["Time required"][time-required].

[time-required]: /#time-required

### What are the textbooks and recommended readings for the unit?

See ["Recommended readings"](/schedule/#recommended-readings) on the
[Resources page](/resources). This lists the textbook details for the
unit,
outlines the recommended reading for each week, and contains
a link to UWA's "Unit Readings" site.

### Should I buy a copy of the textbook?

It would be a good idea to, if you can. The UWA has an online copy,
but I believe only one person can access it at a time.
Cheap second-hand copies of texts are usually available
from [AbeBooks](https://www.abebooks.com),
[Amazon](https://www.amazon.com.au), or
[Book Depository](https://www.bookdepository.com).

Online access to the texts and recommended readings
is also available through UWA's "Unit Readings"
site -- see ["Recommended readings"](/schedule/#recommended-readings).

### How can I keep backups of my work? { #backups }

Take a look at the MIT "Missing Semester of Your CS Education"
[page on "Backups"][missing-backups] for good backup strategies to
adopt.

*Local* backup systems are available for all popular operating
systems in use today (e.g. Time Machine for MacOS), but you should
ensure you keep offsite copies of your work as well.

[missing-backups]: https://missing.csail.mit.edu/2019/backups/

Offsite copies of your work can be stored
using UWA's [student network storage][student-network-storage]{ class="hi-pri" },
or alternatively, backup services
can be purchased for less than $5 per month (e.g. from carbonite.com).

[student-network-storage]: https://ipoint.uwa.edu.au/app/answers/detail/a_id/1570/~/student-network-storage-explained

In [*addition* to keeping backups][is-not-version-control], it's a good idea to keep your work
[under version control](#version-control).

[is-not-version-control]: https://pragmatos.net/2011/09/01/time-machine-is-not-version-control/

### How can I keep my work under version control? { #version-control }

Use [Git][git]. It isn't the
<a class="tooltip"
  href="https://www.mercurial-scm.org"
  target="_blank"
  data-tooltip-text="That would be Mercurial">
easiest</a> version-control system to use,
nor the
<a class="tooltip"
  href="http://darcs.net"
  target="_blank"
  data-tooltip-text="That would be Darcs">
most flexible</a>,
nor the
<a class="tooltip"
  href="https://www.fossil-scm.org/"
  target="_blank"
  data-tooltip-text="That would be Fossil">
most reliable</a> --
nor, really, the best in any way at all, except that it *is* used almost everywhere in the
software development industry, so you might as well get familiar with
it.

MIT University provides an [introduction to Git][mit-git] and an
explanation of why you should use a version-control system.

[git]: https://git-scm.com 
[mit-git]: https://missing.csail.mit.edu/2020/version-control/

You might also find the following resources helpful:

- [A Non-Programmer's Introduction to Git](https://blog.scottlowe.org/2015/01/14/non-programmer-git-intro/){{blank}}, a blog post by Scott Lowe
- Eric Sink's book/website [*Version Control by Example*](https://ericsink.com/vcbe/index.html){{blank}}, especially
  sections 1 ("Introduction"), 2 ("Basics"), and 8 ("Basics with Git").

### Do I need a laptop in order to complete CITS3007? { #laptops }

You will need a laptop when attending lab classes, as
this unit requires software that isn't permitted to be installed on UWA
lab machines.

A laptop is also strongly recommended for completing the unit project
(though a desktop computer running Linux, or capable of running
Oracle VirtualBox, may also be used).

UWA provides [financial support][fin-supp] via the "SOS IT Equipment
Scheme" to students who are unable to purchase a laptop due to financial
hardship.

See also ["What operating system should I use for CITS3007?"](#linux-os).


-----

## Lectures

### Where can I find the lecture slides?

On the ["Resources" page][slides], under
[**"Lecture slides"**][slides]{ class="hi-pri" }.
They'll be published there progressively throughout the semester.
For previous years' lecture slides, see [here](#previous-content).

[slides]: /resources/#lectures

### Are lectures recorded? { #are-lecturers-recorded }

**The lectures are recorded**{ class="hi-pri" }, and will be
available via the {{ siteinfo.lms }} -- usually within an
hour of the lecture finishing.

But please note that recordings do
sometimes fail -- so if you *can* attend the lecture in person or
online, it's recommended.

### Where can I find the lecture recordings? { #accessing-lecture-recordings }

Sign into the Blackboard {{ siteinfo.lms }}, bring up the "CITS3007"
unit, and click on "Lecture Recordings" on the left-hand sidebar. Then
click on the link marked "Lecture Recording System"; a new page should
launch, taking you to the appropriate part of the [Echo360
system][echo360] where the lecture recordings are stored.

[echo360]: https://echo360.com

### Can I attend lectures online? { #online-lectures }

Short answer: no, only face-to-face attendance is available.

Longer answer: currently, it is the policy of the department of Computer Science and
Software Engineering at UWA that units be offered in
**face-to-face mode only**{ class="hi-pri" }.
This is intended to convey to students that they need to engage and interact
face-to-face for at least some activities for effective learning, and
allows teaching staff to schedule face-to-face assessments such as
invigilated tests. See the UWA page on ["study modes"][study-modes] for
more information.

The department continues to support students with many flexible study
options, however, such as [recorded lectures](#are-lecturers-recorded)
and [online submission](#assessment-submission) of assessments.


[study-modes]: https://ipoint.uwa.edu.au/app/answers/detail/a_id/1568/~/study-modes-explained

In the event of Covid 19 restrictions, lectures and labs will be
conducted completely online (accessible via MS Teams), and any student
oral presentations will be done via MS Teams.

------

## Labs

### Where can I find lab worksheets?

On the ["Resources" page][worksheets], under
[**"Worksheets"**][worksheets]{ class="hi-pri" }.
They'll be published there progressively throughout the semester.
For previous years' worksheets, see [here](#previous-content).

[worksheets]: /resources/#worksheets

### Is attendance recorded for labs?

No -- if you don't want to attend the labs, you do not have to. However,
the labs provide the best opportunity for getting feedback and
assistance from teaching staff, as a lab [facilitator](/#facilitators)
is available at each lab. It's therefore strongly recommended that you do attend.

### Are there online labs? { #are-there-online-labs }

There are currently no online labs:
all labs will be delivered face-to-face.

In the event of Covid 19 restrictions, lectures and labs will be
conducted completely online (accessible via MS Teams), and any student
oral presentations will be done via MS Teams.

### Are online labs recorded?

At present, there [are no online labs](#are-there-online-labs), so the
question is moot. In the event that we do hold online labs, by default
they are **not** recorded; the aim is that all lab participants should
feel free to ask questions and speak freely, which they may not do if
they are being recorded. If all participants in an online lab have
agreed beforehand, then the lab facilitator may record the lab.

### Can I attend lab sessions other than the one I'm allocated to? { #attending-labs }

Yes -- as long as there is room available for you, you are welcome to attend other
lab sessions. See [under "labs"][labs], on the site home page, for details.

[labs]: /#labs

### Can I email questions to the lab facilitators?

No -- facilitators are not paid to provide student instruction outside
of the timetabled labs.



----

## Timetable

### Where can I find the unit timetable?

You should have a personal timetable available through
CAS (UWA's Class Allocation System). But you can
also get full details of lecture and lab times and venues by
visiting UWA's **[Timetable site][timetable-site]{{blank}}**{ class="hi-pri" }.
(If the information for {{ siteinfo.unitcode }} is not visible, then enter "{{ siteinfo.unitcode }}" in the
box labelled "Unit search", and then click "Show timetable".)

[timetable-site]: https://timetable.applications.uwa.edu.au/?selectunits={{ siteinfo.unitcode }}

-----


## Assessments

### When are the assessments due?

A list of all assessments (and their due dates) is given on the
[**Assessments page**](/assessment){ class="hi-pri" }, and due dates are
also shown on the [**Schedule**](/schedule){ class="hi-pri" }.

(The content for both is generated from a
[JavaScript source file](https://github.com/cits3007/cits3007.github.io/blob/master/src/_data/siteinfo.js)
contained in the GitHub repository.)

### Do any of the assessments require (or permit) group work?

No -- all assessments are to be completed individually.
See also [Academic conduct and source citation](#academic-conduct-source-citation).

### How do I submit an assessment? { #assessment-submission }

Details of how to submit each assessment will be released on
the [Assessment page](/assessment/).
Most of the assessments will be submitted using [Moodle]({{moodle_url}}){{blank}}.
In order to submit an assessment, you'll need to create an account on
the Moodle server by visiting the [Moodle signup page][moodle-signup].
You'll need to use your UWA email address, select a username (usually,
your given name), select a password, and provide your first and last
name. (All other details are optional.)

[moodle-signup]: https://quiz.jinhong.org/login/signup.php


### Can I get an extension on the deadline for an assessment? { #extensions }

For **quizzes and tests**{ class="hi-pri" }:

: No, in general it's not possible to
  get an extension. Even if conducted online, and even if generous
  time-limits are permitted, these should still be treated much like face-to-face tests:
  you need to complete them at the specified date and time.

  If you're
  unable to complete a quiz or test due to illness or for some other valid
  reason, you should apply for
  [special consideration][special-consideration] (see the UWA [page on
  special consideration][special-consideration] for details).
  If you are granted special consideration, then you will be exempted
  from that assessment, and
  the remaining components of the unit will be re-weighted to make up
  100%. For instance, if you are unable to complete the week 3 quiz
  (worth {{ quiz_percent }}%), then the weights of
  all the *other* components will be multiplied by $\frac{100.0}{100.0 - {{ quiz_percent }} }$.

  If you are granted special consideration, it's helpful if you can email
  the [Unit Coordinator](/#unit-coordinator) to let them know -- Unit
  Coordinators aren't automatically notified when special consideration
  is granted.

  For the purpose of "reasonable adjustments" made for students who
  require them: quizzes, tests and exams count as "timed assessments"
  (although the time limit is generous).
  If you have an Academic Adjust Plan in place from UniAccess (UAAP), you may be
  entitled to extra time for online assessments -- email the
  [Unit Coordinator](/#unit-coordinator) in accordance with your UAAP to
  let them know.

  (See also: ["I have a UniAccess accommodation plan, do I need to let
  you know about this?"](#accommodations).)


For **projects**{ class="hi-pri" }:

: If you need an extension due to illness or for some other valid reason,
  you should apply for
  [special consideration][special-consideration] (see the UWA [page on
  special consideration][special-consideration] for details).

  If you are granted special consideration, it's helpful if you can email
  the [Unit Coordinator](/#unit-coordinator) to let them know -- Unit
  Coordinators aren't automatically informed when special consideration is granted.

  It's also possible to submit your assessment late, subject to the
  standard [penalties for late submission][late-submission].

[special-consideration]: https://www.uwa.edu.au/students/My-course/Exams-assessments-and-results/Special-consideration
[late-submission]: https://ipoint.uwa.edu.au/app/answers/detail/a_id/2711/~/consequences-for-late-assignment-submission


### What is the marking rubric for the assessment items? { #marking-rubric }

Marking rubrics for an assessment item will normally be published with
that assessment item. In particular, the unit project will have a
breakdown of marks available, and how they can be achieved.

Wherever possible, we adopt a rubric based on the following scheme:

**Multiple choice/multiple selection/numeric answer/short answer question**{ class="hi-pri" }

:   These will normally be worth only a small amount each (e.g. 5 or 10
    marks out of a 100-mark quiz or test), and are typically
    marked automatically.
    100% is awarded for a correct answer, and 0% for an incorrect
    answer.

    Make sure to read these questions **carefully**, and answer **exactly** as
    requested. (E.g., if an answer asks for "Only a number", then
    answering "20 bytes", for example, would be marked incorrect.)
    Misreading the instructions will not be grounds for
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

    You can assume that the answer to any short answer question is
    *never* more than 5 words long (and most will be only two or three
    words long). You must always give a *single* answer -- responses
    which try to "hedge" and give multiple alternatives ("this ***or***
    that") will be marked incorrect.


**"Long answer" questions requiring code**{ class="hi-pri" }

:   These will typically be (partly or wholly) automatically marked.

    Unless specified otherwise:

    <div class="medium-list">

    - answers should be self-contained, and `#include` all necessary headers
    - C code submitted should be valid code according to the C11
      standard
    - code should be clearly written, well-formatted, and easy for others
      to understand
    - function bodies should contain [only such inline comments
      as are necessary for a reader to understand the code][no-inline]; excessive
      inline comments will result in low marks for code clarity and style
    - functions should be documented using [documentation
      blocks][docblocks] (see [here][lsst-doc] and [here][cmu-doc]
      for guidelines)
    - code must compile without errors with `gcc`, using
      the compilation flags "-std=c11 -pedantic -Wall -Wextra"
      (and ideally, should compile without warnings)
    - code must compile and run correctly in the CITS3007
      [standard development environment](#cits3007-sde)
    - code should follow sound programming practices, including:
      - the use of meaningful comments
      - well chosen identifier names
      - appropriate choice of basic data-structures, data-types, and functions
      - appropriate choice of control-flow constructs
      - proper error-checking of any library functions called, and
      - cleaning up/closing any files or resources used.

    </div>      

[no-inline]: https://kevlinhenney.medium.com/comment-only-what-the-code-cannot-say-dfdb7b8595ac 
[docblocks]: https://en.wikipedia.org/wiki/Docblock
[lsst-doc]: https://developer.lsst.io/cpp/api-docs.html
[cmu-doc]: https://www.cs.cmu.edu/~410/doc/doxygen.html

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

    - Make sure your answer is **comprehensible**{ class="hi-pri" }. If
      we can't understand your answer, we can't give you credit!
    - Try to keep your answer **concise**{ class="hi-pri" }. But value
      comprehensibility over concision.
    - Make sure your answers are **self-contained**{ class="hi-pri" },
      and do not refer to your answers to other questions. Different
      questions may be marked by different people!
    - Make sure you answer the question **fully**{ class="hi-pri" }. If you only answer
      part of the question (or do not at all answer the question asked),
      you cannot be awarded full marks (no matter how relevant the facts
      you discuss or how good a justification you provide).
      If you only answer part of a question, you may receive
      a proportion of the marks for that question.

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

### What should I do if a question or task in an assessment is ambiguous or contains an error? { #errors-in-questions }

For **projects**{ class="hi-pri" }:

: You will need to clarify the meaning of the question or task
  in the unit [Help forum]({{ forum_url }}) before submitting the assessment.
  Before making a new post in the Help forum, do a search
  to see if someone else has asked the same question already
  and received an answer.

For **"long answer"**{ class="hi-pri" } questions in **quizzes, tests or exams**{ class="hi-pri" }:

: If the question is ambiguous, or you believe it contains an error or
  requires you to make assumptions in order to answer it, then you may
  make whatever reasonable assumptions are required in order to answer it.

  Ensure you document these assumptions in your answer.

For **"short answer"**{ class="hi-pri" } questions in **quizzes, tests or exams**{ class="hi-pri" }:

: You **should**{ class="hi-pri" } answer to the best of your ability,
  bearing in mind the [rubric](#marking-rubric) and guidelines for
  short-answer questions. You may be assured that you will not be
  disadvantaged if there is an error in the question.

  Tests will include a zero-mark question at the end where
  you can include
  questions or comments about the test and can alert the unit
  coordinator to any perceived errors.
  If a question is ambiguous, you may make reasonable assumptions in
  order to answer it, and should record your assumptions in the answer
  to this zero-mark question.
  If applicable, your comments may be considered when marking.

  If you need to put a question or comment in this zero-mark question,
  make sure you paste in the **full question text** it relates to (as
  not all students get the questions in the same order) and make
  sure you give each
  question a clear, bolded heading.

  You **may not**{ class="hi-pri" } contact the unit coordinator
  (or any other person) regarding the content of questions while a test
  is running -- see ["Test conduct"](#test-conduct).

### I have a UniAccess accommodation plan, do I need to let you know about this? { #accommodations }

Yes.

Your UniAccess accommodation plan (UAAP) will state that if you have alternative
exam arrangements for a quiz, test, exam or other timed assessment, then
you need to contact the Unit Coordinator at least 2-3 weeks prior to the
date of the assessment to request that these arrangements be put in
place. Please do so by [emailing the Unit Coordinator](/#unit-coordinator).

The exam for CITS3007 is School-run, rather than organised by the Exams
Office, so you *will* need to email the Unit Coordinator to request that
alternative exam arrangements be put in place.

If your UniAccess accommodation plan states that you require flexibility
with submission deadlines, then it will also state that you should
"contact the Unit Coordinator in a timely manner, i.e. no later than
three university working days after the due date". It will be greatly
appreciated if you can alert the Unit Coordinator as early as possible
that you'll be submitting late, but staff understand that this is not
always feasible. Note that adjustments to submission deadlines do not
apply to quizzes, tests or exams for CITS3007.


## Academic conduct and source citation { #academic-conduct-source-citation }

### Are assessment submissions checked for plagiarism? { #plagiarism-checks }

Yes, they are.
Your submitted work or answers for any assessment item
may be submitted to plagiarism detectors
such as `JPlag`, `moss` or `turnitin` to detect plagiarism.

Additionally, statistical anomalies in the results for an assessment may
be investigated, and any student may be asked to (orally)
**explain their thought process**{ class="hi-pri" } in coming up with their
answers.


### What are the expectations regarding citation of sources/academic conduct? { #source-citation-conduct-expectations }

You **must**{ class="hi-pri" } act in accordance with
UWA's [academic conduct policy][acad-policy].
See the STUDYSmarter team's [Guide to Avoiding Academic
Misconduct][misconduct-guide]{{blank}} (PDF) for additional details.

In particular, you **must not**{ class="hi-pri" } plagiarize any
work. Plagiarism is the unattributed use of
someone else's words, creations, ideas or
arguments as one's own. At UWA, it is extended to include paraphrasing
which is too close to the original.

For all assessments -- even those that are "open book" -- you are expected to:

a.  demonstrate an **understanding**{ class="hi-pri" } of the answers
    you write (and you may be asked to later demonstrate that understanding
    in an oral interview); and
b.  ensure any answers you write are **in your own words**{ class="hi-pri" }.

You will only occasionally need to cite sources in this unit, but if you
do, you need to make sure that you

c.  properly **cite**{ class="hi-pri" } any sources you make use of
d.  ensure your source is **reliable**{ class="hi-pri" } (see ["evaluating sources"](#evaluating-sources)),
    and
e.  provide full **bibliographic details**{ class="hi-pri" } for each source
    cited (usually in a "References" section within your answer).

See also ["What referencing/citation style should I use?"](#citation-style).

(For \(c\), note that you need not cite lecture slides or
worksheets provided for this unit as being a source of ideas.
Your answer must still be in your own words, and you may not reproduce the
content of them directly -- copying and pasting in the text of a slide from the
lecture slides as one of your answers
is still plagiarism -- but you need not cite them as a source
of ideas.
It's assumed they are a common source of ideas for all answers.)

The penalties for misconduct in an exam are *very* severe. So don't do
it.

[acad-policy]: https://www.uwa.edu.au/students/Getting-started/Student-conduct
[misconduct-guide]: https://www.student.uwa.edu.au/__data/assets/pdf_file/0007/2748139/R3-Avoiding-Academic-Misconduct.pdf

### What referencing/citation style should I use? { #citation-style }

If scholarly references are included in submitted work, then students
may use any standard citation style they wish (e.g. Harvard, APA, MLA,
IEEE), as long as it is applied consistently. One recommended style
is the "AMS short alpha-numeric" style (see the [AMS style
guide][ams-style-guide]{{blank}} (PDF), sec 10.3).


[ams-style-guide]: https://www.ams.org/publications/authors/AMS-StyleGuide-online.pdf

If citing code found on the Internet or from other sources, follow the
MIT guide for citing code:
<https://integrity.mit.edu/handbook/writing-code>.

For further advice on referencing sources, refer to the UWA Library
webpage on referencing at
<https://guides.library.uwa.edu.au/referencinguwa>.

### How do I evaluate the reliability of an information source? { #evaluating-sources }

For a quick guide, see the [UWA Library page][evaluating-info] on ["evaluating
information"][evaluating-info].

[evaluating-info]: https://guides.library.uwa.edu.au/evaluate_info

For more information, you might want to attend the UWA Library's
[academic skills workshops][academic-skills-workshops] -- in particular,
the workshops entitled "Critical thinking & academic culture" and
"Using sources and paraphrasing".

[academic-skills-workshops]: https://www.uwa.edu.au/students/Support-services/Academic-support#workshops

-------

## Tests, quizzes and exams { #tests-quizzes-and-exams }

### What topics are examinable in a quiz, test or exam? { #examinable-material }

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
exam. That said, the lab exercises are usually a good guide to the
sort of questions that may be asked.


### What happens if a submit a test, quiz or exam late? { #late-submissions }

Online quizzes, tests and exams **must**{ class="hi-pri" } be submitted by the
due date and time -- this will be enforced strictly (just as it is for
face-to-face tests and exams), and late submissions will receive a mark
of 0. It is your responsibility to ensure you submit by the due date and
time -- even if you think a website such as Moodle or the Blackboard LMS might
permit you to make a late submission.

### What if I think there's a mistake in a test, quiz or exam question? { #test-errors }

You **should**{ class="hi-pri" } answer to the best of your ability, and
record any assumptions made: see ["Errors in
questions"](#errors-in-questions).

You **may not**{ class="hi-pri" } contact the unit coordinator
(or any other person)
regarding the content of questions while a test
is running -- see ["Test conduct"](#test-conduct).

### Are the quizzes/tests/exams open book? (Test conduct) { #test-conduct }

Unless specified otherwise, all quizzes and tests are "take-home"
and open-book. You **may**{ class="hi-pri" } ***look at***{ class="hi-pri" }
any book,
website or software you like, but the answers must be
**your own work**{ class="hi-pri" } (not
that of anyone else)
and in **your own words**{ class="hi-pri" },
and you must not distribute the questions or your
answers to any other person.

The quizzes and tests are not invigilated but – as with all open assessments – any
statistical anomalies will be investigated, and anybody may be asked
to (orally)
**explain their thought process**{ class="hi-pri" } in coming up with their
answers.

The exam is *not* open-book, and is invigilated, but you are permitted
access to a hand-written A4 page of notes (written both sides).


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


**Contacting other people**{ class="hi-pri" } { #contacting-other-people }

:   You **may**{ class="hi-pri" } contact the
    [unit coordinator](/#unit-coordinator) if you
    are unable to access the quiz/test/exam or have difficulties submitting
    it. Make sure to include a screenshot of the problem.

    However, other than that, **you may not**{ class="hi-pri" } contact
    any other person (student, staffmember or anyone else) during the
    test.

    If you have a
    question or comment about the test, or would like to alert the unit
    coordinator to a perceived error, include a comment in your working,
    if appropriate, to indicate how you interpreted the question. If
    applicable, your comments may be considered when marking. No
    action can be taken during the test. You are advised to answer to
    the best of your ability and are assured that you will not be
    disadvantaged if there is an error on the question paper. [Source:
    UWA rules for online exams]
    See also, ["Errors in questions"](#errors-in-questions).


-----

## Projects

### How are problems with the project specification resolved?

An initial specification for the unit project will be published via this
website, and an announcement of this made on the {{help3007}} discussion
forum.

Students should aim to read through the specification as early as
possible, and clarify any ambiguities, apparent contradictions, or
missing information by posting in the {{help3007}} discussion
forum.

After initial clarifications have been made -- usually after about a week -- a revised
specification will be released, consolidating any changes or answers
made by the unit coordinator in the {{help3007}} discussion
forum.

After a revised specification has been published:

<div class="loose-list">

- If there is anything in the specification that appears to be contradictory,
  ambiguous, or under-determined, then students should post to the
  {{help3007}} forum to clarify their interpretation of the
  specification.<span class="br"></span>
  The unit coordinator may clarify the specification further, or they may decide
  that the specification is now sufficiently clear, and that it's up to
  each student to interpret the specification according to their best judgment
  and ability. 
- Unless serious problems with the specification are identified, no further
  revision of the specification will be published -- students should instead
  make sure to check the {{help3007}} forum for subsequent corrections or
  clarifications (if any).

</div>

If, at the time of project submission, anything in the project specification is
contradictory, ambiguous, or under-determined,
and no student has requested clarification in the forum,
then the unit coordinator may interpret those portions of the specification
in any way they wish (as long as it does not conflict with the remainder of
the specification), and mark submissions accordingly.



### What are the formatting expectations for project reports? { #project-formatting }

The unit project will usually contain a written component.
The project specification will explain how this is to be submitted.
Usually, the written component will be submitted as either:

- a PDF (or at your option, a [Markdown][markdown] file), or
- a text input field, available on the Blackboard {{ siteinfo.lms }} or
  {{ siteinfo.moodle }}

[markdown]: https://en.wikipedia.org/wiki/Markdown

Formatting expectations for these are as follows:

**PDF reports**

: - Your PDF report should use A4 size pages.
  - The font for body text should be between 9 and 12 points.
  - Do not double-space lines.
  - The report should contain numbered headings, with informative
    heading titles.
  - Each question should be answered on a new page.
  - Any diagrams, charts or tables used must be legible and large enough
    to be easily read when viewed on-screen at 100% magnification.
  - All pages (except the cover, if you have one) should be
    numbered.
  - Cover sheets, diagrams, charts, tables, bibliographies and
    reference lists do not count towards any page-count maximums.
  - You are not required to include a cover sheet.

**Markdown file**

: As an alternative to submitting a PDF, you may submit your
  report in neatly formatted
  (max. 72 characters per line) Markdown, and we will either read
  it directly or generate a report from it. In that case:

  - It should either adhere to the [CommonMark spec][commonmark]
    or be [Pandoc-compliant][pandoc] Markdown
  - It should be easily readable as plain text, and contain no
    diagrams, charts or raw LaTeX
  - If present, a bibliography should appear as a plain bulleted list
    at the end of the report (do not use citation keys (`@`),
    BibTex, or similar features). "AMS short alpha-numeric" would
    be a good citation style -- see
    the [AMS style guide][ams-style-guide]{{blank}} (PDF), sec 10.3.

**Text input field**

: The input field should have instructions regarding
  appropriate format.

[commonmark]: https://spec.commonmark.org/0.30/
[pandoc]: https://pandoc.org/MANUAL.html#pandocs-markdown

See also:

- [Source citation and academic conduct](#academic-conduct-source-citation)
- [Marking rubrics](#marking-rubric)



-----

## Exams

### Are past exams available? { #past-exams-availability }

Because the exam is completed using Moodle, past exam papers are not
available via the UWA Library, as they are for some other units.

However, the labs and earlier quizzes and tests provide a good guide
to the sort of questions you may be asked.

Be sure to start your exam revision *early*!
If you try to make an appointment to discuss the exam less than
three working days before the exam, I may be either
not at UWA or busy with exam
preparations myself, and unable to schedule an appointment
for you.


-----

## Unit content

### Can I see previous years' content? { #previous-content }

The unit website is archived periodically
by the Internet Archive's [Wayback Machine](https://archive.org/web/) at
<http://web.archive.org/web/*/https://cits3007.github.io/>.
You can use the Wayback Machine interface to view previous versions
of the lectures and labs.

The source code for the unit website is also versioned on GitHub
at <https://github.com/cits3007/cits3007.github.io/>, so you can use
GitHub's interface to look through older versions of the material as
well. The directories you want are probably `assets/lectures` and
`assets/workshops`.

Note that the content of the unit does change slightly from year to
year, so previous years' content will not be a perfect guide to what is
covered in the current year.

### Why is the unit content on GitHub and Moodle? Why not use UWA's Blackboard LMS? { #why-moodle }

Because Blackboard is a very terrible LMS.[^lms-sucks]

[^lms-sucks]: See "[Why Is Your School's LMS So Bad?][lms-so-bad]{{blank}}".

In addition

- Blackboard LMS doesn't allow for (complete or partial) automatic
  marking of coding-based questions, but Moodle does.
- Blackboard LMS content is only available to enrolled students.
  By publishing the unit content as a website,
  I can make potentially useful content available even to someone not
  enrolled in the unit.

[lms-so-bad]: https://www.pathwright.com/blog/why-is-your-schools-lms-so-bad

------

## Discussion forum (help3007) { #help3007 }

### Can I post questions about the unit content to the discussion forum? { #posting-questions }

Please do! But before posting, you might want to

a.  search the forum (and this page) to see if
    an answer to your question has already been posted, and
b.  review the page ["How do I ask a good question?"][good-question]

[good-question]: https://stackoverflow.com/help/how-to-ask

Note that any posts on the discussion forum need to comply with UWA's
[Code of Conduct](/#expectations) and
[academic conduct policy][acad-policy]. That means you should

- endeavour to treat everyone with respect and courtesy and without
  harassment, and
- not post your solutions to an assessment (as this can breach the
  policy against collusion).

### How do I subscribe to posts from the discussion forum? { #forum-subscriptions }

You can set up an email subscription to the discussion forum
as follows:

1.  Ensure you're logged in to {{help3007}}.
2.  Under the left-hand menu ("{{help_forum}}"), select "edit
    preferences".
3.  Select "yes" to one (or both) of the options
    "email me a copy of every new article immediately" and
    "email me a daily digest of new articles".
4.  Click "Save these preferences".

You should now receive regular updates by email when new posts are
made on the forum.

### I said I didn't understand a topic, and the lecturer said I should read the lecture slides/textbook -- but I've already done that { #asking-questions }

This is probably because if you don't make it clear that you've already *looked*
at the slides or textbook, the person answering your question won't know
that -- and so they'll point you to the best initial source of
information, which is usually the lecture slides or textbook.

Indeed, if you ask the same question 10 times, you will probably get
exactly the same answer 10 times. (Or the person answering might recall
that you've already asked before  -- but out of a class of 180 students, there
is no guarantee of this.)

If you'd like a different answer, then see ["How do I ask a good
question?"][good-question]: you need to make clear *what you've
already tried*, and *why that didn't work for you*.

------

## Operating system

### What operating system should I use for CITS3007? { #linux-os }

Linux.

The general principles of secure software development covered in this
unit apply to *all* operating systems; but for this unit, we will be
using Linux, because it is

- freely available and open source
- the most commonly-used server operating system, and
- thoroughly documented.

In the first lab (in week 2), we will explain how to set up a C
development environment using Linux and [**VirtualBox**][vbox]{{blank}}{ class="hi-pri" },
an open-source virtualization tool produced by Oracle corporation.

VirtualBox is available for the Windows, MacOS and Linux operating
systems. It's currently *not* available on the UWA computing lab
machines, so it's recommended you install the software on your own
laptop.

UWA provides [financial support][fin-supp] via the "SOS IT Equipment
Scheme" to students who are unable to purchase a laptop due to financial
hardship.

[vbox]: https://www.virtualbox.org/
[fin-supp]: https://www.uwa.edu.au/students/Support-services/Financial-assistance#:~:text=SOS%20IT%20Equipment%20Scheme

For most purposes, it will also be possible to make use of a
service called GitPod to access a Linux environment via the web
(see the labs for more information); but for
some labs and assessments, this will not be sufficient, and you will
need access to a computer which runs Linux either as its main
operating system, or via VirtualBox.

### What is the standard development environment for CITS3007? { #cits3007-sde }

The standard development environment for CITS3007 is based on
Ubuntu 20.04 running version 5.4.0 of the Linux kernel on
an x86-64 processor, and all submitted code is expected to compile and
run correctly in this environment.

In addition to the base operating system, the development environment
has the following programs (among others) installed:

- afl++ 2.60
- clang-tidy 10.0.0
- gdb 9.2
- gcc 9.3.0
- valgrind 3.15.0

If you are already familiar with how to use Vagrant: an instance of the
standard development environment can be obtained by using the
`arranstewart/cits3007-ubuntu2004` Vagrant box.

If you are not familiar with how to use Vagrant: we will explain how to
use it in the first lab class for the unit (in week 2).

## Software used in CITS3007

### Why is Virtualbox used to access Linux?

We use virtualization technology like VirtualBox to ensure students
are working in a consistent environment – and any problems encountered
can be *exactly* reproduced.

How a C program behaves, and how its data is laid out in memory, can
depend not just on the operating system version and platform the
program is compiled for, but also on the exact version of the compiler
used.

Using a common virtual machine image means all students compiling and
running a C program should see exactly the same behaviour.

### Why not used Docker or Windows Subsystem for Linux (WSL)?



## Linux command-line tools

### How can I get familiar with the Linux command-line?

Practice, practice, practice.

Perhaps more helpfully, the following short guides from MIT University's
"Missing semester" course provide some quick guidance on using the Linux command-line:

- [Course overview + the shell](https://missing.csail.mit.edu/2020/course-shell/){{blank}}
- [Shell tools and scripting](https://missing.csail.mit.edu/2020/shell-tools/){{blank}}
- [Command-line environment](https://missing.csail.mit.edu/2020/command-line/){{blank}}

The following free textbook by William Shotts is also very good:

- William E. Shotts, Jr, *The Linux Command Line: A Complete Introduction*

The Shotts text is available

- for download [as a PDF](http://linuxcommand.org/tlcl.php)
- for online reading from the [UWA Library][library], via [OneSearch][onesearch] (search for the title)
- for purchase as an e-book or paperback, either from
  [Amazon][amazon-tlcl]
  or directly from [No Starch Press](https://nostarch.com/tlcl2)
- secondhand, from [Amazon][amazon-tlcl], [Abebooks][abebooks-tlcl] and
  other online booksellers.

[library]: https://www.uwa.edu.au/library/
[onesearch]: https://onesearch.library.uwa.edu.au
[amazon-tlcl]: https://www.amazon.com/Linux-Command-Line-2nd-Introduction/dp/1593279523
[abebooks-tlcl]: https://www.abebooks.com/servlet/SearchResults?an=shotts&bi=0&bx=off&cm_sp=SearchF-_-Advtab1-_-Results&ds=20&kn=The%20Linux%20Command%20Line:%20A%20Complete%20Introduction&recentlyadded=all&sortby=17&sts=t&tn=Linux%20Command%20Line

### How do I use GNU Make to build C projects?

The following tutorials provide a basic introduction to GNU Make generally:

- [Afraid of Makefiles? Don't be!](https://endler.dev/2017/makefiles){{blank}}, by Matthias Endler
- [How to use makefiles to automate repetitive tasks](https://www.digitalocean.com/community/tutorials/how-to-use-makefiles-to-automate-repetitive-tasks-on-an-ubuntu-vps){{blank}},
  a tutorial from Digital Ocean

The following lab provides more information on using Make specifically
for C projects:

- [Makefiles lab](https://bytes.usc.edu/cs104/labs/lab3/)

------

## Questions about this page

### Why is this page so long? { #faq-length }

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 0.5em 2em; border-radius: 5pt; margin-top: 0.5em; margin-bottom: 0.5em">

For every rule, there is a story ... Sometimes the story is obvious
such as a sign that reads "Do not drive on the ice" or "No Smoking" at
the fuel pump. Other times, reading the instruction manual of a
consumer device has specific instructions such as "Do not use
television in water" or "Do not put oatmeal in the CD drive".

</div>

> - J. Matthews, "Every Rule Has a Story..." in *IEEE Communications
>   Standards Magazine*, vol. 6, no. 1, pp. 4-4, March 2022, doi:
>   [10.1109/MCOMSTD.2022.9762870](https://doi.org/10.1109/MCOMSTD.2022.9762870){{blank}}

See also [r/AskReddit][askreddit], "[What rule exists because of
you?][what-rule]{{blank}}".


[askreddit]: https://www.reddit.com/r/AskReddit/
[what-rule]: https://www.reddit.com/r/AskReddit/comments/576qaw/what_rule_exists_because_of_you/


<!--
  vim: tw=72
-->
