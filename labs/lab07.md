---
title:  CITS3007 lab 7 (week 9)&nbsp;--&nbsp;Testing
---

This lab explores the role of testing in secure software development.

## 1. Code and tools

We will be using the [Doxygen][doxygen] documentation tool. Install it in your VM
with

```
$ sudo apt-get update
$ sudo apt-get install --no-install-recommends doxygen graphviz
```

We will also make use of the [Check][libcheck] unit testing framework.
Install it with

```
$ sudo apt-get install check
```

[libcheck]: https://libcheck.github.io/check/index.html

<!--
git clone arran@barkley.arranstewart.info:/mnt/data2/dev-06-teaching/cits3007-sec-cod/workdir-2022/project-test/project_skeleton
alias gs="git status"
-->

## 2. Testing, documentation and APIs

The aim of testing is to identify and remove
*defects* from a project --
mistakes in the source code or configuration/data files that cause it
to deviate from its prescribed behaviour.[^defect]
*Vulnerabilities* are a particular class of defects where the
resulting failure compromises security goals for
a system.

[^defect]: We use the terms "defect" and "failure" generally
  in line with their definitions in ISO/IEC/IEEE standard
  24765("Systems and software engineering -- Vocabulary").
  A *failure* is deviation of the behaviour of a system from its
  specification, and a *defect* is an error or fault in the
  static artifacts (software code, configuration or data files,
  or hardware) of a system which, if uncorrected,
  can give rise to a failure.

To be able to test a program, or part of it, we have to know what
its intended behaviour *is*, or by definition we can't test it.
[*Documentation*][software-doc] is therefore an important part of any
software project.
The documentation for a function or other piece of code tells us what it
*should* do,
and testing tries to find situations in which the code does something
else.

[software-doc]: https://en.wikipedia.org/wiki/Software_documentation

A program specification defines the behaviour expected of an
entire program, and can be used directly for testing that program.
However, it doesn't say anything about the behaviour of individual
functions. Those are normally documented within the source file
that contains them, and the documentation for all public-facing
functions, macros and data structures forms the [API][api]
("Application Programming Interface") for that file.[^c-api-docs]

[api]: https://en.wikipedia.org/wiki/API

[^c-api-docs]: In some languages, like Java and Rust,
  the **implementations** of datatypes, functions or methods are located
  in the same place as their **specification**. Individual items
  can usually be declared *public* or *private*. \
  &nbsp;&nbsp;  In other languages, like C and C++, the implementations
  are in a different file (the `.c` or `.cpp`) file to the
  specifications (which appear in a header file, with
  extension `.h` or `.hpp`). \
  &nbsp;&nbsp; And some other languages yet are a sort of combination,
  like Ada and Haskell. In those languages, the implementation appears
  in the body of the file, and a specification near the top in a module
  or package "header". \
  &nbsp;&nbsp; Best practice in C is to document the *public* parts
  of a `.c` file in the header file, to keep the implementations in
  the `.c` file, and for everything that isn't intended to be public
  to be made `static` (private). \
  &nbsp;&nbsp; However, to keep things simple in the project, we
  expect project groups only to submit `.c` files, and to put documentation
  headers in the `.c` files if needed -- not in the `.h` files.

### 2.1. Documenting an API

Typically, the specification documentation for functions
is contained in documentation *blocks*: specially formatted
comments or annotations which can be extracted and displayed by
documentation tools. For example, the documentation block below is
from a previous year's project:

```c
/** Decrypt a given ciphertext using the Caesar cipher, using a specified key, where the
  * characters to decrypt fall within a given range (and all other characters are copied
  * over unchanged).
  *
  * Calling `caesar_decrypt` with some key $n$ is exactly equivalent to calling
  * `caesar_encrypt` with the key $-n$.
  *
  * \param range_low A character representing the lower bound of the character range to be
  *           encrypted
  * \param range_high A character representing the upper bound of the character range
  * \param key The encryption key
  * \param cipher_text A null-terminated string containing the ciphertext to be decrypted
  * \param plain_text A pointer to a buffer where the decrypted text will be stored. The
  *           buffer must be large enough to hold a C string of the same length as
  *           cipher_text (including the terminating null character).
  *
  * \pre `cipher_text` must be a valid null-terminated C string
  * \pre `plain_text` must point to a buffer of identical length to `cipher_text`
  * \pre `range_high` must be strictly greater than `range_low`.
  * \pre `key` must fall within range from 0 to `(range_high - range_low)`, inclusive.
  */
void caesar_decrypt(char range_low, char range_high, int key, const char * cipher_text, char * plain_text);
```

