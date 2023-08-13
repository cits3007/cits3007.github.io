---
title: |
  CITS3007 lab 3 (week 5)&nbsp;--&nbsp;String handling, file permissions
---



It's recommended you complete this lab in pairs, if possible, and
discuss your results with your partner.

## 1. String-handling functions

On [Moodle](https://quiz.jinhong.org), under the section "Week 4 – string handling", is a
set of exercises on using C's string handling functions
to write a safe "path-construction" function.

Complete the exercises, using your development environment to
help test your code.

Once you have completed the Moodle exercises: if you have time during
the lab, continue with the following sections of this lab worksheet.  If
not, you can work through the remaining sections in your own time.




## 2. `setuid` and Unix permissions

This section and the following ones introduce the Unix
access control system. This includes:

- traditional Unix file access mechanisms;
- `setuid` permissions; and
- Linux capabilities.

(You may want to refer back to this lab worksheet in future labs,
when we look at how `setuid` programs can be exploited.)

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

The output of the `ls` command should look something like this:

```
-r--r----- 1 root root 798 Mar 16 15:22 /etc/sudoers
```

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em;">

**Output of `ls`**

![](images/unix_permissions.svg){ width=100% }

The `man ls` documentation unfortunately doesn't fully explain this
listing format -- see the documentation of the [GNU coreutils
package][coreutils] for a fuller explanation, or
[this guide][privs] for a short tutorial.

In brief: the first group of 10 characters (starting with "`-r`")
indicates who can access the file, and how they can access it. Every
file on a Unix-like system has associated with it a set of *flags*
(binary options), and the last 9 characters in that group show what they
are. The meaning of the characters is:

[coreutils]: https://www.gnu.org/software/coreutils/manual/html_node/What-information-is-listed.html

- The first character isn't a flag -- it indicates the type of file.
  A directory is shown as "`d`", and a symbolic link as "l". Other file
  types are shown using other characters, as outlined in the GNU
  coreutils documentation.

- The remaining 9 characters should be read in groups of three.
  The first group indicates permissions available to the file owner,
  the second, permissions available to the file group, and the third,
  permissions available to everyone else.

  If someone has read, write and execute permissions, the group of three
  will be the characters "`rwx`"'; if they only have a subset of those
  permissions, some of the characters will be replaced by a hyphen.

  Thus, a file where the user has read, write and execute permissions,
  but everyone else only has read permissions, will look like this:
  `-rwxr--r--`.

  For some programs, the "`x`" in the first group may be replaced by
  "`s`", as we shall see -- this tells the operating system
  that it has the "`setuid`" feature enabled, and when run, its
  effective permissions are those of the *owner* of the file (rather
  than of the user who started the process).


</div>


The `/etc/sudoers` file specifies which users on the system can
temporarily acquire `root` privileges using the `sudo` command.
Only the `root` user can read the file, so when you try to read it
with `less`, you get a permission error.

[privs]: https://devconnected.com/linux-file-permissions-complete-guide/

Obviously, programs that use features
like `setuid` can be very dangerous: if they are
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


### 2.1. `setuid` programs

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




### 2.2 Principle of least privilege


When a program needs to have the
`setuid` feature enabled, it is best practice to use the lowest
possible level of elevated privilege,
and to use the elevated
privilege level for as short a time as possible.
Once the privileges have been used for whatever purpose they
were needed for, the program should relinquish them --
it does so by calling the `setuid()` function.
(You can read about the `setuid()` function at `man 2 setuid` --
but its use is complicated, and we will elaborate more
on it in the next section.)

Relinquishing privileges is
especially important for long-running processes.
For instance, a web server might require higher permissions
than normal early in the life of the process
(e.g. to read configuration files, or listen for connections on port 80,
which normally only `root` can do)
but should drop
those permissions once they are no longer needed -- otherwise the
potential exists for them to be exploited.

Using as few privileges as are needed, for as short a time as is needed,
is known as the "Principle of Least Privilege": read
more about it in the *Unix Secure Programming HOWTO*
on [minimizing privileges][secure-howto].

[secure-howto]: https://dwheeler.com/secure-programs/3.012/Secure-Programs-HOWTO/minimize-privileges.html

**Question:**

:   Suppose we are creating a set of programs
    which manipulate a human resources database. The database
    file is located at `/var/hr/hr.db` and is owned by root.
    One of our programs is called `hr_db_amend`, and is a setuid
    program also owned by root.

    Is this in line with good security practice, as explained in the
    *Unix Secure Programming HOWTO*? If not, what should we do instead?



### 2.3 Effective versus real user ID

Unix systems keep track of two facts about a running process --
the process's "real user ID" (that is, the user ID of the user
who created the process), and its "effective user ID"
(which represents the permissions the process is currently
acting with, and might be different to the real user ID).

