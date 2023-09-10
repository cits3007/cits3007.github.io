---
title: |
  CITS3007 lab 6 (week 7)&nbsp;--&nbsp;Static analysis&nbsp;--&nbsp;solutions
---

The aim of this lab is to familiarize you with some of the static
analysis tools available for analysing C and C++ code, and to
try a dynamic analysis/fuzzing tool (AFL).

We'll be using purely terminal-based tools, as sometimes analysis and
debugging have to be performed in an environment with no graphical console --
for instance, in a cloud-based virtual machine.

## 1. Setup

In a CITS3007 development environment VM, download the source code for
the `dnstracer` program, which we'll be analysing, and extract it:

```
$ wget http://www.mavetju.org/download/dnstracer-1.9.tar.gz
$ tar xf dnstracer-1.9.tar.gz
$ cd dnstracer-1.9
```

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

Note that the `dnstracer` download link is an "http" link rather than
an "https" link -- what problems could this cause? You can read more
about `dnstracer` by following the relevant links at
<http://www.mavetju.org/unix/general.php>. It is used to graphically
depict the chain of servers involved in a [Domain Name System][dns] (DNS)
query. The DNS protocol is an important part of the modern Internet, but
we won't be examining it in detail -- `dnstracer` is just a sample
program used here to test analysis tools on.

[dns]: https://en.wikipedia.org/wiki/Domain_Name_System?useskin=vector

</div>

We'll also use several Vim plugins, including
[ALE](<https://github.com/dense-analysis/ale>) -- the "Asynchronous Lint
Engine" for Vim -- which runs linters (another name for static
analysers) over our code. Run the following commands in your
development environment to install the plugins:

```
$ mkdir -p ~/.vim/pack/git-plugins/start
$ git clone --depth 1 https://github.com/dense-analysis/ale.git ~/.vim/pack/git-plugins/start/ale
$ git clone --depth 1 https://github.com/preservim/tagbar.git   ~/.vim/pack/git-plugins/start/tagbar
```

Set up a Vim configuration by then running the following (you may need to hit
the `enter` key an extra time afterwards):

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

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

Vim plugins can be installed by cloning a Git repository into a
sub-directory of `~/.vim/pack/git-plugins/start`, and can be updated by
`cd`-ing into those directories and running `git pull`.

The Vim settings in `~/.vimrc` specify how the ALE plugin should obtain
and display alerts from analysis tools, including:

- the format to use when showing alerts from analysis tools (`g:ale_echo_msg_format`)
- what options to pass to the `gcc` and `clang` compilers, and the
  `clangtidy` analysis tool.

The full documentation for ALE is available from its Git repository at
<https://github.com/dense-analysis/ale/blob/master/doc/ale.txt>, but
for the purposes of this unit, you do not need to know most of the
details.

</div>

## 2. Building and analysis

### 2.1. Building

We will be analysing the Dsntracer program, which is subject to
a known vulnerability,
[CVE-2017-9430](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-9430).
You can read more about the `dnstracer` program at
<https://www.mavetju.org/unix/general.php>.

You can build `dnstracer` by running the following commands in
your development environment:

```
$ ./configure
$ make
```

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

<center>**`./configure` and the GNU Autotools**</center>

If we want to write a C program that can be compiled and run on
many systems, we need some platform-independent way of *detecting* what
operating system we are running on, what tools (compilers, linkers,
and scripting tools) are available, and exactly what options they
support -- unfortunately, these can vary widely from platform to
platform.

How can we detect these things, and use that knowledge when compiling
our program? One way is to use the suite of tools known as [GNU
Autotools][autotools]. Rather than write a Makefile ourselves, we create
a *template* for a Makefile -- named `Makefile.in` -- and use the GNU
Autotools to create a `./configure` script which will gather details
about the system it is running on, and use those details to generate:

1. a proper Makefile from the template, and
2. a `config.h` file which should be `#include`d in our C
   source files -- this incorporates information about the system
   being compiled on, and defines symbols that let us know
   what functions and headers are available on that target system.
 
(Specifically,
`dnstracer` is using the tools [Autoconf and Automake][autoconf] --
GNU Autotools contains other tools as well which are outside the scope
of this lab.)

[autotools]: https://en.wikipedia.org/wiki/GNU_Autotools
[autoconf]: https://en.wikipedia.org/wiki/Autoconf

The GNU Autotools are sometimes criticised as not being very easy to
use. Alternatives to the GNU Autotools for writing
platform-independent code and building on a range of platforms
include the tools [Meson][meson] and [Cmake][cmake].

