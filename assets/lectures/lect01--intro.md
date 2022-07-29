---
title: |
  CITS3007 Secure Coding\
  Introduction
author: "Unit coordinator: Arran Stewart"
---

# Introduction

### Outline

- Goals
  - What is this course about?
  - What do we cover, and why?
- Admin
  - Teaching staff
  - Unit website & announcements
  - Teaching activities
  - Assessment & feedback
  - Prerequisites
- Assessment tips
- C programming environment
- Security introduction

### What is this unit about?

This unit is about \alert{software security}, which is part of
\alert{information security}.

Besides information security, there are other aspects of security, such as
[physical security][phys-sec]
and [personnel security][person-sec], but those are outside the
scope of this unit.

[phys-sec]: https://www.cyber.gov.au/acsc/view-all-content/advice/guidelines-physical-security
[person-sec]: https://www.cyber.gov.au/acsc/view-all-content/advice/guidelines-personnel-security

### What we cover

We look at weaknesses (vulnerabilities) that can be present in
software systems, and can lead to security being compromised.

We ask, How can we build software that is more secure?

And look at two main approaches:

- finding vulnerabilities in existing software
- avoiding vulnerabilities in new software (at the design
  and implementation phases)

### Why care?

Everyone has items of personal information stored
in many different computer systems -- e.g. consider what computer
systems hold your...

::: block

####

\scriptsize

- Name, data of birth and address
- Financial records
- Medical and health records
- Relationships with others such as colleagues and
  friends (e.g. social media; HR databases)
- Details of your electronic activities and artifacts, like
  - \scriptsize browsing and search history
  - \scriptsize emails
  - \scriptsize phone conversations, text messages
  - \scriptsize GPS locations
  - \scriptsize purchases
- Computer accounts, passwords and files

:::

How happy are you for others to access this information? Does it
matter who is doing the accessing?

### Cost of cyber-crime

Estimates of the annual cost of cyber crime to the Australian economy range
from $33 billion[^acsc-fn] to $42 billion[^phair-fn].

Which is a lot.

\pause

On the other hand, natural disasters are *also* estimated to cost that much to
the Australian economy -- about $38 billion per year[^nat-disast-fn] -- so we should probably be
equally worried about both cyber crime and the environment.

And both amount to about 2% of Australia's annual GDP (Gross Domestic Product) of $US 1.3 trillion.

[^acsc-fn]: Australian Cyber Security Centre, 2021.

[^phair-fn]: UNSW Canberra, 2021.

[^nat-disast-fn]: Deloitte Access Economics, 2021.


### Challenges

Large-scale computer data breaches have been occurring since at least 1984,[^kalat-fn]
and organisations still seem unable to adequately protect
users' data:[^sa-fn]

`\begin{center}`{=latex}
![](lect01-images/south-aust-breach.png){ width=70% }
`\end{center}`{=latex}

 
[^kalat-fn]: See David Kalat, "[The First Major Data Breach: 1984](https://web.archive.org/web/20201216194227/https://www.thinkbrg.com/insights/publications/kalat-first-major-data-breach/)" (2020).

[sa-breach]: https://www.abc.net.au/news/2022-05-18/13000-more-sa-public-servants-involved-in-data-breach/101078646
[^sa-fn]: See Rory McClaren, "[More than 90,000 South Australian public servants now involved in payroll data breach][sa-breach]" (ABC News, May 2022)

### Challenges

\small

Often, we know basic bad practices to avoid, and good ones to adopt -- but
organizations still ignore these very basic security practices.[^whittaker-fn]

`\begin{center}`{=latex}
![](lect01-images/equifax-breach.png){ width=70% }
`\end{center}`{=latex}

[equifax-breach]: http://web.archive.org/web/20220727090628/https://techcrunch.com/2018/12/10/equifax-breach-preventable-house-oversight-report/
[^whittaker-fn]: See Zack Whittaker, "[Equifax breach was 'entirely preventable' had it used basic security measures, says House report][equifax-breach]" (TechCrunch, 2018)




### Preventing computer security failures

Many (but not all) security failures can be prevented
through improved coding practices:

- validating input received from untrusted sources
- sanitizing or escaping output
- requiring authentication for all resources not specifically
  intended to be public
- not disclosing sensitive information in error responses/pages
- implementing the "Principle of Least Privilege" -- granting
  users, systems or programs only the access they need
  in order to perform their tasks
- encrypting the transmission of all sensitive information
- avoiding insecure uses of memory

# Admin

### Teaching staff

::: block

#### Unit Coordinator

