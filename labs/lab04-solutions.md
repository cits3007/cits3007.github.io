---
title: |
  CITS3007 lab 4 (week 5)&nbsp;--&nbsp;`setuid` vulnerabilities&nbsp;--&nbsp;solutions
include-before: |
  ```{=html}
  <style>
    /* custom figcaption style - pandoc doesn't give enough space */

    figcaption {
      font-weight: bold;
      text-align: center;
      font-style: italic;
      margin-top: 1.5rem;
    }

    .centered {
      margin: 0 auto;
    }
  </style>
  ```
---

It's recommended you complete this lab in pairs, if possible, and
discuss your results with your partner. Any exercises you don't complete
during the lab, you should finish in your own time.

Programs and commands in this lab are targeted at a Linux environment.
Ideally, this should be the standard CITS3007 development environment, but they
should work in any environment, based on a recent Linux distribution,
in which you can obtain `root` privileges.

## 1. `setuid`

Recall from last week's lab that `setuid` ("set user identity") is an
important security mechanism on Unix operating systems,
and that `setuid` programs execute with the privileges of the *owner of
the executable file* rather than the privileges of the user executing
the command.

We looked at how you can add `setuid` functionality to an executable
file (using `chmod u+s`), and some best practices to keep in mind when
writing `setuid` programs --
the ["Principle of Least Privilege"][secure-howto] (POLP), and a number of
guidelines from the [Software Engineering Institute][permission-relinq]
(SEI) at Carnegie Mellon University.

[secure-howto]: https://dwheeler.com/secure-programs/3.012/Secure-Programs-HOWTO/minimize-privileges.html {target="_blank"}
[permission-relinq]: https://wiki.sei.cmu.edu/confluence/display/c/POS37-C.+Ensure+that+privilege+relinquishment+is+successful  {target="_blank"}

One of the SEI guidelines is an important part of secure
programming, independent of its application to setuid programs:
[*always* check the return value][check-ret] of any C function that can
fail. If you don't check the return value from such a function, then
it may not have done what you expected, putting your program into
an unknown and potentially unsafe state.

[check-ret]: https://wiki.sei.cmu.edu/confluence/display/c/EXP12-C.+Do+not+ignore+values+returned+by+functions {target="_blank"}

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

::: block-caption

Best practices and CITS3007 assessments

:::

In lab 1, we suggested you maintain a set of lab notes, consisting of useful commands, best
practices etc. that you come across in labs, so that you'll be familiar with them for later
assessments.

The above guideline ("always check the return value of any C function that can fail") is an
example of something you should probably record: for future assessments, we will simply
assume that you are familiar with it.

