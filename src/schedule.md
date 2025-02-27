---js
{
  // For semester dates, see startDate (at bottom of this js section)
  // and siteinfo.semesterStartDateStr
  title: "Schedule",
  layout: "special-layout.njk",

  // css
  customStyle:  `
  ul, ol, dl, li p {
    margin: 0 0 0.70em;
  }

  td p {
    padding: 0pt;
    margin: 0pt;
  }

  .ref {
    font-variant: small-caps;
  }

  /* big */
  @media (min-width: 768px) {
    .schedule-table {
      flex: 1 0 auto;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      width: 95vw;
      max-width: 950px;
      border-collapse: collapse;
    }

    .table-container table {
      margin: 0 5pt;
    }
  }
  /* small */
  @media (max-width: 767px) {
    .table-container {
      width: 100%;
      left: 0;
      padding-left: 5px;
      overflow-x: scroll;
    }

    .table-container table {
      left: 0;
      margin-left: 3px;
      width: 110%;
      min-width: 800px;
    }
  }



  .schedule-table {
    border-collapse: collapse;
    border-bottom: solid black 2pt;
  }

  .schedule-table tr.oddrow {
    background-color: var(--accent-v-v-light);
  }

  .schedule-table th {
    border-top: solid black 1pt;
    border-bottom: solid black 1pt;
    background-color: var(--accent-v-light);
  }

  .schedule-table td
  {
    padding: 1ex 1em;
    border-bottom: solid black 0.5pt;
    vertical-align: top;
  }

  /* small */
  @media (max-width: 767px) {
    .schedule-table {
      font-size: 15px;
    }
  }
  /* big */
  @media (min-width: 768px) {
    .schedule-table {
      font-size: 14px;
    }
  }

  `,
  // end css

  // formatter: func that takes
  //    [asstType, date]
  // pair and returns nice string
  assessmentDates: (assessments, formatter) => {
    let res = {};
    function isValidDate(d) {
      return d instanceof Date && !isNaN(d);
    }
    const util = require('util');
    for (let [asstname, asst] of Object.entries(assessments)) {
      for(const dateType in asst.dates) {
        let theDate = asst.dates[dateType];
        let pretty  = formatter([dateType, theDate]);
        if (isValidDate(theDate)) {
          res[theDate.getTime()] = `${asst.name}: ${pretty}`;
        }
      }
    }
    return res;
  },

  datesForWeek: (weekStartDate, assessmentDates_) => {
    const moment  = require('moment');
    function formatty(dt) {
      return moment(dt).format("h:mm a ddd D MMM")
    }

    // if we have multiple items, render as a list
    // ^H^H actually, do it for single items as well
    function joinItems(arr) {
      if (arr.length == 0) {
        return ""
      } else if (arr.length == 1) {
        return "- " + arr[0]
      } else {
        return arr.map( (x) => "- " + x).join("\n")
      }
    }

    let wkEndDate = new Date(weekStartDate);
    wkEndDate.setDate( weekStartDate.getDate() + 7 );
    let res = []
    for(let tm in assessmentDates_) {
      let dt = new Date(tm);
      dt.setTime(tm);
      if (weekStartDate <= dt  && dt < wkEndDate) {
        res.push(assessmentDates_[tm]);
      }
    }
    return joinItems(res);
  },

  stripIndent: (str) =>
    str.replaceAll(/\n\s+/g, '\n'),

  stripNewlines: (str) =>
    str.replaceAll(/\n/g, ''),

  // semester start date
  startDate: '2025-02-24',
  // should be same as siteinfo.semesterStartDateStr.
  // ugh. can we DRY?

}
---

{% set help_forum = siteinfo.help_forum %}
{% set forum_url  = siteinfo.forum_url %}
{% set helpforum   = help_forum | extLink(forum_url) | safe %}

{% set weeks   = schedule.weeks %}

<!--!
<main>
<div class="page">
!-->

# {{ title }}

The table below shows the topics intended to be covered in
each week of semester.
The order or delivery date of
lectures on this page may change during the semester.

- For **lecture slides**{ class="hi-pri" } and
  **lab worksheets**{ class="hi-pri" }
  see the [Resources page]({{ "/resources/" | url }}).
- For [**recordings**]({{ siteinfo.lms_url }}){ class="hi-pri" } of the lectures,
  visit UWA's {{ siteinfo.lms }} (Learning
  Management System).

