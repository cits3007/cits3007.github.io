---
title: |
  CITS3007 lab 2 (week 3)&nbsp;--&nbsp;Debugging&nbsp;--&nbsp;solutions
---

For this lab, from within your VM, clone the source code for the
lab by running `git clone https://github.com/cits3007/lab02.git`.
You can view individual files using `less` or `vim`.

## 1. `gdb` basics

`gdb`, the GNU Debugger, lets us step through compiled C (or C++)
programs and examine the values of variables in the running program.

When compiling programs we wish to debug, we need to pass the flag `-g`
to `gcc`, which tells it to add debugging information.
It's also best to pass the `-O0` option to `gcc`, which tells the
compiler *not* to optimize the compiled code. (Passing flags like
`-O1`, `-O2` and `-O3` to `gcc` tells it to spend longer compiling the
code, in order apply increasingly advanced optimizations; see the
documentation for `gcc`'s [optimization options][optim-options] for more
details.) If `gcc` has heavily optimized our code, then the
CPU instructions being executed may not correspond very closely to the
source code we provided, making the behaviour of `gdb` unexpected.

[optim-options]: https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html

The Makefile for this lab already includes these two flags, so
running `make factorial` in your VM is all you need to do to
compile the code. (All commands from this point on in the lab are
intended to be run from the command-line in your VM, in the cloned
`lab02` directory, unless otherwise specified.)


### 1.1. Factorial results

Read the API comments for the `factorial` function in
`factorial.c`, and build the `factorial` program with the
command `make factorial`.

Try executing the `factorial` program with various arguments
from 0 to 20 (the valid range) and outside it. Does the program
print the correct result? (If you're not sure what the factorial of some
number is, then Googling "factorial 10", for example, should give you
an answer.)

See if you can spot the cause of the error in `factorial.c`.
If you can, don't fix it yet -- we're going to use the program to
experiment with debugging using `gdb`.

### 1.2. Running `gdb`


Launch the debugger by running

```
$ gdb ./factorial
```

You should see some welcome messages from `gdb`, then it will display
the debugger prompt `(gdb)`. As the welcome messages say, you can type
`help` at this prompt to get help, but the online help is unfortunately
not especially useful unless you already have some familiarity with
`gdb`. (If you *do* know the first letter of a command you're interested
in, then `gdb` has an "autocomplete" feature -- type `l` and then the
`tab` key a couple of times, to see commands beginning with `l`.)

Some of the commands you can run from the `gdb` prompt include:

- <code>list <em>[LINENUM]</em></code>, which lists the code around
  (before and after) <code><em>LINENUM</em></code>. If you leave off
  <code><em>LINENUM</em></code>, `gdb` will "page" it's way through
  the current file. You can type just `l` as shorthand for `list`.
- <code>run</code>, which runs the loaded program.

Try both of these commands. When you run the program, you should
see it print the error message

```
Error: expected 1 command-line argument (an INT), but got 0
```

since by default, `gdb` runs the program with no command-line
arguments. (`gdb` should also print a message saying that our
program `exited with code 01`. By convention, programs on Unix-like
platforms exit with a non-zero code to indicate an error.)

Set the programs arguments by running the following command
(don't type the `(gdb)` prompt):

```
(gdb) set args 6
```

and then running the program again.

Now, exit the debugger by typing `quit` or `ctrl-d`, and start it again.
This time, we'll use `gdb`'s TUI (text-based user interface).

Type `ctrl-x` and then the `a` key immediately afterward. A "window"
should open in your terminal; run the `list` command, and you should
see something like this:

`<div style="display: flex; justify-content: center;">`{=html}
![](images/gdb_tui.png "gdb TUI")
`</div>`{=html}

The arrow keys and the `pageup` and `pagedown` keys on your keyboard
should now move you around in the source listing window, and `ctrl-i`
will refresh the display if at any point it seems to get out of sync
with what you're doing. (The `ctrl-x a` sequence toggles between `gdb`s normal
mode and TUI mode; hitting it repeatedly will take you back and forth
between them.)

The <code>breakpoint <em>LINENUM</em></code> command (`b` for short)
will set a breakpoint in the code (and the source listing will indicate
this with a "`b+`" in the code margin).

Run the command `b 26` to set a breakpoint at line 26 (containing the
statement `argc--`), and `r` to run the program.

`gdb` will highlight the line about to be executed. Some other useful
commands:

- <code>print <em>EXPRESSION</em></code> (`p` for short): print the
  value of a C variable or expression. `p argv` will print the type
  (`char **`) and value of `argv`, one of the arguments to main -- the
  value should be a location in virtual memory, something like
  `0x7fffffffe468`.

  You can print elements within a struct or array using the normal
  C syntax for accessing those elements -- for instance, `print argv[0]`
  will (unsurprisingly) print the value of `argv[0]`.

  You aren't limited to variables -- try printing the value of `3 * 2 + 1`
  or `"foo"[0]` and see what gets displayed.

