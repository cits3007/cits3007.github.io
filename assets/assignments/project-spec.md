---
title: CITS3007 Project 2022
---

\vspace{-3em}

| **Version:** | 0.2          |
|--------------|--------------|
| **Date:**    | 10 Oct, 2022 |

**Changes since version 0.1**:

- Link to rubric
- Allow markdown
- Change 1(d) from "show" to "indicate"
- Clarify structure of a "scores" field line
- Clarify that lseek is also an option for file searching
- Fix privilege-dropping requirement
- Permit aborting execution in lieu of error propagation
- Clarify that valid names and scores must fit the field
- Remove "printed" for error message
- Add detail on marks breakdown

You can see a list of all changes made to the project spec by
viewing its commit history on GitHub, [here][changes].

[changes]: https://github.com/cits3007/cits3007.github.io/commits/master/assets/assignments/project-spec.md 


## Introduction

-   This project contributes **30%** towards your final mark
    this semester, and is to be completed as individual work.
-   The project is marked out of 140.
-   The deadline for this assignment is listed on the assessments
    page of the CITS3007 at
    <https://cits3007.github.io/assessment/>, and is 5:00 pm Thursay
    20 October.
-   You are expected to have read and understood the University
    [Guidelines on Academic
    Conduct](http://www.governance.uwa.edu.au/procedures/policies/policies-and-procedures?policy=UP07%2F21).
    In accordance with this policy, you may discuss with other students the
    general principles required to understand this project, but the work you
    submit must be the result of your own effort.
-   You must submit your project before the submission deadline above. There
    are significant [Penalties for Late
    Submission](https://ipoint.uwa.edu.au/app/answers/detail/a_id/2711/~/consequences-for-late-assignment-submission)
    (click the link for details).

## Marks breakdown/rubric document

A marks breakdown/rubric document for the project is available from
the CITS3007 website at
<https://cits3007.github.io/assessment/#project> which describes
(among other details) the standards a submission should meet to get
more than minimal marks.

If more detail is required about how the rubric would be applied,
please post in the [Help3007][help3007] forum.

[help3007]: https://secure.csse.uwa.edu.au/run/help3007

## Items to submit

You will need to submit:

1. a PDF report, `report.pdf`
2. a text file containing the answer to
   a question (`answers.txt`), and
3. a C file, `adjust_score.c`

Do not submit a .zip or .tar file or other archive.

**PDF report**

:   Your PDF report should use A4 size pages.
    The font for body text should be between 9 and 12 points.
    The report should contain numbered headings, with useful heading titles.
    Each question should be answered on a new page.
    Any diagrams, charts or tables used must be legible and large enough
    to read when viewed on-screen at 100% magnification.
    All pages (except the cover, if you have one) should be
    numbered. If you give scholarly or other references, you may use any
    standard
    citation style you wish, as long as it is consistent.
    Cover sheets, diagrams, charts, tables, bibliographies and
    reference lists do not count towards any page-count maximums.

    As an alternative to submitting a PDF, you may submit your
    report in neatly formatted
    (max. 72 characters per line) Markdown, and we will either read
    it directly or generate a report from it. In that case:

    - Your project file should be called `report.md`
    - It should either adhere to the [CommonMark spec][commonmark]
      or be [Pandoc-compliant][pandoc] Markdown
    - It should be easily readable as plain text, and contain no
      diagrams, charts or raw LaTeX
    - If present, a bibliography should appear as a plain bulleted list
      at the end of the report (do not use citation keys (`@`),
      BibTex, or similar features). "AMS short alpha-numeric" would
      be a good citation style ([AMS style guide][ams], sec 10.3).

    [commonmark]: https://spec.commonmark.org/0.30/
    [pandoc]: https://pandoc.org/MANUAL.html#pandocs-markdown
    [ams]: https://www.ams.org/publications/authors/AMS-StyleGuide-online.pdf

**text file**

:   The format for the text file is given in Part 1.

**C files**

:   Your code is expected to be clearly written, well-formatted,
    and easy for others to understand. It should follow sound programming practices,
    including:

    - the use of meaningful comments
    - well chosen identifier names
    - appropriate choice of basic data-structures, data-types, and functions
    - appropriate choice of control-flow constructs
    - proper error-checking of any library functions called, and
    - cleaning up/closing any files or resources used.

    It should compile without errors or warnings with `gcc`,
    using the compilation flags "`-std=c11 -pedantic -Wall
    -Wextra`".


#### Documenting assumptions

If you believe there is insufficient information for you to complete
part of this project, you should document any *reasonable
assumptions* you had to make in order to answer a question or write
a method.

In that case, make sure your report has as one of its
first sections a section entitled "Assumptions", in which you list
these, giving each one a number and explaining why you think it's
a reasonable assumption.

Then in your code or later in your report, you can briefly
refer to these assumptions (e.g. "This test case assumes that
Assumption 1 holds, so that we can ...").

## Part 1: CVE-2019-17498 (70 marks)

For this part of the project, you will need to investigate
CVE-2019-17498. In your report, you should include a section on this
CVE, addressing the following questions.

a.  What product or software package does CVE-2019-17498 affect?
    What type of vulnerability or vulnerabilities does the CVE
    represent? (10 marks)
#.  How severe is the impact of the CVE? What factors go into
    assessing this impact? (10 marks)
#.  Describe how the CVE could be exploited, and what the
    consequences of a successful exploit could be. (20 marks)
#.  Indicate the C source code that gives rise to the vulnerability
    described by this CVE.
    On the first line of your "`answers.txt`" file, provide a URL for the vulnerable
    version of the C file, then a space, then a range of line numbers
    (two numbers separated by a dash).
    (You may also include these in your report if you wish.)
    (10 marks)
#.  Explain what changes were made in the affected product to
    address the vulnerability described by the CVE, and how
    they work. (20 marks)

For each question you
should [*cite your
sources*](https://guides.library.uwa.edu.au/referencinguwa).
(These may be traditionally published works, but are more likely
to be webpages.)

(Maximum length: 5 pages)

## Part 2: setuid program (70 marks)

You are employed by a games publisher which develops the popular
game *Curdle*, in which players are provided with images of various
fermented or coagulated milk--based products -- cheeses and yoghurts
-- and are required to guess the particular product.

Although available for multiple platforms, the most popular one
on which Curdle is available is Linux (specifically, Ubuntu 20.04,
running on the x86-64 platform). On Linux, the files used by the
game (for instance, a file storing scores achieved by different
players) are owned by the user `curdle`.

Your task is to write a small portion of the game executable
which modifies a
*scores* file used by the game. Running `ls -l` on the scores file produces
the following listing:

```
  -rw------- 1 curdle curdle 2602 Sep 21  2021 /var/lib/curdle/scores
```

Every line in the `scores` file is 20 characters long
(excluding the newline character)
and consists of two "fields":
10 characters
for a player name of maximum length 9, ending in a `NUL`, and 10
characters for a score. For player names shorter than 9 characters
or scores shorter than 10 characters,
you may assume the field is padded with `NUL` characters
to ensure it's 10 characters in length total.

Write a file `adjust_score.c` containing a single function,
`adjust_score()`, with the following signature

```
  int adjust_score(uid_t uid, const char * player_name,
                   int score_to_add, char **message)
```

- `uid` contains the user ID of the `curdle` user
- `player_name` is the name of the current player
- `score_to_add` is the player's score for this game
- the caller should pass in the address of a pointer-to-char
  to `message`, in which `adjust_score` can write an error message
  (if needed).

You should assume the program will be run as a setuid program
owned by the user `curdle`, and that the first thing the `main`
function for the game does is to call `seteuid()` to set the
effective UID to the real UID (i.e., to drop privileges),
and then call `setegid()` to do the same for the group ID.

The `adjust_score` function should do the following:

- Open the scores file (using appropriate privileges)
- Read through the scores file for a line starting with
  `player_name`.
- If such a line is found, your program should read the `int`,
  derive a new score by adding the
  value in `score_to_add`, then replace the original line
  with a new line containing the new score. (Hint: you will want to
  use `fseek()` or `lseek()`.)
- If such a line is not found, add a new, valid score line to the end
  of the file containing the player name and score (which is simply
  `score_to_add`).

The function should drop any special privileges used after they
are no longer required.

If the score was changed successfully, the function should return 1;
if not, it should return 0, and:

- allocate memory for an error message
  using `malloc()`
- write an error message to that memory, and
- set `*message` to the newly allocated memory.

(As an alternative: your implementation of the function may return 1
on success, and abort execution of the program on any failure.
But some marks will be available for programs that *do* handle
errors and provide an error message, as outlined above.)

If a score or player name cannot be represented or stored in the
characters available
for them in a line,
that counts as an error --
the situation should be checked for and an appropriate error message
written.

You may use helper functions if desired which are called by the
`adjust_score` function.

Your code will be awarded 40 marks for correct operation, 10 marks for
use of appropriate secure coding techniques, and
20 marks for code concision and clarity. It should avoid introducing
any security vulnerabilities.



<!--
  vim: tw=68
-->
