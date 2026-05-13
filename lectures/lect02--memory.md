---
title: |
  CITS3007 Secure Coding\
  C language, intro to buffer overflows
author: "Unit coordinator: Arran Stewart"
include-before: |
  ```{=latex}
  %\setbeameroption{hide notes} % Only slides
  %\setbeameroption{show only notes} % Only notes
  \setbeameroption{show notes on second screen=right} % Both
  ```
---

### Outline

- C language topics -- parts of you C should know

# C language refresher

### Why C?

Why do we use C in this unit, instead of some other language
(Python, or C#, or Rust, say)?

### Why C?

C has a privileged place in the software ecosystem.

- Most modern operating systems (e.g. Linux, Windows and macOS) are written in C
  - their *interfaces* are defined in C
- Many programming languages have their primary implementation in C (e.g. Python,
  JavaScript, Lua, Bash)

So C underpins many modern systems and languages.

::: notes

If there are problems in the C code -- that can lead to very serious
problems in the system or the programming language.


Lots of programming language libraries (e.g. Python's numpy and pillow
imaging library)
are wrappers around underlying C libraries -- if there are problems in
the C, those can manifest in the library.

&nbsp;

**Java**

We don't mention Java, but
Java primary implementation is OpenJDK, and the JVM is primarily implemented in C++ -- see
<https://github.com/openjdk/jdk>. There are actually multiple JVM variants (e.g. some with
JITting, some without) -- the JIT HotSpot JVM code is at
<https://github.com/openjdk/jdk/tree/master/src/hotspot>.


:::

### Why C?

- C often serves as a "lingua franca" when extending languages
  or developing programs written in multiple languages
- For instance, the Python language can be extended by writing
  [new built-in modules][python-extend] in C.

[python-extend]: https://docs.python.org/3.10/extending/extending.html

::: notes

- Well -- V8 JS engine is actually in C++. But bindings are in C.

:::

### Features

C was created as an \alert{efficient systems programming language}, and was first used
to re-write portions of the Unix operating system so as to make them more portable.

It aims to give the programmer a \alert{high level of control}
over the organization of data and the operations performed on that data.

But it also assumes the programmer \alert{knows what they are doing},
and provides very little in the way of safeguards.

### Features

C inherited some features from the language [PL/I][pl-i],
but unfortunately in some cases opted for less security than PL/I.

For instance, [buffer overflows][buffer-overflows] (which we look at
shortly)
were rare in PL/I, as it required that programmers always specify a
maximum length for strings:[^multics] C does not implement this feature.

[pl-i]: https://en.wikipedia.org/wiki/PL/I
[buffer-overflows]: https://en.wikipedia.org/wiki/Buffer_overflow

[^multics]: Karger & Schell (2002)

::: notes

- e.g. C's comment style is copied from PL/I; variable declaration
  style seems to be Ritchie's own invention; `auto` and `static`
  are from B/BCPL; preprocessor was in use by both PL/I and BCPL

see:

- Ritchie, <https://www.bell-labs.com/usr/dmr/www/chist.html>
- PL/I vs C comparison code:
  <http://eberhard-sturm.de/ZIV/PL1andC.html>. (Part of a pro-PL/I
  rant.)

**3 aug 2022**

- UWA reported a data breach last Friday --

:::


### Features

C leaves many details about the behaviour of programs (for instance, what
range of numbers an `int` can hold) to the compiler, and the details
can vary from platform to platform.

The intention is to allow the compiler to use the \alert{most efficient
types} and \alert{most efficient processor instructions} for the
platform it is targeting.


### Language standards

We will largely discuss the C11 standard,[^c11] which is still in widespread use.

That said, as long as your code compiles and runs correctly
using the standard CITS3007 development environment, you are welcome
to use later versions of the language if you wish.[^gcc-c17]

[^c11]: ISO/IEC 9899:2011. See [ISO/IEC 9899:201x][open-c]
  at <https://www.open-std.org> for a draft version.

[open-c]: https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1548.pdf

[^gcc-c17]: \texttt{gcc} can be instructed to use C17, for instance, by passing
  \texttt{-std=c17} to the compiler.

### Language references and texts

