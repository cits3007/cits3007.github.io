---
title: |
  CITS3007 lab 5 (week 7)&nbsp;--&nbsp;Static analysis
---

The aim of this lab is to familiarize you with some of the static
analysis tools available for analysing C and C++ code, and to
try a dynamic analysis/fuzzing tool (AFL).

## 1. Setup

In a CITS3007 development environment VM, download the source code for
the `dnstracer` program which we'll be analysing and extract it:

```
$ wget https://www.mavetju.org/download/dnstracer-1.9.tar.gz
$ tar xf dnstracer-1.9.tar.gz
$ cd dnstracer-1.9
```

We'll also use several `vim` plugins, including ALE
(<https://github.com/dense-analysis/ale>), which runs linters on our
code:

```
$ mkdir -p ~/.vim/pack/git-plugins/start
$ git clone --depth 1 https://github.com/dense-analysis/ale.git ~/.vim/pack/git-plugins/start/ale
$ git clone --depth 1 https://github.com/preservim/tagbar.git   ~/.vim/pack/git-plugins/start/tagbar
```

Set up a `vim` configuration by running the following:

```
tee -a ~/.vimrc <<EOF
set number
let g:ale_echo_msg_format = '[%linter%] %s [%severity%]'
let g:ale_c_gcc_options = '-std=c11 -Wall -Wextra -DHAVE_CONFIG_H -I. -Wno-pointer-sign'
let g:ale_c_clang_options = '-std=c11 -Wall -Wextra -DHAVE_CONFIG_H -I. -Wno-pointer-sign'
let g:ale_c_clangtidy_checks =  ['-clang-diagnostic-pointer-sign', 'cert-*']
let g:ale_c_clangtidy_options =  '--extra-arg="-DHAVE_CONFIG_H -I. -Wno-pointer-sign"'
EOF
```

## 2. Building and analysis

### 2.1. Building

Build `dnstracer`:

```
$ ./configure
$ make
```

You can read more about the `dnstracer` program at
<https://www.mavetju.org/unix/general.php>. It is subject to
a known vulnerability,
[CVE-2017-9430](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-9430).
`dnstracer` uses the tools [Autoconf and Automake][autoconf] to
determine the type of system being compiled on, and whether any special
flags are needed for compilation.

[autoconf]: https://en.wikipedia.org/wiki/Autoconf

The `./configure` script generates two files, a `Makefile` and
`config.h`, which incorporate information about the system being
compiled on. However, the content of those two files is only as good as
the developer makes it -- if they don't enable the warnings and checks
that they should, then the final executable can easily be buggy.
The output of the `make` command above should show us the final compilation
command being run:

```
gcc -DHAVE_CONFIG_H -I. -I. -I.     -g -O2 -c `test -f 'dnstracer.c' || echo './'`dnstracer.c
```

and a warning about a possible vulnerability (marked with
`-Wformat-overflow`). However, there are *many* more problems with the
code than running `make` reveals. If you run `./configure --help`,
you'll see that we can supply a number of arguments to `./configure`.
Let's try to increase the amount of checking our compiler does (and
improve error messages) by switching our compiler to `clang`, and
enabling more compiler warnings:

```
$ CC=clang CFLAGS="-pedantic -Wall -Wextra" ./configure
$ make clean all
```

If you look through the output, you'll see many warnings that include
the following:

```
passing 'unsigned char *' to parameter of type 'char *' converts between pointers to integer types with different sign [-Wpointer-sign]
```

Although this is useful information, there are so many of these warnings
it's difficult to see other potentially serious issues. So we'll disable
those. Run:

```
$ CC=clang CFLAGS="-pedantic -std=c11 -Wall -Wextra -Wno-pointer-sign" ./configure
$ make clean all
```

The `-pedantic` flag tells the compiler to adhere strictly to the C11
standard (`-std=c11`); compilation now fails, however: the author of
`dnstracer` did not write properly compliant C code. In particular:

- proper `#include`s for `strncasecmp`, `strdup` and `getaddrinfo` are missing
- proper `#include`s for the `struct addrinfo` type are missing

