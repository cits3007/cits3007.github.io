---
title: "Welcome"
layout: page-layout.njk
customStyle: |
  ul, ol, dl, li p {
    margin: 0 0 0.70em;
  }

  .questions li {
    padding-top: 2ex;
  }

  .quicklinks-table-ctr table
  {
    width: 110%;
    transform: translateX(-5%)
  }

  .quicklinks-table-ctr td
  {
    vertical-align: top;
    padding-top: 1ex;
  }

  /* quicklinks col 1 */
  .quicklinks-table-ctr td:nth-child(1)
  {
    width: 50%;
    text-align: start;
    padding-right: 0.5em;
  }

  /* quicklinks col 2 */
  .quicklinks-table-ctr td:nth-child(2)
  {
    width: 2em;
    text-align: center;
  }

  /* quicklinks col 3 */
  .quicklinks-table-ctr td:nth-child(3)
  {
    x-padding-left: 0.4em;
    text-align: start;
  }


---

{% set help_forum = siteinfo.help_forum %}
{% set forum_url  = siteinfo.forum_url %}
{% set help3007   = help_forum | extLink(forum_url) | safe %}


## Welcome to {{ siteinfo.unitcode }} &nbsp; {{ siteinfo.unitname }}

Welcome to the website for {{ siteinfo.unitcode }}
in {{ siteinfo.year }}. Unit material (lecture slides and lab/workshop
material) for this unit will be **published on these pages, and not on
the LMS**{ class="hi-pri" }; but refer to the {{ siteinfo.lms }}
for recorded lectures and the unit outline.

## Quick links

::: { class="quicklinks-table-ctr" }

```{list-table}
- - - Want to know [**what we'll be doing**](#weekly-activities){ class="hi-pri" } and
      [**when**](schedule){ class="hi-pri" }?
  - <i class="fa fa-arrow-circle-right"></i>
  - See below for quick details of the [**weekly
    activities**](#weekly-activities){ class="hi-pri" } for the unit,
    and see the [**Schedule**](schedule){ class="hi-pri" } for a guide
    to what will be covered in what week. (There's also a link to the
    schedule at the top of every page.)
- - - Want to know [**if the lectures are recorded**](#lecture-recordings){ class="hi-pri" }?
  - <i class="fa fa-arrow-circle-right"></i>
  - See below under [**"Lecture recordings"**](#lecture-recordings){ class="hi-pri" }.
- - - Want to know [**what the assessments are**](/assessment){ class="hi-pri" }?
  - <i class="fa fa-arrow-circle-right"></i>
  - See the [**Assessments page**](/assessment){ class="hi-pri" }.
- - - Looking for [**lecture slides**](resources/#lectures){ class="hi-pri" }
      or [**lab exercise sheets**](resources/#labworkshops)?
  - <i class="fa fa-arrow-circle-right"></i>
  - You can find them on the [**Resources page**](resources){ class="hi-pri" }.
    (There's also a link to it at the top of every page.)
- - - Want to [ask a question](questions){ class="hi-pri" } about the unit?
  - <i class="fa fa-arrow-circle-right"></i>
  - Currently the best place to ask questions is on the [**discussion forum**]({{forum_url}}){ target="_blank" }
    for the unit, [**{{help_forum}}**]({{forum_url}}){ class="hi-pri" target="_blank" } --
    that way, all students can benefit from answers to your questions. \
    (Or, if it's not a topic suitable for the forum, feel free to [email me](#unit-coordinator) instead.)
- - - Want to know what you should
      [already know](#assumed-knowledge){ class="hi-pri" }
      before taking this unit?
  - <i class="fa fa-arrow-circle-right"></i>
  - See the [**assumed knowledge**](#assumed-knowledge){ class="hi-pri" }
    for students taking this unit, below, and note that a
    prerequisite for this unit is the completion of 12 points of
    programming units.
```

:::

<!--
x**
-->


[help]: https://secure.csse.uwa.edu.au/run/help{{ siteinfo.citscode }}

------

## Unit overview


This unit covers computer security topics including:

- memory safety
- input validation and and inter-process communication
- race conditions and file operations
- cryptography best practices; and
- development best practices.


