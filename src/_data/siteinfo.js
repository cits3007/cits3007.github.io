const moment  = require('moment');
const util    = require('util');

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

// formate a [dateType, dateVal] pair
// where dateType is a string ("available", "due", etc)
function formatAssessmentDate(asstDate) {
  let [dateType, dt] = asstDate;
  // initial cap
  dateType = dateType[0].toUpperCase() + dateType.slice(1);
  // dt is string (leave as is), or date
  if (isValidDate(dt)) {
    // either date, or date+time
    if (dt.getHours() == 0) {
      dt = moment(dt).format("ddd D MMM");
    } else {
      dt = moment(dt).format("h:mm a ddd D MMM");
    }
  }
  return `${dateType} ${dt}`
}

// format a (dateType => date) mapping
// (where dateType = string "open", "closed", "due" etc
function formatAssessmentDates(asstDates) {
  let dates = Object.entries(asstDates).map(formatAssessmentDate);
  return dates.join("\\\n");
}

module.exports = function(configData) {
  let { render, renderInline, extLink, safe } = configData.markdownConfig

  const year      =  2022;
  const citscode  = "3007";
  const unitcode  = `CITS${citscode}`;
  const unitname  = "Secure Coding";
  const locode    = unitcode.toLowerCase();

  const handbook_url      = `https://handbooks.uwa.edu.au/unitdetails?code=${unitcode}`;
  const unit_outline_url  = `https://lms.uwa.edu.au/bbcswebdav/institution/Unit_Outlines_${year}/${unitcode}_SEM-1_${year}/${unitcode}_SEM-1_${year}_UnitOutline.html`;
  const forum_url         = `https://secure.csse.uwa.edu.au/run/help${citscode}`;
  const timetable_url     = 'https://timetable.applications.uwa.edu.au/';
  const csmarks_url       = "https://secure.csse.uwa.edu.au/run/csmarks";
  const cssubmit_url      = "https://secure.csse.uwa.edu.au/run/cssubmit";

  const lms               = safe(extLink("LMS", "https://lms.uwa.edu.au"));

  let assessments = {
      week3_quiz: {
        name: "[Week 3 online quiz](/assessment/#week-3-quiz)",
        marksPercent: "5",
        dates: {
          available: new Date(year, 7, 9), // Tue 9 Aug
          closes:    new Date(year, 7, 11, 17, 0) // 5pm Thu 11 Aug
        },
        submit: lms
      },
      week7_ex: {
        name: "[Week 7 take-home test](/assessment/#mid-sem-test)",
        marksPercent: "15",
        dates: {
          available: new Date(year, 8, 14, 17, 0), // 5pm Wed 14 Sept
          due: new Date(year, 8, 15, 17, 0) // 5pm Thu 15 Sept
        },
        submit: lms
      },
      project: {
        name: "[Project](/assessment/#project)",
        marksPercent: "30",
        dates: {
          available: new Date(year, 8, 20), // Tue 20 Sep,
          due: new Date(year, 9, 20, 17, 0) // 5pm Thu 26 May
        },
        submit: safe(extLink("cssubmit", `${cssubmit_url}?p=np&open=${unitcode}-1`))
      },
      exam: {
        name: "[Face-to-face exam](/assessment/#exam)",
        marksPercent: "50",
        //dates: "Available 5pm Wed 8 Jun\\\nDue 5pm Fri 10 Jun",
        dates: {
          due: "UWA Exam period", // 5pm Wed 8 Jun
        },
        submit: safe("In&nbsp;person")
      },
    }



  let config = {
    year:         year,
    citscode:     citscode,
    unitcode:     unitcode,
    unitname:     unitname,
    locode:       locode,


    title:        `${unitcode} ${unitname}`,
    subtitle:     `${unitcode} in ${year}`,
    description:  `${unitcode} ${unitname} unit @uwa`,
    repository:   `${locode}/${locode}.github.io`,
    site_url:     `https://${locode}.github.io/`,

    timezone:     "Australia/Perth",
    language:     "en",

    author:       "Arran D. Stewart",

    keywords:     ["computer science", "software engineering",
                  "uwa", "testing", "quality assurance", unitcode],

    lecture_time: "Friday 10 a.m.",

    lecture_venue: safe(extLink("the Webb Lecture Theatre (Geography and Geology Building, room G.21)", "https://link.mazemap.com/KvzDfhrT")),

    // google analytics
    ga_code:      "G-TPDL8908E5",
    gua_code:     "UA-40672453-5",

    // 202, 66%, 33%
    // 188, 53, 26

    // themeing
    accent: "hsl(195,54.6%,30.8%)", // medium-dark blue for navbar
    // with hue, saturation, lightness
    accent_h: 195,
    accent_s: "54.6%",
    accent_l: "30.8%",


    main_menu: [
        { url:  "/",
          name: "Home",
          ext:  false,
        },
        { url:  "/schedule/",
          name: "Schedule",
          ext:  false,
        },
        { url:  "/resources/",
          name: "Resources",
          ext:  false,
        },
        { url:  "/assessment/",
          name: "Assessment",
          ext:  false,
        },
        { url:  handbook_url,
          name: "Handbook entry",
          ext:  true,
        },
        { url: unit_outline_url,
          name: "Unit outline",
          ext:  true,
        },
        { url: forum_url,
          name: "Help" + citscode,
          ext:  true,
        },
    ],

    icon_menu: [],

    /// useful snippets

    timetable_url: timetable_url,

    csmarks_url: csmarks_url,

    cssubmit_url: cssubmit_url,

    lms: lms,

    help_forum: `help${citscode}`,

    forum_url: forum_url,

    formatAssessmentDate: formatAssessmentDate,

    assessments: assessments,

    assessment_table: {
      header: ["Assessment", "% of final mark", "Assessment dates", "Where to submit"],
      body: ["week3_quiz", "week7_ex", "project", "exam"].map( (key) => {
        let the_assessment = assessments[key];
        return [
          the_assessment.name,
          the_assessment.marksPercent,
          formatAssessmentDates(the_assessment.dates),
          the_assessment.submit,
        ]
      })
    },

  }

  return config;
}