[meson]: https://mesonbuild.com
[cmake]: https://cmake.org

</div>

The `./configure` script generates two files, a `Makefile` and
`config.h`, which incorporate information about the system being
compiled on. However, the content of those two files is only as good as
the developer makes it -- if they don't enable the compiler warnings and checks
that they should, then the final executable can easily be buggy.
The output of the `make` command above should show us the final compilation
command being run:

```
gcc -DHAVE_CONFIG_H -I. -I. -I.     -g -O2 -c `test -f 'dnstracer.c' || echo './'`dnstracer.c
```

and a warning about a possible vulnerability (marked with
`-Wformat-overflow`). 

We know from earlier classes that invoking GCC without specifying a C
standard (like C11) and enabling extra warnings can easily result in
code that contains bugs and security vulnerabilities -- so the current
version of the Makefile is insufficient.

How can we enable extra warnings from GCC?
If you run `./configure --help`,
you'll see that we can supply a number of arguments to `./configure`,
and some of these are incorporated into the Makefile and use to
invoke GCC.
Let's try to increase the amount of checking our compiler does (and
improve error messages) by switching our compiler to `clang`, and
enabling more compiler warnings:

```
$ CC=clang CFLAGS="-pedantic -Wall -Wextra" ./configure
$ make clean all
```

If you look through the output, you'll now see many warnings that include
the following:

```
passing 'unsigned char *' to parameter of type 'char *' converts between pointers to integer types with different sign [-Wpointer-sign]
```

Although this is useful information, there are so many of these warnings
it's difficult to see other potentially serious issues. (And many of
them may be harmless -- an example of *false positives* from the
compiler warnings). So we'll disable those. GCC tells us that they're
enabled using the flag `-Wpointer-sign`, so we can use the flag
`-Wno-pointer-sign` to *dis*able them. Run:

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
that this is a Linux/POSIX function, not part of the C standard
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

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

<center>**Writing portable C code -- non-standard extensions to C**</center>

If we want to write portable C code -- code that will work with other C
compilers and/or other operating systems -- it's important to specify what *C
standard* we're wanting to adhere to (in this case, C11), and to request
that the compiler strictly adhere to that standard.

When we invoke `gcc` or `clang` with the arguments "`-std=c11
-pedantic`",
this disables many compiler-specific extensions. For example: the C
standard says it's impermissible to declare a zero-length array
(e.g. `int myarray[0]`), but by default, `gcc` will let you do so
without warning.
In general, disabling compiler-specific extensions is a good thing: it
ensures we don't accidentally use `gcc`-only features, and makes our
code more portable to other compilers.
 
One reason some people don't add those arguments is because (as we saw
above) doing so may make their programs stop compiling. But this is because
they haven't
been sufficiently careful about distinguishing between functions that
are part of the [C standard
library](https://en.wikipedia.org/wiki/C_standard_library), and
functions which are extensions to C provided by their compiler, or
are specific to the operating system they happen to be
compiling on.

For example, `fopen` is part of the C standard library; if you run
`man fopen`, you'll see it's include in the `stdio.h` header file.
(And if you look under the "Conforming to" heading in the man page, you'll
see it says `POSIX.1-2001, POSIX.1-2008, C89, C99` -- `fopen` is part of
the C99 (and later) versions of the C standard.)

On the other hand, `strncasecmp` is *not* part of the C standard
library: it was originally introduced by BSD (the "Berkeley Standard
Distribution"), a previously popular flavour of Unix, and is now
a GCC extension. It is part
of the [POSIX standard][posix] for Unix-like operating systems.
(If you look under the "Conforming to" heading in the man page, you'll
see it says `4.4BSD, POSIX.1-2001, POSIX.1-2008`.)

[posix]: https://en.wikipedia.org/wiki/POSIX

Using `-std=c11 -pedantic` encourages you to be more explicit about what
compiler- or OS-specific functions you're using. `strncasecmp` is usually only found
on Unix-like operating systems. It isn't available, for instance, when
compiling on
Windows with the MSVC compiler; if you want similar functionality, you need the
[`_strnicmp` function][strnicmp].

[strnicmp]: https://docs.microsoft.com/en-us/cpp/c-runtime-library/reference/strnicmp-wcsnicmp-mbsnicmp-strnicmp-l-wcsnicmp-l-mbsnicmp-l?view=msvc-170

Sometimes when using a function from a standard other than the C
standards,
your compiler will require you to specify exactly what
extensions and standards you want to enable. For instance,
`man strdup` (rather obliquely) tells you that adding

```C
#define _POSIX_C_SOURCE 200809L
```

to your C code is one way of making the `strdup` function available.
**Note that** you should put the above `#define` **before
any** `#include`s: the `#define` is acting as a sort of signal to the
compiler, telling it what parts of any later-appearing header files to
process, and what to ignore.