<!--
 *k
-->

Documentation blocks normally have some way of formatting
the documentation for easy reading, of documenting particular
parts of a function (like parameters or the return value),
and of referring to other, related functions.
In this lab, we will use the [Doxygen][doxygen] tool,
which is expressly designed for extracting API documentation from
C and C++ files. It uses [Markdown][markdown] conventions
for formatting, and special tags (like `\param`, `\return`
and `\ref`) to pick out particular portions of a function -- these are
described in the Doxygen tool's [documentation][doxy-tags].
You likely have encountered similar tools to Doxygen
previously for
other languages: Java uses the [`javadoc`][javadoc] tool,
Python projects typically use [`pydoc`][pydoc] or [`sphinx`][sphinx],
Rust uses [`rustdoc`][rustdoc], and Haskell uses [`haddock`][haddock].

[markdown]: https://daringfireball.net/projects/markdown/syntax
[doxy-tags]: https://doxygen.nl/manual/commands.html
[doxygen]: https://doxygen.nl
[javadoc]: https://www.oracle.com/au/technical-resources/articles/java/javadoc-tool.html
[pydoc]: https://docs.python.org/3/library/pydoc.html
[sphinx]: https://www.sphinx-doc.org/
[rustdoc]: https://doc.rust-lang.org/rustdoc/what-is-rustdoc.html
[haddock]: https://haskell-haddock.readthedocs.io/en/latest/

Note that documentation blocks do *not* serve the same purpose
as inline comments (comments contained within the body of a function).
(In fact, in some languages, documentation blocks may not be
comments at all. Python uses [strings instead of comments][docstring],
and Rust internally uses the [`#[doc]` annotation][rust-annot].)
Documentation blocks should *always* be included for any function that forms part of an API,
so that other programmers know how to *use* that function, and documentation blocks can
be as extensive as needed.
If you are using a C library -- say, the FLAC library, which
allows you to encode, decode and manipulate audio files in the FLAC
format -- then your primary way of knowing what the functions
in that library do is by referring to the [API documentation][flac-api].
Not only do you not need to know what any inline comments say,
but for commercial software libraries, you might not have any access
to them or to the source code at all.[^commercial-example]

[docstring]: https://peps.python.org/pep-0257/
[rust-annot]: https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html
[flac-api]: https://xiph.org/flac/api/group__flac.html

[^commercial-example]: For
  an example of such a C library, see the Intel [IPP
  multimedia library][ipp]. Although the library is
  free for use, the source code is properietary
  and not available.

[ipp]: https://www.intel.com/content/www/us/en/developer/tools/oneapi/ipp.html

In contrast to documentation blocks,
*inline* comments are *only* for the use of programmers who need
to fix or enhance existing functions, and typically should be
used sparingly -- excessive inline commenting makes code harder
to read. In general, inline comments should not say *what*
the code is doing -- anyone who understands the programming language
should
be able to see that -- but rather *why* it is doing it.

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em;">

::: block-caption

Inline commenting of your code

:::

Don't over-comment your code! In this unit, we value clarity and conciseness.
Over-commenting can detract from both, and it will be difficult to achieve high marks if
your code is excessively or unnecessarily commented.

You should assume that the person marking your code is an experienced C programmer and does
not require explanations of basic language features.

If you _do_ feel you need to add inline comments, then focus on explaining *why* you are
doing something, rather than what you are doing. The code itself should make the 'what'
clear; comments should provide additional context or reasoning.

</div>

### 2.2. Running `doxygen`

