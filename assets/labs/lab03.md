---
title: |
  CITS3007 lab 3 (week 5)&nbsp;--&nbsp;`setuid` vulnerabilities
---

It's recommended you complete this lab in pairs, if possible, and
discuss your results with your partner.

## 1. `setuid`

`setuid` ("set user identity") is an important security mechanism on
Unix operating systems.
When a `setuid` program is run, it assumes the privileges of the
*owner of the executable file* (for instance, `root`), rather than (as
is usually the case) the privileges of the user executing the command.

An example of a *non*-`setuid` program is `less` (and most other
programs you commonly run). Try running the following commands:

```
$ ls -al /etc/sudoers
$ less /etc/sudoers
```

(See [this guide][privs] for an explanation of the output of the
`ls -al` command if you are not familiar with it.)
The `/etc/sudoers` file specifies which users on the system can
temporarily acquire `root` privileges using the `sudo` command.
Only the `root` user can read the file, so when you try to read it
with `less`, you get a permission error.

[privs]: https://devconnected.com/linux-file-permissions-complete-guide/

Obviously, programs like this can be very dangerous: if they are
not carefully written, their elevated privileges can have unexpected
consequences.
However, many programs *do* need to run with special permissions.
Consider the `passwd` program, for instance, which allows a user to
change their password. Passwords on Unix systems
are typically stored in a file called `/etc/shadow`, which only the
`root` user can read or change. (Run `ls -al /etc/shadow` to
see its permissions -- what are they?)
When you successfully run the `passwd` program, it updates the
contents of `/etc/shadow` with your new password (actually, a
[hashed and salted][shadow-file] version of your password), despite the
fact that the user doesn't have permissions to change that file.
Run

[shadow-file]: https://www.cyberciti.biz/faq/understanding-etcshadow-file/


```
$ ls -al `which passwd`
```

to see the permissions of the `passwd` executable. You should see
something like this:

```
-rwsr-xr-x 1 root root 68208 Mar 14 16:26 /usr/bin/passwd
```

The "`s`" in the first 3 characters of the permissions indicates
that this program has the `setuid` feature enabled.

### 1.1. `setuid` programs

Consider the following commands:

- `"chsh"`
- `"su"`
- `"sudo"`

What do they do? (Read the `man` pages for the commands for details.)
How can you find out where the executable files for those commands are
located? (Hint: check out `man which`.)
List the permissions for the executables using `ls -al`. What do they
have in common? Why is it needed?



For each of these commands, copy the executable to your working
directory, and run `ls -al` on the copy. What permissions does the copy
have? Try running the copied `sudo` and `chsh` commands (give `chsh`
the password `vagrant`, and suggest `/bin/sh` as a new shell). What
happens?

You can add the `setuid` feature to the copied programs by running the command
`chmod u+s ./SOME_PROGRAM` (inserting the name of the copied program
as appropriate). However, the programs will still be owned by you --
what happens if you try to run them?




### 1.2. Relinquishing privileges

When a program like `passwd` or `sudo` needs to have the
`setuid` feature enabled, it's best practice to use the elevated
privilege level for as short a time as possible.
Once the privileges have been used for whatever purpose they
were needed for, the program should relinquish them --
it does so by calling the `setuid()` function.
(Read about it at `man 2 setuid`.)

This is especially important for long-running processes.
For instance, a web server might require higher permissions
than normal early in the life of the process but should drop
those permissions once they are no longer needed -- otherwise the
potentials exists for them to be exploited.
Using as few privileges as are needed, for as short a time as is needed,
is known as the "Principle of Least Privilege": read
more about it in the Unix Secure Programming HOWTO
on [minimizing privileges][secure-howto].

[secure-howto]: https://dwheeler.com/secure-programs/3.012/Secure-Programs-HOWTO/minimize-privileges.html

However, the code needed to successfully relinquish privileges
is not as simple as one might hope. Read the
Software Engineering Institute's [web page on relinquishing
permissions][permission-relinq] for some of the issues.

[permission-relinq]: https://wiki.sei.cmu.edu/confluence/display/c/POS37-C.+Ensure+that+privilege+relinquishment+is+successful


Save the following program as `privileged.c` and compile it.
(Hint: a quick way to do so is to run `make privileged.o privileged`,
even if you have no Makefile in your current directory.
`make` contains builtin knowledge of how to compile and link C
programs.)



```
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/stat.h>
#include <fcntl.h>

void main() {
  int fd;

  /* Assume that /etc/zzz is an important system file,
   * and it is owned by root with permission 0644.
   * Before running this program, you should create
   * the file /etc/zzz first. */
  fd = open("/etc/zzz", O_RDWR | O_APPEND);
  if (fd == -1) {
     printf("Cannot open /etc/zzz\n");
     exit(0);
  }

  /* Simulate the tasks conducted by the program */
  sleep(1);

  /* After the task, the root privileges are no longer needed,
     it's time to relinquish the root privileges permanently. */
  setuid(getuid());  /* getuid() returns the real uid */

  if (fork()) { /* In the parent process */
    close (fd);
    exit(0);
  } else { /* in the child process */
    /* Now, assume that the child process is compromised, malicious
       attackers have injected the following statements
       into this process */

    write (fd, "Malicious Data\n", 15);
    close (fd);
  }
}
```

Then create the file `/etc/zzz`, which we will assume
is an important system file:

```
$ sudo touch /etc/zzz
$ sudo chmod 0644 /etc/zzz
```

What permissions does `/etc/zzz` have once you've done this?



Run the `privileged` executable using your
normal user account, and describe what you have observed. Will the file
`/etc/zzz` be modified? Explain your observation.



Now change the owner of the `privileged` executable to `root`:

```
$ sudo chown root:root ./privileged
```


Try running it again -- what happens? Why?



Finally, enable the `setuid` feature:

```
$ sudo chmod u+s ./privileged
```

Run the program again -- is `/etc/zzz` modified?



### 1.3. Discussion of code

When programs are run which use the `setuid` feature,
there are multiple different sorts of "user id" at play.

- `rUID` -- the real user ID. This means the ID of the user
  who created the process.
- `rGID` -- the real group ID. This means the GID of the user
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
and run it again -- what do you observe?

In the code above, there are a number of issues:

- The call to `setuid` made to drop privileges can *fail*.
  (What does `man 2 setuid` say about the return value of `setuid`?)
  If privileges can't be dropped, usually the only sensible thing
  to do is to abort execution of the program.

- A call to `fork` spawns a child process. The child process
  inherits the real user ID, effective user ID, and all the open files of the parent process.
  That being so, what do you think allows a malicious user
  to exploit the child process in this case? How would you fix it?

As an aside: it's quite common for a program that needs special
privileges to "split itself into two" using the `fork` system call.
The parent process retains elevated privileges for as long as it needs,
and sets up a communications channel with the child (for instance,
using a *pipe*, a *socket* or *shared memory* -- more on these later).
The parent process has very limited responsibilities, for instance,
writing to a `root`-owned file as need, say. The child process handles
all other responsibilities (e.g. interacting with the user).





<!-- vim: syntax=markdown tw=72 :
-->
