---
title:  CITS3007 lab 6 (week 8)&nbsp;--&nbsp;Injection
---

`~\vspace{-5em}`{=latex}



## 1. Environment variables

Every process has access to a set of *environment variables*. In C, they
are represented as the variable `char **environ` (see `man 7 environ`
for additional details): this variable allows us to read, write, and and
delete environment variables.
We can also manipulate them from the shell.

Note that Bash lets us set variables
using the syntax

```
$ myvar=myval
```

but these variables are "Bash" variables, not environment variables, and
are only accessible within our current shell
session. (This is similar to the way `gdb` lets us set convenience
variables: they are accessible only from our `gdb` session, and are not
part of and do not affect the program being debugged.)

Try the following:

```
$ myvar=myval
$ echo my var is $myvar
$ sh -c 'echo my var is $myvar'
``` 

Only the first `echo` command prints the expected contents of `myvar`.
The second time around, we are spawning a new shell process, and within
that process, the variable `myvar` has not been defined.

*Environment* variables, however, *are* inherited by child processes.
We can use `export` to turn a normal variable into an environment
variable:

```
$ myvar=myval
$ echo my var is $myvar
$ export myvar
$ sh -c 'echo my var is $myvar'
```

This time, we should see the expected contents of `myvar` echoed twice.
We can also define and export a variable in a single step:

```
$ export myvar=myval
```

Besides the builtin Bash "`echo`" command, the "`declare`" command can
be useful for displaying variable contents as well. "`declare -p myvar`" means
to display the definition of `myvar` (note that we do *not* put a dollar
sign in front of `myvar` this time -- "`declare -p`" needs the *name* of
a variable, not its value).

```
$ declare -p myvar
declare -x myvar="myval"
```

### 1.2. Environment variables and `fork`

Save the following program as `child_env.c`, and compile it with
`make child_env.o child_env`.

```C
#include<unistd.h>
#include<stdio.h>
#include<stdlib.h>

extern char **environ;

void printenv() {
    int i = 0;
    while(environ[i] != NULL) {
        printf("%s\n", environ[i]);
        i++;
    }
}

void main() {
    pid_t childPid;
    
    switch(childPid = fork()) {
        case 0:    // child process
            //printenv();
            exit(0);
        default:   // parent process
            printenv();
            exit(0);
    }
}
```

Once `fork` has been called, the code detects whether it is running in
the child process (the result of `fork()` was 0) or the parent
(the result of `fork()` id the process ID of the child process -- see
`man 2 fork`).
Currently, the *parent*'s environment is printed, using the `printenv`
function.
If you run `./child_env`, you'll see a large amount of output -- so
we'll redirect it to a file:

```
$ ./child_env > parent_env
```

Now comment out the parent call to `printenv()`, and uncomment the
child's, re-compile, and then run again:

```
$ ./child_env > child_env
```

If we compare our two files using diff (or in a graphical environment,
you could use a command like `meld`), we see they are the same:

```
$ diff parent_env child_env
```

So it appears the child gets an exact copy of the parent's environment.


### 1.2. Environment variables and `execve`

Save the following program as `use_execve.c`, and compile with
`make use_execve.o use_execve`.


```C
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

extern char **environ;

int main(int argc, char ** argv) {
    char *myargv[2];
    
    myargv[0] = "/usr/bin/printenv";
    myargv[1] = NULL;
    
    execve("/usr/bin/printenv", myargv, NULL);
    
    return 0;
}
```

Read `man 2 execve` for details of the `execve` function
(which we also looked at in lectures). The first argument
is a program to run: when `execve` is called, this program "replaces" the
one currently running. The second argument is a list of the arguments
passed to the new program. It has the same purpose and structure as `argv`
does in `main` of a C program, and is an array of strings, terminated by
a `NULL` pointer; the *first* of these normally holds the name of the program
being executed (though this is only a convention, and programs sometimes
set `argv[0]` to other things).
The last argument is to an array of strings
representing the environment of the new program. We have set it to
`NULL` -- what do you predict the output of running the program will be?

Now, replace the call to execve with the following, then recompile and
rerun:

```
execve("/usr/bin/env", argv, environ);
```

From reading the man page for execve, what do you predict will be the
output?


### 1.3. Environment variables and `system`

Save the following program as `use_system.c`, and compile with
`make use_system.o use_system`.

```C
#include <stdio.h>
#include <stdlib.h>

int main() {
    system("/usr/bin/printenv");
    printf("back in use_system");
 
    return 0;
}
```

You can read about the `system` function using `man 3 system`.
What do you predict will be the output? Should you see the output of
`printf`?




### 1.4. `setuid` programs and `system`

Save the following program as `run_cat.c`, and compile with
`make run_cat.o run_cat`.

```C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char **argv) {
  const size_t BUF_SIZE = 1024;
  char buf[BUF_SIZE];
  buf[0] = '\0';

  if (argc != 2) {
    printf("supply a file to read\n");
    exit(1);
  }

  strcat(buf, "cat ");
  strcat(buf, argv[1]);

  system(buf);
  return 0;
}
```

If we invoke this as `./run_cat SOMEFILE`, we should be able to get the
contents of the file using the `cat` command (see `man 1 cat`).
Try running `./run_cat /etc/shadow` -- you should get a "permission
denied" error, which we expect, because `root` owns `/etc/shadow`, and
normal users do not have read access.

Now make `run_cat` a setuid program:

```
$ sudo chown root:root ./run_cat
$ sudo chmod u+s ./run_cat
```

Try running `./run_cat /etc/shadow` again -- what do you see, and why?
Instead of `cat`, you can imagine that we might instead invoke some
other command which normally only root can run, but which we want to let
other users run.



You can find out where the `cat` command is that `run_cat` is executing
by running

```
$ which cat
```

This will look through the directories in our `PATH`, and report the
first one which contains an executable file called "`cat`".
Now we will manipulate the `PATH` environment variable so that `run_cat`
instead of accessing the normal system `cat` command, executes a command
of our choosing.

Create a file `cat.c` in the current directory, and edit with `vim`,
adding the following contents, then compile with `make cat.o cat`.

```C
#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/stat.h>
#include <fcntl.h>


int main(int argc, char ** argv) {
  uid_t euid = geteuid();

  printf("DOING SOMETHING MALICIOUS, with effective user ID %d\n", euid);
}
```

Type

```
$ export PATH=$PWD:$PATH
```

and run `run_cat` again.

```
$ ./run_cat /etc/shadow
```

What do you see? Why? And how would you fix this?





<!-- vim: syntax=markdown
-->