Ensure you have a copy of your group's project code available, and
download it into your development environment. (Or, if you don't have it
quickly available, you can also 


Change directory to your directory containing your source code,
and run `doxygen -g`. It generates a file called `Doxyfile`, used to
configure the exact contents and formatting of the API documentation for
a project. To work well with a C project, a few changes are needed --
you can download a Doxyfile with these changes in the code .zip file for
this lab.

Specific changes we make to the original Doxyfile include changing

- `INPUT` to `src`
- `OPTIMIZE_OUTPUT_FOR_C` to `YES`
- `RECURSIVE` to `YES`
- `SOURCE_BROWSER` to `YES`

Download and extract the `Doxyfile` from that zip file, and run the
command `doxygen`.
The Doxygen tool will use the configuration contained
in the `Doxyfile` configuration file to generate HTML documentation
contained in an `html` subdirectory of your project.

The easiest way of viewing the HTML documentation is usually by
using an editor like VS Code to open the HTML files in the development VM;
alternatively, it's possible to copy the files from the development VM
to the host -- see [this StackOverflow][so] answer.

[so]: https://stackoverflow.com/questions/27384596/vagrant-how-to-sync-folder-from-guest-back-to-host/46943065#46943065 

Some of the functions in the project code already have documentation blocks
written for them (e.g. `handle_login`), but others do not. As you work through the
project, it's a good idea to update the documentation blocks based on your understanding
of what services the different functions perform, and what they require from the caller
in return.

<!--
You can see a copy of this documentation on the CITS3007 website 
[here](https://cits3007.arranstewart.io/assignments/docs/html).
-->

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em;">

::: block-caption

Doxygen features

:::

Doxygen has a number of features we will not use, but which are very
useful for exploring the structure of large codebases. It can create
UML-style diagrams of the classes or functions contained in the code, as
well as showing graphically which functions or methods make use of
others. You can read more about those features [here][doxy-diags].

[doxy-diags]: https://www.doxygen.nl/manual/diagrams.html 

</div>


If you're unfamiliar with good practices for writing API documentation,
take a look at

- the [code documentation guidelines][lsst-coding] for data management at the
  [Vera C. Rubin Observatory][rubin-obs] 
  <!-- in Chile, which houses the [Large Synoptic Survey Telescope][lsst] -->
- the [coding and documentation style][cmu-style]
  for Carnegie Mellon University course 15-410/605, "Operating System
  Design and Implementation", or
- the Oracle [writing Javadoc documentation][javadoc-guide] guide --
  although written for the Java language rather than C, nearly
  all the general principles discussed here still apply.

[lsst-coding]: https://developer.lsst.io/cpp/api-docs.html
[rubin-obs]: https://www.lsst.org
[lsst]: https://en.wikipedia.org/wiki/Vera_C._Rubin_Observatory
[cmu-style]: https://www.cs.cmu.edu/~410/doc/doxygen.html
[javadoc-guide]: https://web.archive.org/web/20190426200914/http://www.oracle.com/technetwork/java/javase/documentation/index-137868.html

### 2.3. Writing your project code

The .zip file for this lab contains an alternative Makefile, together with some
additional files, that you may find useful for the project.

The new files include the following features:

*A Makefile with a range of additional warning and error flags enabled*

:   We already recommend you compile all code for this unit with `-Wall -Wextra
    -pedantic-errors`. The Makefile for this week's lab includes a Make variable
    `EXTRA_CFLAGS` which defines a number of other warning and error options which
    can stop you making mistakes in your code.

    Development teams, particularly in security-sensitive environments, frequently use flags
    like these to enforce best practices and improve the overall quality of the code.

    As we've seen in previous labs, `-pedantic-errors` enforces stricter
    compliance with the C standard -- it turns any non-standard behaviour into an error,
    which helps catch potentially problematic code that might work on some compilers but is
    technically not conforming to the C standard. This is useful to ensure that code behaves
    consistently across different compilers.

    The option `-Werror=vla` turns warnings about **Variable Length Arrays (VLAs)** into
    errors. VLAs are arrays whose size is determined at runtime, which can lead to stack
    overflows, attacker induced [stack clashes], or unpredictable behaviour if not carefully
    managed. Banning VLAs can enhance the stability and predictability of the program, which
    is especially important in security-sensitive code.

    You might be familiar with GCC warning about "implicitly defined functions"; the `-Werror=implicit-function-declaration`
    option turns that too into an error. In C, using a function before its declaration can
    lead to unpredictable behaviour -- the compiler is forced to make assumptions about the
    parameters and return type which are often incorrect. By making this an error, code
    is forced to be more explicit, improving reliability and reducing the risk of bugs.

    The GCC documentation pages explain in detail what the other flags do; in general, all
    of them aim to improve

    - security
    - consistency
    - reliability, and
    - maintainability

    by catching a variety of potential issues early.

[clash]: https://askubuntu.com/questions/927188/what-is-stack-clash-and-what-can-i-do-about-it

*A "banned.h" header file, of functions you shouldn't be using*

:   A `banned.h` file is a special header file used in some development environments to
    explicitly prohibit the use of certain functions or programming practices that the
    development team has decided should **never** be used in their codebase. It helps
    enforce coding standards and ensures that developers avoid potentially dangerous or
    inappropriate behaviour in their code.
    
    This file typically contains declarations of functions that are considered unsafe,
    inappropriate, or incompatible with the design goals of the project. The functions in
    this list are usually replaced by safer, more controlled alternatives that adhere to the
    project's standards.
    
    For example, the `gets()` function in C is notorious for its potential to cause buffer
    overflows, as it doesn't check the size of the input. A team might take the very reasonable decision to ban
    the use of `gets()` (and possibly other functions like `scanf()`) in the
    project because these can easily be exploited by attackers if used improperly.
    
    `FILE` pointer-based I/O functions like `fopen()`, `fprintf()`, and `fclose()` might be
    banned in certain projects because they are not well-suited for structured logging or
    when multiple components need to interact cleanly with each other. Instead, the team may
    use custom logging functions or more explicit input/output management that avoids
    relying on global `stdout` or `stderr` (which can create conflicts or problems during
    testing, or in environments such as [**multi-threaded** or **multi-process**
    systems][mt]). The `banned.h` header we include in this week's code bans such functions for
    exactly this reason -- no code in CITS3007 assessments is supposed to print to `stdout`
    or `stderr` unless explicitly asked to.

    [mt]: https://www.reddit.com/r/cpp_questions/comments/11kvn9k/whats_the_best_approach_when_multiple_threads/    
    
    A typical `banned.h` might look like this:
    
    ```c
      // banned.h - Header file to prohibit certain unsafe or inappropriate functions
      
      #ifndef BANNED_H
      #define BANNED_H
      
      // Prohibit the use of dangerous or insecure functions
      #define gets(...)        _Pragma("GCC warning \"gets() is banned. Use fgets() instead.\"") // Prevent usage of gets
      #define strcpy(...)      _Pragma("GCC warning \"strcpy() is banned. Use strncpy() instead.\"")
      #define sprintf(...)     _Pragma("GCC warning \"sprintf() is banned. Use snprintf() instead.\"")
      
      // Prohibit use of file pointer-based I/O functions
      #define fopen(...)       _Pragma("GCC warning \"fopen() is banned. Use custom logging functions instead.\"")
      #define fprintf(...)     _Pragma("GCC warning \"fprintf() is banned. Use custom logging functions instead.\"")
      #define fclose(...)      _Pragma("GCC warning \"fclose() is banned. Use custom logging functions instead.\"")
      
      #endif // BANNED_H
    ```
    
    (This is not exactly the way ours operates, but gives you an idea of how they look.)
    
    When the `banned.h` file is included in the source code (usually by a central header
    that is included throughout the project), the compiler will generate warnings (or
    errors, depending on the project settings) whenever one of the banned functions is used.
    This prevents developers from accidentally using functions that are considered unsafe,
    inappropriate, or incompatible with the project's design principles.

*A `check_account.ts` set of example unit tests*

:   Testing is important in any software project, but it is absolutely critical in a
    security-conscious environment. Security vulnerabilities often arise from subtle bugs:
    memory errors, unexpected edge cases, or incorrect assumptions about how code behaves.
    Thorough testing helps to catch these problems early, before they can become serious
    vulnerabilities.
    
    In this lab, we show how to use the `libcheck` framework, which is specifically designed
    for C development. It provides **process isolation**, meaning that if a test crashes or
    triggers a memory error, it won't crash the entire test suite -- only the individual
    test process. This is extremely useful when writing security-sensitive code, because
    it allows you to aggressively test error handling and boundary cases without
    destabilising the test harness.
    
    You are welcome to use any other C testing framework you are comfortable with, but
    consistent, thorough, and automated testing is expected. Good testing practices are
    essential not just for correctness, but also for security: well-tested code is much
    harder to exploit. 

    Take a look at some of the tests in `check_account.ts` and see if you can follow
    what they are doing. Consider other tests -- are there _edge cases_ you can identify?
    What if some string input is at the largest size it can plausibly be for a parameter,
    or the smallest size -- what will happen? Are degenerate cases (e.g. empty strings)
    allowed for some or all string parameters, and if so, does your code behave correctly
    when they are passed? What about functions like `account_update_password` -- how
    should they behave if implemented correctly? (One question to think about: when
    invoked twice with the same password, do you expect `account_update_password`
    to produce the same result, or a different one?)

When testing your project, you'll need to
compile your code with a *range* of optimizations and sanitizers (as well as making use of
the static analysers we have looked at). Some warnings and sanitizers only work well when
code is quite highly optimized (option `-O2` to GCC), and high optimization levels also
often elicit bugs you otherwise wouldn't have identified. But testing at low optimization
levels is useful too -- entirely different bugs may appear.

### 2.4. Writing and running tests

Once a specification is available for a function (or even before then!), it's possible to
start writing tests for it. A test is meant to look at the behaviour of a system or function
in response to some input, and make sure that it aligns with what we expect.

It can be useful to think of a test as being composed of three parts

1. **Arrange**
2. **Act**
3. **Assert**

In C, we often also need to add a fourth part, "**Cleanup**".
Some languages have [automatic memory and resource management][gc] --
when open files or allocated memory are no longer in use, they
are "garbage collected" -- but C is not one of these. In C, it's up to
the programmer to ensure they dispose of resources after use (for
instance by `free()`-ing allocated memory and closing open files).

[gc]: https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)

**Arrange** 

:   means preparing whatever resources are required for our test. This
    could include initializing data structures needed, creating
    and populating files or database, or starting programs running
    (say, a webserver).

**Act**

:   means invoking the behavior we want to test. In C, this will
    typically mean calling a function, which we call the *function
    under test*.

**Assert**

:   means to look at the resulting state of the system and see if it is
    what we expected. If a function returns a value, it might mean
    checking to make sure that value is the correct one.
    If the function instead writes data to a file or database, it might
    mean examining the file or database to see whether
    the changes made are the ones we expected. Sometimes **assert**ing
    just requires comparing two values, but other times
    we might need to make a more thorough investigation.


In C, **cleanup** means to dispose of any used resources, and to
make sure the test we've just run won't interfere with the results
of any future tests.

C is a particularly challenging language to write tests for,
because a misbehaving function under test can overwrite the stack frame
of the function that's calling it, meaning we can no longer rely
on the results of our test.

It's a good idea, therefore, to enable any dynamic checks we can
that will help us catch misbehaviour like this -- for instance, by using
the [Google sanitizers][sanitizers] or tools like [Valgrind][valgrind].
Additionally, the [Check][libcheck] unit-testing framework, which we use
in this lab,
by default uses the `fork()` system call to run tests in a separate
address space from the test framework, which prevents the framework from
being affected by any memory corruption that occurs.

[sanitizers]: https://github.com/google/sanitizers
[valgrind]: https://valgrind.org

If you run `make test`, the Makefile will

- compile your code (if not already done)
- use the [`checkmk`][checkmk] tool to generate "`.c`" files from the
  tests contained in `check_account.ts`, and
- compile and run the tests.

[checkmk]: https://manpages.ubuntu.com/manpages/focal/man1/checkmk.1.html

The use of `checkmk` isn't necessary -- we could write the tests
by hand in C if we wanted -- but it saves us having to write some
repetitive boilerplate code.

Try running

```
$ make test
```

to see the Check framework in action. You should see that several tests were run, perhaps
that some pass, and perhaps that others failed.

Check can output results in [multiple formats][test-output].  You might find the output of
the `check_account` binary more readable if you run it with the following environment
variables and options:

```
CK_TAP_LOG_FILE_NAME=- prove --verbose ./check_account
```

Here, `make check_account` builds our test-runner program. `CK_TAP_LOG_FILE_NAME=-`
tells it to output results using the ["TAP" format][tap] for test
results, and `prove` is a Perl program which formats those results
and summarizes them (see [`man prove`][prove] for details).
Leaving off the "`--verbose`" flag to `prove` will result in just
a summary being printed.

[test-output]: https://libcheck.github.io/check/doc/check_html/check_4.html#Test-Logging
[tap]: https://testanything.org
[prove]: https://linux.die.net/man/1/prove

Try and adjust the Makefile so that your code is compiled and run with the UBSan and ASan
sanitizers (look at previous labs for hints on how to do so). MSan (memory sanitizer) is
another dynamic analyser worth looking at, but note that it can't be enabled at the same
time as ASan -- they instrument your code in incompatible ways.

It's a good idea to enable the sanitizers while developing your project. If they detect
memory errors, you may
need to debug your program using `gdb`. The output of
AddressSanitizer should includes a stack trace which reveals where
the bug was detected. (Include the "-g" option to gcc for better information). If running

```
$ gdb -tui ./check_account
```

to track down what causes a bug, you probably will want to set the
environment variable `CK_FORK` to "`no`", like this:

```
$ CK_FORK=no gdb -tui ./check_account
```

This inhibits Check's usual behaviour of `fork`ing off a separate
process in which to run each test.

### 2.5. Project work

Although your project should be completed in your own group, it's fine to discussing with other students
or the lab facilitators
the general concepts of testing, and how you might come up with more tests for your code --
in fact, this is encouraged.
Besides the tests contained in the .ts file, what additional tests will you need?
How will you ensure your test expectations are correct?

<!--

### 2.6. "Mock" objects

It's often a good idea to make our tests fast, so they're quick and easy
to run. If tests take too long to run, developers will avoid running
them, which leads to poor quality code. When writing *unit* tests --
tests which examine the behaviour of a very smal part of the system --
it's also often a good idea to minimize our tests' dependencies on
external resources, like files and database.

For that reason, it can be useful to use "mock" resources, which "stand
in" for a real resource, but are quicker to create. 
The Check framework does not provide any special support for creating
mocks, but we can use some of the Linux kernel's features to
build our own.
On Linux, the [`memfd_create`][memfd] system call creates a "file"-like
object which exists purely in memory. Accessing such files is faster
than making accesses to disk.
In the skeleton code for the CITS3007 project, the
`mock_file()` function in `tests/test_utils.c` uses `memfd_create`
to create an in-memory file with any desired content.
(The protopye and documentation are in tests/test_utils.h`).

[memfd]: https://man7.org/linux/man-pages/man2/memfd_create.2.html

Other unit testing frameworks provide more extensive support
for mock objects. For instance, the [cmocka][cmocka] test framework
allows for *functions* to be mocked: the framework allows
a C function to be "swapped out", and replaced by a "mock" function
generated by the framework. The [LWN.net][lwn] site has an article on
using mock objects in C, at <https://lwn.net/Articles/558106/>.
We don't cover the cmocka framework in detail in this unit,
but provide it as a resource you may find useful when tackling the
project.

[cmocka]: https://cmocka.org  
[lwn]: https://lwn.net/

### 2.7. Other tests

The tests provided in the skeleton Curdle code
do not test the `crypto()` function itself.
The specification for that function says that it uses a particular
file, "` /var/lib/curdle/scores`", to store scores in, that it should
be run as part of a setuid program, and that the `curdle` user
should be owner of the program executable.

How might we test these requirements?

-->

<!-- vim: syntax=markdown tw=92
-->
