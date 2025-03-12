---
title: |
  Installing CITS3007 development environment prerequisites on M-series Mac laptops
---

[homebrew]: https://brew.sh
[virtualbox]: https://www.virtualbox.org
[vagrant]: https://www.vagrantup.com
[utm]: https://mac.getutm.app

If you're running an M-series Mac, the following instructions should allow you to
install the [Homebrew][homebrew] package manager, the [Vagrant][vagrant] development
environment manager, and [UTM][utm].
(We also install VirtualBox; we don't invoke it directly -- it can't be run on M-series
Macs -- but we do make use some of VirtualBox tools in later tutorials.)

[homebrew-terms]: https://tmr08c.github.io/2016/10/glossary-of-homebrew-terms/

1.  **Install Homebrew on MacOS**

    Homebrew is a package manager for MacOS, which allows new software packages to be
    easily installed (and removed). Using it is typically much more straightforward than
    downloading and configuring DMG (disk image) files.

    - Open Terminal and run:

      ```bash
      /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
      ```

    (Note: For Apple Silicon, Homebrew is installed under `/opt/homebrew`.)

2.  **Set up Homebrew environment**

    - Append Homebrew's environment setup to your shell configuration:

      ```bash
      echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
      ```
    - Reload your shell configuration:

      ```bash
      source ~/.zshrc
      ```

    - Verify the installation:

      ```bash
      brew doctor
      ```

3.  **Install Vagrant, UTC, and VirtualBox**

    - Install Vagrant and UTC (available as Homebrew ["formulas"][homebrew-terms]):

      ```bash
      brew install vagrant utc
      ```

    - Install VirtualBox (a GUI application) using the "`--cask`" flag:

      ```bash
      brew install --cask virtualbox
      ```

    (Note: The "`brew cask`" command for installing GUI applications previously was used,
    but now has been deprecated. Instead, we now use "`brew install --cask`" for GUI apps.)


4.  **Install Vagrant plugins**

    Install the "vagrant\_utm" and "vagrant-disksize" plugins, which
    are used by later steps.

    - Install "vagrant\_utm":

      ```bash
      vagrant plugin install vagrant_utm
      ```
 
    - Install "vagrant-disksize":

      ```bash
      vagrant plugin install vagrant-disksize
      ```

5.  **Create your main environment directory**

    - Make a new directory for your development environments:

      ```bash
      mkdir ~/CITS3007_development_environment
      ```

6.  **Tips on using UTM**

    In CITS3007, we will be using UTM via Vagrant. If you want to experiment with
    running UTM, however, it's also possible to run UTM directly.
    You can find documentation for UTM [here][utm-docs], and a "gallery"
    of predefined UTM virtual machine images [here][gallery].


[utm-docs]: https://docs.getutm.app
[gallery]: https://mac.getutm.app/gallery/

----

<div style="font-size: 1.2em; font-weight: bold; margin-bottom: 0.5em;">Credits</div>

This tutorial was written by Steve Beaver, with additions from
Arran Stewart.

<!--
  vim: syntax=markdown tw=90 smartindent :
-->