If you're not already familiar with C, you will need to get up
to speed in the first few weeks through self-study.

See the [website][textbook-recs] for textbook recommendations.

Robert Seacord has a textbook which I quite like, but you should pick
a textbook that you feel comfortable with.

[textbook-recs]: https://cits3007.arranstewart.io/resources/#c-programming


### Language references and texts

If you are already familiar with C:

- The \alert{\href{https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1548.pdf}{ISO/IEC C11 standard}} is a bit
  wordy, and the vocabulary takes a bit of getting used to -- but it's
  not *that* difficult to follow, and it's the final word on what a
  legal C11 program should do.  
 
- `\alert{`{=latex}<https://cppreference.com>`}`{=latex} actually has
  very good coverage of C header files and functions. \
  Just make sure you're reading the right one.  

  - From a corresponding C`\texttt{++}`{=latex} page, follow the "C
    language" links down the bottom of page  

  - C language topics should have a URL that looks like
    `https://en.cppreference.com/w/c/SOMETHING`

::: notes

**cppreference.com**

good reference for C, if you already know roughly what you're
after

- can be a tad forbidding for a novice programmer


:::

### These slides != a textbook

Please note: these lecture slides aim to refresh your memory
on details of the C language, and highlight some important
differences from other languages.

They are not a complete reference, nor are they a substitute for a C
textbook.

If you rely on them to explain all the details of the C
language, you will probably get questions wrong in the
assessments, and then you will be unhappy.


### Major surprises

\small

Some of the following features of C often surprise people coming from
other languages:

- (Almost) everything is an integer (or derived from an integer type)   

- Assignment ("`=`") will only sometimes do what you think it should do  

- If you misuse memory (e.g. going outside the bounds of an array), you
  get no warnings or exceptions about this -- the compiler assumes
  you know what you're doing
  - Instead of exceptions, the behaviour of your program becomes
    \alert{undefined} -- it literally has no meaning, is not a valid C
    program, and the compiler is allowed to generate whatever compiled
    code it likes.  

- Many aspects of program behaviour are not fixed by the language standard,
  but are \alert{implementation-defined}.


### Definedness

The C language standard gives great latitude to compiler
implementers to do whatever is most efficient for a particular platform.

Instead of specifying exactly what some construct will do, the standard
leaves this up to the compiler implementer.

### Definedness

\footnotesize

There are three different types of
"not-precisely-defined-by-the-standard" behaviour:

implementation-defined

:   The implementation must pick some behavior, and its choice must be
    documented.  

    (Query: What does "implementation" mean? A compiler? A version of that
    compiler? A version of that compiler, targeting a specific platform?)

unspecified

:   Similar to implementation-defined, except that the choice need not be documented.  

    (The choice need not be deterministic or consistent --
    an implementation could choose different behaviours at different
    times.)

undefined

: Anything at all can happen; the standard imposes no requirements. The
  program might fail to compile, or it might execute incorrectly, or it
  might by pure luck do exactly what the programmer intended.