Arran Stewart\
Email: cits3007-pmc@uwa.edu.au\
Phone:  +61 8 6488 1945\
Office: Rm G.08 CSSE Building\
Consultation: Drop in from 4--5pm Fridays, or email for an appointment.

:::

::: block

#### Lab facilitators

- Santiago `Renter\'{i}a`{=latex}
- Dan Smith

:::

### Unit website

Nearly all content for the unit will be available from the unit website,
which is hosted on [GitHub](https://github.com/).

The easiest way to find it is to search on Bing or Google
for "CITS3007 github", or to bookmark <https://github.com/cits3007>.

`\begin{center}`{=latex}
![](lect01-images/website.png){ width=100% }
`\end{center}`{=latex}

### Unit website


You **won't** need to visit LMS/Blackboard to obtain teaching materials --
you'll only need to visit the LMS to access lecture recordings, and to submit
online quizzes or tests.

### Announcements

```{=latex}
\begin{columns}[t]
\begin{column}{0.45\textwidth}
```

\small

- Announcements will be made in lectures, and on the unit
  help forum, [`help3007`][help3007].
- It's important to check the forum regularly -- at least once a week.
- If you log in and visit the forum site, you can set it
  to alert you via email when new postings are made.

```{=latex}
\end{column}
\begin{column}{0.55\textwidth}
```


`\begin{center}`{=latex}
![](lect01-images/help3007.png){ width=100% }
`\end{center}`{=latex}

```{=latex}
\end{column}
\end{columns}
```



[help3007]: https://secure.csse.uwa.edu.au/run/help3007



### Problems

::: block

####

Who should I contact if I have an issue?

:::

- For most matters -- the unit coordinator (UC), Arran
  - If it's a problem other students are likely to have,
    it's suggested you post to [Help3007][help3007]
    so other students can benefit from the answer.
  - If you require personal communication with the UC,
    feel free to email me on cits3007-pmc@uwa.edu.au.

&nbsp;

- In labs -- feel free to ask the lab facilitators
  (Daniel and Santiago)
  about any of the teaching and learning materials
  presented in labs or lectures.




### Unit contact hours – details

Lectures:

- You should attend one lecture (1 hour 50 mins) per week -- you should either attend in
  person, attend online (we will use MS Teams), or watch the recorded lecture.
  (Recorded lectures are available via the university's
  LMS, at <https://lms.uwa.edu.au/>.)

Labs:

- You should attend one lab (1 hour 50 mins) each week, starting in week
  *two*.\
  If there is room available for you, you are welcome to attend other
  lab sessions as well. (See the website to find the times for
  labs other than the one you're allocated to.)
- In the labs, we will work through practical exercises
  related to the unit material. If you have a laptop, it's recommended
  you bring it.

Lecture slides and lab worksheets:

- Lecture slides and lab worksheets will go up on the website as the
  semester progresses.

### Workshops

There may not be sufficient time in lectures to demonstrate some of
the software and techniques we will be using. On occasional weeks
(e.g. when programming assignments are released)
we may schedule **workshop** sessions
(held on Mondays at 10am in Physics Lecture Room 215).

We will try to advertise any workshop sessions at least 2 weeks in advance.

It's recommended you bring a laptop to them, so that you can follow
along with any software/programming demonstrations.

### Non-timetabled hours

A six-point unit is deemed to be equivalent to one quarter of a
full-time workload, so you are expected to commit 10--12 hours
per week to the unit, averaged over the entire semester.

Outside of the
contact hours (3 hours per week) for the unit, the remainder of your
time should be spent reading the recommended reading, attempting
exercises and working on assignment tasks.

### CITS3007 unit content

See the CITS3007 website at <https://cits3007.github.io/schedule/>
for the list of topics covered.

The main topics are:

- memory safety and arithmetic errors
- inter-process communication and input validation
- accessing files and resources safely
- cryptography
- secure software development processes

### Textbook

```{=latex}
\begin{columns}[t]
\begin{column}{0.35\textwidth}
```

\footnotesize

Visit the unit website for details of the textbooks and readings
you will need access to:

<https://cits3007.github.io/>

&nbsp;

The main textbook is [*Designing Secure Software*][kohnfelder] by Loren Kohnfelder
(No Starch Press, 2021).

&nbsp;

You have online access to it via the UWA Library -- look in the LMS
under "Unit Readings" and that should give you links into the
library's holdings.

[kohnfelder]: https://www.amazon.com/Designing-Secure-Software-Guide-Developers/dp/1718501927

```{=latex}
\end{column}
\begin{column}{0.65\textwidth}
```

`\begin{center}`{=latex}
![](lect01-images/kohnfelder-textbook-cover.jpg){ width=70% }
`\end{center}`{=latex}

```{=latex}
\end{column}
\end{columns}
```


### Assessment

The assessment for CITS3007 consists of an online
quiz, a mid-semester take-home test, a project, and a final examination.

All details are on the Assessment page of the unit website at:

- <https://cits3007.github.io/assessment/>

The project will be done individually.



### Feedback

There'll be an opportunity to give feedback on how
the unit is going around week 5 -- we'll post a survey
form in MS Teams.

Please do make use of the opportunity to comment
on the course!

There is *also* an opportunity to provide feedback via
the SELT (Student Experience of Learning and Teaching) survey[^selt]
at the end of semester -- but that will come too late
for us to make any changes *this* semester.

[^selt]: See [SELT-Policy.doc](https://www.uwa.edu.au/policy/-/media/Project/UWA/UWA/Policy-Library/Policy/Teaching-and-Research-Training/Learning-and-Teaching/SELT/SELT-Policy.doc) (Word document) for UWA's SELT policy.


### Prerequisites

The prerequisites for this unit are 12 points of programming units.
At UWA, that should mean you're familiar with at least one
object-oriented programming language (Java or Python).

If you aren't -- let me know.

**Advisable prior studies:**

Although the prerequisite for this unit is only 12 points of programming, you
are advised to take this unit in the third year of your course to ensure you have a
comprehensive understanding of computer systems, and will be able to do well in this
unit.

In particular, CITS2002 Systems Programming will be helpful in understanding
computer systems and the C language.


### Assessment tips

\footnotesize

Some tips for doing well in the unit:

\alert{Written work}:

- The project and exam will include English written work as well as programming.

  Communicating with others -- for instance, documenting your work, writing
  a security testing plan, or justifying a particular technical approach -- is an important
  part of software engineering.

- I suggest taking a look at the UWA Library's "Study support"
  web pages at
  <https://www.uwa.edu.au/library/Help-and-support/Study-support>,
  especially the Communication and Research Skills (CARS) module and materials.

  These web pages provide advice on writing tasks like:

  - finding, evaluating and critiquing evidence
  - making an argument
  - writing a report



### Assessment tips

\small

\alert{Written work, cont'd}:

- Make sure you're careful in your use of terminology. If your answer
  is unclear or confusing, you are unlikely to be awarded
  high marks for an assessment.

### Assessment tips

\small

\alert{Programming work}:

- An important part of programming is that code not only achieves
  a desired effect, but can also be easily understood and maintained by others.

  Your code is expected to be clearly written, well-formatted,
  and easy for others to understand.

### Assessment tips

\small

\alert{General}:

- If in class we cover a particular way of completing a task
  or presenting information, then use that same method in your work.

- There may well be alternative approaches, but usually we have
  good reasons for choosing the method we have.

- Secure software development is full of pitfalls
  for the unwary -- what looks like a reasonable approach
  can have disastrous security consequences.


 

### Programming environment

We will largely be using the C programming language.

Project code will be expected to compile and run correctly
on a standard Linux environment[^standard-dev] which we provide
in the form of virtual machine (VM) images.

[^standard-dev]: The standard environment contains C development tools
  installed on an Ubuntu 20.04 Linux distribution, running Linux
  kernel version 5.4.0.

### Programming environment, cont'd

The VM images are hosted at

- <https://app.vagrantup.com/arranstewart/boxes/cits3007-ubuntu2004>

and in the first lab we will look at how you can access them
using the open source tools VirtualBox and Vagrant.

(Students using M1 series Macs will not be able to use VirtualBox --
those students will need to use [UTM][utm], an alternative
virtualization package.)

[utm]: https://mac.getutm.app


# Security introduction

### Security goals

Traditionally, information security is based on three
goals ("C I A"):

- \alert{Confidentiality} -- preventing the unauthorised disclosure of
  information
- \alert{Integrity} -- preventing the unauthorised modification of information
- \alert{Availability} -- ensuring timely and reliable access to and use of information
  by authorised users

### Purdue University case

```{=latex}
\begin{columns}[t]
\begin{column}{0.30\textwidth}
```

\small

Which security goal was compromised here?

[roy-sun-breach]: http://web.archive.org/web/20210228093256/https://www.ibtimes.com/who-roy-sun-purdue-graduate-sentenced-jail-changing-grades-straight-1559438



```{=latex}
\end{column}
\begin{column}{0.70\textwidth}
```

`\begin{center}`{=latex}
![](lect01-images/roy-sun-hack.png){ width=100% }
`\end{center}`{=latex}

&nbsp;

\scriptsize

*"During his senior year, Sun missed all of his classes but one. However, with
the help of [an accomplice's] scheme, he was still able to receive straight
A's."*\footnotemark[1]

```{=latex}
\end{column}
\end{columns}
```

`\footnotetext[1]{`{=latex}
See Treye Green, "[Who Is Roy Sun? Purdue Graduate Sentenced To Jail For Changing Grades To Straight A’s][roy-sun-breach]" (International Business Times, 2014)
`}`{=latex}

### Chinese police hacking case

```{=latex}
\begin{columns}[t]
\begin{column}{0.25\textwidth}
```

\small

How about here?



```{=latex}
\end{column}
\begin{column}{0.75\textwidth}
```

`\begin{center}`{=latex}
![](lect01-images/china-police-leak.png){ width=100% }
`\end{center}`{=latex}

&nbsp;

\scriptsize

*"A hacker claimed in an online forum that they had stolen 1 billion records, mostly belonging to Chinese citizens, in an ongoing bid to sell the information for 10 bitcoins, or almost $300,000."*\footnotemark[1]

```{=latex}
\end{column}
\end{columns}
```

[china-police-breach]: http://web.archive.org/web/20220714015017/https://www.abc.net.au/news/2022-07-08/australian-citizens-exposed-in-shanghai-police-data-leak/101214904


`\footnotetext[1]{`{=latex}
See Bang Xiao, "[Private information of more than 100 Australians exposed amid huge China police data leak][china-police-breach]" (ABC News, 7 July 2022)
`}`{=latex}

### Akamai outage

```{=latex}
\begin{columns}[t]
\begin{column}{0.25\textwidth}
```

\small

And here?



```{=latex}
\end{column}
\begin{column}{0.75\textwidth}
```

`\begin{center}`{=latex}
![](lect01-images/akamai-outage.png){ width=95% }
`\end{center}`{=latex}

&nbsp;

\scriptsize

*"The company responsible for a mass web outage that hit three of Australia's big four banks, Virgin and Australia Post, among others, has said a routing table error was to blame for the service disruption, not a cyber attack."*\footnotemark[1]


```{=latex}
\end{column}
\end{columns}
```

[akamai-outage]: http://web.archive.org/web/20211105015341/https://www.abc.net.au/news/2021-06-17/banks-experiencing-outages-internet-banking-app/100223900


`\footnotetext[1]{`{=latex}
See Stephanie Chalmers and Michael Janda, "[Akamai says a technical problem not cyber attack was behind mass bank, corporate web outage][akamai-outage]" (ABC News, 17 June 2021)
`}`{=latex}

### Safety versus security

- Generally when we talk about software security, we mean
  ensuring that bad things don't happen due to *deliberate*
  actions by others.
- But a related goal is software *safety*, which is ensuring
  that bad things don't happen, whether deliberate or not.

\pause

&nbsp;

- The security goals we mentioned can often be compromised by accident, as well as
  intentionally --
  - confidentiality can be threatened by (say) accidentally leaving
    a USB drive full of employee details in a car-park
  - integrity can be threatened if we fail to keep proper backups
    and suffer a power outage
  - availability can be threatened if we make a mistake in routing
    Internet traffic
  

### Accidental compromise

`\begin{center}`{=latex}
![](lect01-images/sydney-bin.png){ width=75% }
`\end{center}`{=latex}

\scriptsize

*"More than 700 public patients and hundreds more in the private system have had their privacy breached after letters from their specialists to GPs were found dumped in a Sydney bin."*[^sydney-bin-fn]

[^sydney-bin-fn]: See Sarah Gerathy, "[Confidential hospital patient records found dumped in Sydney bin][sydney-bin]" (ABC News, 21 April 2017)


[sydney-bin]: https://www.abc.net.au/news/2017-04-21/confidential-health-records-found-dumped-in-sydney-bin/8460694 


### Other security goals

Some security experts believe the "CIA" triad needs to be augmented with additional
goals; two commonly proposed ones are:

- \alert{Authenticity} -- being confident in or able to verify the genuineness
  of a message or information
- \alert{Accountability} -- the ability to trace actions back uniquely to the
  entity that took those actions. \
  (Or, sometimes, \alert{Non-repudiation} -- the creation of evidence that
  an action has occurred, so that a user cannot later falsely deny
  taking that action.)

### Example -- alleged training email


```{=latex}
\begin{columns}[t]
\begin{column}{0.30\textwidth}
```

\footnotesize

I received this email on Tuesday, purporting
to be from UWA's IT Services.\

&nbsp;

Is it genuine?



```{=latex}
\end{column}
\begin{column}{0.70\textwidth}
```

`\begin{center}`{=latex}
![](lect01-images/cybersec-training.png){ width=100% }
`\end{center}`{=latex}

&nbsp;



```{=latex}
\end{column}
\end{columns}
```

### Example -- alleged training email

\small

About the email:

- It asks me to click on a non-UWA link, <https://uwa.securityeducation.com/>,
  which in turn asks me to provide my UWA user ID and password.
- IT Service's page on phishing emails[^uwa-phish] says that
  "Any email from a legitimate business such as the University or your bank
  will give a telephone number and postal address", which this email does not.

\pause

&nbsp;

- In fact, the email *is* from UWA's IT services.

[^uwa-phish]: At <https://cybersecurity.it.uwa.edu.au/stay-secure/email-scams-phishing>

<!--
archived at: http://web.archive.org/web/20220308204230/https://cybersecurity.it.uwa.edu.au/stay-secure/email-scams-phishing
-->

### Threats, vulnerabilities, incidents & attacks

These concepts all relate to the ways in which
information security can be or is compromised.

- \alert{Threat}: Anything that has the potential to cause harm
  or loss.

  - Threats can be *natural threats* (floods, hurricanes, solar flares),
    *unintentional threats* (an intern accidentally deletes everything
    from your server's filesystem), or *intentional threats* (activities done deliberately:
    e.g. altering or deliberately deleting server data).
  - Could be thought of as "a source of danger".

  When we talk about *security* threats, we mean
  harm or loss due to a compromise of a security goal.

- \alert{Vulnerability}: A flaw or weakness in a system's design, implementation
  or use that could be exploited to compromise security.


<!--
source:

adapted from Stallings & Brown, Computer Security, 3rd edn,
table 1.1

and from the net in general

-->

### Threats, vulnerabilities, incidents & attacks

- \alert{Attack}: A situation where someone (the attacker) deliberately exploits
  a vulnerability and compromises security goals.
- \alert{Incident}: Much the same, except it arises from a non-deliberate act.
  Security incidents can still be costly and harmful, however, so
  we need to take them into account.  


### References

\footnotesize

- Australian Cyber Security Centre, *ACSC Annual Cyber Threat Report: 1 July 2020 to 30 June 2021* (Kingston ACT, 2021), <https://www.cyber.gov.au/sites/default/files/2021-09/ACSC%20Annual%20Cyber%20Threat%20Report%20-%202020-2021.pdf>
  <!-- summarised at <http://web.archive.org/web/20220715163603/https://www.cyber.gov.au/acsc/view-all-content/reports-and-statistics/acsc-annual-cyber-threat-report-2020-21>
    archived at <http://web.archive.org/web/20220714200242/https://www.cyber.gov.au/sites/default/files/2021-09/ACSC%20Annual%20Cyber%20Threat%20Report%20-%202020-2021.pdf>
  -->

- UNSW Canberra, "Cybercrime an Estimated $42 Billion Cost to Australian Economy," UNSW Canberra Latest News, created December 6, 2021, accessed July 28, 2022, <https://www.unsw.adfa.edu.au/newsroom/news/cybercrime-estimated-42-billion-cost-australian-economy>.
  <!--
phair.

Date not in webpage, but archived at: <http://web.archive.org/web/20220328232334/https://www.unsw.adfa.edu.au/newsroom/news?keywords=&page=2>

phair archived at: <http://web.archive.org/web/20220326024227/https://www.unsw.adfa.edu.au/newsroom/news/cybercrime-estimated-42-billion-cost-australian-economy>
-->

- Deloitte Access Economics, *Update to the Economic of Natural Disasters in Australia*, Special Report (Sydney, NSW, 2021), <https://www.iag.com.au/sites/default/files/Newsroom%20PDFs/Special%20report%20_Update%20to%20the%20economic%20costs%20of%20natural%20disasters%20in%20Australia.pdf>.
  <!--
<http://australianbusinessroundtable.com.au/assets/documents/Special%20report:%20Update%20to%20the%20economic%20costs%20of%20natural%20disasters%20in%20Australia/Special%20report%20_Update%20to%20the%20economic%20costs%20of%20natural%20disasters%20in%20Australia.pdf>

archived at: <http://web.archive.org/web/20220627210149/http://australianbusinessroundtable.com.au/assets/documents/Special%20report:%20Update%20to%20the%20economic%20costs%20of%20natural%20disasters%20in%20Australia/Special%20report%20_Update%20to%20the%20economic%20costs%20of%20natural%20disasters%20in%20Australia.pdf>

-->




