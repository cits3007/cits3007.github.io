---
title:  CITS3007 lab  8 (week 9)&nbsp;--&nbsp;Testing
numbersections: true
---

It is strongly suggested you review (or complete, if you have not done so)
the labs and lectures for weeks 1-9 *before* attempting this lab.

This lab explores binary file formats, and the role of testing in secure software
development.

## 1. Reading and writing binary data

In C programming, working with files to store and retrieve data is a fundamental task.
You have already encountered **text files**, which store data as a sequence of characters,
encoded in a specific character set (for instance, [ASCII][ascii] or
[UTF-8][utf]) -- the `.c` and `.h` source files we use
for C programming are examples of such files.
Such files are also used for configuration files and some documents, and can be opened and
modified with text editors such as `vim`.

**Binary files**, on the other hand, do not (primarily) contain human-readable text.
Rather, they contain data that can only be easily read or displayed using a program,
including images (such as [JPEG][jpeg] or [PNG][png] images), executables (which come in
formats like [ELF][elf], used on Linux, and [PE][pe], used on Windows), and binary
document formats (like [MS Word][ms-word] or [Adobe PDF][pdf]).
They can also be used to store structured records (which, in C, we would describe and
manipulate using structs).
If you open a binary file with a text editor like `vim`
(try opening an executable you have creating in one of the previous labs, for instance),
you will see a jumble of
non-human-readable characters and symbols. Unlike text files, binary files lack a clear,
human-interpretable structure when viewed in a text editor -- the formats they are in are
optimized for efficient processing by programs, not for human readability.

[ascii]: https://en.wikipedia.org/wiki/ASCII
[utf]: https://en.wikipedia.org/wiki/UTF-8
[jpeg]: https://en.wikipedia.org/wiki/JPEG
[png]: https://en.wikipedia.org/wiki/Portable_Network_Graphics
[elf]: https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
[pe]: https://en.wikipedia.org/wiki/Portable_Executable
[ms-word]: https://en.wikipedia.org/wiki/Microsoft_Word
[pdf]: https://en.wikipedia.org/wiki/PDF

When working with file formats, you will often encounter the terms "serialization" and
"deserialization" (sometimes called "marshalling" and "unmarshalling").
**Serialization** refers to the process of converting complex data structures, such as
objects or structs in a programming language, into a sequence of bytes that can be easily
written to a (typically binary) file or transmitted over a network.
The serialized data represents the original data's structure and values in (ideally) a
compact and platform-independent manner.
Conversely, **deserialization** is the process of reconstructing complex data structures
from the serialized binary data. The structs and formats we use in this lab
(and in the project) are very simple, but complex structs could included nested
structs, unions, and pointers to other structs, making the tasks of serialization
and deserialization more difficult.

C has the functions the [`fread`][fread] and [`fwrite`][fwrite] functions for reading
and writing binary data to a file. The linked [cppreference.com][cppref] pages show how the two
functions can be used to read and write an array of `double`s. They can also be used
to read and wrote whole structs.

[fread]: https://en.cppreference.com/w/c/io/fread
[fwrite]: https://en.cppreference.com/w/c/io/fwrite
[cppref]: https://en.cppreference.com

For instance, consider the following `bank_account` struct:

```c
struct bank_account {
    int acct_num;
    char acct_name[20];
    double acct_balance;
};
```

This struct represents information about a bank account, and consists of an integer
(`acct_num`) for the account number, a character array (`account_name`) to store the
account holder's name, and a floating-point number (`acct_balance`) for the account
balance.

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em;">

<center>**File format complications**</center>

Note that in a more realistic example, we [would not use a `double`][no-doubles]
to represent currency.
When serializing or deserializing a struct, we also would not use the type
`int`, the size of which can vary from platform to platform.
We would either
amend the struct so that it uses an [exact-sized integer type][exact] like
`uint32`, or would need to cast to such a type while serializing.

[no-doubles]: https://stackoverflow.com/questions/3730019/why-not-use-double-or-float-to-represent-currency#3730040
[exact]: https://en.cppreference.com/w/c/types/integer