- <code>ptype <em>EXPRESSION</em></code>: print the *type* of a C
  variable or expression.

- `step` (`s` for short): step "into" the current instruction. That is,
  if the current instruction is a function call, `gdb` will go "into"
  that function and start stepping through its instructions.

- `next` (`n` for short): step "over" the current instruction; if it
  is a function call, the function will be executed without `gdb` going
  "into" that function and stepping through it in detail.

- `finish`: Step "out" of the current function (run to the end).

- `continue` (`c` for short): continue running until a breakpoint is
  hit.

- `kill` (`k` for short): abort execution of the program, but don't exit
  `gdb`.

- `info args`: print the arguments of the function you're in.

- `info locals`: print the local variables of the function or block
  you're in.

- `clear`: remove all breakpoints.

- `backtrace` (`bt` for short): print information on the stack frames
  currently on the call stack -- i.e., what "chain" of functions called the
  function you're currently in, and with what arguments.

For some additional commands and advanced features, see
the [Hitchikers Guide To The GDB][hitch-gdb] and the
GDB tutorial series [here][gdb-tutorial] and [here][gdb-tutorial-2] from RedHat.
GDB "cheat sheets" are available [here][gdb-cheat] (PDF)
and
[here][gdb-cheat-2].

[hitch-gdb]: https://apoorvaj.io/hitchhikers-guide-to-the-gd
[gdb-tutorial]: https://developers.redhat.com/blog/2021/04/30/the-gdb-developers-gnu-debugger-tutorial-part-1-getting-started-with-the-debugger
[gdb-tutorial-2]: https://developers.redhat.com/articles/2022/01/10/gdb-developers-gnu-debugger-tutorial-part-2-all-about-debuginfo
[gdb-cheat]: https://darkdust.net/files/GDB Cheat Sheet.pdf
[gdb-cheat-2]: https://gist.github.com/rkubik/b96c23bd8ed58333de37f2b8cd052c30

### 1.3. `argc` and `argv`

The first thing the `factorial` program does in `main` is execute the
following statements:

```C
argc--;
argv++;
```

If you're running an instance of the `factorial` program, kill it
with `k`, use `set args 6` to set the command-line arguments of the
program, and run it with `r`. (Your breakpoint at line 26 should still
be showing; execute the command `b 26` to set if you've accidentally
exited `gdb` and come back in.)

Step through the program, examining the values of `argc`, `argv`,
and elements of `argv` (like `argv[0]` and `argv[1]`) at various points
in the program.

What is the effect of the two statements we listed above? Why would we
use them?



<div class="solutions">

**Sample solutions**

The statements are used to "ignore" the value of `argv[0]`, which
contains the filename of the program being executed. `argc` is
decremented by one (so the number of arguments is reduced by one),
and `argv` is incremented by one -- the effect is that
`argv[0]` *after* the statements are executed points to what
used to be `argv[1]`.

This is commonly done in programs where we are interested in the
command-line arguments of the program, but have no especial interest
in the name of the executable.

</div>



### 1.4. `strtol`

In the file `factorial.c`, we use the function `strtol` to convert the
program's first command-line argument into a `long`, despite the
fact that the `factorial` function only takes an `int`, and we then
cast the `long` into an `int`.

However, C11 has a function `atoi`, which converts strings to `int`s, so
it seems we could have used that.
Read the documentation for 

