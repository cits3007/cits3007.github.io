---
title: |
  CITS3007 Secure Coding\
  Access control and setuid
author: "Unit coordinator: Arran Stewart"
include-before: |
  ```{=latex}
  %\setbeameroption{hide notes} % Only slides
  %\setbeameroption{show only notes} % Only notes
  \setbeameroption{show notes on second screen=right} % Both
  ```
---


### Highlights

- Access control
  - What is it, how it helps with our security goals
- Access control lists and capabilities
- `setuid` and `setgid`
- "Confused deputy" and TOCTOU vulnerabilities

### Security goals

On most systems, we have more than one user, and more than
one program.

So at the OS level, we want mechanisms for achieving our "C I A" security goals:

- Confidentiality: Users can only see what they need to see
- Integrity: Users can't tamper with things that don't belong to them
- Availability: Users are able to access things that do belong to them

### Authentication and authorization

Two such mechanisms for
achieving our "C I A" security goals:

- Authentication -- confirming the identity
  of someone or something
- Authorization -- checking whether someone is
  permitted to take a particular action
  - e.g. Is user `alice` allowed to modify file `F`? 
  - determines who is trusted, for some particular purpose.

Authorization is enforced by an *access control system*.



### Access control system

- A collection of methods and components that determines who has access
  to particular system resources, and the type of access they have.
  - Ensures all actions on resources are within the security policy

- Supports our goals of achieving confidentiality and integrity

Terminology:

- *object* -- some resource we want to protect.
- *subject* -- entities capable of *doing* things
  (taking actions).
  - For instance, a *user* or a *process* (running program).



::: notes

Technically, we deal not with users but abstractions of human
users. A *principal*. See saltzer and schroeder.

- Saltzer, Jerome H., and Michael D. Schroeder. "The
  protection of information in computer systems." Proceedings of the IEEE
  63.9 (1975): 1278-1308.

  <https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=1451869>

:::

### Access control system

Some examples of the sorts of questions an access control system
should be able to answer:

- Can Alice read the file "`/home/Bob/my-private-journal.txt`"?
- Can Bob open a TCP socket, listening on port 80?
- Can Carol write to row 15 of the database table "`USER-SALARIES`"?

### Access control system

Principle to bear in mind: Principle of Least Privilege

- Programs, users and systems should be
  given enough privileges to perform their
  tasks, and no more

### Access control system issues

- They need to be *efficient*:
  - We can have many file accesses occuring every second,
    so our system needs to be able to make decisions quickly
- We'd like them to be *expressive*:
  - We may want to express complex, high-level policies
    about who can do what

### Matrix model

- In order to determine who can do what, we can imagine
  that we have a matrix listing all objects in the system
  (as columns) and all subjects/users (as rows)

`\begin{center}`{=latex}
![](lect04-images/matrix.eps){ width=8cm }
`\end{center}`{=latex}

- At the intersection, we list the particular
  rights the subject has to do things with that object

### Matrix model

`\begin{center}`{=latex}
![](lect04-images/matrix.eps){ width=6cm }
`\end{center}`{=latex}

- for file objects, *rights* are usually things like "read", "write",
  "execute" etc.
- could be suspend, stop, start, for processes
- listen on a port
- possibly others



::: notes


Lampson - an originator of the matrix model.

- Lampson, Butler W. (1971). "Protection". Proceedings of the 5th
  Princeton Conference on Information Sciences and Systems. p. 437. \
  <https://dl.acm.org/doi/pdf/10.1145/775265.775268>


:::

### Matrix model

The matrix model isn't a *complete* specification ...

- It's an abstraction of rights at one point in time.
- It doesn't tell us how rights can change over time.

### Types of access control system

Who decides what rights subjects have for particular objects?

One answer:

- Individual users can control access to e.g. files that they own \
  $\Rightarrow$ we have a \alert{Discretionary Access Control}
  (DAC) system
- Some system mechanism controls access, and individual users can't
  alter it \
  $\Rightarrow$ we have a \alert{Mandatory Access Control}
  (MAC) system

There are other sorts as well -- e.g. Role Based Access Control (RBAC)
which we don't go into in this unit.

### Types of access control system

Discretionary Access Control (DAC) system:

- Owners of objects set the permissions
- Most common approach
- Poses difficulties for e.g. protecting
  audit logs from sysadmins

Mandatory Access Control (MAC) system:

- Enforced by the OS
- May be appropriate for e.g. Dept of Defence systems
- Implies that superusers/system administrators don't have ultimate
  control
- Used e.g. to ensure not even sysadmins can tamper with the OS kernel,
- To be effective, needs hardware support: else we can e.g.
  boot from a thumbdrive and take control

::: notes

useful refs:

- Bishop 2nd ed chap 4 - access control
- Anderson 2020 sec 6.2 on DACs and MACs

see pros and cons at

<https://www.ekransystem.com/en/blog/mac-vs-dac>

:::

### DACs

For DACs, there's usually one sort of right called "ownership",
which grants the ability to add
or remove rights 

- e.g. granting others the right
  to read files in your home directory

