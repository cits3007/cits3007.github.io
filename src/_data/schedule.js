
// returns an object schedule with the following properties:
//  - 'weeks', an array of topics (each with keys `weekNum`, `lectureTopic`,
//    `workshopTopic` and `reading`), and more importantly
//  - makeWeeksFromStartDate() -- given a `Date` object, it will
//    return the weeks array with a `.date` field added to each,
//    which is the Monday of that week.

module.exports = function(configData) {

  let schedule = {}

  schedule.weeks = [
    {weekNum: 1,
    lectureTopic:
        `
- Unit info
- Security & OS concepts
- C language
        `,
    workshopTopic: "*No labs this week*",
    reading:
      `- [Good11]{ class="ref" } chaps 1 (Introduction) & 3 (Operating systems security)
- Your C textbook (or [Sea20]{ class="ref" })
- [Sea13]{ class="ref" } chap 5 (Integer security)
- Further reading: [Koh21]{ class="ref" } chaps 1--3 (Foundations, threats and mitigations)
      `,
    assessmentDetails: ""
    },

    {weekNum: 2,
    lectureTopic:
      `Memory and arithmetic errors`,
    workshopTopic:
      `Linux C development environment<br><br>
      <span style="color: #696969;">***Mon university holiday (Labour day): Monday lab students attend another session***</span>
      `,
    reading:
      `- [Good11]{ class="ref" } chap 3 (Operating systems security)
- [Sea13]{ class="ref" } chap 5 (Integer security)
- Further reading: [Koh21]{ class="ref" } chap 9 (Low-level coding flaws)
      `,
    assessmentDetails: ' ',
    },


    {weekNum: 3,
    lectureTopic:
      "Access control",
    workshopTopic:
        "Static and dynamic analysis tools",
    reading:
      `- [Good11]{ class="ref" } chap 3 (Operating systems security)
- [Sea13]{ class="ref" } chap 8 (File IO)
- Further reading: [Koh21]{ class="ref" } chap 9 (Low-level coding flaws),
  Chen et al ["Setuid demystified"](https://people.eecs.berkeley.edu/~daw/papers/setuid-usenix02.pdf) (11th USENIX Security Symposium, 2002).
      `,
    assessmentDetails: ""
    },


    {weekNum: 4,
    lectureTopic:
        "Input validation and sanitization",
    workshopTopic:
      "String-handling and `setuid`",
    reading:
      `- [Koh21]{ class="ref" } chap 10 (Untrusted input)
- Further reading: [Sea13]{ class="ref" } chap 9 (Recommended practices);
  Erik Poll, ["Secure Input Handling"](https://www.cs.ru.nl/E.Poll/papers/secure_input_handling.pdf);
  [Vie03]{ class="ref" } chap 3 (Input validation)
      `,
    assessmentDetails: ' ',
    },

    {weekNum: 5,
    lectureTopic:
      `Program analysis and testing`,
    workshopTopic:
      "Memory and arithmetic errors",
    reading:
      `- [Sea20]{ class="ref" } chap 11 (Debugging, testing and analysis)
- [Sea13]{ class="ref" } chap 9 (Recommended practices)
- Further reading: [Koh21]{ class="ref" } chap 12 (Security testing)
      `,
    assessmentDetails: ' ',
    },

    {weekNum: null,
    lectureTopic:
      `<span style="color: #696969;">***no class -- non-teaching week***</span>`,
    workshopTopic: "",
    reading: "",
    assessmentDetails: '',
    },


    {weekNum: 6,
    lectureTopic:
      "Concurrency bugs",
    workshopTopic:
      "Input validation and IPC",
    reading:
      `- [Good11]{ class="ref" } chap 3 (Operating systems security)
- [Sea13]{ class="ref" } chap 7 (Concurrency)
      `,
    assessmentDetails: '',
    },

    {weekNum: 7,
    lectureTopic:
      "Inter-process communication",
    workshopTopic:
      'Multi-language analysis tools',
      // sonarqube
    reading:
      `- [Smi08]{ class="ref" } chap 5 (Network security)
- Further reading: [Koh21]{ class="ref" } chap 11 (Web security); [Vie03]{ class="ref" } chap 9 (Networking)
      `,
    assessmentDetails: '',
    },


    {weekNum: 8,
      lectureTopic:
        `Secure software development`,
      workshopTopic:
        `Fuzzing<br><br>
        <span style="color: #696969;">***Thurs university holiday (ANZAC day): Thursday lab students attend another session***</span>
        `,
      reading:
      `- [Koh21]{ class="ref" } chaps 6-7 (Secure design), 12 (Security testing) & 13 (Secure development best practices)
- [Sea13]{ class="ref" } chap 9 (Recommended practices)
- Further reading: [Sea20]{ class="ref" } chap 11 (Debugging, testing and analysis) 
      `,
      assessmentDetails: ' ',
    },

    {weekNum: 9,
    lectureTopic:
        `Secure software development`,
    workshopTopic:
      `TBA
      `,
    reading:
      "Refer to previous week",
    assessmentDetails: '',
    },

    {weekNum: 10,
    lectureTopic:
        `Cryptography introduction`,
    workshopTopic:
          'Race conditions and secure file operations',
    reading:
      `- [Koh21]{ class="ref" } chap 5 (Cryptography)
- [Good11]{ class="ref" } chap 8 (Cryptography)
- [Good11]{ class="ref" } chap 3 (Operating systems security) sec 3.2 (Password-based authentication)
- OWASP ["Password storage cheat sheet"](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
      `,
    assessmentDetails: ' ',
    },

    {weekNum: 11,
    lectureTopic:
        `Cryptography`,
    workshopTopic:
          'Cryptography',
    reading:
      `Refer to previous week`,
    assessmentDetails: "",
    },

    {weekNum: 12,
    lectureTopic:
        "revision",
    workshopTopic:
        "no labs",
    reading: ' ',
    assessmentDetails: '',
    },

  ]

  return schedule;

}