You'll remember best practices like these better if you try constructing your own example
programs which do (or don't) abide by them. (Constructing your own examples is a type of
[**active learning**](https://en.wikipedia.org/wiki/Active_learning), and results in far better
recall than simply reading content and trying to remember it. You can learn more about active
learning via [links provided](https://cits3007.github.io/faq/#how-can-I-do-well-in-CITS3007)
on the CITS3007 website.)

If you're unsure whether some guideline or best practice applies when, for instance,
completing the project, you can always post to the discussion forum and ask.

</div>

### 1.1 File permissions and the POLP

One aspect of the Unix access control system can come in handy when
trying to apply the Principle of Least Privilege:

- File permissions are checked when a file is *opened*, not when an open
  file is used.

Once you have obtained a descriptor (the more general term is ["file handle"][handle]) to an open file
on Unix systems, you can generally continue to read or write via that
file descriptor regardless of what happens to the original file -- the
file may be renamed, have its permissions changed, or even be deleted,
and it won't affect your access to the file contents.

[handle]: https://en.wikipedia.org/wiki/Handle_(computing)

This is partly a side effect of the way filesystems work on Unix: on
Unix systems, there's a structure called an *inode* which you can think
of as being an intermediary between a file path and the file content.

(How Unix filesystems work should be familiar to you from your prior
[systems programming][cits2002] study.
If you need a refresher, refer to the boxed section
[below](#unix-filesystem-implementation) for suggested resources.)

The inode specifies things like the file owner and permissions, and
"points to" a set of blocks on disk which is the file content. Multiple
file paths can point to the same inode (they are called "hard links");
deleting a file path deletes its directory entry, but the inode still
exists (as does the file content) as long as at least one directory
name or open file-handle still points to that inode. The diagram below shows two
distinct file paths  (`/home/alice/myfile.txt` and `/home/alice/files/myotherfile.txt`)
which point to a single inode, which itself points to a number of disk blocks.


`<div style="display: flex; justify-content: center;">`{=html}

![inodes in a Unix filesystem](images/inodes.svg ""){ width=80% }

`</div>`{=html}

Let's demonstrate that an inode still exists, as long as there is a "live"
reference to the inode.

1.  Compile the following program, `keep_open.c`:[^compiling] [^safety]

    ```{.c .numberLines}
    // keep_open.c

    #include <stdlib.h>
    #include <stdio.h>

    #include <sys/types.h>
    #include <sys/stat.h>
    #include <unistd.h>
    #include <fcntl.h>

    #define BUF_SIZE 1024

    char buf[BUF_SIZE];

    void fail(const char* mesg) {
      perror(mesg);
      exit(EXIT_FAILURE);
    }

    int main(int argc, char **argv) {
      argc--;
      argv++;

      if (argc != 1) {
        fprintf(stderr, "expected 1 arg, FILENAME\n");
        exit(EXIT_FAILURE);
      }

      printf("opening file\n");
      int fd = open(argv[0], O_RDWR);
      if (fd == -1)
        fail("couldn't open file");

      printf("running 'tail'\n");
      system("tail -f /dev/null");

      // read up to a buffer's worth
      ssize_t read_res = read(fd, buf, BUF_SIZE);
      if (read_res == -1)
        fail("couldn't open file");

      printf("contents read: %s\n", buf);

      close(fd);
    }
    ```

    This program opens a file specified on the command line (line 28);
    it then keeps it open, and calls `system()` to run the command
    "`tail --follow /dev/null`". This invocation of "tail" won't exit until
    the `tail` process is killed -- it tries to continually wait for new
    input ("`--follow`") from a file that has nothing in it ("`/dev/null`").
    (Using `tail` in this fashion is a common way of keeping a program
    running that would otherwise exit.)

[^compiling]: From this point on in the unit, we will assume you know how
  to create a new directory to store files for a lab,
  how to create, compile and link a C program using GCC and/or GNU Make,
  and how to pass appropriate compilation flags to GCC.\
  If you are unsure, refer back to the previous labs.

[^safety]: This program does not validate its input, and makes
  use of the `system()` function -- but it's assumed you are
  the only person using the program, are not running it on a
  sensitive system, and can tolerate the risk.

2.  Check your current disk usage, using the command `df -h .`.

    You should see something like the following output (it may vary
    somewhat depending on what virtualisation software you're using,
    and how much of the filesystem you've already used):

    ```bash
    $ df -h .
    Filesystem      Size  Used Avail Use% Mounted on
    /dev/vda3       124G  4.4G  111G   5% /
    ```

    This tells us that the filesystem has a capacity of 124&thinsp;GB, and
    that 4.4&thinsp;GB worth of files already exist.

3.  Create a file called "myfile" using the `dd` program:[^dd]

    ```bash
    echo hello world > myfile
    # append 2GB of zeros to the file - may take a minute to run
    dd status=progress oflag=append conv=notrunc if=/dev/zero bs=1M of=myfile count=2048
    ```

[^dd]: (See `man dd` for details of the `dd` command, which is used for
  copying file content. `oflag=append` tells `dd` to append the data
  it gets from `/dev/zero` to the output file, and `conv=notrunc`
  tells it not to *truncate* the output file when it calls `open()`.

4.  Now check your current disk usage again, using `df -h .`.

    You should see output like the following:

    ```bash
    $ df -h .
    Filesystem      Size  Used Avail Use% Mounted on
    /dev/vda3       124G  6.4G  111G   5% /
    ```

    This is similar to the output from step 2, but now we are using 6.4&thinsp;GB of disk
    space -- our new 2&thinsp;GB file `myfile` is taking up space on the system. (If
    you aren't getting the expected output, check to make sure that `myfile`
    was properly created and is of the right size. `du -sh myfile` should report that
    the file exists and is around 2&thinsp;GB in size.)

[^ssh]: If you are using Vagrant -- whether on Linux, Windows or MacOS --
  then you can start a new SSH session
  by opening a new terminal window, `cd`-ing to the directory where your
  Vagrantfile is located, and running `vagrant ssh`. \
  &nbsp; &nbsp;   If you are accessing your development environment in some other way
  (e.g. via Windows WSL or VS Code), and are not sure how to open a new
  terminal window, ask your lab facilitator for assistance.

5.  Run your compiled program:

    ```
    $ ./keep_open ./myfile
    opening file
    running 'tail'

    ```

    The program should then "hang" -- this is expected. Open a new
    terminal window and/or start a new SSH session[^ssh] to your VM in
    order to complete the next steps -- ideally, keep an eye also
    on what is happening in the original terminal window.

6.  Change the ownership of `myfile` to root, and allow only root
    to read or write to it:

    ```
    $ sudo chown root:root myfile
    $ sudo chmod g-rwx,o-rwx myfile
    $ ls -al myfile
    -rw------- 1 root    root    2147483660 Aug 20 10:42 myfile
    ```

    And delete it:

    ```
    $ sudo rm myfile
    ```

    The file should now be completely inaccessible (outside of the
    use of disk forensic techniques) -- once we ran `chmod`, no-one but
    `root` could read
    or write to it, and in any case the file is deleted.

    But if you check how much disk space is being used, you'll see
    that despite deleting the file, disk usage hasn't changed:

    ```
    $ df -h .
    Filesystem      Size  Used Avail Use% Mounted on
    /dev/vda3       124G  5.4G  111G   5% /
    ```

7.  Now, we'll kill the `tail` command that is running:

    ```
    $ pkill -f 'tail -f /dev/null'
    ```

    In the terminal where your `keep_open` program was running, you
    should now see the following:

    ```
    opening file
    running 'tail'
    contents read: hello world
    ```

    Once we killed the `tail` commend, the program was able to progress
    further, using the `read` system call to read data from the file,
    and `printf` to display that data.

    This is despite the fact that, in another terminal, we'd altered
    the file's ownership and permissions, and deleted it using `rm`.

    The `keep_open` program had already obtained a "handle" to the inode where `myfile`'s
    metadata was stored, and any subsequent actions we performed on the file
    didn't affect that handle at all.
    The program had no difficulty reading a line from the
    file, even though the filepath had been removed using `rm`; the open handle kept
    the inode "alive".

    But if we *now* check the disk space on our filesystem:

    ```
    $ df -h .
    Filesystem      Size  Used Avail Use% Mounted on
    /dev/vda3       124G  4.4G  111G   4% /
    ```

    then we should see that it has decreased by 2&thinsp;GB (from 6.4&thinsp;GB back to 4.4&thinsp;GB, in
    the example above). Once the open file-handle was closed, the
    kernel discovered that the inode for the file was unused --
    no other programs had it open, and no directory entries "pointed"
    to it.

    Therefore, the inode was removed, and the disk blocks used by it
    were reclaimed.


<div id="unix-filesystem-implementation" style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

::: block-caption

Unix filesystem implementation

:::

A basic familiarity with how filesystems are implemented is part of the assumed knowledge
for this unit -- you should already be familiar with the structure of filesystems and how
file handles work from a unit like [CITS2002 Systems Programming][cits2002].

[cits2002]: https://teaching.csse.uwa.edu.au/units/CITS2002/ {target="_blank"}

If you need a refresher, refer to your operating systems textbook. Where exactly
filesystems are discussed will depend on the textbook, but by way of example, in
Arpaci-Dusseau et al, [*Operating Systems: Three Easy Pieces*][os3ep], the relevant portions
are section 39, "Files and directories", and section 40, "File system implementation".
(These sections also discuss some concepts relevant to access control systems, which we've
looked at in lectures, and TOCTOU/concurrency bugs, which we will look at in future
lectures.)

[os3ep]: https://pages.cs.wisc.edu/~remzi/OSTEP {target="_blank"}

</div>



#### Consequences for software security

What are the consequences of all this for software security?
Several things:

*On Unix-like systems, permissions are only needed (and checked) at `open` time*

:   We need appropriate permissions to open a file, but once it's
    been opened, no permissions are needed to read or write to
    the open file via its file descriptor.

    (In fact, the file descriptor acts as a sort of *capability*[^capability] --
    we can actually pass it from program to program, and it carries
    with it the "rights" to read and write from the open
    file.[^passing-fd])

    So for a setuid program: if the only reason we needed elevated
    privileges was to open a file for reading or writing, then once
    the file is open -- we can (and *should*!) drop the privileges.

[^capability]: A capability is some sort of token or handle that refers
  to an object or resource (in this case, a file), and carries with it rights
  or permissions to perform particular actions on that object.
  For more details, see the Wikipedia article on
  [capability-based security](https://en.wikipedia.org/wiki/Capability-based_security){target="_blank"}.

\

*Permission changes can't be retrospective*

:   Any changes you make to a file's permissions will have
    no effect on programs that already have the file open
    (and if malicious programs already have the file open, they may
    have [*exfiltrated*][exfil] the data in it -- sent it to an
    attacker-controlled system).

    You can find out what programs have a file open using
    the [`lsof`][man-lsof] ("list open files") program, but you can't "retract"
    those programs' permissions to use their open files -- the best you
    can do is kill the process.\

[exfil]: https://en.wikipedia.org/wiki/Exfiltration  {target="_blank"}
[man-lsof]: https://man7.org/linux/man-pages/man8/lsof.8.html {target="_blank"}

\

*File paths are unreliable -- do not trust them*

:   The *path* to a file is not a very good way of identifying it reliably and uniquely over
    a period of time. The *inode* is usually the best representation of what we think of as
    "the file", and a file descriptor gives us a "handle" to that inode.

    If you need secure and reliable access to a file, then the usual Unix approach is to
    open the file *once* (giving you a file pointer or file descriptor that links to the
    file's inode), and then to perform all actions (reading, writing, checking file
    permissions) on that file "handle".

#### Unreliability of file paths

Consider the following scenario.
You have a root-owned, `setuid` program -- call it PDFizer -- running as a server, which is
intended to typeset and convert the contents of files to PDF when users send a request for
it to do so -- but only *if* that user would have had permissions to read the original file.

The PDFizer program needs to run as root, because otherwise it wouldn't be able to access
files owned by different users.

Suppose our PDFizer program receives a request from user `bob`, who wants
to typeset the file `/home/bob/myfile.txt`.

And let us suppose our program implements the following
logic:

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

::: block-caption

PDFizer logic

:::

when we receive a request from some user `user` to typeset a file `a_file`:

1. Look at `a_file` and see whether the user has
   permission to read it -- for instance, using the [`stat()` function][man-stat]
   function (the information we're after is in the `st_mode`
   struct member) or the [`access()` function][man-access].
2. If the user does have permission, then `open()` the file, convert it
   to PDF, and send the result to the user.

[man-stat]: https://linux.die.net/man/2/stat {target="_blank"}
[man-access]: https://man7.org/linux/man-pages/man2/access.2.html {target="_blank"}

</div>

So in the case of Bob's request:

1. Look at `/home/bob/myfile.txt` and use `stat` or `access` to see whether user `bob` has
   permission to read it.
2. If so, `open()` the file `/home/bob/myfile.txt`, convert it
   to PDF, and send the result to `bob`.

**Question:**

:   Before continuing, try to answer the following questions: What assumptions
    is the program logic for PDFizer making? And are those assumptions
    sensible ones?

    (Hint: Have we seen any similar examples in lectures? Read the man page for `access()` --
    does it suggest any problems with the program logic to you?)

<details style="margin-bottom: 1rem;" >

<summary>**Click to expand answer**</summary>

<div class="solutions" style="margin: 1rem 0;" >

::: block-caption

Answer

:::

The PDFizer program assumes that
the path `/home/bob/myfile.txt` represents the
same file in both step (1) and step (2).

But in between steps one and two, Bob could have deleted `/home/bob/myfile.txt`
and replaced it with a symbolic link to `/etc/shadow` (which
contains users' passwords). Since our PDFizer program is executing
as root, it will have no difficulty executing step 2, opening a file
which Bob should not have access to, and sending it to Bob as a PDF.

Therefore, the assumption that the file is the same is a *bad* assumption.

You *cannot rely on a file path pointing to the same "file" at
two different times*. Read the recommendation of the Software
Engineering Institute (SEI) about this:
["FIO01-C. Be careful using functions that use file names for
identification"][sei-fname].

[sei-fname]: https://wiki.sei.cmu.edu/confluence/display/c/FIO01-C.+Be+careful+using+functions+that+use+file+names+for+identification {target="_blank"}

This sort of vulnerability is called a "TOCTOU" ("Time Of Check
vs Time Of Use") vulnerability -- between steps (1) and (2)
is a time window that attackers can take advantage of.
(The attacker is also causing the PDFizer program to confuse a symbolic link with an
older file with the same name -- this is sometimes called a
[symlink attack](https://capec.mitre.org/data/definitions/132.html).)

Instead of using the function [`stat()`][man-stat] in step 1 (which takes as argument a file name), we
should have opened the file *first*, obtaining a file descriptor, and then called [`fstat()`][man-fstat]
(which takes as argument a file descriptor) to check the user's permissions.

**Tip: `f`-functions**

If you're about to use a Unix function which operates on a file *path* (e.g.
[`stat()`][man-stat], [`chown()`][man-chown], [`chdir()`][man-chdir]),
it is often worth checking whether there is an equivalent function that operates on a file
*descriptor* (e.g. [`fstat()`][man-fstat], [`fchown()`][man-fchown], [`fchdir()`][man-fchdir])
and is therefore safer.

[man-stat]: https://linux.die.net/man/2/stat {target="_blank"}
[man-chown]: https://linux.die.net/man/3/chown   {target="_blank"}
[man-chdir]: https://linux.die.net/man/3/chdir   {target="_blank"}
[man-fstat]: https://linux.die.net/man/2/fstat   {target="_blank"}
[man-fchown]: https://linux.die.net/man/2/fchown {target="_blank"}
[man-fchdir]: https://linux.die.net/man/2/fchdir {target="_blank"}

**Tip: man page notes**

The man page for the [`access()` function][man-access] warns against using that function,
and suggests an alternative -- but the warning is right at the end of the man page, in
the "Notes" section.

Always read to the end of a man page, to see if there are any warnings or deprecation
notices for a function you are about to use.

[man-access]: https://man7.org/linux/man-pages/man2/access.2.html {target="_blank"}

</div>


<div style="border: solid 2pt orange; background-color: hsl(22.35, 100%, 85%, 1); padding: 1em; margin: 1rem 0;">

::: block-caption

Secure coding practices

:::

In the project for CITS3007, it will be up to *you* to ensure you
follow good secure coding practices -- dropping privileges when
appropriate, calling `fstat()` instead of `stat()`, and checking
the return values of functions that can fail -- and following these
practices will comprise a fair proportion of your mark.

Static analysis programs and bug-finders may identify some of these
problems (and it will be up to you to use them appropriately), but
not all.

The best way to ensure you remember good secure coding practices
while completing the project is to

1. practice them beforehand -- write code that does and doesn't
   follow a particular secure coding practice
2. take notes when you see a practice mentioned, and do a [*code
   review*][code-review] of your project code before submitting
   to make sure you followed them all.

**Reviewing your own code**

Ideally, a code review should be performed by someone other than
the original developer. There is still benefit, however, to
reviewing your own code. It's a good idea to (1) wait a while
between working on code and reviewing it, and (2) don't review the code
using the same display device your wrote it on. Instead, print it
out, or try reading it from a tablet instead of a PC. Otherwise,
there's a strong tendency to "see what you expect to see" instead
of what's actually there.


</div>

</details>

[code-review]: https://en.wikipedia.org/wiki/Code_review {target="_blank"}



[^passing-fd]: There are two main ways file descriptors
  can be passed between programs: (1) a child process
  inherits any un-closed file descriptors from its parent upon a
  `fork()`;
  and (2) file descriptors can be passed using the
  [`sendmesg`][sendmesg] and [`recvmesg`][recvmesg] functions to
  a completely unrelated process.\
  Method (2) is a fairly fiddly process -- a library,
  ["Ancillary"][ancillary] exists which simplifies it.


[sendmesg]: https://linux.die.net/man/2/sendmsg  {target="_blank"}
[recvmesg]: https://linux.die.net/man/3/recvmsg  {target="_blank"}
[ancillary]: http://www.normalesup.org/~george/comp/libancillary/ {target="_blank"}

### 1.2. Relinquishing privileges

In last week's lab, we looked at strategies for applying the
Principle of Least Privilege to setuid programs.
We noted that once privileges have been used for
whatever purpose they were needed, a program should relinquish
them using the `setuid()` function (see `man 2 setuid`).
We also saw that it's easy to make mistakes when relinquishing
privileges -- the SEI's [web page on relinquishing
permissions][permission-relinq] identifies some of the issues.

[permission-relinq]: https://wiki.sei.cmu.edu/confluence/display/c/POS37-C.+Ensure+that+privilege+relinquishment+is+successful {target="_blank"}

Save the following program as `privileged.c` and compile it.


```{ .c .numberLines }
// privileged.c

#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/stat.h>
#include <fcntl.h>

int main() {
  int fd;

  // Assume that /etc/zzz is an important system file,
  // and it is owned by root with permission 0644.
  // Before running this program, you should create
  // the file /etc/zzz first.
  fd = open("/etc/zzz", O_RDWR | O_APPEND);
  if (fd == -1) {
     printf("Cannot open /etc/zzz\n");
     exit(0);
  }

  // Simulate the tasks conducted by the program
  sleep(1);

  // After the task, the root privileges are no longer needed,
  // it's time to relinquish the root privileges permanently.
  setuid(getuid());  // getuid() returns the real uid

  if (fork()) { // In the parent process
    close (fd);
    exit(0);
  } else { // in the child process
    // perform unprivileged tasks

    // Now, assume that the child process is compromised, malicious
    // attackers have injected the following statements
    // into this process

    write (fd, "Malicious Data\n", 15);
    close (fd);
  }
}
```

In the code above, we assume that the file `/etc/zzz` is some
important system file, and that it needs to be protected from
unauthorised tampering (i.e., breaches of integrity). Only
root will have permissions to write to the file.

Our program, `privileged`, will be run by non-root users, but
will be a setuid program, so that it can still amend `/etc/zzz`
when needed. In line 17, it opens the file for reading and writing,
and specifies that any write operations will append to the end
of the file.

It then performs important tasks on the `/etc/zzz` (we simulate these by
calling `sleep()`, at line 24).

Once those tasks are done, we relinquish privileges by calling
`setuid()`, close the file, and spawn a child process to
perform more unprivileged tasks (displaying to the end-user
summaries of what has been done, perhaps).

**Question:**

:   Before even running the program -- can you spot any security
    issues with the code?

    (Hint: consider what has been said in lectures and the previous
    lab about `setuid` programs.)



<div class="solutions">

::: block-caption

Sample solutions

:::

There are several clear problems with the code:

1. In line 24, it does "important tasks" with the `/etc/zzz` file --
   but it doesn't relinquish privileges until line 28.

   If those "important tasks" only needed an open file handle
   (a file descriptor, in this case) to do them, then we
   should have dropped privileges *before* line 24.

   The only reason to keep our root privileges is if we need to
   `open()` more files that only root can access.

2. In line 28, we haven't checked to see whether the call
   to `setuid()` succeeded. If it didn't -- then we still
   have root privileges! Our attempt to drop privileges failed,
   and the best thing we can do at this point is immediately
   terminate program execution (using `exit()` or `abort()`.

3. At line 30, the program spawns a child process -- but
   we haven't yet closed the file descriptor `fd`.
   This means that even though we might have dropped privileges,
   the child program still has full abilities to read
   and write to the file via the file descriptor.

   We should *not* have done this! Unless we have specific
   reasons for doing otherwise, we should `close()` all open
   file descriptors before `fork`ing a child; else the child
   will inherit those file descriptors, and all the capabilities
   that go with them.

   We should also have taken a number of other precautions
   before spawning a child process, such as sanitising the
   environment variables (or just following a recipe laid out
   in the
   [Secure Programming Cookbook for C and C++][cookbook]) --
   but failing to close file descriptors is the most obvious flaw.

[cookbook]: https://www.amazon.com.au/Secure-Programming-Cookbook-C/dp/0596003943


</div>




Once your program is compiled, create the file `/etc/zzz` and restrict
access to it using `chown` and `chmod`:

```bash
$ sudo touch /etc/zzz
$ sudo chown root:root /etc/zzz
$ sudo chmod u=rw,g=r,o=r /etc/zzz
# or chmod 0644 /etc/zzz would have the same effect
```

What permissions does `/etc/zzz` have once you've done this?



<div class="solutions">

**Sample solutions**

It should have read and write permissions for the
`root` user, and read permissions for everyone else.

</div>



Run the `privileged` executable using your
normal user account, and describe what you have observed. Will the file
`/etc/zzz` be modified? Explain your observation.



<div class="solutions">

**Sample solutions**

The file will not be modified. The `privileged` executable is
owned by a normal user, and as yet has no `setuid` bit enabled,
so it cannot be used to modify the `/etc/zzz` file.

</div>



Now give the `privileged` program setuid capabilities.
Change the owner of the `privileged` executable to `root`, and enable
the setuid bit:

```
$ sudo chown root:root ./privileged
$ sudo chmod u+s ./privileged
```

Run the program again -- is `/etc/zzz` modified? Was that the program
designer's intent?



<div class="solutions">

**Sample solutions**

The file will be modified: the owner is root and
the setuid bit is enabled.

From the source code, the program designer clearly did *not* intend
this to happen -- the spawned child process was intended
only to perform unprivileged tasks.

</div>



### 1.3. Discussion of code

When programs are run which use the `setuid` feature,
there are multiple different sorts of "user ID" at play.

- `rUID` -- the real user ID. This means the ID of the user
  who created the process.
- `rGID` -- the real group ID. This means the group ID of the user
  who created the process.
- `eUID` -- the effective user ID. For many executables,
  this will be the same as the `rUID`. But if an executable has the
  `setuid` feature enabled, then the *effective* user ID
  will be different -- it will be whoever owns the executable
  (often, `root`).
- `eGID` -- the effective group ID. This is similar to `eUID`, but
  for user groups. Programs can have a `setgid` feature enabled,
  and the effective group ID can be different from the real group ID
  if it is enabled.

In the code above, paste the following at various spots in the program
to see what the real and effective user ID are:

```
  uid_t spot1_ruid = getuid();
  uid_t spot1_euid = geteuid();
  printf("at spot1: ruid is: %d\n", spot1_ruid);
  printf("at spot1: euid is: %d\n", spot1_euid);
```

(Change `spot1` to `spot2`, `spot3` etc. in the
other locations you paste the code.)
Re-compile the program, give it appropriate permissions,
and run it again -- what do you observe? Why does this happen?

See if you can fix the issues with the program you identified
earlier. (Hint: read the SEI pages, and look up what `man 2 setuid`
says about return values from the function.) Once you've made
your changes, compile and run the program again, and confirm that
your changes prevent the vulnerability.

As an aside: it's not uncommon for a program that needs special
privileges to "split itself into two" using the `fork` system call.
The parent process retains elevated privileges for as long as it needs,
and sets up a communications channel with the child (for instance,
using a [*pipe*][pipe], a [*socket*][socket] or [*shared memory*][shared-mem] -- more on these later,
when we look at [inter-process communication][ipc]).
The parent process has very limited responsibilities, for instance,
writing to a `root`-owned file as needed, say. The child process handles
all other responsibilities (e.g. interacting with the user).

[pipe]: https://en.wikipedia.org/wiki/Named_pipe                    {target="_blank"}
[socket]: https://en.wikipedia.org/wiki/Unix_domain_socket          {target="_blank"}
[shared-mem]: https://en.wikipedia.org/wiki/Shared_memory           {target="_blank"}
[ipc]: https://en.wikipedia.org/wiki/Inter-process_communication    {target="_blank"}



<div class="solutions">

**Answer to "why does this happen"?**

- A call to `fork` spawns a child process. The child process
  inherits the real user ID, effective user ID, and all the open files of the parent process.
  Therefore, if a program designer fails to `close()` files
  the child process shouldn't have access to, it'll still have access.
  A malicious user could take advantage of this to breach
  security of the files.

**Answer to "what are the problems, and how can they be fixed?"**

In this case, a file has been left open when the call to `fork` occurs.
On Unix systems, a user needs correct permissions to *open* a file, and
the OS will check this and prevent the file being opened if a user
has insufficient permissions.
However, once the file has *been* opened, the "file descriptor"
(a small integer that identifies that open file to the OS) can be used
to write to the file, even if the process drops permissions.

The fix is: the file should be closed *before* the call to `fork`.

Furthermore, all functions which could conceivably fail -- such as `setuid` and
even `close` -- should have their return values checked, so that if they
do fail, the program can abort. Otherwise, the program will continue,
and the developer's assumptions about the state of the program could be
incorrect.

</div>



<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

::: block-caption

Temporarily dropping permissions -- saved set-user-ID

:::

The explanation of real and effective user ID given in this lab is a slightly simplified
picture. It's sufficient if you only need to change the effective user ID *once*, in order
to permanently drop elevated permissions.

However, it's also possible to drop permissions *temporarily*, and then get them back again.
If you need to drop permissions temporarily, you can read about what the "saved set-user-ID"
is, and what functions to call, in a paper by Chen et al entitled ["Setuid
demystified"][chen-setuid] (PDF, 2002). (It's a short paper, and sections 1-3 and 5.2 should
be the only ones you need to read.)

[chen-setuid]: https://people.eecs.berkeley.edu/~daw/papers/setuid-usenix02.pdf {target="_blank"}

</div>



## 2. Further reading: Linux capabilities

Traditionally on Unix-like systems, running processes can be divided
into two categories:

- *privileged* processes, which have an effective user ID of 0
  (that is, `root`)
- *unprivileged* processes -- all others.

Privileged processes bypass any permission checks the kernel would
normally apply (i.e., when checking whether the process has permission
to open or write to a file), but unprivileged processes are subject
to full permission checking.

This is a very coarse-grained, "all or nothing" division, though.
Modern OSs may take a finer-grained approach, in which the ability to
bypass particular permission checks is divided up into units, which Linux calls
*capabilities* (this is just Linux's term for them -- they are not
actually the same as ["capabilities" in security theory][capsec]). For example,
the ability to bypass file permission
checks when reading or writing a file could be one privilege; the
ability to run a service on a port below 1024 might be another.

[capsec]: https://en.wikipedia.org/wiki/Capability-based_security  {target="_blank"}

These have been implemented since version 2.2 of the Linux kernel (released in 1999).
They are documented
under [`man capabilities`][man-cap], and [this article][linux-cap-art]
provides a good introduction to why capabilities exist and how they
work.

**Question:**

:   What advantages can you see of a finer-grained permissions system
    over the traditional Unix approach? Are there any disadvantages?


[man-cap]: https://man7.org/linux/man-pages/man7/capabilities.7.html {target="_blank"}
[linux-cap-art]: https://blog.container-solutions.com/linux-capabilities-why-they-exist-and-how-they-work {target="_blank"}

## 3. Moodle exercises

On Moodle, under the section "Week 5 – sanitization" are some C
programming exercises relating to environment sanitization. If you don't
get a chance to complete these during the lab, you should do so in your
own time.


<br><br>

## 4. Credits

The code for the `privileged.c` program is adapted from
<https://web.ecs.syr.edu/~wedu/seed/Labs/Set-UID/Set-UID.pdf>
and is copyright Wenliang Du, Syracuse University.

<br><br><br>


<!--
  vim: syntax=markdown filetype=markdown tw=92 :
-->