Check `man strncasecmp`, and you'll see it requires `#include
<strings.h>`, which is missing from the C code. `man strdup` tells us
that this is a Linux/POSIX functions, not part of the C standard
library; to inform the compiler we want to use POSIX functions, we
should add a line `#define _POSIX_C_SOURCE 200809L` to our C code.
Furthermore, it'll be useful to make use of *static asserts*, so we
should include the `assert.h` header. Edit the `dnstracer.c` file, and
add the following near the top of the file (e.g. just after the first
block comment):

```C
#define _POSIX_C_SOURCE 200809L
#define _DEFAULT_SOURCE
#include <assert.h>
```

The `#define`s need to appear *before* we start `include`-ing header
files. If we now run `make clean all`, we should have got rid of many
compiler-generated warnings. But many more problems exist.

### 2.2. Static analysis

We'll identify some using `flawfinder` -- read "How does Flawfinder
Work?", here: <https://dwheeler.com/flawfinder/#how_work>.
Flawfinder is a linter or static analysis tool that checks for known
problematic code (e.g. code that calls unsafe functions like `strcpy`
and `strcat`). Run:

```
$ flawfinder *.c
# ... many lines omitted ...
Not every hit is necessarily a security vulnerability.
You can inhibit a report by adding a comment in this form:
// flawfinder: ignore
Make *sure* it's a false positive!
You can use the option --neverignore to show these.
```

You'll see a *lot* of output. Good static analysis tools allow us to
ignore particular bits of code that would be marked problematic, either
temporarily, or because we can prove to our satisfaction that the code is safe.

