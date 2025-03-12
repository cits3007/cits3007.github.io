---
title: |
  Create an x86-64 virtual environment using UTM and Vagrant
---

This tutorial describes how to create a development environment in a virtual machine which uses the
x86-64 architecture.
This development environment can be used for any CITS3007 work, but will typically
run more slowly than an ARM64 environment.

1.  **Navigate to development environment directory**

    Open Terminal and navigate to your development environment directory:

    ```bash
    cd ~/CITS3007_development_environment
    ```

2.  **Create and enter an `x86_64` subdirectory**

    - Create an `x86_64` subdirectory:

      ```bash
      mkdir x86_64
      ```

    - Change to the `x86_64` subdirectory:

      ```bash
      cd x86_64
      ```

3.  **Initialize the Vagrant project**

    Run:

    ```bash
    vagrant init utm/bookworm
    ```

    This initializes a Vagrant project with the "`utm/bookworm`" box, which is
    built for x86-64 emulation. (Ensuring that the VM emulates x86-64 hardware
    is critical.)

4.  **Overwrite the Vagrantfile with a custom x86-64 configuration**

    Execute the following command to replace the Vagrantfile with a custom configuration:

    ```bash
    curl --output Vagrantfile https://cits3007.arranstewart.io/labs/lab00-mac-x64-Vagrantfile.rb
    ```

    You can alter the configuration if desired before bringing up the virtual machine,
    by editing the Vagrantfile (e.g. with `nano` or `vim`).
    The Vagrantfile contains (commented out lines) which
    configures a virtual machine with 8GB RAM and 6 CPU cores -- uncomment these
    and adjust as needed. But note that for our purposes,
    that amount of RAM and that many CPU cores are typically not needed.


5.  **Launch the x86-64 environment**

    - Start the VM by running:

      ```bash
      vagrant up
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

----

<div style="font-size: 1.2em; font-weight: bold; margin-bottom: 0.5em;">Credits</div>

This tutorial was written by Steve Beaver, with additions from
Arran Stewart.

<!--
  vim: syntax=markdown tw=90 smartindent :
-->