Using `-std=c11 -pedantic` doesn't *guarantee* your code conforms with
the C standard (though it does help). Even with those flags enabled,
it's still quite possible to write
non-conforming programs. As the [`gcc` manual says][pedantic]:

> Some users try to use `-Wpedantic` to check programs for strict ISO C
> conformance. They soon find that it does not do quite what they want:
> it finds some non-ISO practices, but not all -- only those for which
> ISO C requires a diagnostic, and some others for which diagnostics
> have been added.

From a security point of view, it's easier to audit code that's explicit
about what libraries it's using, than code which leaves that implicit;
so specifying a C standard and `-pedantic` is usually desirable.

[pedantic]: https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#Warning-Options

</div>


### 2.2. Static analysis

We'll identify some problems with `dnstracer`
using Flawfinder -- read "How does Flawfinder
Work?", here: <https://dwheeler.com/flawfinder/#how_work>.
Flawfinder is a linter or static analysis tool that checks for known
problematic code (e.g. code that calls unsafe functions like `strcpy`
and `strcat`). Install Flawfinder by running the command
`sudo apt install flawfinder` in your development environment, and
then try using it by running:

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
we'll use Vim to navigate the problems, instead. Run `vim
dnstracer.c`, then type

```
:Tagbar
```

and

```
:lopen
```

in Vim. "Tagbar" makes it easier to navigate our code, by showing the
functions and types of our program in a new Vim pane. `:lopen` opens
the "Location" pane, which reports the locations of problematic code (as
reported by linters on our system). Use `ctrl-W` and then an arrow key
to navigate between window panes. In the Tagbar pane, the `enter` key
will expand or collapse sections (try it on `macros`), and if we go to
the name of a function or field (e.g. the field `next` in an `answer`
struct), hitting `enter` will go to the place in our C code where it's
defined. Switch to the "Location" pane; navigating onto a line and
hitting `enter` will take us to the problematic bit of code.
Navigating to the "Location" pane and entering `:resize 20` resizes the
height of the pane to 20 lines.

We can now much more easily match up problematic bits of code with the
warnings from `flawfinder`. We'll take a look at one of those now.

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

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

<center>**Integrating linter warnings with editors and IDEs**</center>

As you can see, the output of linters and other static analysers is much
more usable when it can be integrated with our editor or IDE, but it's
often not obvious how to make sure our editor/IDE is calling the
C compiler and linters with the command-line arguments we want.

In GUI tools like [Eclipse IDE][eclipse] and [VS Code][vs-code], these
configurations are often "hidden" in deeply-nested menu options.
In Vim, the configurations are instead included as commands in your
`~/.vimrc` file (`vimrc` stands for "Vim run commands" -- commands
which are to be run when Vim starts up). What commands are needed
for Vim plugins like ALE to work properly may still not be
straightforward to work out -- we ended up needing

```
let g:ale_c_gcc_options = '-std=c11 -Wall -Wextra -DHAVE_CONFIG_H -I. -Wno-pointer-sign'
let g:ale_c_clang_options = '-std=c11 -Wall -Wextra -DHAVE_CONFIG_H -I. -Wno-pointer-sign'
let g:ale_c_clangtidy_checks =  ['-clang-diagnostic-pointer-sign', 'cert-*']
let g:ale_c_clangtidy_options =  '--extra-arg="-DHAVE_CONFIG_H -I. -Wno-pointer-sign"'
```

-- but once you *have* worked out what they are, at least they're
always in a consistent place.

[eclipse]: https://www.eclipse.org/ide/
[vs-code]: https://code.visualstudio.com 

</div>


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
servers run by [Hurricane Electric](http://he.net)
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
and causes the problem to crash. This is better than a buffer overflow
being allowed to execute unchecked,
but is still a problem: in general, a user should *not* be able to make a program segfault or
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

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

<center>**ulimit and systemctl**</center>

User accounts on Linux have limits placed
on things like how many files they can have open at once, and the
maximum size of the stack in programs the user runs. You can see
all the limits by running `ulimit -a`.

Some of these are "soft" limits which an unprivileged user can change --
running `ulimit -c unlimited` says there should be no limit on the size of core
files which programs run by the user may dump. Others have "hard" limits,
like the number of open files. You can run `ulimit -n 2048` to change
the maximum number of open files for your user to 2048, but if you try
a number above that, or try running `ulimit -n unlimited`, you will get
an error message:

```
bash: ulimit: open files: cannot modify limit: Operation not permitted
```

The `systemctl` command is used to start and stop system services --
programs which are always running in the background. In this case, we
want to stop the `apport` service: it intercepts segfaulting programs,
and tries to send information about the crash to Canonical's servers.
But we don't want that -- we want to let the program crash, and we
want the default behaviour for segfaulting programs, which is to
produce a memory-dump in a `core` file.

</div>

Run the bad input again, and you should get a message about a core dump
being generated; then run `gdb`. The commands are as follows:

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
We'll use a program called `afl-fuzz`[^afl] to find that
bug for us, and identify input that will trigger it.

[^afl]: "AFL" stands for "American Fuzzy
  Lop", a type of rabbit; `afl-fuzz` was developed by Google. Read about
  it further at <https://github.com/google/AFL>. (If you have time, you
  might like to try using another fuzzer, `honggfuzz`,
  by reading the documentation at <https://github.com/google/honggfuzz>.)

Fuzzers are very effective at finding code that can trigger program
crashes, and `afl-fuzz` would normally be able to find this
vulnerability (and probably many others) by itself if we just let it run
for a couple of days. To speed things up, however -- because in this
case we already *know* what the vulnerability is -- we'll give the
fuzzer some hints.

By default, `afl-fuzz` requires our program take its input from standard
input (though there are ways of altering this behaviour). So to get
our program working with `afl-fuzz`,
we'll add the following code at the start of `main`
(search in Vim for `argv` to find it, or use the Tagbar pane and search
for `main`):

```{.c .numberLines}
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