The output of flawfinder is not especially convenient for browsing;
we'll use `vim` to navigate the problems, instead. Run `vim
dnstracer.c`, then type

```
:Tagbar
```

and

```
:lopen
```

in `vim`. "Tagbar" makes it easier to navigate our code, by showing the
functions and types of our program in a new VIM pane. `:lopen` opens
the "Location" pane, which reports the locations of problematic code (as
reported by linters on our system). Use `ctrl-W` and then an arrow key
to navigate between window panes. In the Tagbar pane, the `enter` key
will expand or collapse sections (try it on `macros`), and if we go to
the name of a function or field (e.g. the field `next` in an `answer`
struct), hitting `enter` will go to the place in our C code where it's
defined. Switch to the "Location" pane; navigating onto a line and
hitting `enter` will take us to the problematic bit of code.
Navgiating to the "Location" pane and entering `:resize 20` resizes the
height of the pane to 20 lines.

We can now much more easily match up problematic bits of code with the
warnings from `flawfinder`. We'll

In the Tagbar pane, search for "`rr_types`". (A forward slash, "`/`",
in Vim will do a search for us.) Navigate to it with `enter`, and
observe a yellow highlight on the line, telling us there's a warning for
it. Switch to the location list, and search for that line (188 in my
editor). Flawfinder is giving us a general warning about *any* array
with static bounds (which is, really, all arrays in C11). However,
there's another issue here -- what is it?

The declared size of the array, and the number of the elements should
match up; if someone changes one but not the other, that could introduce
problems. We'll add a more reliable way of checking this.

- *Remove* the size `256` from the array declaration.
- Below it, add

  ```
  static_assert(sizeof(rr_types) / sizeof(rr_types[0]) == 256,
                   "rr_types should have 256 elements");
  ```

We're now statically checking that the number of elements in `rr_types`
(i.e., the size of the array in bytes, divided by the size of one
element) is always 256.

In the locations pane, you'll also see warnings from a program called
`clang-tidy`. It can also be run from the command-line (see `man
clang-tidy` for details); try running

```
$ clang-tidy --checks='-clang-diagnostic-pointer-sign' --extra-arg="-DHAVE_CONFIG_H -I. -Wno-pointer-sign" dnstracer.c --
```

We need to give `clang-tidy` correct compilation arguments (like `-I.`),
or it won't know where the `config.h` header is and will mis-report
errors. We want it not to report problems with pointers being coerced
from signed to unsigned or vice versa (i.e., the same issue flagged
by `gcc` with `-Wno-pointer-sign`), so we disable that check by putting
a minus in front of `clang-diagnostic-pointer-sign`.
(For some reason, though, the "pointer sign" warnings still get reported
in Vim by ALE -- if anyone works out how they can be disabled, feel free
to let me know.)

## 2.3. Dynamic analysis

Let's see how `dnstracer` is supposed to be used. It will tell us the
chain of [DNS name servers](https://en.wikipedia.org/wiki/Name_server)
that needs to be followed to find the IP address
of a host. For instance, try

```
$ ./dnstracer -4 -s ns.uwa.edu.au www.google.com
$ ./dnstracer -4 -s ns.uwa.edu.au www.arranstewart.io
```

These commands say to use a local UWA nameserver (ns.uwa.edu.au)
and to follow the chain of nameservers needed to get IP addresses for
two hosts (www.google.com and www.arranstewart.io). The "Google" host is
fairly dull; it seems the UWA nameserver stores that IP address directly
itself. The second is a little more interesting, as it requires name
servers run by [nearlyfreespeech.net](https://www.nearlyfreespeech.net)
to be queried.

Now re-compile with `gcc` at the `O2` optimization level, and try some
specially selected input:

```
$ CC=gcc CFLAGS="-pedantic -g -std=c11 -Wall -Wextra -Wno-pointer-sign -O2" ./configure
$ make clean all
$ ./dnstracer -v $(python3 -c 'print("A"*1025)')
```

You should see the message

```
*** buffer overflow detected ***: terminated
Aborted (core dumped)
```

This is the "denial of service" problem reported in
[CVE-2017-9430](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-9430).
A buffer overflow occurs, but gets caught by gcc's inbuilt protections
and causes the problem to crash. This is better than a buffer overflow,
but still a problem: in general, a user should *not* be able to make a program segfault or
throw an exception based on data they provide. Doing so for e.g. a
server program -- e.g. if a server ran code like `dnstracer`'s and
allowed users to provide input via, say, a web form --
could result in one user being able to force the program to crash, and
create a denial of service for other users. (In the present case,
`dnstracer` *isn't* a server, though, so the risk is actually very
minimal.)

Note that the problem doesn't show up when compiling with `clang`, and
only appears at the `O2` optimization level (which is often applied when
software is being built for distribution to users). Recall that at
higher optimization levels, the compiler tends to make stronger and
stronger assumptions that no Undefined Behaviour ever occurs, and this
can lead to vulnerabilities.

One can analyse the dumped `core` file in `gdb` to find the problematic
code.

We need to run the following to ensure core dumps work properly
on Ubuntu:

```
$ ulimit -c unlimited
$ sudo systemctl stop apport.service
$ sudo systemctl disable apport.service
```

(If we don't run these, Ubuntu instead tries to send information about
the crash to Canonical's servers.)

Run the bad input again, then `gdb`:

```
$ ./dnstracer -v $(python3 -c 'print("A"*1025)')
$ gdb -tui ./dnstracer ./core
```

In GDB, run the commands `backtrace`, then `frame 7`: you should
see that a call to `strcpy` on about line 1628 is the cause.

We'll try to find this flaw using a particular *dynamic* analysis
technique called
"fuzzing". Static analysis analyses the static artifacts of a system
(like the code source files); dynamic analysis actually runs the
program.
We'll use a program called `afl-fuzz` to find that
bug for us. "AFL" stands for "American Fuzzy
Lop", a type of rabbit; `afl-fuzz` was developed by Google. Read about
it further at <https://github.com/google/AFL>. (If you have time, you
might like to try using another fuzzer, `honggfuzz`,
by reading the documentation at <https://github.com/google/honggfuzz>.)

`afl-fuzz` requires our program take its input from standard in, so
we need to add the following code at the start of `main`
(search in vim for `argv` to find it, or use the Tagbar pane and search
for `main`):

```C

    int  new_argc = 2;
    char **new_argv;
    {
    new_argv = malloc(sizeof(char*) * new_argc + 1);

    // copy argv[0]
    size_t argv0_len = strlen(argv[0]);
    new_argv[0] = malloc(argv0_len + 1);
    strncpy(new_argv[0], argv[0], argv0_len);
    new_argv[argv0_len] = '\0';

    // read in argv[1] from file
    const size_t BUF_SIZE = 4096;
    char buf[BUF_SIZE];
    ssize_t res = read(0, buf, BUF_SIZE - 1);
    if (res > BUF_SIZE)
      res = BUF_SIZE;
    buf[res] = '\0';

    new_argv[1] = malloc(sizeof(char) * (res + 1));
    strncpy(new_argv[1], buf, res);
    new_argv[1][res] = '\0';

    // set argv[2] to NULL terminator
    new_argv[new_argc] = NULL;
    }

    argv = new_argv;
    argc = new_argc;