- `strtol` (`man strtol` in your VM, or
<https://en.cppreference.com/w/c/string/byte/strtol>), and
- `atoi` (`man atoi` in your VM, or
<https://en.cppreference.com/w/c/string/byte/atoi>)

and summarize
what the differences are. Why might we prefer `strtol` over `atoi`?



<div class="solutions">

**Sample solutions**

`strtol` provides more information and allows for more precise
error-checking than `atoi`. When `atoi` can't convert the string it
sees, it returns the value `0`: this is unhelpful, since it means we
have no way of knowing whether it encountered a conversion error, or was
actually supplied with the string `"0"`.

`atoi` also has unhelpful behaviour when the number encountered would
fall outside the bounds of an `int` (i.e. is too large in magnitude,
whether positive or negative): its behaviour is simply undefined.
`strtol` in contrast is more helpful: it sets the global value `errno`
(which you can read about [here][errno]) to the value `ERANGE` to
indicate an "out of range" error, and still returns *some* potentially
useful value (either the highest or lowest value a `long` can hold).

[errno]: https://en.cppreference.com/w/c/error/errno 

Because of this, many C style guides recommend that `strtol` be
used instead of `atoi`.

</div>



### 1.5. Diagnosing and fixing the `factorial` bug

Kill the `factorial` program, set a breakpoint somewhere in the
`factorial` function (e.g. line 18), and use the `run` and/or
`continue` commands to get to your breakpoint.

Step through execution of the `factorial` function, and examine
the values of the local variables (using either `print` or `info
locals`). What is the bug in `factorial`? Fix it.

Make a GitHub repository to hold your own version of the Lab 2 code,
and use `git remote remove`, `git remote add` and `git push` to push
your fixed code to GitHub.

Refer to [Lab
1](https://cits3007.github.io/labs/lab01.html) if you can't recall
how to do this, and make a note of it for next time.



<div class="solutions">

**Sample solutions**

The fix is that the line

```
for (int i = n; i >= 0; i--) {
```

should be changed to

```
for (int i = n; i > 0; i--) {
```

In other words, this is an ["off-by-one" error][off-by-one].

[off-by-one]: https://en.wikipedia.org/wiki/Off-by-one_error

</div>



<div style="border: solid 2pt blue; background-color: hsla(241, 100%,
50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em;">

**Recommendation -- keep lab notes**

It's recommended you keep online notes of useful commands
you come across in the unit and/or useful links, as a reminder to
yourself of what we've covered. You could keep a Word or
text document, if you like, using [Google
Docs](https://docs.google.com/), but another option is to store
your notes in a "Gist" -- a single text file versioned by GitHub.

Click on the "+" symbol in the top right of any GitHub page, and select
"New gist". Give your gist a description (e.g. "My CITS3007 notes")
and a filename (e.g. "notes.md"). Then click "Create secret gist"
(or "public", if you wish to make it public).

Gists support formatting your file using
[Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) --
for instance, use asterisks ("`*`") to surround words intended to be
italic, and start paragraphs which should be part of a list with a
hyphen and space ("`<code>- </code>`{=html}"). Clicking the "Preview" tab will show you
what your notes look like converted to HTML.

</div>


## 2. segfaults

Compile the `segfault` program by running `make segfault` and then run
it with `./segfault`. The intended behaviour is that it should accept a
line of input from the user, and echo this back.

However, when it is run and some text entered, it produces a
[*segmentation fault*][segfault]. A
segmentation fault is caused when the CPU detects that a program has
attempted to access memory which it is not permitted to access.

[segfault]: https://en.wikipedia.org/wiki/Segmentation_fault 

Try running the program using `gdb`. (Hint: you can get `gdb` to
start in TUI mode by running `gdb -tui ./segfault`.) Start `gdb`
and run the program with the `run` command, and enter some text.
Once the segfault occurs,
run the `backtrace` command to see the current stack trace.

You should see something like

```
#1  0x00007ffff7e2a96c in __GI__IO_getline (fp=fp@entry=0x7ffff7f93980 <_IO_2_1_stdin_>, buf=buf@entry=0x0,
    n=n@entry=1023, delim=delim@entry=10, extract_delim=extract_delim@entry=1) at iogetline.c:34
#2  0x00007ffff7e296ca in _IO_fgets (buf=0x0, n=1024, fp=0x7ffff7f93980 <_IO_2_1_stdin_>) at iofgets.c:53
#3  0x0000555555555209 in main () at segfault.c:9
```

Each stack frame shows the values of the arguments to the function
called for that frame. Do any of them look suspicious?



<div class="solutions">

**Sample solutions**

The argument `buf` (in stack frames #1 and #2) is equal to 0 -- that is,
the `NULL` pointer. Trying to dereference the `NULL` pointer in C -- on
platforms that have hardware memory protection -- will generally result in a
segmentation fault.

However, not all platforms *do* implement memory protection, so this is not
guaranteed.

</div>



Try printing the value of `buf` (with the command `print buf`) before
and after it
has been allocated, and see what result you get.



<div class="solutions">

**Sample solutions**

After the allocation, `buf` will be set to 0 (the `NULL` pointer),
which is not what we want -- we expect it should point to
newly-allocated memory.

</div>



Try using the `print` command to see how the "bitwise left shift"
("`<<`") operator works.

Try `p 1 << 2`, `p 1 << 10`, and a few other values, then try `p 1 <<
31`. What result do you get? Why might this occur? (Hint: read the
cppreference.com page on arithmetic operators, in particular the section
on "overflow":
<https://en.cppreference.com/w/cpp/language/operator_arithmetic>.
Also try the `ptype` command for the various values you typed above, to
see what their type is.) How can the program be fixed?





<div class="solutions">

**Sample solutions**

The behaviour occurs because the type of `1 << 32` is type `int`,
which is a signed integer type, and only has 4 bytes (32 bits) on the
platform we're using. The left shift operator `<<` has the effect of
multiplying a number by two $n$ times (where $n$ is the right-hand
operand). For an `int`, multiplying by two 32 times leads to overflow,
and the `int` "wraps around" to a negative number.

The immediate problem with the program can be fixed by:

- choosing a much smaller buffer (say, `1 << 16`, or `65535`)
- putting a lowercase "`l`" after the `1` (i.e. `1l << 32`) -- this
  makes it a `long`, which on our platform can store 8 bytes, or 64
  bits)

</div>




<!-- vim: syntax=markdown tw=72 smartindent :
-->