Finally, we would have to account for the **endianness** of different platforms.
"Endianness" refers to the byte-ordering scheme used to store multi-byte data types in RAM.
In little-endian systems, the least significant byte is stored first, while in big-endian
systems, the most significant byte comes first.

For example, consider the decimal number 17,412. If stored in a 2-byte short, this
number would be stored with the value 172 in the most significant byte (MSB), and
67 in the least significant byte (LSB) (since $(172 \times 256) + 67 = 17,412$).
But in what order in memory would those two bytes be in?

- On a **little-endian** system, the LSB (67) would be stored at the lower memory address,
  followed by the MSB (172) at the higher memory address. So, in memory, it would look like this:

  | Address | Value  | Description |
  | ------- | -------|-------------|
  | 1000    | 67     | LSB         |
  | 1001    | 172    | MSB         |

- On a **big-endian** system, the MSB (172) would be stored at the lower memory address,
  followed by the LSB (67) at the higher memory address. So, in memory, it would look like
  this:

  | Address | Value  | Description |
  | ------- | -------|-------------|
  | 1000    | 172    | MSB         |
  | 1001    | 67     | LSB         |

Larger integer types will similarly be stored in "reverse" order on little-endian
systems.
If we had a 4-byte integer type, with the bytes from most to least significant being
B1, B2, B3, and B4, then on a little-endian system, they would be stored in the
order "B4 B3 B2 B1" in memory, and on a big-endian system, in the order "B1 B2 B3 B4".

The x86-64 architecture uses little-endian byte ordering, which is the most common byte
ordering used in processors today; examples of *big-endian* systems include the
[PowerPC][powerpc] architecture (used for some early Apple Macintosh computers) and
mainframes like the IBM [Z-series][ibm-z]. Additionally, network protocols (such as
the [Ethernet][ethernet] and [IP][ip] protocols)
typically use big-endian byte order for data transmission (to the extent that
big-endian is often referred to as "network byte order").

[powerpc]: https://en.wikipedia.org/wiki/PowerPC
[ibm-z]: https://en.wikipedia.org/wiki/IBM_System_z
[ethernet]: https://en.wikipedia.org/wiki/Ethernet
[ip]: https://en.wikipedia.org/wiki/Internet_Protocol

What byte ordering is used in binary file formats varies -- a file format could
use big-endian, little-endian, or even (rarely) both in the same file. Some examples
are:

- The Portable Network Graphics (PNG) format specifies a big-endian byte order for certain
  fields, regardless of the platform. Little-endian computers will have to do some
  re-ordering of bytes when reading from or writing to this format.
- The Windows Bitmap (BMP) file format used for storing bitmap images specifies
  little-endian byte order for various data structures within the file.

A file format could also specify that it uses the "native endianness" of the platform
the file was created on, but then would not be portable between systems of different
endianness.

For this laboratory (and for the project) we will assume that integer types are to
be stored on disk in little-endian order. This means we can directly use the `fread`
and `fwrite` functions to write integer types, without having to do any byte-reordering.


</div>

### 1.1 Writing and reading a bank account struct

Code for this lab can be found in the `lab08.zip` file, and
includes the following program, `write_bank_account.c`:

```{.c .numberLines}
#include <stdio.h>
#include <stdlib.h>

struct bank_account {
  int acct_num;
  char acct_name[20];
  double acct_balance;
};

int main() {
  // a bank_account instance
  struct bank_account account = {123456, "John Doe", 1000.50};

  const char * filename = "bank_account.bin";

  // open binary file for writing
  FILE *ofp = fopen(filename, "wb");

  if (ofp == NULL) {
    perror("Error opening file");
    exit(EXIT_FAILURE);
  }

  // write 'account' to file; there's 1 element to write,
  // which has size 'sizeof(struct bank_account)'.
  size_t els_written = fwrite(&account, sizeof(struct bank_account), 1, ofp);

  if (els_written != 1) {
    perror("Error writing to file");
    fclose(ofp);
    return 1;
  }

  fclose(ofp);

  printf("Bank account struct written to '%s'\n", filename);

  exit(EXIT_SUCCESS);
}
```