For most programs, the two are exactly the same.
For setuid programs, however, the operating system sets the real user ID
(abbreviated "rUID") as per usual, but sets the effective user ID
(abbreviated "eUID") to the owner of the executable file being run.

The Linux C functions [`getuid` and `geteuid`][getuid-man] are used to
determine at runtime what the rUID and eUID are. This is how a program
like `su` can tell whether it is being run as a setuid, root-owned
program -- it's eUID should be 0.
(Linux also has something called a ["saved user ID"][saved-uid], used for the
situation where a program *mostly* needs to run as root, but temporarily
needs to run some actions as a non-privileged user. However, we will
leave discussion of it until a later lab.)

[getuid-man]: https://manpages.ubuntu.com/manpages/focal/man2/getuid.2.html
[saved-uid]: https://en.wikipedia.org/wiki/User_identifier#Saved_user_ID

**Exercise**

:   Compile the following program:

    ```{ .C .numberLines }
    #include <stdio.h>
    #include <stdlib.h>
    #include <sys/types.h>
    #include <unistd.h>

    int main() {
      uid_t ruid = getuid();
      uid_t euid = geteuid();
      printf("real uid is: %d\n", ruid);
      printf("effective uid is: %d\n", euid);

      return EXIT_SUCCESS;
    }
    ```

    Compare the results it gives when run with the results it gives
    after you change its owner to root and make it a setuid program.



### 2.4 Relinquishing privileges

So, we know that we should use elevated privileges for
as short a time as possible, and then relinquish them.
How do we do that?

The Linux C function [`seteuid`][man-seteuid] lets us
change our eUID; to drop privileges, we just change our
eUID so that it's the same as our rUID.

[man-seteuid]: https://manpages.ubuntu.com/manpages/focal/man2/seteuid.2.html

However, there are some pitfalls to be aware of when
relinquishing privileges: read the
Software Engineering Institute's [web page on relinquishing
permissions][permission-relinq] for an explanation of
some of the issues.

[permission-relinq]: https://wiki.sei.cmu.edu/confluence/display/c/POS37-C.+Ensure+that+privilege+relinquishment+is+successful

**Question:**

:   In our `hr_db_amend` program described above,
    we initially run with elevated privileges.

    Most users on the system cannot read or write the
    `/var/hr/hr.db` file, but because we are running
    as the `hr` user, we can.

    Our `hr_db_amend` program contains the following code,
    executed shortly after the program has started running:


    ```{ .c .numberLines}
      // open DB file for reading and writing
      fd = open("/var/hr/hr.db", O_RDWR);
      if (fd == -1) {
         printf("Cannot open /var/hr/hr.db\n");
         exit(EXIT_FAILURE);
      }

      // now that we have a file descriptor,
      // privileges are no longer needed - relinquish them

      setuid(getuid());  // getuid() returns the real uid
    ```

    Does this code contain potential security flaws?
    If so, how could it be changed to remove them?





We will experiment further with `setuid` programs, and
code for using and relinquishing privileges, in future labs.

## 3. Challenge question

(Challenge questions in the lab worksheets are aimed at students
who already have a good knowledge of C and operating systems --
they are not compulsory to complete.)

On Linux, is it possible to write a setuid program in Python? Why
or why not? Is it advisable?





<!-- vim: syntax=markdown tw=72 :
-->
