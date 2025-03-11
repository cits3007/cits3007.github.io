---
title: |
  Create an x86-64 virtual environment using UTM and Vagrant
date: 2025-03
author: created by Steve Beaver
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

5.  **Launch the x86-64 environment**

    - Start the VM by running:

      ```bash
      vagrant up
      ```