-------

## Unit Coordinator

[**{{ coordinator.name }}**][coordinator-dir]{ target="_blank" }

::: { class="inline-table-ctr" }

```{list-table}
- - **Office**
  - {{ coordinator.room }}
- - **Email**
  - {% email_el_spannized coordinator.email %}
- - **Availability**
  - I work half-time at UWA, and am normally only on campus on Tuesdays
    and Fridays.
- - **Consultation**
  - Email {% email_el_spannized coordinator.email %} for an appointment,
    or visit my office between 4-5pm Fridays. Students are also
    welcome to speak to me after the lectures.
```

{#
    **Changes due to Covid restrictions, March 2022**: While we're under restrictions due to Covid and most
    students are off campus, I suggest emailing me anytime up until
    Wednesday morning to make an appointment for an online meeting between 4
    and 5pm Wednesday afternoon.
    (Or, if between 4 and 5pm Wednesday doesn't suit, we can arrange some other
    time.)
#}


:::

[coordinator-dir]: {{ coordinator.directory }}


------

## Weekly activities

*(Note that there are no labs in week 1, beginning Mon 25 July;
labs don't start until week 2)*{ class="hi-pri" }

**Lecture**

:   There is one two-hour lecture each week
    (starting in week ***one***{ class="hi-pri" }), at
    {{ siteinfo.lecture_time }} in {{ siteinfo.lecture_venue }}.

    You should either attend in person,
    attend online (see the
    [instructions for joining with MS Teams](/resources/#streamed-lectures)),
    or watch the recorded lecture on {{ siteinfo.lms }}.

**Labs**

:   You should attend one lab each week, starting in week
    ***two***{ class="hi-pri" }.\
    However, as long as there is room available for you, you are welcome to attend other
    sessions as well.

**Workshops**

:   There may not be sufficient time in lectures to demonstrate some of
    the software and techniques we will be using. On occasional weeks
    (e.g. when programming assignments are released)
    **workshop**{ class="hi-pri" } sessions will be scheduled – these
    will be held on Mondays at 10&nbsp;am in Physics Lecture Room 215
    [(Physics building, room 2.15)][phys-215].

    Any workshop sessions will be advertised at least 2 weeks in advance.
    It's recommended you bring a laptop to them, so that you can follow
    along with any software/programming demonstrations.

[phys-215]: https://link.mazemap.com/tGWFSmEa 


{#
There are currently two face-to-face lab/workshop sessions:

- Wednesday, 12 noon--2 pm, in CSSE lab 2.05
- Wednesday, 2 pm--4 pm, in CSSE lab 2.05
#}

You can always get full details of lecture and lab times and venues by
visiting UWA's **{{ siteinfo.year }} [Timetable site][cits3007-timetable]{ target="_blank" }**{ class="hi-pri" }.
(If the information for {{ siteinfo.unitcode }} is not visible, then enter "CITS3007" in the
box labelled "Unit search", and then click "Show timetable".)

[cits3007-timetable]: https://timetable.applications.uwa.edu.au/?selectunits={{ siteinfo.unitcode }}


### Lecture recordings

**The lectures are recorded**{ class="hi-pri" }, and will be
available via the {{ siteinfo.lms }} -- usually within an
hour of the lecture finishing.

But please note that recordings do
sometimes fail -- so if you *can* attend the lecture in-person or
online, it's recommended.

### Time required

Note that materials presented during class sessions
**<span>*do not*</span> define the whole unit**{ class="hi-pri" }.
A six-point unit is deemed to be equivalent to one quarter of a
full-time workload, so you would be expected to commit 10--12 hours
per week to the unit, averaged over the entire semester.
Outside of the contact hours (3 hours per week) for the unit, the
remainder of your time should be spent reading the recommended reading,
attempting exercises and working on assignment tasks.

### Preparing for lectures

The [**schedule**](schedule){ class="hi-pri" }
contains the list of **recommended readings**{ class="hi-pri" } for each
topic. To gain maximum benefit from the lectures and workshops, I
recommend you at least review these *before* attending class.

### Who'll be helping in labs { #facilitators }

Our facilitators for labs are:

- Dan Smith
- Santiago Aguilar

{% set facilitators = ['daniel', 'santiago'] %}

<div style="display: flex; justify-content: space-evenly;">
{% for facilitator in facilitators %}
<figure>
<img src="{{ '/images/' + facilitator + '.jpg' | url }}" alt="{{facilitator}}" width=120px height=120px style="border-radius: 30%;">
<figcaption style="text-align: center;" >{{ facilitator | initialCap }}</figcaption>
</figure>
{% endfor %}
</div>



-----

## Assumed knowledge

Completion of 12 points of programming-based units is a prerequisite
for enrolling in CITS3007. In particular, it's assumed that you are
familiar with programming in at least one procedural/OO language
(typically either Python or Java). Please let the Unit Coordinator
know as soon as possible if this is not the case.

It's advisable (although not required) to complete
[CITS2002 Systems Programming][cits2002] –
which introduces the C programming language –
before enrolling in CITS3007, as programming assignments will
use standard C. The basics of C programming will be covered
in CITS3007, but at a fairly brisk pace.

[cits2002]: https://teaching.csse.uwa.edu.au/units/CITS2002/


-----


{#

## Feedback survey

We want to ensure everyone enrolled in the unit is able to access
lectures, lab/workshops, and a suitable Java development environment in which to
complete exercises and assignments. We also want to find out what you're
finding useful (or not) about the unit.

So there is a survey for CITS2003/CITS4407 students available on the MS
Teams page for the unit -- you can also reach it by clicking
[**here**][survey-link]{ target="_blank" class="hi-pri" }. If you can
assist us by completing the survey before the end of **week 4**{:
class="hi-pri" :} (i.e., 5 pm Friday, 19 March) that would be greatly
appreciated.

[survey-link]: https://teams.microsoft.com/l/entity/81fef3a6-72aa-4648-a763-de824aeafb7d/_djb2_msteams_prefix_225387803?context=%7B%22subEntityId%22%3Anull%2C%22channelId%22%3A%2219%3A9a6540f366aa438c8fe185aadb8cb33a%40thread.tacv2%22%7D&groupId=8c2d8b6e-4af0-457b-8094-32e95c4d6107&tenantId=05894af0-cb28-46d8-8716-74cdb46e2226

#}

## Expectations


It is expected that you will act professionally at all times, both face to face and
via electronic media.
Please see the [UWA Code of Conduct][code-of-conduct], which is founded on
the [UWA Code of Ethics][code-of-ethics]. 

It is also expected that you act ethically in your studies.
You will have completed the [Academic Conduct Essentials][acad-essentials]
unit, which explains what is appropriate and inappropriate academic
conduct.

{#
To avoid plagiarism, ensure you reference
There is also a link one the Resources page to a
<a href="./resources.html#Referencing guide">referencing guide (from MIT) specifically for code.</a>
#}

[code-of-conduct]: https://www.hr.uwa.edu.au/policies/policies/conduct/code/conduct
[code-of-ethics]: https://www.hr.uwa.edu.au/policies/policies/conduct/code/ethics
[acad-essentials]: https://www.uwa.edu.au/library/find-resources/ace 

## Policies

Before undertaking this unit,
students are strongly encouraged to read UWA's
[Policy on Assessment][assessment-policy]{ target="_blank" }.

[assessment-policy]: https://www.uwa.edu.au/policy?method=document&id=UP07%2F132#faq-5323d73c-6b2b-44e6-b18d-0a559620de54


{#

- UWA's [University charter of student rights and responsibilities][charter]{ target="_blank" }
- UWA's [Policy on Assessment][assessment-policy]{ target="_blank" } -- particularly &sect;10.2 <i>Principles of submission and penalty for late submission</i>,
- UWA's [Policy on Academic Conduct][academic-conduct]{ target="_blank" }

[charter]: https://www.uwa.edu.au/policy/-/media/Policy/Policy/Student-Administration/Charter-of-Student-Right-and-Responsibilities/Charter-of-Student-Rights-and-Responsibilities.doc
[academic-conduct]: https://www.student.uwa.edu.au/learning/resources/ace/conduct

#}

<!--
  vim: tw=72
-->
