---
title: |
  CITS3007 Secure Coding\
  Memory and arithmetic errors
author: 'Unit coordinator: Arran Stewart'
---

### Outline

- Buffer overflows
  - relevance, related vulnerabilities, protections
- Integer overflows and overflows

# Buffer overflows

### Buffer overflows -- relevance

- We've seen a historical case where buffer overflows
  were used in a security incident (the Morris Internet worm)
- Buffer overflows are *still* a very major source of vulnerabilities
- The CWE ("Common Weakness Enumeration") database has annual "[Top 25
  most dangerous software weaknesses][cwe-top-25]" lists -- it's based on
  an analysis of the CVE database, weighting particular vulnerabilities
  by their prevalence and severity
  - (The CWE is a classification of types
    of vulnerabilities -- like a dictionary or glossary. Not to be
    confused with the [CVE][cve], "Common Vulnerabilities and
    Exposures", a database of publicly disclosed flaws in software programs.)
  - CWE-787, "Out-of-bounds write", the category to which buffer
    overflows belong, has been in the top 2 CWEs for 3 years running


[cwe-top-25]: https://cwe.mitre.org/top25/archive/2021/2021_cwe_top25.html
[cve]: https://www.cve.org

::: notes

CVE may often refer to CWE

e.g. The NIST record for
[CVE-2018-11786](https://nvd.nist.gov/vuln/detail/CVE-2018-11786)
(a vulnerability in Apache Karaf) includes a reference to
[CWE-269](https://cwe.mitre.org/data/definitions/269.html), "Improper Privilege Management"

:::

### Buffer overflows -- relevance

They can persist for a very long time, undetected

- The "[Baron Samedit][samedit]" vulnerability is a heap-based buffer overflow vulnerability
  ([CVE-2021-3156][samedit])
  in the `sudo` program, which is ubiquitous on Unix-like systems
   - the bug was introduced in 2011, and not detected until 2021
   - By calling the `sudoedit` command (a symlink to `sudo`) with
     specially crafted arguments, an attacker could execute
     arbitrary code and gain root privileges.

- The "[BootHole][boothole]" vulnerability in Linux's GRUB2 bootloader
  also arose from a buffer overflow
  - It was present from the very first version of GRUB2 (released in
    2010) until patched versions were released in 2020
  - It allowed an attacker to control the "secure boot" process (which
    normally can't be done from within the booted OS at all,
    even by a superuser)

[samedit]: https://nvd.nist.gov/vuln/detail/CVE-2021-3156
[boothole]: https://www.csoonline.com/article/3568362/linux-grub2-bootloader-flaw-breaks-secure-boot-on-most-computers-and-servers.html


::: notes

sources:

- baron samedit - see
  <https://packetstormsecurity.com/files/161160/Sudo-Heap-Based-Buffer-Overflow.html>

- boothole details - see
  <https://eclypsium.com/2020/07/29/theres-a-hole-in-the-boot/>

- boothole CVE -
  <https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-10713>

- boothole applies to all versions of GRUB2 (considered to be
  everything from GRUB 1.98 onwards) til when the CVE was patched.

  GRUB 1.98 dates from 2010 -- see e.g.
  <https://www.phoronix.com/news/ODA0MQ> from March 2010 announcing its
  release

boothole

- the overflow occurs when parsing the `grub.cfg` configuration file
  used by GRUB2 -- this file specifies how
  bootup processes like safe more and recovery mode should work

:::

### Related vulnerabilities

- [CWE-787][cwe-787], "Out-of-bounds Write", includes as sub-types of
  vulnerability:
  - CWE-121 Stack-based Buffer Overflow: A buffer on the stack is
    overflowed (can overwrite stack return addresses)
  - CWE-121 Heap-based Buffer Overflow: A buffer on the heap is
    overflowed (can corrupt data)
  - CWE-823 Use of Out-of-range Pointer Offset: Pointer could
    potentially point anywhere in memory

[cwe-787]: https://cwe.mitre.org/data/definitions/787.html

### Underlying causes

- a buffer (array or string) is just some space in which data can be stored.
- some languages check at runtime whether a reference to an array
  position is in bounds, others don't
  - C does not; Java and Python do
  - In C++, bounds checking may be provided -- e.g. if using the `std::vector`
    class, an alternative to access syntax `myvec[42]` is to use
    `myvec.at(42)`
- If, while writing to a buffer, a program overruns the bounds of the
  buffer, then that's a buffer overflow.
  - (Normally, this is due to copying data past the "right-hand end" of
    the buffer, but there's no reason in principle why it might not go the
    other way.)
- If the data overwrites adjacent data or program instructions, that
  can lead to unpredictable behaviour and security vulns.

::: notes

- why use fixed-size buffers at all?

  why not use dynamically allocated memory?

- attacker can still cause problems -- e.g. integer overflow

locality

If you use a buffer which fits inside a [CPU cache][cpu-cache], your
code is likely to run much faster -- instead of fetching data from RAM
(a relatively slow operation), the data can be fetched from the cache
(much faster)


[cpu-cache]: https://en.wikipedia.org/wiki/CPU_cache

:::

### Types of buffer overflow

- stack buffer overflow -- overrun a buffer declared as a variable on
  the stack. Attackers would rely on the fact that this would typically
  overwrite adjacent variables and/or program instructions
- heap overflow -- we overrun a buffer contained in dynamically allocated
  memory. Attackers would rely on the fact that this would overwrite
  other data structures stored on the heap.

### Mechanics of overflow

- The classic way to exploit memory-bounds
  vulnerabilities is to do *code injection*
  - Malicious code is put into some predictable location
    in memory -- typically, somewhere where *data* would normally
    stored
  - Then the vulnerable program is tricked into executing that
    code (e.g. by overwriting the return address of the stack frame).
- But there are other ways to exploit vulnerabilities without code
  injection.
  - you could corrupt data -- e.g. you might overwrite a variable that's
    used to select a branch of an `if` statement


### Preventing buffer overflow vulnerabilities

- Re-write in a memory safe language (Java, Python)
- Audit/static analysis
- Prevent execution of injected code
- Add runtime instrumentation to detect problems
- Make it harder for attackers to exploit code
  and data through address randomisation
- Testing
- Validate untrusted input (discussed in future lectures)

### Prevention -- memory safe language

Re-write in a memory safe language (Java, Python)

- Not always possible for existing code
- Memory-safe languages may have their own disadvantages
  (slower, slow start-up time, need to distribute a large runtime,
  possibly harder to find qualified developers, lack portability
  of C)

### Prevention -- audit/static analysis

- Buffer overflows (and other attacks relying on "wild pointers")
  tend to arise from format string vulnerabilities
  and common errors in managing dynamic memory
- So trying to eliminate those sources of errors
  goes a long way to eliminating the problem
- Manual audits and automated static analysis can be applied
  to find such errors

### Prevention -- runtime instrumentation

It may be possible to add run-time checks to
a normally unchecked language.

- May be in the form of a library or alternative
  implementation of standard functions (e.g. `malloc`,
  `strncpy`, etc)
- Compilers such as `gcc` and `clang` offer [*sanitizers*][sanitizers]
  which can be enabled by providing flags at compilation time
  (e.g. `-fsanitize=undefined` is an umbrella "undefined behaviour
  sanitizer" for `gcc`)
  - These sanitizers can detect errors such as buffer overflows

[sanitizers]: https://hpc-wiki.info/hpc/Compiler_Sanitizers

### Address sanitizer

An example sanitizer --
[AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html),
originally developed by Google.

A refinement of earlier techniques (e.g. "Electric Fence", developed by
Bruce Perens in 1987 while working at Pixar).

It replaces the normal `malloc` and `free` functions with versions where
the memory around `malloc`-ed regions is "poisoned".

Reads and writes are checked to make sure they're not using addresses
in the "poisoned" regions -- if they are, the program aborts.

::: notes

<https://github.com/google/sanitizers/wiki/AddressSanitizerAlgorithm>

paper:

<https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/37752.pdf>


:::

### Stack "canaries"

Another runtime checking approach is to embed "canaries" in stack frames

- Canaries can be e.g. random strings chosen at program startup
- Code is inserted that verifies the integrity of the
  canaries prior to function return
- If an attacker overflows a stack buffer, they won't know
  the correct value of the "canaries", so the overflow
  will be detected

### Runtime instrumentation limitations

In general, any of these techniques will reduce
performance (due to additional memory being required
and/or additional runtime checks being performed)

- However, the cost may be tolerable
  - e.g. Use of StackGuard (stack canary technique)
    results in approx 8% performance penalty



### Prevention -- address randomization

This technique is called \alert{ASLR} (Address  Space  Layout
Randomization)

Used to prevent an attacker from reliably jumping to some particular
function/address in memory.

- We start the stack and heap at some random location
  in memory
- We map shared libraries to random locations in process memory
  - This means that the attacker can no longer e.g. jump
    directly to the `system` or `exec` function

### Prevention -- validate untrusted input

We need to be particular careful when we're
reading and using data (e.g. especially sizes
or lengths of things) from potentially
untrusted sources. e.g.

- over the network
- from a user-supplied file


### Audit/static analysis

Programs can be manually or (partly) automatically
checked for common problems:

- Use of "unsafe" functions
- Improper use of "safe" functions
- Poor memory management practices

<!--

TODO. cf serious code review, used at NASA -
often only 1 bug in many hundreds of KLOCs of code

-->

Static analysis tools:

Examples include Splint, OCLint, Clang Static Analyzer

We will see more on these in labs.


### Unsafe library functions

Many C string functions are *unsafe* to use because
they rely solely on the `NUL` delimiter to mark the end
of strings; so if this delimiter is missing, they will keep
reading or writing memory til a `NUL` is encountered.

These functions include:

- `strcpy (char* dest, const char *src)`
- `strcat (char *de st, const char *src)`
- `gets (char *s)`
- `scanf (const char *format, ...)`
- and many more.

In general, the "safe" equivalents of those functions should be used.

### "Safe" library functions

e.g. `char *strncpy(char *dest, const char *src, size_t n)` is a "safe"
version of `strcpy (char* dest, const char *src)`.

However, **the word "safe" here is a misnomer**. They are definitely
*safer* than the originals, but still need to be used properly.

`strncpy` will copy at most `n` characters; but it *won't*
properly terminate `dest` unless a `NUL` appears in those `n`
characters.

So the proper use is usually something like:

::: block

####

```
#define BUF_SIZE 50
char buf[BUF_SIZE];
strncpy(buf, src, BUF_SIZE);
buf[BUF_SIZE-1] = '\0';
```

:::



### "W xor X" ("write XOR execute")

- Modern CPUs provide hardware support for marking segments
  of memory as non-executable
  - Both AMD and Intel processors support this
- The stack and heap can be put in non-executable memory
  - Any attempt to execute memory in those regions
    will result in a "fault"

### "W xor X"

- Marking memory as non-executable does *not* prevent
  data structures or return addresses from being corrupted
- It's possible to overwrite a stack return address
  with some library routine, and arrange the contents
  of the frame above it to look like arguments to that routine
- So the attacker cannot execute arbitrary code within the
  running process;
  but they may still be able to call functions like [`system`][system]
  (which executes commands via the operating system's shell).

### return-oriented programming

- Marking memory as non-executable doesn't defence against
  a style of attack called "return-oriented programming".
- A "return address" need not point to the *start* of a function;
  it can point to any sequence of instructions ending in a "return"
  (called "gadgets")
- Therefore, it's possible to arrange the stack such that stack
  frames will execute a sequence of these gadgets, with appropriate
  data acting as function arguments
- If an attacker can find appropriate "gadgets" in library
  routines, they may be able to perform arbitrary computations
  without needing to inject code


[system]: https://en.cppreference.com/w/c/program/system


# Integer overflows and underflows

### Unsigned integer wraparound

- In C, for *unsigned* integer types, their intended behaviour is that
  if you attempt to calculate a value that would go outside their
  bounds, the value will "wrap around"

  - i.e., if the maximum representable number is $N$, then trying to
    create the value $N+m$ will instead give the value $N \mod m$.

### Signed integer overflow

- For *signed* integer types, exceeding the representable bounds
  for a type results in undefined behaviour.

- In practice, on many platforms the value will "wrap around".

- **However**, the compiler is allowed to *assume* that the value
  *hasn't* wrapped around. (That's what "undefined behaviour means":
  only programs with no UB have a well-defined meaning; so the compiler
  is allowed to assume that no UB ever occurs.)

### Signed integer overflow

- The consequence is that once UB has occurred, you *can't reliably check for
  it*.

  e.g. Suppose we have an `int n` containing some positive number,
  and we add one to it. How can
  we check to see if it overflowed?

  Maybe we save the value of old `n`, and make sure `n > old_n`;
  or ask whether `n < 0`.

  But the **compiler is allowed to tell us** that `n` **is**
  greater than `old_n`, because **that's what would be true**
  if no UB occurred.

  It can "optimize away" the results of checks like `n > old_n`,
  because it "knows" they must evaluate to `true`.

::: notes

**references:**

C11 6.2.5 "types", for behaviour of unsigned integer types

C11 6.5, para 5, for behaviour of signed integer types:
"If an exceptional condition occurs during the evaluation of an
expression (that is, if the result is not mathematically defined or
not in the range of representable values for its type), the behavior
is undefined."

(but unsigned ints get explicitly excluded from 6.5)

:::

### Integer bounds in other languages

- Java *only* has signed integer types -- no unsigned types. The
  behaviour of all types is that they "wrap" around if overflow would
  occur.

  Since Java 8, it provides methods like `Math.addExact()`, which will
  throw an exception if overflow or underflow would occur.

- Treatment of integers in Python varies from version to version.

  Typical approach is: use the underlying C `int` type by default;
  however, if a value would exceed the bounds of an `int`, it gets
  automatically promoted to an [arbitrary-precision][arb-precision]
  integer type

  - How to detect overflow? One way: do the C arithmetic as normal,
    then try it with the C `int`s cast to `double`s. If the result
    differs greatly, then underflow or overflow occurred.

[arb-precision]: https://en.wikipedia.org/wiki/Arbitrary-precision_arithmetic

### Integer overflow -- compiler protections

`gcc` offers *sanitizers*.

- `-fsanitize=shift` -- check that the result of a shift operation is not undefined

  `-fsanitize=signed-integer-overflow` -- check that signed integers
  don't overflow


::: notes

- `-fsanitize=undefined` is a general UB sanitizer; you can also enable
  specific checks

  <https://medium.com/@lucianoalmeida1/the-undefined-behavior-sanitizer-6e7fe78790c7>

- see
  <https://gcc.gnu.org/onlinedocs/gcc-7.2.0/gcc/Instrumentation-Options.html>

:::


### Overflow CWE

- Has a CWE ID -- [CWE-190][cwe-190] Integer Overflow or Wraparound
- a calculation can produce an integer overflow or wraparound, but the
  program logic assumes the new value will always be larger than the
  old
- if the integer is got from a user/attacker, they may be able to
  deliberately trigger this with user-supplied inputs
- if the integer is then used to control looping, make a security
  decision, allocate memory etc then the vulnerability becomes critical

[cwe-190]: https://cwe.mitre.org/data/definitions/190.html


### Integer overflows

- More on integer overflows next week


<!--
Consider the following code:

::: block

####

```C
size_t len = read_num_from_network();
char *buf;
buf = malloc(len+5);
read(fd, buf, len);
```

:::

\pause

- No buffer overrun appears to occur here (in fact, we've 5 bytes to
  spare)

\pause


- But if the data from the network overflows the bounds of a
  `size_t`[^size-max], then it will wrap around to some small number
  (e.g. 4, say)


[^size-max]: The upper bound of a
  \texttt{size\_t} is \texttt{SIZE\_MAX}; it must be at
  least 65535. on AMD64 platforms, it's usually $2^{64}$.

### xxx

xx

::: notes

notes on `size_t`:

- `SIZE_MAX` specified on C11, 7.20.3

:::

::: notes

### aaa


::: notes


- pfleeger p 96

  - suppose we have prog w/ 100 faults discovered and fixed, and one
    where only 10 have been discovered and fixed.

    Is it more likely that the first or the second contains more
    remaining faults?

    no source: the first

- security *requirements*:

  particular standards for security goals


  security flaw: behaviour that violates security requirements

  program security flaws can result from any kind of software defect ...
  misunderstanding of requirements, typos, off-by-one errors

  landwehr categorization of flaws

  - validation error
  - domain error [???]
  - serialization and aliasing [?? these are diff]
  - poor identifcn or authenticn
  - boundary condition violn
  - "other exploitable logic errors"

  ... pretty poor IMO




gcc buffer overflow

- see ` -Warray-bounds`
  (<https://gcc.gnu.org/onlinedocs/gcc-11.1.0/gcc/Warning-Options.html#index-Warray-bounds>),

  ... and more

  (see <https://developers.redhat.com/articles/2021/06/25/use-source-level-annotations-help-gcc-detect-buffer-overflows>)

- and `-fsanitize=bounds`,
  (<https://gcc.gnu.org/onlinedocs/gcc-7.2.0/gcc/Instrumentation-Options.html>)

- see also <https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html>

string overflow

- see
  <https://gcc.gnu.org/onlinedocs/gcc-11.1.0/gcc/Warning-Options.html#index-Wformat-overflow>,

  `-Wformat-overflow`


:::

-->


<!--
  vim: tw=72 :
-->
