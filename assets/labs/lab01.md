---
title: |
  CITS3007 lab 1&nbsp;--&nbsp;Development environment
---

<div style="border: solid 2pt orange; border-radius: 5pt; background-color: hsl(22.35, 100%, 85%, 1); padding: 1em;">

**Laptop requirement**

When attending lab classes, you will need access to a laptop, as this
unit makes use of software which is not permitted to be installed
on UWA lab machines.

Any one of a Windows, Linux or Mac OS laptop are
acceptable. They will need enough disk space and RAM to run Oracle
[VirtualBox][virtualbox] and a virtual machine instance -- 15 spare GB
of disk space and 4 GB of RAM would be about the minimum needed.

</div>

## 1. Setting up the C development environment { #c-devel-env }

To complete the lab work for this unit, you will use a
standardised C development environment – the one we use is based on
Ubuntu 20.04.

To access the environment, there are two options:

- Install two open source tools ([VirtualBox][virtualbox] and
  [Vagrant][vagrant]) on your laptop or home PC. See
  [VirtualBox and Vagrant](#virtualbox-and-vagrant), below.

Or alternatively:

- Access the development environment on the Web using [GitPod][gitpod]
  (which provides web-based access to development environments
  hosted in the cloud). See [Using GitPod](#using-gitpod), below.

[virtualbox]: https://www.virtualbox.org
[vagrant]: https://www.vagrantup.com
[gitpod]: https://gitpod.io/

For the first couple of labs, **either of these options** will be fine; but for
some of the later labs, you *will* need to use **VirtualBox+Vagrant**, so
you should install them now and ensure you can get them working.


### VirtualBox and Vagrant { #virtualbox-and-vagrant }

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em; margin-bottom: 1em">

**What are VirtualBox and Vagrant?**

**VirtualBox** is a type of [virtualization software][virtualization] which allows
you to run other operating systems on your computer – even operating
systems designed for completely different hardware (such as
mobile phones, for instance).
It allows precise control of what OS [kernel][kernel]
is run (we will learn more about what an OS kernel is later).
(Other technologies for running Linux do exist -- for instance,
Docker and Windows Subsystem for Linux, or WSL -- but they do not
allow the precise control over kernel version that VirtualBox does.)

**Vagrant** is a tool for managing virtual environments. It handles
tasks such as

- fetching virtual machine (VM) [images][vm-image] from the web
  and installing them in a standard location;
- checking whether any updates have been issued for an image,
  and prompting the user to download them, if so;
- allowing a user to easily manage multiple versions of the
  same basic VM image; and
- abstracting over the details of particular virtualization
  technologies.

It's widely used in industry to provide developers with a
Standard Operating Environment (SOE) for their team or
organization, so it's hoped that experience with
Vagrant will prove useful beyond your university studies.

Since the purpose of Vagrant is to manage VMs on a computer,
vagrant commands need to be run from the *host* computer
(for instance, your laptop), not from within a VM.

[virtualization]: https://en.wikipedia.org/w/index.php?title=Hardware_virtualization
[kernel]: https://en.wikipedia.org/wiki/Kernel_(operating_system)
[vm-image]: https://en.wikipedia.org/w/index.php?title=Disk_image

</div>



To install VirtualBox and Vagrant:

1.  Visit <https://www.virtualbox.org/wiki/Downloads>, download
    the appropriate VirtualBox package for your platform (Windows, MacOS or Linux),
    and install it.

    - On Windows, the installer is an `.exe` file you can simply run
      by double-clicking.
    - On MacOS, the installer is a `.dmg` file -- double click on it
      for instructions.
    - On Ubuntu distributions a `.deb` file is provided -- we assume you already know how to install
      one of these. If you are using a non-Ubuntu distribution, consult
      the VirtualBox documentation for instructions on how to install.

    <div style="border: solid 2pt orange; border-radius: 5pt; background-color: hsl(22.35, 100%, 85%, 1); padding: 1em;">

    **VirtualBox for ARM64 (M-series) Macs**

    If your computer is an ARM64-based (M-series) Macintosh, it may look
    as if there are no downloads of VirtualBox available for your
    computer. However, there are -- they are just a little harder to
    find.

    On July 19th a
    newer version of VirtualBox was released which hasn't yet been ported
    to the ARM64 architecture -- but you *can* still use the older version,
    VirtualBox 7.0.8.

    Visit <https://www.virtualbox.org/wiki/Download_Old_Builds_7_0> to
    see the older versions of VirtualBox, and download the one labelled
    "Developer preview for macOS / Arm64 (M1/M2) hosts".

    </div>



#.  Visit <https://www.vagrantup.com/downloads>, download the
    appropriate Vagrant package for your platform, and install it.

    - On Windows, the installer is an `.msi` file you can run by
      double-clicking.
    - On MacOS, you can either download a `.dmg` file, or
      (if you have [Homebrew](https://brew.sh) installed) there are
      instructions for adding Vagrant with a `brew install` command.
    - On Ubuntu, it's recommended you install Vagrant using the APT package
      manager (see "Package manager for Linux" on the Vagrant page).

    <!--
    macos old intel: may hit network issue, just google and amend
    vagrantfile
    -->

#.  Check that Vagrant has been successfully installed.

    On Windows, open a "Command Prompt" window. On MacOS or Linux, open
    a terminal window.

    Then type `vagrant --version`; Vagrant should display

    ```
    Vagrant 2.3.7
    ```

    (Or something similar – any version from 2.2.0 onwards should be
    fine.)

#.  Test a small virtual machine (VM) image.

    On your *host machine* (i.e. your laptop), create a new directory
    (called e.g. `vagrant-test`), open a terminal window and `cd` into
    the directory. (The `cd` command works on Linux, Mac and Windows.)

    Type `vagrant init generic/alpine316`, then `vagrant up
    --provider=virtualbox`.  Vagrant should take about a minute to
    download a virtual machine containing [Alpine Linux][alpine] and
    configure it for use.

    If you type `vagrant ssh`, Vagrant will connect to the new virtual
    machine using [`ssh`][ssh] and present you with a shell prompt:

    ```
    $ vagrant ssh
    alpine316:~$
    ```

    Note that the [command-line prompt][prompt] has now **changed**
    from the usual terminal prompt you see. The prompt `alpine316:~$`
    indicates that you're running commands in an Alpine Linux VM. To be able
    to run commands from your host machine again, you need to exit
    from the VM.

    You can simply exit the shell by typing `exit` or
    hitting `ctrl-D`. (It's not strictly necessary, but it's good
    practice to *halt* VMs when you're not using them --
    you can do so by issuing the command `vagrant halt` atfer you've
    exited the shell.)

    <div style="border: solid 2pt orange; border-radius: 5pt; background-color: hsl(22.35, 100%, 85%, 1); padding: 1em;">

    **Troubleshooting on Linux**

    Note that on Linux, if you happen to already have `libvirt` installed:
    `libvirt` and VirtualBox can't both run at the same time. Ensure
    that `libvirt` isn't running by typing `sudo systemctl stop
    libvirtd`.

    </div>

    <div style="border: solid 2pt orange; border-radius: 5pt; background-color: hsl(22.35, 100%, 85%, 1); padding: 1em;">

    **Troubleshooting on MacOS**

    If you're unable to complete this step on a Macintosh computer, and
    your lab facilitator is not able to resolve the issue, it's
    suggested that you:

    a. for the moment, skip to the task 2, "Concept review questions",
       and carry on from there; and
    b. attend the unit coordinator's [consultation sessions][consult] to
       troubleshoot any VirtualBox and Vagrant issues further.

    [consult]: https://cits3007.github.io/#unit-coordinator

    </div>

    [alpine]: https://www.alpinelinux.org
    [ssh]: https://www.ssh.com/academy/ssh
    [prompt]: https://en.wikipedia.org/wiki/Command-line_interface#Command_prompt

#.  Download a VM containing the standard CITS3007 development
    environment. Note that this will likely take **around 5--10
    minutes**, so once you've started the process, move onto the next
    exercise.

    On your *host machine* (i.e. your laptop), create a new directory
    (called e.g. `cits3007-test`), open a terminal window and `cd` into
    the directory.

    Type `vagrant init arranstewart/cits3007-ubuntu2004`, then `vagrant
    up --provider=virtualbox`.  Vagrant should take around 5--10 minutes
    to download a virtual machine and configure it for use. The output
    from Vagrant should look something like the following:

    ```
    Bringing machine 'default' up with 'virtualbox' provider...
    ==> default: Importing base box 'arranstewart/cits3007-ubuntu2004'...
    ==> default: Matching MAC address for NAT networking...
    ==> default: Checking if box 'arranstewart/cits3007-ubuntu2004' version '0.1.2' is up to date...
    ==> default: Setting the name of the VM: xxx-cits3007-test_1658816964468_16898
    ==> default: Clearing any previously set forwarded ports...
    ==> default: Fixed port collision for 22 => 2222. Now on port 2200.
    ==> default: Clearing any previously set network interfaces...
    ==> default: Preparing network interfaces based on configuration...
        default: Adapter 1: nat
    ==> default: Forwarding ports...
        default: 22 (guest) => 2200 (host) (adapter 1)
    ==> default: Booting VM...
    ==> default: Waiting for machine to boot. This may take a few minutes...
        default: SSH address: 127.0.0.1:2200
        default: SSH username: vagrant
        default: SSH auth method: private key
        default: Warning: Connection reset. Retrying...
        default: Warning: Remote connection disconnect. Retrying...
        default: Warning: Connection reset. Retrying...
        default:
        default: Vagrant insecure key detected. Vagrant will automatically replace
        default: this with a newly generated keypair for better security.
        default:
        default: Inserting generated public key within guest...
        default: Removing insecure key from the guest if it's present...
        default: Key inserted! Disconnecting and reconnecting using new SSH key...
    ==> default: Machine booted and ready!
    ==> default: Checking for guest additions in VM...
    ==> default: Setting hostname...
    ```

    Once it's done, you can type `vagrant ssh` to get shell access to
    the new VM:

    ```
    $ vagrant ssh
    vagrant@cits3007-ubuntu2004:~$
    ```

    Note that again, your terminal prompt has changed -- it sould look
    like this:

    ```
    vagrant@cits3007-ubuntu2004:~$
    ```

    (usually in bright green). The prompt indicates the name of the
    current user ("`vagrant`")[^vagrant-user], and the hostname for the
    machine your are in ("`cits3007-ubuntu2004`").

    If you want to issue commands on your host machine again (that is,
    on your laptop), you'll need to either

    - exit your current SSH session, either by running the command `exit`
      or by typing `ctrl-D`
    - open a new terminal window, and issue your commands from there.

    In particular, trying to run Vagrant commands from within your VM
    will *not* work, since Vagrant has not been installed within the VM.

#.  Optional: install VS Code and the "Remote-SSH" extension.

    The standard CITS3007 development environment VM comes with the
    `vim` editor already installed, and for some tasks we do,
    it will be necessary to use `vim` or another terminal-based
    editor.

    However, if you already have VS Code installed and are familiar
    with it, we provide instructions on how to configure it
    for use with a Vagrant box [here](/labs/lab01-vs-code.html).

[^vagrant-user]: Conventionally, all Vagrant VMs have a user account
  named "vagrant" on them, with the password for the account also
  set to "vagrant". This makes it easy to log into them, but note that
  normally, using a well-known, easy-to-guess, hard-coded user ID and
  password would be [*terrible* security practice][default-creds].\
  &nbsp;
  But in this case: the VM is only being used for development purposes,
  rather than deployed in production; it should only be possible to
  connect to the VM from your local computer; and the VM is unlikely to
  contain any confidential data of yours. This being so, the use of
  default credentials is usually an acceptable risk.

[default-creds]: https://en.wikipedia.org/wiki/Default_Credential_vulnerability

#### Vagrant cheat sheet

You can find a useful "cheat sheet" of commands for managing Vagrant VMs
here:
<https://cheatography.com/davbfr/cheat-sheets/vagrant-cheat-sheet/>.


### Using GitPod { #using-gitpod }

If you don't yet have access to a laptop on which you
can install VirtualBox and Vagrant, then for the first couple of
labs you can also use
a cloud-based development VM provided by [GitPod][gitpod].

We provide instructions on how to use GitPod
[here](/labs/lab01-gitpod.html).

## 2. Concept review questions

If possible, it's recommended you work on this section in pairs or small
groups and compare answers.

### 2.1. Definitions

For each of the following concepts, review the definition given in the
lecture slides, and explain it in your own words. If you can, give an
example, based on your own experience or from recent news reports:

a. threat
#. vulnerability
#. confidentiality
#. integrity
#. availability







### 2.2. Concepts

a.  How would you describe the relationship between threats,
    vulnerabilities, and attacks? Give examples to illustrate the
    relationship.

    



#.  Is it possible for a *threat* and a *vulnerability* to both exist,
    without there being an attack? Explain why or why not.

    

#.  Consider an ATM, which requires users to provide a bank card and a
    PIN in order to perform transactions. Give examples of
    *confidentiality*, *integrity* and *availability* requirements
    associated with the system. How important do you think each
    requirement is -- are they all equally important, or does the
    importance differ?

    

## 3. AusCERT security bulletins

It's recommended you complete this exercise in pairs or small groups.
Security Bulletins are sometimes not easy to understand, at first
glance, but by sharing ideas and comparing your understanding with
other students, you should be able to complete the questions in this
section.

[AusCERT][auscert] is a non-profit organisation that provides advice on cybersecurity
threats and vulnerabilities. Some of its information is publicly
available, and some is provided only to members.

Visit its website at <http://www.auscert.org.au/>, and from the
"Resources" tab, select "Security Bulletins". (The direct link is
<https://auscert.org.au/bulletins/>.)

Take a look at several, and try searching for
`ASB-2022.0077` and `ESB-2022.3655`. All bulletins have the following
features:

- They have an *ID number*. Bulletins with an ID number
  beginning with "ESB" are bulletins from external sources, being
  redistributed by AusCERT; those beginning with "ASB" are published by
  AusCERT itself. The ID number contains 4 digits indicating what year the
  bulletin was published, followed by the bulletin number within that
  year.
- They specify the product affected by some vulnerability, the operating
  system affected, and what the *resolution* (i.e. action to be taken,
  in order to mitigate or prevent the vulnerability) is.
- They refer to one or more *CVE* identifiers. The CVE ("Common Vulnerabilities and
  Exposures") identification scheme is provided by the US-based MITRE
  organisation. For instance, Auscert's bulletin `ASB-2022.0129`
  refers to `CVE-2022-30168`, the details of which can be found at
  <https://www.cve.org/CVERecord?id=CVE-2022-30168>.
- They give a CVSS (Common Vulnerability Scoring System) score. This is
  a way of quantifying the severity of a vulnerability using a number
  from 0 to 10, where 0 is the least severe and 10 the most.
  Read more about these severity ratings at
  <https://nvd.nist.gov/vuln-metrics/cvss>.

Now, find the `ESB-2022.1671` bulletin and read through it, and refer to
the NIST page on severity ratings at <https://nvd.nist.gov/vuln-metrics/cvss>.
Then answer the following questions:

a.  The bulletin is for a patch which fixes a *vulnerability*.
    What is the vulnerability (give a CVE identifier and a description)?
    In what product does it occur?

    

#.  How severe is the vulnerability? If a vulnerability is severe, does
    that necessarily mean it is easy to exploit, and/or has a high
    probability of being exploited?


    


Locate the CVE information page on <https://www.cve.org> for
this vulnerability, and follow the links there to find out more
about it. Google for the definitions of any terms you do not know --
[Wikipedia](https://en.wikipedia.org/) has good summaries of most terms.
Answer the following questions:

c.  How could an attacker exploit this vulnerability? Describe
    a scenario in which this could occur.

    


#.  Of the "C I A" security goals -- which ones could be compromised
    if this vulnerability were exploited?

    





[auscert]: http://www.auscert.org.au/

## 4. C development

<div style="border: solid 2pt orange; border-radius: 5pt; background-color: hsl(22.35, 100%, 85%, 1); padding: 1em;">

**C language familiarity**

Ideally, you should be doing this unit in your 3rd year, and have
familiarity with the C programming language.

You need to either

- have access to a **good C programming textbook** -- see the
  CITS3007 ["Resources"
  page](https://cits3007.github.io/resources/#c-programming) for one
  recommendation -- or
- be comfortable searching through and interpreting the C language pages at
  **<https://en.cppreference.com/>**.

Note that YouTube tutorials will **not** be sufficient as a C reference
for this unit -- you **must** use a textbook (or the cppreference.com
site). The lab facilitators will not be able to assist you if you are
using video tutorials instead of a C language reference.

If you are still in the process of purchasing a textbook, the
following sites may provide a helpful refresher:

- Carl Burch, [*C for Python programmers*][c-for-py]
  - Slides based on [*C for Python programmers*][c-for-py-slides]
- Steven Simpson, [*Learning C from Java*][c-from-java]
- Daniel Weller and Sharat Chikkerur, [Practical Programming in C][prac-c] (lecture slides)

[c-for-py]: http://www.cburch.com/books/cpy/index.html
[c-for-py-slides]: https://web.cs.hacettepe.edu.tr/~bbm101/fall16/lectures/w12-c-for-python-programmers.pdf
[c-from-java]: https://ssjools.hopto.org/java2c/alldiffs
[prac-c]: https://ocw.mit.edu/courses/6-087-practical-programming-in-c-january-iap-2010/pages/lecture-notes/

</div>


### 4.1. C questions

a.  What is the difference between the C literal values `3`, `'3'`,
    `"3"` and `3.0`? What is the type of each?

    





#.  Consider the following C code:

    ```C
    const char * str = "test";
    char c = str[0];

    if (c >= 65 && c <= 90) {
      printf("high\n");
    } else if (c >= 97 && c <=122) {
      printf("low\n");
    } else {
      printf("other\n");
    }
    ```

    If this code is executed, what will be printed to the terminal?


    

#.  What is the output of the question (b) code if we change the string
    `"test"` to `"TEST"`?


    

#.  What is the output of the question (b) code if we change the string
    `"test"` to `"???"`?

   

### 4.2. Cloning from `git` and modifying C programs

1.  If you don't already have one, create an account on
    [GitHub](https://github.com). `ssh` into the VM instance you created
    in section 1 ["Setting up the C development
    environment"]("#c-devel-env) (or, if using GitPod -- use the
    "terminal" window in GitPod).

2.  Visit <https://github.com/cits3007/lab01-leap-year> to look at the
    sample Git repository for this lab. You can download it by running
    (at the terminal)

    ```
    $ git clone https://github.com/cits3007/lab01-leap-year.git
    ```

    This will create a directory `lab01-leap-year` containing the repository
    code; `cd` into it, and run the following commands to tell `git` who
    you are

    ```
    $ git config --global user.name 'John Smith'
    $ git config --global user.email 'mygithubaccount@users.noreply.github.com'
    ```

    replacing "John Smith" with your own name, and `mygithubaccount` with your
    GitHub username.

    <div style="border: solid 2pt orange; background-color: hsl(22.35, 100%, 85%, 1); padding: 1em;">

    **Networking issues?**

    If `git clone` fails due to network connectivity issues, here are a couple of quick fixes to try:

    - In the VM, run the command

      ```
      $ echo nameserver 8.8.8.8 | sudo cat -a /etc/resolv.conf
      ```

      This can fix issues with DNS ("Name or service not known"), as it points the VM
      to a Google-maintained DNS server at IP address 8.8.8.8.

    - For the moment, try using a different VM image -- in a fresh directory, try `vagrant init bento/ubuntu-20.04`
      and repeat the steps for bringing a VM up.

      Within the VM, you'll want to run `sudo apt install build-essential` to ensure `gcc` and `make` are
      installed. This image will be OK to use for the next few labs, til we can diagnose the problem.


    </div>

3.  Build the `test_leap` program by typing `make`, then try running it
    with various different command-line arguments:

    ```
    $ ./test_leap 1901
    $ ./test_leap 1900
    $ ./test_leap 2000
    $ ./test_leap -1
    $ ./test_leap -0
    $ ./test_leap 9223372036854775807
    $ ./test_leap 9223372036854775808
    $ ./test_leap foo
    $ ./test_leap foo bar
    ```

    What results do you get? Take a look at the code in `test_leap.c`,
    read the documentation for the `strtol` function (by running
    `man strtol`),
    and explain what is happening in each case.

   

4.  Create a repository on GitHub that will hold your own version of
    this code. Visit <https://github.com>, click on the plus ("+")
    symbol in the top right-hand corner of the page, select "new
    repository", and give your repository a name (e.g.
    "cits3007-test-repo") under "Repository name". ("Owner" should be
    set to your GitHub account name.)

    Then click "Create repository".

5.  You'll need to create an SSH id, for use with GitHub.

    Type `ssh-keygen` in the VM, and hit "`enter`" in response to any
    questions.

    Type `cat ~/.ssh/id_rsa.pub` in the VM -- a long line starting with
    "`ssh-rsa`" should be displayed.

    Go to "GitHub settings" (top right of the GitHub page, and select
    "Settings" from the drop-donw menu), then "SSH and GPG keys",
    and click "new SSH key".

    Give your SSH key a name (e.g. "cits3007 ssh key"), then paste the
    output of the `cat` command into the box marked `key`, and click
    "Add SSH key".

6.  In your Linux terminal, type

    ```
    $ git remote remove origin
    $ git remote add origin git@github.com:mygithubaccount/cits3007-test-repo.git
    $ git push -u origin master
    ```

    replacing "`cits3007-test-repo`" with the name of the repository you
    created in step 4, and `mygithubaccount` with your GitHub
    username.

    When you originally cloned the repository, you created a local
    repository (contained in the VM) which was "linked" to the remote
    GitHub repository hosted at
    <https://github.com/cits3007/lab01-leap-year>.

    The commands above remove the link to
    <https://github.com/cits3007/lab01-leap-year> (since you don't have
    permission to write to that repository), and replace it with a link
    to the new repository you *can* write to.

    The SSH key you've created consists of two parts -- a *public* part,
    located in `~/.ssh/id_rsa.pub` on the VM, which you can freely share with
    anyone, and a *private* part (located in `~/.ssh/id_rsa` on the VM), which you
    should keep secret. You will probably want to store these for later
    use. Running

    ```
    $ vagrant ssh -- cat ~/.ssh/id_rsa.pub > id_rsa.pub
    $ vagrant ssh -- cat ~/.ssh/id_rsa > id_rsa
    ```

    will copy the files to your host machine so you can use them later.
    (Type `vagrant upload --help` for information on how you can upload
    them to another VM.)

6.  The code in `test_leap.c` contains an error. The correct algorithm
    for determining whether a year is a leap year is outlined at
    <https://en.wikipedia.org/wiki/Leap_year#Algorithm>, but the code in
    `test_leap.c` incorrectly reports that (for instance) 1900 is a leap
    year, when it is not. (Can you spot any other errors? Feel free to
    post in the Help3007 forum if you can.)

    Fix the code in `test_leap.c` and test your changes by trying the
    values from step 3 again.

    Then, when you are satisfied, run the command `git push` to
    push your changes to the GitHub-hosted remote version of your
    repository.

    Compare your changes with another student's – are there any
    differences between how you fixed the program?

    


### 4.3. Using version control and backing up

If you haven't used `git` for version control before, it's suggested you
work through the "[Version Control with Git][sw-carp-git]" exercises
published by [Software Carpentry][sw-carp]:

- <https://swcarpentry.github.io/git-novice/>

If you *have* used `git` before, you may still find the following "cheat
sheet" useful for refreshing your memory of Git's commands:

- <https://education.github.com/git-cheat-sheet-education.pdf> (PDF)

It's expected that you keep your project work for CITS3007 under version
control (so that facilitators can easily see what work you've already
done, and what you're currently trying to do), and that you keep an
up-to-date remote copy of your code with a Git hosting provider such as
GitHub – make sure you `git push` to it frequently. You don't have to
use GitHub if you prefer to use another provider ([GitLab][gitlab] is
another popular one), and you can even host the repository yourself if
you have some reliable way of doing so.

It's also expected that you will keep reliable backups of any work you
submit – visit <https://missing.csail.mit.edu/2019/backups/> for an
explanation of what is a reasonable approach to backing up (namely,
following the "3-2-1" rule). While GitHub is a good offsite location for
hosting source code, you may also wish to back up other sorts of work
and documents.  Offsite copies of non-code work can be stored using the
[*student network storage*][stud-storage], or alternatively, backup
services can be purchased for as little as $5 per month (e.g. from
<https://www.carbonite.com>).[^tarsnap]

Ways of using the student network storage are explained on the UWA Library
page "[Student email and collaboration tools][stud-collab]", under the
heading "Access the student collaboration tools".


[sw-carp-git]: https://swcarpentry.github.io/git-novice/
[sw-carp]: https://software-carpentry.org/lessons/index.html
[gitlab]: https://about.gitlab.com
[stud-storage]: https://www.it.uwa.edu.au/it-help/storage
[stud-collab]: https://www.uwa.edu.au/library/Help-and-support/Student-email-and-collaboration-tools

[^tarsnap]: Another option is [Tarsnap][tarsnap], which is very cheap,
  but rather complex to set up.
  The MIT page at <https://missing.csail.mit.edu/2019/backups/> lists other backup
  hosting providers under "Resources".

[tarsnap]: https://www.tarsnap.com

## 5. Moodle signup and/or login

For upcoming quizzes and tests, we'll be using the CSSE Moodle server,
available at <https://quiz.jinhong.org>.

There is currently one Moodle quiz available -- it is not assessed, but you
should attempt it, as the material covered is examinable later.
You can use that quiz to revise or refresh your knowledge of C.

Visit <https://quiz.jinhong.org> and sign up
with your UWA email address, then attempt the quiz
in your own time, if you don't finish it in the lab.


<!-- vim: syntax=markdown tw=72 smartindent :
-->