```

This code reads a line from standard input, makes a "bogus"
version of `argv` called `new_argv` which contains that input at
`argv[1]`, then replaces `argc` and `argv` with our new version.

AFL requires some sample, valid inputs to work with. Run the following:

```
$ mkdir -p testcase_dir
$ printf 'www.google.com' > testcase_dir/google
$ python3 -c 'print("A"*980, end="")' > testcase_dir/manyAs
```

We also need to ideally allow afl-fuzz to *instrument* the code
(i.e., insert extra instructions so it can analyze what the running code
is doing) -- though afl-fuzz will still work even without this step. Recompile with:

```
$ CC=/usr/bin/afl-gcc CFLAGS="-pedantic -g -std=c11 -Wall -Wextra -Wno-pointer-sign -O2" ./configure
$ make clean all
```

Then run

```
$ afl-fuzz -d -i testcase_dir -o findings_dir -- ./dnstracer
```

We've given afl-fuzz a *very* strong hint here about some valid input
that's *almost* invalid (`testcase_dir/manyAs`); but given time and
proper configuration, many fuzzers will be able to identify such input
for themselves.

After about a minute, afl-fuzz should report that it has found a
"crash"; hit ctrl-c to stop it, and look in `findings_dir/crashes`
for the identified bad input.

In general, running a fuzzer on potentially vulnerable software is a
pretty "cheap" activity: one can leave a fuzzer running for several
days with simple, valid input, and check at the end of that period to see what
problems have been discovered.

# 3. Further reading

Take a look at *The Fuzzing Book* (by Andreas Zeller, Rahul Gopinath,
Marcel Böhme, Gordon Fraser, and Christian Holler) at
<https://www.fuzzingbook.org>, in particular the "Introduction to
Fuzzing" at <https://www.fuzzingbook.org/html/Fuzzer.html>.

Fuzzing doesn't apply just to C programs; the idea behind fuzzing
is to randomly generate inputs in hopes of revealing crashes or other
bad behaviour by a program. The *Fuzzing Book* demonstrates how
the techniques by applying them to Python programs, but they are
generally applicable to any language.

Fuzzing has been very successful
at finding security vulnerabilities in software -- often much more so
than writing unit tests, for instance. An issue with unit tests is that
human testers can't generate as *many* tests as a fuzzer can (fuzzers
will often generate at least thousands per second), and often have
trouble coming up with test inputs that are sufficiently "off the beaten
path" of normal program execution to trigger vulnerabilities.

Fuzzers often work well with some of the dynamic *sanitizers* which
we've seen `gcc` and `clang` provide. The sanitizers
(such as ASAN, the
[AddressSanitizer](https://github.com/google/sanitizers/wiki/AddressSanitizer),
and  UBSan, the [Undefined Behaviour
sanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html))
help with making a program *crash* if memory-access problems or
undefined behaviour are detected.

You can read more about AFL-fuzz at
<https://afl-1.readthedocs.io/en/latest/fuzzing.html>, and if you have
time, experiment with the `honggfuzz` fuzzer
(<https://github.com/google/honggfuzz>) or using AFL-fuzz in combination
with sanitizers.



<!-- vim: syntax=markdown tw=72 :
-->