(See <https://c-faq.com/ansi/undef.html> for more details.)

### Definedness exercise

Suppose you have a function `eraseAll` in a C program, left behind
by some other programmer:

::: block

####

\small

```c
  static int eraseAll() {
    return system("rm -rf /");
  }
```

:::

Running this function would invoke the `rm` command, and request it
to delete all files on your system (thus destroying the system).

Fortunately, however, you never actually call the `eraseAll` function from your
code.

### Definedness exercise

Suppose that somewhere in the code your program *does* invoke, you
accidentally cause undefined behaviour (for instance, by going out of
bounds of an array, or trying to dereference an uninitialized pointer).

Can the compiler output a program which calls the `eraseAll` function
and destroys your system?

::: notes

See the `undef_demo.{c,sh}` files, which compile and run a program
using the Clang compiler.

<https://cits3007.arranstewart.io/lectures/undef_demo.zip>

:::



### C data types

`\begin{center}`{=latex}
\vspace{-2em}
![](images/c-types.pdf)
`\end{center}`{=latex}

\scriptsize
\vspace{-1.7em} See [`<stdint.h>`][stdint] for many more integer types
(e.g. fixed-width integer types like `int32_t`).



[stdint]: https://en.cppreference.com/w/c/types/integer


### "Imaginary" types

> Before you can understand strings in C, you have to realize the truth. C has no strings.

`\hspace{2.5em} --- \texttt{/u/Different-Brain-9210}`{=latex} on [Reddit][no-strings]

[no-strings]: https://old.reddit.com/r/cprogramming/comments/11ar86f/handle_dynamic_memory/

### "Imaginary" types

Unlike many other languages, C does \alert{not have} a "string" type.

There is no type in C called "string", representing human-readable text.

What C has instead are \alert{arrays of \texttt{char}s}, some of which
might represent strings, and some of which might not.

::: notes

It's up to the programmer to keep track of which are which in their head

:::


### "Imaginary" types {.fragile} 

\footnotesize

You can think of C as having two "imaginary" types, which it's up to the
programmer to keep track of in their head:

"blob of bytes"

:   \
    Raw access to a sequence of contiguous bytes in memory. Other languages
    sometimes call this type `bytes` or a `bytestring`.[^blob-special]

"string"

:   \
    A human-readable string of text. To work properly
    with string-related library functions, they must be terminated
    with a null character (usually written `'\0'`).

    If the terminator is missing, that will result in security problems.

*Both* these "imaginary" types are represented in code as arrays of
`char`s.


[^blob-special]: You can also think of `\passthrough{\lstinline!char *!}`{=latex} as sometime being a type called
  "view-this-raw-memory-as-a-bytestring". It's an exception to the normal rule
  that you must never access a location in memory by the "wrong" type.

::: notes

normal rule --
you must never access a pointer using an incorrect type.

But you *are* always allowed to convert pointers to the type `char *`,
and "inspect the innards" of some object as raw memory.

see e.g.
<https://tttapa.github.io/Pages/Programming/Cpp/Practices/type-punning.html>

----

re "null" char.
this meaning of "null" is different to "null pointer".

I prefer "NUL character", but the world is against me. (Plus, NUL
is probably ASCII spcific.)

:::

### Array decay

C semantics is based on there being \alert{arrays} sitting in memory at
various locations.

All arrays always have an exact size, and if you go outside the bounds of the
array, that will result in security problems.

Unfortunately, unless you are careful, it's easy for the information
about array length to "vanish" from the programmer's view -- more on
this in labs.

::: notes

So in practice, except for things that are known to be strings, "blob of
bytes"/"buffers" need to be passed around as TWO types, a pointer plus a
`size_t` holding its length:

`void myfunc(int * my_array, size_t len)`

as an aside:
C++ improves on this a bit, and it's less common to pass around raw
pointers.

Instead, in modern C++,

- Containers (e.g. `vector`), which store an array, PLUS its size, are more frequently used
- `std::string` is a vector of `char`s
- One can often pass around a `std::span` to represent a contiguous set
  of elements - an array, a container, OR just a slice/view into those
  (see e.g. <https://www.cppstories.com/2023/span-cpp20/>)

:::


### Integers in C

\small

C has a large number of integral data types.[^int-types]
The most common are:

::: block

\small

#### standard integer types

- standard signed integer types: `signed char`, `short int`, `int`, `long int`,
  and `long long int`
- standard unsigned integer types: `_Bool` (also available as `bool`),
  `unsigned char`, `unsigned short int`, `unsigned int`, `unsigned long int`,
  and `unsigned long long int`
- the `char` type.

:::

What range of integers these can hold, and which of these
types are equivalent to each other, is implementation dependent.

[^int-types]: In fact, nearly every type you see in this
  unit (besides function types) is either an integer type,
  or derived from (array or \texttt{struct} or pointer to) integer types.


::: notes

\footnotesize

- C11 - see e.g.  <https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1548.pdf>.
- bits in byte impl-dependent: 3.6.
- types: 6.2.5

importance:

- Most types we (in this unit) encounter in programs will be
  integers or collections (arrays, structs) of integers!
- Really, the only other types are the floating point types,
  which most people won't deal with much in systems programming

&nbsp;

Triva: In pre-ANSI C, the "signed" and "unsigned" keywords did not even
exist. So e.g. ints could be signed or unsigned, but no way of
_forcing_ one or the other.

See e.g.

- early, pre-K&R C manual at <https://www.bell-labs.com/usr/dmr/www/cman.pdf>,
- docco for the `-traditional` flag under <https://gcc.gnu.org/onlinedocs/gcc-2.95.3/gcc_2.html#SEC6>,
- Oracle "Making the Transition to ANSI C" <https://docs.oracle.com/cd/E19957-01/802-5776/802-5776.pdf>.)
- Oracle "Oracle Developer Studio C: Differences Between K&R C and ISO C" <https://docs.oracle.com/cd/E77782_01/html/E77788/bjbfb.html>

:::



### Integers in C

::: block

\small

#### standard integer types

- standard signed integer types: `signed char`, `short int`, `int`, `long int`,
  and `long long int`
- standard unsigned integer types: `_Bool` (also available as `bool`),
  `unsigned char`, `unsigned short int`, `unsigned int`, `unsigned long int`,
  and `unsigned long long int`
- the `char` type.

:::

\vspace{-0.5em}The C11 standard states that
the `char` type is equivalent to *either* `signed char` or `unsigned char`,
but which one is the case is implementation-defined.`\\`{=latex}
It says the size of a `char` is one byte, and has at least 8
bits, but *doesn't* otherwise constrain
how many bits exist in a byte (this, too, is
implementation-defined).[^nbby]

[^nbby]: The \texttt{CHAR\_BIT} macro in \texttt{<limits.h>} will tell
  you the number of bits per byte. On Unix-like OSs, the macro
  \texttt{NBBY}, defined in \texttt{<sys/param.h>}, will give the same result.

::: notes

\scriptsize

***Why* can char be either signed or unsigned?**

C standard aimed to codify existing practice, which was, some platforms had char as signed and some unsigned.
(see e.g. [stackoverflow answer here](https://stackoverflow.com/questions/74180152/why-is-char-different-from-both-signed-char-and-unsigned-char/74296942#74296942),
plus comment on EBCDIC on same page.)

IBM mainframes -- used EBCDIC (<https://en.wikipedia.org/wiki/EBCDIC>) character encoding.
It used codes greater than 127. Lowercase 'a' is 0x81 (dec 129), thru other letters up to '9' 0xf9 (dec 249).

So unsigned was best choice for these machines. (Post ANSI,
char *has* to be unsigned there, since standard says members of
basic execution character set have to always be non-negative.)

Even on modern, ASCII-using systems, it varies: x86-64 uses signed, ARM64 usually uses
unsigned (though iOS doesn't). (Why unsigned for ARM64? Reason seems to be because early
ARM platforms just didn't have *native* [hardware] support for signed bytes - see
[here](https://stackoverflow.com/questions/3093669/why-unsigned-types-are-more-efficient-in-arm-cpu/6532932#6532932).)

(See further [here][arm64-hn], [here][arm64-dobbs], [here][arm-llvm] and [here][arm-docco].)

[arm64-hn]: https://news.ycombinator.com/item?id=18269886#:~:text=Anyway%2C%20here%20is%20one%20possible,to%20do%20the%20sign-extension.
[arm64-dobbs]: https://www.drdobbs.com/architecture-and-design/portability-the-arm-processor/184405435
[arm-llvm]: https://discourse.llvm.org/t/why-is-char-type-considered-unsigned-in-arm-architecture/69763
[arm-docco]: https://developer.arm.com/documentation/den0013/d/Porting/Miscellaneous-C-porting-issues/unsigned-char-and-signed-char

-------

**CHAR_BIT**

- `CHAR_BIT` - see <https://en.cppreference.com/w/c/types/limits>

Is `CHAR_BIT` ever not 8?

Yes, though rarely. see e.g.
<https://stackoverflow.com/questions/32091992/is-char-bit-ever-8/38345249#38345249> --
"TMS320C28x DSP from Texas Instruments has a byte with 16 bits".

Historically, there were systems with chars that weren't 8 bit.
e.g. Honeywell 6000 (<https://en.wikipedia.org/wiki/Honeywell_6000_series#Data_formats>)
had 9-bit chars. (why? idk)

:::


### Functions in C

All executable statements in C must be written inside a procedure -- C calls
its procedures "functions".

C functions may return a result, in which case the signature of the function
will indicate the return type. For instance:

::: block

####

```C
int square(int x);
```

:::

The function declared above takes one argument (an `int`), and returns
an `int` value.


### Functions in C

::: block

####

```C
void print_int_to_terminal(int x);
```

:::

Alternatively, a function may be declared as having return type `void`,
in which case it *doesn't* return any value as a result.

Both void and non-void functions may have *side effects*: they may
for instance
modify the values of global variables, perform output to the
terminal, or alter the state of files or attached devices.

### Function declarations and definitions

A function \alert{declaration} "tells" code following it
about a function:

::: block

####

```C
int square(int x);
```

:::

A function \alert{definition} provides the "body" of the function:

::: block

####

```C
int square(int x) {
  return x * x;
}
```

:::


### Function conventions in C

There are two types of functions in C:

- Functions that can *fail* -- they try to do something, but may
  sometimes not succeed, even when called correctly.

  Examples: `fopen`, `malloc`.

- Functions that cannot fail -- if called correctly, these always
  succeed.

  Examples: `strlen`, `memcpy`, `isalpha`.

However, it can be easy to call both these sorts of functions
incorrectly.

### Function conventions in C

The convention in C for function return values is as follows:

Functions that can fail

:   \
    If the function normally returns a pointer -- it will return
    `NULL` to indicate failure.

    If the function normally returns a non-negative `int` -- it will
    return -1 to indicate failure.

More on these in the labs.

::: notes

In security-critical code -- in fact, in all code, really -- you should *always*
check the return value of functions that can fail.

:::

### Control structures

C has the following control flow structures:

selection statements

:   \
    `if` and `switch` statements

loops

:   \
    `while`, `do` and `for` loops

jumps

:   \
    `continue`, `break`, `goto` and `return` statements

\pause

The `goto` statement *is* useful in C. One reason is that C does
not have exceptions and "`finally`" blocks (which can be used to handle
errors and execute "clean-up" code in Java and Python).

`goto` can be used to jump to an error-handling section of your function
(see your C textbook, or Seacord chap. 5, for details). 


### Scope in C

C has two basic types of scope:

- \alert{global scope} (or "file scope"): for variables declared outside all
  functions. These are visible from the declaration, to the end of the file.
- \alert{block scope}: for variables declared within a function or statement block.
  These are visible from the declaration, to the end of the function or statement block.

For global variables (and for functions, which are always global --
C doesn't have nested functions): adding the keyword
`{\bfseries\passthrough{\lstinline!static!}}`{=latex}
before them ensures that the variable or
function is *only* visible from within that file.


Limiting scope is C's primary method of implementing [information
hiding][info-hiding].

[info-hiding]: https://en.wikipedia.org/wiki/Information_hiding


::: notes

- info hiding: originally defined by Parnas, "On the Criteria To Be Used in Decomposing Systems into Modules"
  (1972).
- see also "static functions" -
  <https://stackoverflow.com/questions/558122/what-is-a-static-function-in-c>

:::

### Scope in C


\begin{center}
\includegraphics[width=1.0\textwidth]{images/scope.pdf}
\end{center}


### Arrays in C

C provides support for 1-dimensional and multi-dimensional arrays.

::: block

#### 1-dimensional array

```C
#define ARRAY_SIZE 10
int some_array[ARRAY_SIZE];
```

:::


::: block

#### 2-dimensional array

```C
#define ARRAY_HEIGHT 5
#define ARRAY_WIDTH  10
int two_d_array[ARRAY_HEIGHT][ARRAY_WIDTH];
```

:::

::: notes

- Arrays decay to pointers

:::

### Size of arrays

For our purposes -- *the size of arrays in C is fixed at compile-time*.

You shouldn't declare an array using a variable as a size, even if the compiler
lets you.

::: block

####

```c
  int mylen = 10;
  char myarray[mylen];
```

:::

Using such "variable-length arrays" is error-prone in C, and can often allow an attacker to
exploit [stack-clashing
vulnerabilities](https://blog.qualys.com/vulnerabilities-threat-research/2017/06/19/the-stack-clash).


### Strings in C

C does not provide a separate datatype for strings -- rather,
strings are considered to be arrays of `char`s, with the `NUL`
character (which has ASCII code 0) acting as a terminator.

::: block

#### String

```C
// this declaration:
char my_str[] = "cat";
// is equivalent to:
char my_str[4] = { 'c', 'a', 't', '\0'};
```

:::



### Pointers in C



```{=latex}
\begin{columns}[t]
\begin{column}{0.45\textwidth}
```

\alert{Pointer} types in C hold a reference to an entity of some *other* type.
For instance a "pointer to `int`" (written `int *`) holds a reference to an
`int`.

&nbsp;

It's usually convenient to think of this "reference" as the address of a location
in memory, but the C11 standard does not require that to be the case.


```{=latex}
\end{column}
\begin{column}{0.55\textwidth}
```

`\begin{center}`{=latex}

![A pointer and the variable it references\footnotemark[1]](lect02-images/Pointers.svg){ width=80% }

`\end{center}`{=latex}



```{=latex}
\end{column}
\end{columns}
```

`\footnotetext[1]{`{=latex}
Image courtesy of Wikipedia, <https://commons.wikimedia.org/wiki/File:Pointers.svg>
`}`{=latex}

::: notes

- "address in memory": could instead be a memory segment plus offset, etc.

- "entity": the C standard uses the term "object". I avoid it here
  to prevent confusion with the OO meaning.

:::

### Pointers in C

C allows the use of \alert{pointer arithmetic}. In addition to
performing (say) addition on two integer values, we can perform it
on one pointer value and one integer value.

::: block

####

```C
int * p1 = NULL;
int * p2 = p1 + 4;
```

:::

Adding `4` to a pointer doesn't move it along by 4 bytes. (What does it
do?)

We can also subtract one pointer from another, and perform equality and
inequality comparisons on two pointers (`==`, `<`, `>`, `<=`, and `>=`).

::: notes

ans:

it moves it along by `4` $\times$ the size of whatever is being pointed
to (an `int`, in the example above).


- pointer addition is defined in C11 at 6.5.6 Additive operators.
- And see the corresponding sections for subtraction, equality, etc.

:::

### Pointers in C

Many languages disallow pointer arithmetic, since its use can
easily result in invalid pointers (pointers that
do not reference a properly initialized object of the correct type).

C allows it; it is up to the programmer to ensure they comply
with the standard's rules as to when a pointer is valid.

If the programmer fails to comply with those rules,
the result usually is that the behaviour of the
program is *undefined*.

(In other words: the program has no well-defined "meaning",
according to the C11 standard; and the standard places no
constraints on what behaviour it may have.)

::: notes

- cf Java: is careful about where it lets you get pointers from (you can't
  **forge** references)
- is careful *when* you can have them (only once ctor executed);
- is careful about what you can do with them (no ptr arith)

UB:

- nasal demons

:::


### Pointers in C

\begin{center}
\includegraphics[width=0.8\textwidth,height=\textheight]{images/array.pdf}
\end{center}

For instance: if arithmetic is performed on a pointer which references
some element of an array, and the resulting pointer would go outside the
bounds of the array,[^bounds] then the behaviour of the program is
undefined.

[^bounds]: To be precise: the pointer must point either to an element
  of the array, or the position one past the last element.

### Pointers in C

A pointer to a variable can be obtained using the '`&`' ("address-of")
operator, and pointers can be dereferenced using  '`*`' (the dereference
operator).


\begin{center}
\includegraphics[width=1.0\textwidth]{images/pointerops.pdf}
\end{center}



### Lifetime

Variables have a \alert{storage duration} that determines their
"lifetime".

- Memory for \alert{global} variables is allocated when the program
  starts running, and persists until the program exits

- However, the majority of variables in a program are \alert{local}
  variables, and have what is called "automatic storage duration"
  - This basically means they "disappear" when the function they
    are declared in exits, and the memory allocated to them is reclaimed
  - If you've somehow managed to hang onto a reference to this memory,
    the behaviour of your program is *undefined*

::: notes

- technically it's *objects* that have a storage duration -- C11,
  6.2.4. But near enough

:::

### Automatic lifetime and dangling pointers

\small

Consider this function:

::: block

####

```C
int * myfunc() {
  int a_local_var = 36;
  int * a_pointer = &a_local_var;
  return a_pointer;
}
```

:::

There's nothing wrong with returning a pointer -- lots of functions
do it (like the standard function [\texttt{getenv}][getenv] --
`char* getenv (const char* name)` -- which gives you the value of
an environment variable).

But a caller of `myfunc` will receive a pointer to memory which
has been reclaimed -- a "[dangling pointer][dangling-pointer]" --
and such a pointer results in undefined behaviour.

[getenv]: https://en.cppreference.com/w/c/program/getenv
[dangling-pointer]: https://en.wikipedia.org/wiki/Dangling_pointer

::: notes

- You don't even have to dereference the pointer -- the standard
  says "If an object is referred to outside of its
  lifetime, the behavior is undefined. The value of a pointer becomes indeterminate when
  the object it points to (or just past) reaches the end of its
  lifetime." (6.2.4)

:::

### dangling pointers

\footnotesize

::: block

#### myfile.c


![](images/danglingpointer.pdf){ width=70% }

:::

\small

Compilers will generally not warn you about this -- the above
code compiles with `gcc -pedantic -Wall -Wextra` with no warnings.

Code [static analyzers][static-analyzers] exist which *will* warn you --
more about them, later.

e.g. `clang-tidy myfile.c` will give the output

::: block

####

\scriptsize
\vspace{-1em}

```
1 warning generated.
myfile.c:4:3: warning: Address of stack memory associated with local
variable 'a_local_var' returned to caller [clang-analyzer-core.StackAddrEscapeBase]
  return a_pointer;
  ^
```

:::

[static-analyzers]: https://en.wikipedia.org/wiki/Static_program_analysis

### Dynamically allocated memory

- Data which we want to persist beyond the execution time of a function
  needs either to be global, or to be allocated in a region of memory
  called the \alert{heap}.
- Memory allocated on the heap is said to be "[dynamically
  allocated][dyn-alloc]"
- The primary C functions used to manage dynamic memory are
  - [\texttt{malloc}][malloc], for allocating memory, and
  - [\texttt{free}][free], for releasing it.

[dyn-alloc]: https://en.wikipedia.org/wiki/C_dynamic_memory_allocation
[malloc]: https://en.cppreference.com/w/c/memory/malloc
[free]: https://en.cppreference.com/w/c/memory/free

&nbsp;

::: block

####

\vspace{-0.5em}

```C
void *malloc(size_t size);
void free(void *ptr);
```

:::

::: notes

- and this also lets us allocate arrays for which
  we'll only know the size at run-time -- hence, "dynamic" \
  (as opposed to "static" -- the size of any global variable
  or automatic variable can be known at compile-time).

:::

### Dynamically allocated memory

::: block

####

\small
\vspace{-1em}

```C
#include <stdio.h>
#include <stdlib.h>

int* make_arr(int n) {
  int* arr = malloc(n * sizeof(int));
  return arr;
}
int main() {
  int n;
  printf("How big an array to allocate? ");
  scanf("%d",&n); // usually, prefer
                  // string parsing functions
                  // like strtol
  int* arr = make_arr(n);
  for(i = 0; i < n; i++)
    arr[i] = n;
  free(arr);
}
```

:::

\footnotesize
\vspace{-1em}

(See cppreference.com for details of [\texttt{strtol}][strtol].)

[strtol]: https://en.cppreference.com/w/c/string/byte/strtol

### Dynamically allocated memory

- Once a pointer has been `free`d, using that pointer's value at all --
  even without dereferencing it -- is undefined behaviour.

  ::: block

  ####

  \small
  \vspace{-1em}

  ```C
  int *p = malloc(sizeof(int));
  free(p);
  if (p == NULL) {
    // ...
  ```

  :::

- So is calling `free` on a pointer more than once.

- Attempting to read from `malloc`ed memory before it has been
  initialized results in an "indeterminate value" -- not undefined,
  but almost certainly not what you want

::: notes

- malloc indeterminate - see C11, 7.22.3.4 The malloc function

:::


<!--
  vim: tw=92 :
-->