The aim here is to get some input from standard input, but then
to ensure the input we've just read will work properly
with the rest of the codebase (which expecteds to operate on arguments
in `argv`).

So we create *new* versions of `argv` and `argc` (lines 1--2 of the
above code), containing the
data we want (obtained from standard input -- line 15), and then we
replace the old versions of `argv` and `argc` with our new ones
(lines 28--29). If what the code is doing is not clear, try stepping
through it in a debugger to see what effect each line has.

AFL requires some sample, valid inputs to work with. Run the following:

```
$ mkdir -p testcase_dir
$ printf 'www.google.com' > testcase_dir/google
$ python3 -c 'print("A"*980, end="")' > testcase_dir/manyAs
```

We also need to ideally allow afl-fuzz to *instrument* the code
(i.e., insert extra instructions so it can analyze what the running code
is doing) -- though afl-fuzz will still work even without this step.
Recompile Dnstracer by running the following:

```
$ CC=/usr/bin/afl-gcc CFLAGS="-pedantic -g -std=c11 -Wall -Wextra -Wno-pointer-sign -O2" ./configure
$ make clean all
```

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

<center>**Instrumenting for afl-fuzz**</center>

Some of the dynamic analysis tools we have seen (like the Google
sanitizers, ASan and UBsan) are built into GCC, so to use them,
we just have to supply GCC with appropriate command-line arguments
(e.g. `-fsanitize=address,undefined`).

However, AFL-fuzz is not part of GCC, and it takes a different approach.
It provides a command, `afl-gcc`, which behaves very similarly to normal
GCC, but additionally adds in the instrumentation that AFL-fuzz needs.

So we can perform the instrumentation by specifying the option
`CC=/usr/bin/afl-gcc` to the `./configure` command: this specifies
a particular compiler that we want to use.

</div>


Then, to do the fuzzing, run

```
$ afl-fuzz -d -i testcase_dir -o findings_dir -- ./dnstracer
```

A "progress" screen should shortly appear, showing what AFL-fuzz is
doing -- something like this:


<pre style="line-height: 1.0"><code>
             american fuzzy lop ++2.59d (dnstracer) [explore] {-1}
