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

```tee -a ~/.vimrc <<EOF
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

### 2.2. Analysis

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



<!-- vim: syntax=markdown tw=72 :
-->