### DACs complications

- Suppose we're sysadmin: do we really trust users to
  get all permissions right?
- What if a user wants to download and run programs they found online --
  should they be able to?
- What if some users should be considered more trustworthy than others?

### Types of access control system

Many OSs will actually implement aspects of both MACs and DACs.

Example: Windows provides a kind of support for some DAC-style,
system-specified permissions.

- Process and resources have an "integrity-level" label
- By default, files are labelled "medium"; but the web
  browser (and all files downloaded from it) is labelled "low".
- The OS enforces that "low"-labelled files may not alter
  higher-labelled files.
- So if you want to run some program you downloaded, and it
  will changes files on the filesystem, the user has to
  explicitly upgrade it from "low" to "medium".


::: notes  

source:

- Anderson 2020 sec 6.2

:::


### Deputies

- Suppose a user wants to change their password -- stored 
  in e.g. `/sys/PASSWORDS`
- We can't give every user read and write permissions
  to that file
- We might give particular *programs* the ability to take
  actions on behalf of particular users at a higher level of privilege
  than the user has.

  - e.g. We might specify that the `passwd` program, when it runs, runs
    as `root` and can read and alter this `sys/PASSWORDS` file.
  - Or we might run a program as a server, started by a privileged user --
    and other users just send *requests*.

### Confused deputies

But if we do this carelessly, it leads to *confused deputies*.

Example: Alice sends a request to a server process
started by Bob -- "give me the contents of `file1`, nicely formatted"

`\begin{center}`{=latex}
![](lect04-images/deputy.svg){ width=80% }
`\end{center}`{=latex}


It's *Bob's* permissions that are used to check whether a file
can be read; so Alice could ask for the contents of
`/home/bob/my_secret_file.txt`,
which she shouldn't be allowed to have access to.

(See "[The Confused Deputy (or why capabilities might have been
invented)][conf-dep]"

[conf-dep]: https://css.csail.mit.edu/6.858/2015/readings/confused-deputy.html

::: notes

see original confused deputy paper

:::

### Confused deputies

An example that has actually occurred:

- A webserver -- each student is allowed to
  create a `public_html` dir from which files for a website are
  served (e.g. `/home/student1/public_html`).
- The webserver process has privileged rights (e.g. because it
  needs to serve on port 80, which only `root` can do)
- A student creates a `public_html` in their directory, but it's
  a *symbolic link* (symlink) to `/etc/passwd` (or some other file
  only root should have access to).
- Because the webserver is running as root, it *does* have access
  to files like `/etc/passwd`; so it serves it up as a webpage.

Solutions to confused deputies: coming up later  

### Implementing an access control matrix

Suppose we want to implement an access control system -- how should we
store the information about rights?

"As a very big 2D array" is not a good idea -- many cells would be
empty (i.e. sparse array) or duplicated, array would be large

- e.g. Suppose Alice owns a file. Do we really want to store a list of
  all users at e.g. UWA who *don't* have permission to read/write it?
- We might want to have "default" permissions for things
  - it's then wasteful to list them explicitly for every user/subject
  - only explicitly list people who've specifically been
    granted *more* or *fewer* rights.

### Implementing an access control matrix

Some options:

(a) Store by "column" (resource)
    - Each object is associated with a list of users, and what rights
      they have
(b) Store by "row" (user)
    - Each subject is associated with a list of objects, and what rights
      the user has for it

### ACL vs capabilities

::: block

####

(a) By "column" (resource)
    - Each object is associated with a list of users, and what rights
      they have
(b) By "row" (user)
    - Each subject is associated with a list of objects, and what rights
      the user has for it

:::