## Recommended readings

In most cases, a good C textbook and a good operating systems textbook
will cover all the background you need to know for a topic on the
schedule.

However, if something in the lectures or labs is unclear, you may
find it useful to refer to a textbook on security or secure coding.
Unfortunately there is no one textbook that covers all the topics we
look at in CITS3007, but the schedule below
gives **[recommended readings][unit-readings]{ target="_blank" }**{ class="hi-pri" }
for each topic.
Online copies of most readings are available via
the {{ siteinfo.lms }} (look under "Unit Readings").
The
readings may be added to or modified as the semester progresses.

<!-- _x -->

<details>

<summary>References in the reading list are to the sources listed <b class="high-pri" >here</b> (click here to expand):</summary>

<div class='reading-list-source' style="margin: 1rem; padding: 1rem; border: 1pt black solid; border-radius: 5pt;" >

**Good11**{ class="ref" }

:   - Goodrich, M, and R Tamassia, [*Introduction to Computer
      Security*][goodrich] (Pearson, 2011)

**Koh21**{ class="ref" }

:   - Kohnfelder, L, [*Designing Secure Software*][kohnfelder] (No Starch Press, 2021)

**Sea13**{ class="ref" }

:   - Seacord, R, [*Secure Coding in C and C++*][seacord-sec] (2nd ed; Addison-Wesley, 2013)

**Sea20**{ class="ref" }

:   - Seacord, R, [*Effective C: An Introduction to Professional C Programming*][seacord-c] (No Starch Press, 2020)


**Smi08**{ class="ref" }

:   - Smith, S and J Marchesini, [*The Craft of System Security*][smith-craft] (Addison-Wesley, 2008)


**Vie03**{ class="ref" }

:   - Viega, J and M Messier, [*Secure Programming Cookbook for C and C++*][viega-sec] (O'Reilly Media, 2003)

</div>


</details>

[kohnfelder]: https://www.amazon.com/Designing-Secure-Software-Guide-Developers/dp/1718501927
[goodrich]: https://www.amazon.com/Introduction-Computer-Security-Michael-Goodrich/dp/0321512944/
[unit-readings]: http://www.unitreadings.library.uwa.edu.au/leganto/public/61UWA_INST/lists/18520998510002101?auth=SAML
[seacord-sec]: https://www.amazon.com.au/Secure-Coding-Robert-Seacord-April/dp/B00D8211N2 
[seacord-c]: https://www.amazon.com.au/Second-Language-Introduction-Professional-Programming/dp/1718501048
[smith-craft]: https://www.amazon.com.au/Craft-System-Security-Sean-Smith/dp/0321434838
[viega-sec]: https://www.amazon.com.au/Secure-Programming-Cookbook-Cryptography-Authentication-ebook/dp/B0043EWU16

<!--!
</div>
!-->



<!--!
<div class="table-container">

<table class="schedule-table" >
<colgroup>
<col style="width: 10%;">
<col style="width: 16%">
<col style="width: 18%">
<col style="width: 43%">
</colgroup>
<tbody>
<tr>
<th>
  Week
</th>
<th>
 Lecture
</th>
<th>
 Lab
</th>
<th>
  Reading
</th>
</tr>
!-->

{% set assessmentDates_  = assessmentDates( siteinfo.assessments, siteinfo.formatAssessmentDate ) %}
{%- for week in weeks -%}
<tr{{ (' class = "oddrow"' | safe) if (loop.index % 2 == 1) else "" }}>
  <td style="text-align: center;">
   <strong>{{ week.weekNum        }}</strong>
   <br/>
   {{ week.date | dateFormat('D MMM') }}
  </td>
  <td>
    {{ week.lectureTopic      | mdBlock | safe }}
  </td>
  <td>{{ stripIndent(week.workshopTopic) | mdBlock | safe }}</td>
  <td>{{ stripIndent(week.reading)  | mdBlock | safe }}</td>
  {#
  <td>
    {%- set weekStartDate = week.date %}
    {%- set stuff = datesForWeek(weekStartDate, assessmentDates_) %}
    {{- stripNewlines( stuff | mdBlock ) | safe  }}
  </td>
  #}
</tr>
{%- endfor %}



<!--!
</tbody>
</table>

</div>
!-->



<!--!
</main>
!-->

{# vim: tw=92
#}
