---
title: |
  Create an ARM64 virtual environment using UTM and Vagrant
---

[shellcode]: https://en.wikipedia.org/wiki/Shellcode

## 1. Creating an ARM64 development environment

This tutorial describes how to create a development environment in a virtual
machine which uses the ARM64 architecture.
This development environment can be used for *most* CITS3007 work; but

- When you get to lab 4 (in week 5), which covers buffer overflows: if you want to attempt the
  extension tasks for the lab, they *won't* work on an ARM64 virtual machine, since they use
  [shellcode][shellcode] that only works on x86-64 processors. For those tasks,
  you'll need to use an x86-64 environment (covered in the next tutorial).
- When working on the project (due in week 11), you'll need to allow for differences
  between platforms. The biggest difference
  is that the `char` type on an x86-64 platform is *signed*, but on ARM64 platforms
  it is *unsigned*. You may want to make use of GCC's `-fsigned-char` option
  to mimic the x86-64 behaviour (see [here](#differences)). It's also recommended
  that you test your code using a x86-64 virtual machine before submitting and/or
  merging your work with other students'.

<h4 style="font-size: 1.2em; font-weight: bold; margin-bottom: 0.5em;">Steps</h4>

1.  **Navigate to development environment directory**

    Open Terminal and navigate to your development environment directory:

    ```bash
    cd ~/CITS3007_development_environment
    ```

2.  **Create and enter an ARM64 subdirectory**

    - Create the ARM64 folder:

      ```bash
      mkdir ARM64
      ```

    - Change to the ARM64 directory:

      ```bash
      cd ARM64
      ```

3.  **Initialize the Vagrant project**

    Run:

    ```bash
    vagrant init utm/ubuntu-24.04
    ```

    This creates a default Vagrantfile that uses the "`utm/ubuntu-24.04`" box.

4.  **Overwrite the Vagrantfile with a custom ARM64 configuration**

    Execute the following command to replace the Vagrantfile with a custom configuration:

    ```bash
    curl --output Vagrantfile https://cits3007.arranstewart.io/labs/lab00-mac-arm64-Vagrantfile.rb
    ```

    You can alter the configuration if desired before bringing up the virtual machine,
    by editing the Vagrantfile (e.g. with `nano` or `vim`).
    The Vagrantfile contains (commented out lines) which
    configures a virtual machine with 8GB RAM and 6 CPU cores -- uncomment these
    and adjust as needed. But note that for our purposes,
    that amount of RAM and that many CPU cores are typically not needed.

5.  **Launch the ARM64 environment**

    It's possible to download _and_ bring a VM up with one command (the "`vagrant up`"
    command, see below), but here we split this into multiple commands to make it easier
    to see what is happening at different stages (and to diagnose problems if they occur).

    - Download the relevant Vagrant "box" by running:

      ```bash
      vagrant box add utm/ubuntu-24.04 --provider=utm
      ```

    - Start the VM by running:

      ```bash
      vagrant up --provider=utm
      ```

    - Once the VM has successfully started, you should be able to start an SSH session
      on the VM by running

      ```bash
      vagrant ssh
      ```

6.  **Optional: extra development packages**

    The previous steps should provide you with a development environment that can
    be used for nearly all labs -- it includes basic development tools like the GCC
    compiler and `make`.

    For an environment that more closely matches the standard CITS3007 environment --
    running the following command from within the VM will install extra packages that include documentation,
    fuzzers, and debugging tools:

    ```bash
    curl -sSL https://raw.githubusercontent.com/cits3007/ubuntu-vagrant-box/refs/heads/master/provision-mac.sh | sudo bash
    ```

<br>

-----

<br>

## 2. Notes on the ARM64 platform

In this section, we discuss some ways that an ARM64
platform can differ from the x86-64 platform.

### 2.1 What are some differences between ARM64 vs x86-64 platforms? { #differences }

The standard [CITS3007 development environment][faq-dev-env] runs on the x86-64
architecture, and any code you submit for the CITS3007 project will be compiled and tested
using GCC on the x86-64 architecture.

[M-series][m-series] Mac laptops, however, use the [ARM64][arm64] architecture, which
differs from x86-64 in several ways (note that the following list is **not**
comprehensive!):

- The architectures have a different [instruction set][isa] -- programs compiled
  for one will not run on the other, and [shellcode][shellcode] written for one
  will not work on the other.
- The `char` type can be either signed or unsigned -- on the x86-64 platform, a `char`
  is usually signed, but when targeting the ARM64 architecture, C compilers (including GCC)
  usually default to it being unsigned (for [performance reasons][arm64-dobbs] that are now
  largely historical). \
  &nbsp;&nbsp;&nbsp;  It's possible to force GCC to make the `char` type signed or unsigned by using the
  [`-funsigned-char` and `-fsigned-char`][gcc-char] options.
- [Data structure padding and alignment][align] can [differ][arm64-dobbs] between the two. GCC provides
  ["attributes"][gcc-att] which allow you to force variables or structs to use padding
  and alignment rules you specify. (Doing this can result in generated code being slightly slower,
  but you may not care about the difference.)

You can find comments on some of these differences in the ["Miscellaneous C porting
issues"][arm64-porting] section of the developer documentation for the ARMv7-A series of
processors.

[faq-dev-env]: https://cits3007.arranstewart.io/faq/#cits3007-sde
[m-series]: https://en.wikipedia.org/wiki/Apple_silicon#M_series
[arm64]: https://en.wikipedia.org/wiki/ARM64
[isa]: https://en.wikipedia.org/wiki/Instruction_set_architecture
[shellcode]: https://en.wikipedia.org/wiki/Shellcode
[arm64-dobbs]: https://www.drdobbs.com/architecture-and-design/portability-the-arm-processor/184405435
[gcc-char]: https://gcc.gnu.org/onlinedocs/gcc-4.8.0/gcc/C-Dialect-Options.html
[align]: https://en.wikipedia.org/wiki/Data_structure_alignment
[gcc-att]: https://gcc.gnu.org/onlinedocs/gcc-4.4.7/gcc/Variable-Attributes.html
[arm64-porting]: https://developer.arm.com/documentation/den0013/d/Porting/Miscellaneous-C-porting-issues

### 2.2 What platform will submitted projects be tested on?

Projects will be tested on the x86-64 platform, using GCC as a compiler, and the
[CITS3007 standard development environment][faq-dev-env].

### 2.3 How can I ensure my code runs correctly on the x86-64 platform? { #project-requirements }

It's up to you to make sure that you thoroughly test your code and ensure it
runs correctly on the x86-64 platform. Some suggestions as to how you might
do so include:

- Making sure you can compile and run tests on your code using a virtual machine which
  emulates the x86-64 processor. Note that emulated virtual machines will run quite slowly on a Mac
  M-series host. It's also best not to install any GUI packages on such a VM -- they
  will run *extremely* slowly.
- Referring to published portability guidelines -- one set of such guidelines is provided
  by [Imperial College, London][imp-c-port], and the [GNU project][gnu-c-port] also
  has some suggestions.
- Compiling and testing on an ARM64 platform with a range of different static analysers,
  a range of different compilers (e.g. both GCC and Clang) -- with all appropriate
  warnings enabled -- with a range of different
  [sanitizers][san] enabled, and at a range of different [optimization levels][gcc-opt].
  While this won't *ensure* that your code works correctly on an x86-64 platform, it is likely
  to result in fewer problems once you do try to run it on an x86-64 system.

[imp-c-port]: https://www.doc.ic.ac.uk/lab/cplus/cstyle.html#N10553
[gnu-c-port]: https://www.gnu.org/prep/standards/standards.html#CPU-Portability
[san]: https://github.com/google/sanitizers
[gcc-opt]: https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html

----

<div style="font-size: 1.2em; font-weight: bold; margin-bottom: 0.5em;">Credits</div>

Section 1 of this tutorial was written by Steve Beaver, with additions from
Arran Stewart.

<!--
  vim: syntax=markdown tw=90 smartindent :
-->