- Option (a) leads to the idea of an \alert{access control list} (ACL)
- Option (b) leads to the idea of a \alert{capability system}
  (though there's more to such a system than just this)
  - Rights to do things are held by subjects, and can be
    passed around to other subjects

\hrule

\footnotesize

NB: Don't confuse a "capability system" with `man 7 capabilities`

- a Linux approach to making superuser permissions finer-grained
- not actually a "capability system"

### ACLs vs capabilities

ACL

- Store rights as e.g. file metadata
- Straightforward to implement
- Easy to e.g. revoke one user's rights to a file
- Difficult to determine all rights possessed by one user
- Difficult to e.g. revoke a user's right on *all* files
- Example: All popular OSs (Linux, Mac, Windows)

Capabilities

- Easy to determine all rights possessed by one user
- Easy to add and remove users, and to delegate rights
- Difficult to e.g. change rights of all users to one file
- Example: Various distributed OSs (e.g. [Amoeba][amoeba], experimental
  system developed in 90s)

[amoeba]: https://www.cs.vu.nl/pub/amoeba/amoeba.html

::: notes

- The [Amoeba][amoeba] distributed OS
  is an example of a powerful and flexible capability system.

  Created early 90s -- one creator 
  Andrew S. Tanenbaum of [Minix][minix] fame, Minix
  was the chief inspiration for Linux

[minix]: https://en.wikipedia.org/wiki/Minix

:::

### ACLs vs capabilities

- In practice, ACLs don't list *every* user -- doesn't scale well
- Also, we said access control needs to be efficient -- in many systems,
  permissions are only checked when a file is *opened*, not
  each time the file content is accessed
- Many OSs combine aspects of ACLs and capability systems

### Capability systems

We don't look at them in detail, but as noted, many OSs
use aspects of capabilities.

Typically very powerful and flexible.

Particular subjects might have the ability to *copy* capabilities
so they can be given to others -- or perhaps only to *transfer*
capabilities (i.e., the original subject no longer possesses them)


### Unix approach

The Unix approach to *subjects* (principals):

- Users have a *user ID*, and one or more *groups*.
- The `root` user (with user ID 0) is the superuser
  - The first process starts as `root`, spawns others
- Every user has a primary group (stored in `/etc/passwd`), and can be a member of others
  (stored in `/etc/group`).
- A user `nobody` normally exists that owns no files, and
  can be used as a default user for unprivileged operations
- Processes execute with the permissions ("effective user ID") of the
  user that started them  
- When determining rights to files, we use a coarse-grained approach
  and divide all principals into
  - the user/owner
  - the group owner
  - everyone else  

### Unix approach

The Unix approach to *objects* (principals):

- "Everything is a file"
- represent as many things as possible as *files*; then,
  we can use filesystem permissions to implement our
  access control system

`\begin{center}`{=latex}
![](lect04-images/everything_is_a_file.png)
`\end{center}`{=latex}


### Unix approach

- Classify file rights as "read", "write" and "execute"
  - There are other rights needed to execute particular system calls
    (e.g. to kill a process)
  - The OS kernel will check whether a subject (a process)
    has rights to make particular system calls
  - For the `root` user, the answer is always "yes"\
    (but see `man 7 capabilities`)    
- Classify subjects as "user", "group", "everyone else"
- Processes have an *actual* user ID and group ID (based on the user
  that started them)
  - But can also have an *effective* user ID and group ID -- differs
    for `setuid` and `setgid` programs
  - Check file permissions only on open
  - Effectively, file descriptors are a kind of "capability", and can
    be passed around to e.g. subprocesses

### Unix approach

- Doesn't easily allow for flexible rules
  - e.g. "Allow Alice's file `F` to be read by every user
    except Carol and Dan"
- The system calls for managing `setuid` and `setgid`
  programs are easy to get wrong
- Because `root` can do anything -- difficult to create a
  sysadmin-untamperable audit trail/log
  - need to either store off-system/offsite, or modify the
    DAC approach

Note:

- Many file systems allow files to have "extended attributes"
  (see <https://en.wikipedia.org/wiki/Extended_file_attributes>)
  which allow more flexible policies to be implemented on top
- On modern systems, the Unix approach is typically agumented \
  e.g. the SELinux (Security-Enhanced Linux) architecture

### Solutions to confused deputies

Confused deputies arise when a process with high privileges
is "fooled" into letting a less-privileged principal
do something they shouldn't.

One solution:

- Split the program into two interacting processes that
  communicate.

### Solutions to confused deputies -- client/server

e.g. Suppose a compiler needs to allow users to compile input files
and write to output files, and **also** should write billing/audit
information to `/sys/billing`.

- Split the compiler into two:
  - Compiler part runs as user, will only read or write files the user
    has access to
  - A separate process runs as (e.g. `root`), is communicated with
    by compiler process, writes to `/sys/billing` \
- Better practice would be to create a dedicated `billing` user, not
  to use `root`
- Principle of Least Privilege: give principals only the rights
  they need to perform their job

### Solutions to confused deputies -- `setuid`

Client/server approach is not always appropriate (e.g. not especially fast)

`setuid` approach:

- Make the compiler a `setuid` program, which starts off running as
  `root`
- Open `/sys/billing`
- Immediately drop all root privileges \
  (again: Principle of Least Privilege)
- Now do the job of e.g. reading input files, compiling
  and writing to output files

::: notes

issues here:

- running as `root` not ideal if we can get away with less

:::



### Solutions to confused deputies -- `setuid`

Downsides:

- Relies on programmer to get things right
- On Unix systems, easy to get wrong
- Easy to create [TOCTOU][toctou] bugs -- "time of check vs time of use"

::: code

####

```python
if not actual_user_can_access("file1"):
  sys.exit(1)
fp = open("file1", "w")
fp.write("some data")
```

:::


[toctou]: https://en.wikipedia.org/wiki/Time-of-check_to_time-of-use 

See:

- Bishop, "[How to Write a Setuid
  Program](http://nob.cs.ucdavis.edu/~bishop/secprog/1987-sproglogin.pdf)"
  (PDF)
- [Checklist for Security of Setuid
  Programs](http://www.cis.syr.edu/~wedu/Teaching/cis785/Papers/setuid.pdf)
  (PDF)

::: notes

TOCTOU:

- we check, should the *actual* user have access? (not effective user,
  which is root)
- if so, we open and write to file
- but file could've changed in between the two, attacker interposes file


:::


<!-- vim: tw=72
-->