If we were writing an array of `bank_account` structs, the return value of
`fwrite` would be the number of elements written. Here, since we have just
one struct, we expect to get back the result 1; as with any C function, it's
import to always check the return value of `fwrite` to make sure an error
hasn't occurred.
You can compile the program with the command:

```
$ make CC=gcc CFLAGS='-std=c11 -pedantic -Wall -Wextra -Wconversion' write_bank_account.o write_bank_account
```

Run the program; it will create a binary file named `bank_account.bin` containing the serialized
`bank_account` struct. Since we can't view binary files easily using `less` or `vim`, take
a look at the contents with the program `xxd`:

```
$ xxd bank_account.bin
00000000: 40e2 0100 4a6f 686e 2044 6f65 0000 0000  @...John Doe....
00000010: 0000 0000 0000 0000 0000 0000 0044 8f40  .............D.@
```

[`xxd`](https://linux.die.net/man/1/xxd) produces a hexadecimal dump of binary files,
showing both hexadecimal and ASCII representations of the data; this is handy for
debugging and verifying the contents of binary files. The value 123456 is
`0x0001e240` in hexadecimal notation, and we can see the first four bytes of the
file contain this number in little-endian order: `40e2 0100`.



The 20 bytes after that are the string "John Doe" -- in hex, "`4a6f 686e 2044 6f65`".
In the output shown above, we then see a series of zero bytes, and the last 8 bytes
of the file (`0000 0000 0044 8f40`) represent the double 1000.50.

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em;">

<center>**Python for debugging and verifying binary formats**</center>

Although our code is written in C, it can often be convenient to use
Python to verify and interpret the contents of binary files.

For instance, we can use Python's `hex()` function to get numbers in
hexadecimal format. If we run `python3` to get a Python prompt, then
typing `hex(123456)` at the prompt should
display the result `0x1e240`, which is `0x0001e240` when padded with
zeroes to 4 bytes.

We can also use the [struct][struct] library to find out what the double
1000.50 looks like as a sequence of bytes.

[struct]: https://docs.python.org/3/library/struct.html

Try the following at the Python prompt:

```
>>> import struct
>>> struct.pack('d', 1000.50).hex()
'0000000000448f40'
```

The `'d'` indicates that we want to convert something to bytes as if it
were a C `double`. In the output,
the "b" before the string means it represents an uninterpreted sequence of
bytes; here the output is indicating that the double 1000.5 will convert
to the sequence of bytes `0000 0000 0044 8f40`, exactly what we saw in
the output from `xxd`.

It often is also possible to perform tasks like this using the GDB debugger, which we
examined in the second lab; but for many programmers, using Python will be more
convenient.

</div>

The `read_bank_account.c` program contains corresponding code for reading and
displaying the contents of our "`bank_account.bin`" file:

```{.c .numberLines}
#include <stdio.h>
#include <stdlib.h>

struct bank_account {
  int acct_num;
  char acct_name[20];
  double acct_balance;
};

int main() {
  // a bank_account instance to store the read data
  struct bank_account account;

  const char * filename = "bank_account.bin";

  // open the binary file for reading
  FILE *file = fopen(filename, "rb");

  if (file == NULL) {
    perror("Error opening file");
    exit(EXIT_FAILURE);
  }

  // read from the file
  size_t els_read = fread(&account, sizeof(struct bank_account), 1, file);

  if (els_read != 1) {
    perror("Error reading from file");
    fclose(file);
    exit(EXIT_FAILURE);
  }

  fclose(file);

  // display the account information
  printf("Account Number: %d\n", account.acct_num);
  printf("Account Name: %s\n", account.acct_name);
  printf("Account Balance: %.2f\n", account.acct_balance);

  return 0;
}
```

If you compile and run it, you should see displayed exactly the struct contents
that we wrote in to the file.

Exercise

:   Amend the two programs so that instead of reading and writing a single struct,
    they read and write an array of 4 such structs. Compile and run them, and
    check that the output you get is what you expect.

Exercise

:   Our programs thus far both store a fixed number of records to a file
    (one struct in the initial `write_bank_account.c` and `read_bank_account.c` code,
    four structs in the code written for the previous exercise). How could
    we amend our programs (and the file format used) so that the file format included
    a count of the number of records stored?


By using these programs as examples, and reading the documentation on the
[cppreference.com][cppref] site for `fread` and `fwrite`, you should be able to
develop functions for your project which read and write in the file formats
specified. In some cases, you'll be reading or writing single scalar values (like
the 64-bit, unsigned integer value found at the start of the `ItemDetails` file format),
in other cases, whole structs or perhaps parts of structs.