┌─ process timing ────────────────────────────────────┬─ overall results ────┐
│        run time : 0 days, 0 hrs, 0 min, 18 sec      │  cycles done : 2     │
│   last new path : 0 days, 0 hrs, 0 min, 0 sec       │  total paths : 70    │
│ last uniq crash : none seen yet                     │ uniq crashes : 0     │
│  last uniq hang : none seen yet                     │   uniq hangs : 0     │
├─ cycle progress ───────────────────┬─ map coverage ─┴──────────────────────┤
│  now processing : 66*0 (94.3%)     │    map density : 0.02% / 0.23%        │
│ paths timed out : 0 (0.00%)        │ count coverage : 1.71 bits/tuple      │
├─ stage progress ───────────────────┼─ findings in depth ───────────────────┤
│  now trying : splice 4             │ favored paths : 26 (37.14%)           │
│ stage execs : 60/64 (93.75%)       │  new edges on : 30 (42.86%)           │
│ total execs : 58.0k                │ total crashes : 0 (0 unique)          │
│  exec speed : 3029/sec             │  total tmouts : 0 (0 unique)          │
├─ fuzzing strategy yields ──────────┴───────────────┬─ path geometry ───────┤
│   bit flips : n/a, n/a, n/a                        │    levels : 8         │
│  byte flips : n/a, n/a, n/a                        │   pending : 29        │
│ arithmetics : n/a, n/a, n/a                        │  pend fav : 0         │
│  known ints : n/a, n/a, n/a                        │ own finds : 68        │
│  dictionary : n/a, n/a, n/a                        │  imported : n/a       │
│   havoc/rad : 29/29.2k, 39/28.0k, 0/0              │ stability : 100.00%   │
│   py/custom : 0/0, 0/0                             ├───────────────────────┘
│        trim : 50.13%/169, n/a                      │             [cpu:322%]
└────────────────────────────────────────────────────┘
</code></pre>

The AFL-fuzz documentation gives an explanation of this screen
[here][afl-fuzz-status-screen].

[afl-fuzz-status-screen]: https://github.com/google/AFL/blob/master/docs/status_screen.txt


We've given afl-fuzz a *very* strong hint here about some valid input
that's *almost* invalid (`testcase_dir/manyAs`); but given time and
proper configuration, many fuzzers will be able to identify such input
for themselves.

After about a minute, afl-fuzz should report that it has found a
"crash"; hit ctrl-c to stop it, and look in `findings_dir/crashes`
for the identified bad input.

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

<center>**Crash files**</center>

Inside the `findings_dir/crashes` directory should be files containing
input that will cause the program under test to crash.
For instance, on one run of AFL-fuzz, a "bad input" file is produced
called
"`findings_dir/crashes/id:000000,sig:06,src:000083,time:25801+000001,op:splice,rep:16`".
The filename gives information about the crash that occurred and how the
input was derived.

- "`id:000000`" is an ID for this crash – this is the first and only
  crash found, so the ID is 0.
- "`sig:06`" says what [*signal*][signal] caused the program to crash.
  You can get a list of Linux signals and their numbers by running the
  command "`kill -L`": signal 6 is "`SIGABRT`", which is raised when a
  program calls the [`abort()`][abort] function. `abort()` typically
  gets called by the process itself; in this case, the code added by gcc
  to detect buffer overflows detects an overflow has occured, and "bails
  out" by calling `abort()`.
- "`src:000083`" isn't too important to understand, but matches up the
  crash with an item in AFL-fuzz's "queue" of inputs to try (also
  available under the `findings_dir`).
- "`time:25801+000001`" gives information about when the crash occurred.
- "`op:splice,rep:16`" gives information about what AFL-fuzz did to one
  of our inputs to get the new input that caused the crash. In this
  case, it performed a "splice" operation (inserting new characters into
  the input string) 16 times.

[signal]:https://en.wikipedia.org/wiki/Signal_(IPC)
[abort]: https://man7.org/linux/man-pages/man3/abort.3.html

Since gcc's buffer overflow protections are enabled, we should expect a
crash to occur exactly when the input is long enough to overflow the
buffer -- at that point, gcc's protection code detects that something has
been written outside the buffer bounds, and calls `abort()`. So all
AFL-fuzz has to do to trigger a crash is lengthen the input string
enough. But AFL-fuzz *monitors* the code paths the program under test is
executing -- that's what the "instrumentation" step is for -- and can
thus "learn" to explore quite complicated input structures -- see [this
post][afl-fuzz-jpeg] by the main developer of AFL-fuzz, Michał Zalewski,
in which AFL-fuzz "learns" how to generate valid JPEG files, just from
being given the input string "`hello`".

[afl-fuzz-jpeg]: https://lcamtuf.blogspot.com/2014/11/pulling-jpegs-out-of-thin-air.html

</div>


In general, running a fuzzer on potentially vulnerable software is a
pretty "cheap" activity: one can leave a fuzzer running for several
days with simple, valid input, and check at the end of that period to see what
problems have been discovered.

**Challenge exercise**

:   We've seen how we could have *detected* CVE-2017-9430 in advance,
    by letting a fuzzer generate random inputs and attempt to crash
    the Dnstracer program.

    Can you work out the best way of fixing the problem, once detected?

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

<br><br><br>

<!-- vim: syntax=markdown tw=72 :
-->
