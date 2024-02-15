const moment  = require('moment');
const util    = require('util');

///////
// utility functions

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
      // for debugging: try
      //    dt = moment(dt).format("ddd D MMM YYYY");
      dt = moment(dt).format("ddd D MMM");
    } else {
      dt = moment(dt).format("h:mm a ddd D MMM");
      // for debugging: try
      //    dt = moment(dt).format("h:mm a ddd D MMM YYYY");
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

////
// module exports
//
// the final object returned is `config`, q.v.

module.exports = function(configData) {
  let { render, renderInline, extLink, safe } = configData.markdownConfig

  const year      =  2024;
  const semester  =  1;
  const citscode  = "3007";
  const unitcode  = `CITS${citscode}`;
  const unitname  = "Secure Coding";
  const locode    = unitcode.toLowerCase();

  const handbook_url      = `https://handbooks.uwa.edu.au/unitdetails?code=${unitcode}`;
  const unit_outline_url  = `https://lms.uwa.edu.au/bbcswebdav/institution/Unit_Outlines_${year}/${unitcode}_SEM-${semester}_${year}/${unitcode}_SEM-${semester}_${year}_UnitOutline.html`;
  const forum_url         = `https://secure.csse.uwa.edu.au/run/help${citscode}`;
  const timetable_url     = 'https://timetable.applications.uwa.edu.au/';
  const csmarks_url       = "https://secure.csse.uwa.edu.au/run/csmarks";
  const cssubmit_url      = "https://secure.csse.uwa.edu.au/run/cssubmit";
  const moodle_url        = "https://quiz.jinhong.org/";
  const lms_url           = "https://lms.uwa.edu.au";

  const lms               = safe(extLink("LMS", lms_url));
  const moodle            = safe(extLink("Moodle", moodle_url));

  let semesterStartDateStr = '2024-02-26'
  let semesterStartDate = new Date(semesterStartDateStr);

  // put in semester week num (from 1), day of week (from Monday as 0)
  // plus hours (0-23)
  // to get a specified Date.
  // Doesn't know about mid-sem break, though, so add 1 to week
  // for dates past the mid-point of semester
  function makeDate(weekNum, dayOfWeek, hour) {
    let res = new Date(semesterStartDate);
    res.setDate(res.getDate() + ((weekNum - 1) * 7) + dayOfWeek);
    res.setHours(hour);
    return res;
  }

  let assessments = {
      week4_quiz: {
        name: "[Week 4 online quiz](/assessment/#week-4-quiz)",
        marksPercent: "5",
        dates: {
          available: makeDate(/*wk*/ 4, /*wed*/ 2, /* 5pm */ 17),
          closes:    makeDate(/*wk*/ 4, /*thu*/ 3, /* 5pm */ 17)
        },
        submit: moodle
      },
      week7_ex: {
        name: "[Week 7 mid-semester test](/assessment/#mid-sem-test)",
        marksPercent: "15",
        dates: {
          available: makeDate(/*wk 7*/ 8, /*wed*/ 2, /* 5pm */ 17),
          due:       makeDate(/*wk 7*/ 8, /*thu*/ 3, /* 5pm */ 17)
        },
        submit: moodle
      },
      project: {
        name: "[Project](/assessment/#project)",
        marksPercent: "30",
        dates: {
          available: "TBA", // Tue 20 Sep,
          due: makeDate(/*wk 11*/ 12, /*thu*/ 3, /* 5pm */ 17)
        },
        submit: moodle
      },
      exam: {
        name: "[Face-to-face lab-based exam](/assessment/#exam)",
        marksPercent: "50",
        dates: {
          due: "UWA exam period"
        },
        submit: safe(extLink("Moodle", moodle_url) + ", lab venue in exams timetable")
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
                   "education", "tertiary education",
                   "university of western australia", "uwa",
                   "cyber-security", "software security",
                  "security", "quality assurance", unitcode],

    lecture_time: "Thursday 11 a.m.",

    //lecture_venue: safe(extLink("the Webb Lecture Theatre (Geography and Geology Building, room G.21)", "https://link.mazemap.com/KvzDfhrT")),
    lecture_venue: safe(extLink("the Weatherburn Lecture Theatre (Maths Building, room G.40)", "https://link.mazemap.com/KT1fOG28")),

    semesterStartDateStr: semesterStartDateStr,
    semesterStartDate: semesterStartDate,

    // google analytics
    ga_code:      "G-TPDL8908E5",
    gua_code:     "UA-40672453-5",

    // 202, 66%, 33%
    // 188, 53, 26

    // themeing
    accent: "hsl(195,54.6%,30.8%)", // some sort of green for navbar?
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
        { url:  "/faq/",
          name: "FAQ",
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

    timetable_url:  timetable_url,
    csmarks_url:    csmarks_url,
    cssubmit_url:   cssubmit_url,
    moodle_url:     moodle_url,
    lms_url:        lms_url,
    forum_url:      forum_url,

    lms: lms,
    moodle: moodle,

    help_forum: `help${citscode}`,


    formatAssessmentDate: formatAssessmentDate,

    assessments: assessments,

    assessment_table: {
      header: ["Assessment", "% of final mark", "Assessment dates", "Where to submit"],
      body: ["week4_quiz", "week7_ex", "project", "exam"].map( (key) => {
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