## 2 Project code and test code

You can download the header file for the project, together a `.c` file of "skeleton"
code (with implementations to be filled in by you) from the CITS3007 website, at

- <https://cits3007.github.io/assignments/project-code.zip>

For this lab, it's suggested you download the zip file into your CITS3007 development VM
(e.g. using `wget`).

Note that the header file does not need to be submitted, but you will eventually
submit the contents of your `.c` file. It's recommended that you track changes to your
`.c` file with version control so that you can easily "roll back" to previous versions in
case you make mistakes in your code.

Also supplied are some sample files in the formats used by the project, and basic test
code that you can use to test some of the functions you need to implement for the project.

<div style="border: solid 2pt orange; background-color: hsl(22.35, 100%, 85%, 1); padding: 1em;">

<center>**Final project submission**</center>

When making a final submission for your project, do not submit any content other than your
completed `p_and_p.c` file, and do not amend the `p_and_p.h` file
(since then, your code may be relying on declarations or definitions that contradict those
in the standard `p_and_p.h` file -- which is what your submitted code will be compiled
against).

If you do submit additional content, then at best, it will simply be ignored by the
markers (and you are may receive a lower mark for code style and clarity).
At worst, if the additional content causes compilation errors,
you may receive a mark of 0 for the coding portion of the project (though you can still
receive marks for style and clarity for the portions of the project you have attempted).

Your submitted `p_and_p.c` file file should include any necessary `#include`s and
preprocessor definitions necessary for your code to compile and execute properly.

</div>

## 3. Testing, documentation and APIs


We will be using the [Doxygen][doxygen] documentation tool. Install it in your VM
with

```
$ sudo apt-get update
$ sudo apt-get install --no-install-recommends doxygen graphviz
```

[doxygen]: https://doxygen.nl



We will also make use of the [Check][libcheck] unit testing framework.
Install it with

```
$ sudo apt-get install check
```

[libcheck]: https://libcheck.github.io/check/index.html



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
  &nbsp;&nbsp; However, to keep things simple in this project, we
  will document our functions in the `.c` file which contains
  your code to be submitted.


### 3.1. Documenting an API

Typically, the specification documentation for functions
is contained in documentation *blocks*: specially formatted
comments or annotations which can be extracted and displayed by
documentation tools. For example, we might document an
`adjust_score` function for one of WotW Inc's other games, Curdle,
with a documentation block like the following one:

```c
/** Adjust the score for player `player_name`, incrementing it by
  * `score_to_add`. The player's current score (if any) and new score
  * are stored in the scores file at `/var/lib/curdle/scores`.
  * The scores file is owned by user ID `uid`, and the process should
  * use that effective user ID when reading and writing the file.
  * If the score was changed successfully, the function returns 1; if
  * not, it returns 0, and sets `*message` to the address of
  * a string containing an error message. It is the caller's responsibility
  * to free `*message` after use.
  *
  * \param uid user ID of the owner of the scores file.
  * \param player_name name of the player whose score should be incremented.
  * \param score_to_add amount by which to increment the score.
  * \param message address of a pointer in which an error message can be stored.
  * \return 1 if the score was successfully changed, 0 if not.
  */
int adjust_score(uid_t uid, const char * player_name, int score_to_add, char **message);
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
Documentation blocks should *always* be included for any function
so that other programmers know how to *use* that function, and can
be as extensive as needed.

For instance, let's suppose
you are using a C library -- the [FLAC library][flac], say, which
allows you to encode, decode and manipulate audio files in the
[FLAC format][flac-format] -- then your primary way of knowing what the functions
in that library do is by referring to the [API documentation][flac-api].
Not only do you not need to know what any inline comments say,
but for commercial software libraries, you might not have any access
to them or to the source code at all.[^commercial-example]

[docstring]: https://peps.python.org/pep-0257/
[rust-annot]: https://doc.rust-lang.org/rustdoc/write-documentation/the-doc-attribute.html
[flac]: https://xiph.org/flac/
[flac-format]: https://en.wikipedia.org/wiki/FLAC
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

<div style="border: solid 2pt orange; background-color: hsl(22.35, 100%, 85%, 1); padding: 1em;">

**Inline commenting of your code**

Do not over-comment your code. Excessive inline comments make your
code harder to read, and will result in a lower mark for code clarity
and style.

In general, you should assume that the person marking your code knows
how to program in C, and does not need to have it explained to them.

</div>


### 3.2. Running `doxygen`

If you change directory to where you have unzipped the test files and code,
you can run `doxygen` (or `make docs`, which has been set up to do the
same thing). The Doxygen tool will use the configuration contained
in the `Doxyfile` configuration file to generate HTML documentation
contained in the `docs/html` subdirectory.

Initially, there are no `.c` or `.h` files to be analysed for documentation
(and trying to run `make docs` will result in an error), so the documentation
will be sparse.
However,
if you copy or move your `p_and_p.h` and `p_and_p.c` files to the
current directory and re-run `doxygen` or `make docs`, then documentation
will be extracted from those files. If you view the file
`docs/html/index.html` in a browser,[^html-viewing] you can view the C
source files in the current project, any structs defined, and function
prototypes and definitions found (try looking under "pitchforks-and-poltergeists" /
"Files" / "File List" / "`p_and_p.h`" in the left-hand navigation sidebar).
Initially, the only documentation blocks are for the structs in `p_and_p.h`,
but if you add documentation for your own functions and re-run Doxygen,
your documentation will be added. The Doxygen documentation can also be
a useful way of orienting yourself in a new C (or other language) project, since it links
and indexes all source files, function and data-type definitions found.
Often, IDEs or editors will provide similar functionality, but in lieu of them,
Doxygen can be a useful tool.

[^html-viewing]: Depending on your setup, you may need to copy the `docs`
  directory from your guest VM to your host machine before you can view
  the files in a browser.\
  &nbsp; One way of copying the files is to install the "vagrant-scp" plugin:
  you can do so by running the command `vagrant plugin install vagrant-scp`
  on your host machine.\
  &nbsp; Once the plugin is installed, if you `cd` to a directory where
  you have a Vagrantfile for the CITS3007 development environment,
  then running a command like `vagrant scp :myproject/docs ./` will
  copy the `docs` directory from the VM to your host. (Replace `myproject` with
  the path to your code.)
 
Try adding a documentation block for one of the functions you need to implement,
and re-generating the HTML files.
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


### 3.3. Building the skeleton code

You can build the skeleton code by `cd`-ing to the
directory where you've unzipped the test code and data files and running `make all`.
The output you see from `make` will be quite "noisy", because our
empty file implementations have a lot of unused parameters in them.

The following command filters out those unused parameter warnings and
might initially be useful for making the output easier to read:

```
$ make CFLAGS="-Wno-unused-parameter" clean all
```


### 3.4. Writing and running tests

Once a specification is available for a function, it's possible to
start writing tests for it. A test is meant to look at the
behaviour of a system or function in response to some input,
and make sure that it aligns with what we expect.

It can be useful to think of a test as being composed of three parts

1. **Arrange**
2. **Act**
3. **Assert**

In C, we typically also need to add a fourth part, "**Cleanup**".
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

The "code provided for this lab contains tests for some of
functions you will need to write for the project.
All but the first  test have been commented out -- as you complete
implementations for various functions, you can try uncommenting more
of the tests. You will also likely need to write your own tests; you
can use the existing ones as a basis for this.

<div style="border: solid 2pt orange; background-color: hsl(22.35, 100%, 85%, 1); padding: 1em;">

**Purpose of the provided tests**

Passing the tests provided here does **not**
guarantee that you've correctly implemented the specification for
`adjust_score()`. You will have to use your own judgment and programming
skills to determine that, and should write your own tests which give you
confidence in your code.

The tests are provided only as examples -- you need not use them at
all if you prefer not to. Your project will be assessed on how
successfully you implement `adjust_score()`, and on the general quality
of your code -- not on whether you've used [Check][libcheck] to do
your testing.

</div>

If you `cd` into test `tests` directory and run `make test`,
the Makefile will

- build object files for your `p_and_p.c` code (if not already done)
- use the [`checkmk`][checkmk] tool to generate "`.c`" files from the
  tests contained in the `.ts` files, and
- compile and run the tests.

[checkmk]: https://manpages.ubuntu.com/manpages/focal/man1/checkmk.1.html

The use of `checkmk` isn't necessary -- we could write the tests
by hand in C if we wanted -- but it saves us having to write some
repetitive boilerplate code.

Try running

```
$ make test
```

to see the Check framework in action. You should see that 1 tests
was run, and that one test (`arithmetic_testcase:arithmetic_works`)
passed. Start un-commenting the other tests as you progress through
the project.

Check can output results in [multiple formats][test-output].
You might find the output of the following command slightly more
readable:

```
$ make all && CK_TAP_LOG_FILE_NAME=- prove --verbose ./check_p_and_p
```

Here, `make all` builds our test-runner program. `CK_TAP_LOG_FILE_NAME=-`
tells it to output results using the ["TAP" format][tap] for test
results, and `prove` is a Perl program which formats those results
and summarizes them (see [`man prove`][prove] for details).
Leaving off the "`--verbose`" flag to `prove` will result in just
a summary being printed.

[test-output]: https://libcheck.github.io/check/doc/check_html/check_4.html#Test-Logging
[tap]: https://testanything.org
[prove]: https://linux.die.net/man/1/prove

To see one of the Google sanitizers in action, edit the
`check_p_and_p.ts` file and uncomment the block of code
starting with

```C
//#tcase deliberately_bad_testcase
//
//#test go_out_of_bounds
```

and then run `make test` again. The `strlen()` function
in that test goes out of bounds due to an unterminated string,
but the bad behaviour is detected by the AddressSanitizer.
If this happens while developing your program, it means
you'll need to debug your program using `gdb`. The output of
AddressSanitizer includes a stack trace which reveals where
the bug was detected. If running

```
$ gdb -tui ./check_p_and_p
```

to track down what causes a bug, you probably will want to set the
environment variable `CK_FORK` to "`no`", like this:

```
$ CK_FORK=no gdb -tui ./check_p_and_p
```

This inhibits Check's usual behaviour of `fork`ing off a separate
process in which to run each test.

### 3.5. Some project tips

- You'll likely want to use `fread` and `fwrite` to read and write binary data to
  a file.
- If you have a file descriptor, but need a `FILE*` (or vice versa) -- check out the
  `fdopen` and `fileno` functions for converting between the two.
- If reading or writing from a `FILE*`, it's a good idea to call `fflush` before
  finishing the current function -- especially if the `FILE*` was obtained using `fdopen`,
  since it may contain buffered input or output that hasn't yet been fully
  read or written.


<!--

### 2.6. "Mock" objects

It's often a good idea to make our tests fast, so they're quick and easy
to run. If tests take too long to run, developers will avoid running
them, which leads to poor quality code. When writing *unit* tests -|-
tests which examine the behaviour of a very smal part of the system -|-
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
do not test the `adjust_score()` function itself.
The specification for that function says that it uses a particular
file, "` /var/lib/curdle/scores`", to store scores in, that it should
be run as part of a setuid program, and that the `curdle` user
should be owner of the program executable.

How might we test these requirements?

-->

<!-- vim: syntax=markdown tw=90
-->
