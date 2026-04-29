---
title:  CITS3007 lab 9 (week 11)&nbsp;--&nbsp;Passwords&nbsp;--&nbsp;solutions
---

## 1. Introduction

Passwords are one of the oldest,[^age] most widely used mechanisms for authenticating users -- found
everywhere from web apps and APIs, to operating systems and IoT devices. Other authentication
methods have since become available (such as biometric logins and hardware tokens), but
passwords still underpin access control for the vast majority of services.

[^age]: Roman soldiers used "watchwords" to identify each other (especially at night, to
  distinguish allies from potential enemies). These watchwords would often be changed daily for
  security. See Polybius's *Histories*, translated by E.S. Shuckburgh (London: Macmillan,
  1889), p 487, available at [Project
  Gutenberg](https://www.gutenberg.org/files/44125/44125-h/44125-h.htm#Page_487).



However, using passwords alone is increasingly considered insecure. Modern best practice
favours [multi-factor authentication][mfa] (MFA), where a password is combined with
something the user *has* (like a phone or hardware key) or something they "*are*" (like a
fingerprint). Relying on passwords alone leaves systems too easily vulnerable to
["credential stuffing"][cs] (attackers re-using stolen passwords) and brute-force attacks.

[mfa]: https://en.wikipedia.org/wiki/Multi-factor_authentication
[cs]: https://en.wikipedia.org/wiki/Credential_stuffing

The way we hash and store passwords has evolved significantly in the past few decades.
Simple hashing algorithms like [MD5][md5] or [SHA-1][sha1] are no longer considered
acceptable for use in securing systems. Today, secure systems use slow, salted,
[key-stretching][ks]
algorithms like **[bcrypt][bcrypt]**, **[scrypt][scrypt]**, or **[Argon2][argon2]** to make
attacks computationally expensive.

Guidelines have also shifted. Prior to the late 2010s, typical advice for generating
passwords was that they should:

- Have minimum "complexity" requirements, requiring a mix of uppercase and lowercase
  letters, numbers, and punctuation
- Avoid dictionary words
- Be [changed frequently][passpol] (for instance, every 30, 60 or 90 days -- even without any evidence
  of compromise)
- Never be reused across systems (even though it's impossible for a user to manage a large
  number of passwords without the help of a [password manager][pm] -- and these were less
  commonly used, at the time)
- Use "security questions" (e.g. a user's mother's maiden name, or first pet) as backup or
  secondary authentication -- even though answers to these questions can often be guessed or
  found out.

[pm]: https://en.wikipedia.org/wiki/Password_manager
[passpol]: https://en.wikipedia.org/wiki/Password_policy

Much of the burden was placed on users to come up with strong passwords, remember dozens of
them, rotate them regularly, and never write them down.

**Exercise**

:   See if you can find the password guidelines for some of the organizations
    you work or study at. How many of them use practices from the list above?

**Question**

:   Of the secure design principles we've looked at in lectures, which one
    do the guidelines above violate?



<div class="solutions">

The principle of psychological acceptability.

Psychological acceptability is one of Saltzer and Schroeder's classic principles of secure
system design, and suggests that security mechanisms should not make the system harder to use
than necessary, and should fit naturally into how users think and behave.

But old-style password rules make passwords:

- hard to remember: humans are bad at memorising lots of complex, arbitrary strings.
- hard to type correctly: instead of being English or other natural language words, they
  contain digits and punctuation in unusual places.
- tempting to reuse, or write down: if people are forced to change passwords frequently, or
  aren't encouraged to use a password manager, they'll likely reuse passwords with slight
  variations, or write the passwords down (e.g. on a sticky note affixed to the computer
  screen).

</div>




By 2017, many standards bodies, such as [NIST][nist], had abandoned these practices.
They resulted in users:

- Coming up with passwords like `Tr0ub4dor&3`, which are hard for humans to remember (which
  of the "o's" was actually a "`0`"?), and are not especially resistant to cracking.
- Incrementing passwords (`Password1`, `Password2`, etc.), reusing old ones, or writing them
  down, to deal with frequent requests to change passwords.

In short, as the [comic XKCD explains][xkcd], these practices trained people to use
passwords that are hard for humans to remember, but easy for computers to guess.

[nist]: https://www.nist.gov
[xkcd]: https://xkcd.com/936/

```{=html}
<div style="display: flex; justify-content: center; align-items: center; ">
```

[![](https://imgs.xkcd.com/comics/password_strength.png)](https://xkcd.com/936/)

```{=html}
</div>
```

## 2. Modern user password best practice

Instead, modern best practices advocate that for user accounts[^password-recs]

- Multi-factor authentication should be required, wherever possible to implement,
  in order to add a second layer of defence;
- Users should be encouraged to use passwords made of multiple words or a memorable phrase --
  they're easier for users to recall and harder for attackers to crack than short, "complex"
  strings -- or to use a password manager to generate and store strong, unique passwords for
  every site.
- There should be no forced rotation of passwords unless a compromise is suspected or confirmed.
- Users should be prevented from selecting passwords found in data breaches or which follow
  known weak patterns, reducing the risk of credential stuffing attacks.

[^password-recs]: See section 5.1.1, "[Memorized secrets"][memsec] of NIST standard
  [SP 800-63B][nist-std]

The UK National Cyber Security Centre (NCSC) provides a [helpful page of
advice][ncsc-advice] for system owners on modern best practices, which is worth reading
through.

[ncsc-advice]: https://www.ncsc.gov.uk/collection/passwords/updating-your-approach#PasswordGuidance:UpdatingYourApproach-Don'tenforceregularpasswordexpiry

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em;">

::: block-caption

Service accounts

:::

Note that the above advice only applies to *user* accounts used by
*humans*. Credentials are also needed by so-called [*service accounts*][serv-acc]. These
are accounts used by automated tools (such as scripts, bots, or background services) in
order to authenticate themselves, typically to other systems.

For instance, if your computer uses a backup program which backs your files up
to cloud storage, then it will need some sort of credential -- an account name and
password, or equivalent[^serv-creds] -- for the cloud provider (such as [Backblaze][bb]
or [Carbonite][carb]) who provides that backup storage.

[bb]: https://www.backblaze.com
[carb]: https://www.carbonite.com

For service accounts, different considerations apply, since often:

- Service accounts often use only _one_ factor to authenticate. (Your backup program can't
  ask you to supply your thumbprint every night at 2 a.m.)
- Unlike humans, computer programs don't need their credentials to be "memorable" -- they can just
  as easily use a completely randomly generated string of bytes or characters.

OWASP calls accounts like these
["Non-Human Identities"][nhi], and notes that [best practice][service-rot] is still to
ensure the credentials they use regularly expire (or are rotated).

</div>

[^serv-creds]: Sometimes service accounts will authenticate themselves using a password-like
  value. But often a preferred approach is for them to use a public-private [key pair][kp].
  When the service account needs to authenticate itself to another system, it sends an
  authentication request; the foreign system provides a randomly generated value (a
  "challenge") which the service account then must encrypt with its private key (producing a
  "response"), proving that it is who it claims to be.  This is basically the same method the
  Git program uses to [authenticate itself on your behalf to GitHub][github-challenge] if
  you use an SSH key pair to authenticate -- it's called a [challenge--response protocol][cprot].

[memsec]: https://pages.nist.gov/800-63-3/sp800-63b.html#memsecret
[nist-std]: https://pages.nist.gov/800-63-3/sp800-63b.html
[serv-acc]: https://en.wikipedia.org/wiki/Service_account
[nhi]: https://owasp.org/www-project-non-human-identities-top-10/2025/
[service-rot]: https://owasp.org/www-project-non-human-identities-top-10/2025/7-long-lived-secrets/
[kp]: https://en.wiktionary.org/wiki/keypair
[github-challenge]: https://medium.com/@mehul25/how-github-ssh-keys-work-25dcd2452512
[cprot]: https://csrc.nist.gov/glossary/term/challenge_response_protocol


[md5]: https://en.wikipedia.org/wiki/MD5
[sha1]: https://en.wikipedia.org/wiki/SHA-1
[ks]: https://en.wikipedia.org/wiki/Key_stretching
[bcrypt]: https://en.wikipedia.org/wiki/Bcrypt
[scrypt]: https://en.wikipedia.org/wiki/Scrypt
[argon2]: https://en.wikipedia.org/wiki/Argon2

## 3. Cryptography questions and exercises

See if you can answer the following questions, after reviewing the material on cryptography
in the lectures.

**Question 3(a)**

:   Suppose in the CITS3007 SDE you create the MD5 hash of some password, using a command like:

    ```
    $ printf mypassword | md5sum
    ```

    In what format is the hash displayed? How large is the hash, in bytes?
    How would you write it in C syntax?



<div class="solutions">

::: block-caption

Sample solution

:::

If we run the commands, we get output like the following:

```
$ printf mypassword | md5sum
34819d7beeabb9260a5c854bc85b3e44  -
```

The first "word" of output is the actual hash; the "-" represents the name of the file being
hashed (in this case, "-" represents standard input).

The hash is a sequence of hexadecimal digits, and represents 16 bytes (or 128 bits).

Each pair of characters in the original hash represents one byte, so
if stored in C as an array of bytes, we could write it as follows:

```c
  // fragment 1
  char somehash[] = {0x34, 0x81, 0x9d, 0x7b, 0xee, 0xab, 0xb9, 0x26,
                     0x0a, 0x5c, 0x85, 0x4b, 0xc8, 0x5b, 0x3e, 0x44};
```

Strings in C also allow us to use hexadecimal escape sequences, so we could also write the
following:

```c
  // fragment 2
  char somehash[] = "\x34\x81\x9d\x7b\xee\xab\xb9\x26"
                    "\x0a\x5c\x85\x4b\xc8\x5b\x3e\x44";
```

The difference is that in fragment 1, `somehash` is a "plain" array or buffer, of size 16
elements, but in fragment 2, `somehash` is a null-terminated C string, so the array will be
of size 17.

Note that best practice suggests that in the above examples, we should [specify an exact
size][sz] for the array, rather than relying on it being implicitly defined, and should use
an [`enum` or `#define`][arr] to specify the size, rather than a magic number -- so the
first example becomes

[sz]: https://wiki.sei.cmu.edu/confluence/display/c/ARR02-C.+Explicitly+specify+array+bounds%2C+even+if+implicitly+defined+by+an+initializer
[arr]: https://wiki.sei.cmu.edu/confluence/display/c/ARR00-C.+Understand+how+arrays+work


```c
  // fragment 1
  enum {
    HASH_SIZE = 16
  };

  char somehash[HASH_SIZE] = {
      0x34, 0x81, 0x9d, 0x7b, 0xee, 0xab, 0xb9, 0x26,
      0x0a, 0x5c, 0x85, 0x4b, 0xc8, 0x5b, 0x3e, 0x44
  };
```


<!--

I've seen it suggested that MISRA C explicitly encourages enums over #defines,
but can't see evidence of that. See e.g. MISRA C 2013.

MISRA C 2013: document is copyright ... but see
<https://electrovolt.ir/wp-content/uploads/2022/09/MISRA-C_2012_-Guidelines-for-the-Use-of-the-C-Language-in-Critical-Systems-Motor-Industry-Research-Association-2013-2013.pdf>

-->


</div>



**Question 3(b)**

:   What is the purpose of salting passwords, when creating a password hash?



<div class="solutions">

::: block-caption

Sample solution

:::

Salting passwords prevents several common attacks on passwords.

If a password is used unsalted, directly as is, then every user in the world who
happens to use the password "qwerty", for instance, will have exactly the
same hash for their password (assuming the same algorithm is used).
If we used the MD5 hashing algorithm,[^md5] then every user who uses the password "qwerty"
will get the hash `d8578edf8458ce06fbc5bb76a58c5ca4`:

[^common-passwords]: See <https://en.wikipedia.org/wiki/Wikipedia:10,000_most_common_passwords>
[^md5]: Note that as per the lectures, MD5 should **not** be used in practice as a password
  hashing function; a dedicated function like SCrypt should be used instead.

```
$ printf qwerty | md5sum
d8578edf8458ce06fbc5bb76a58c5ca4  -
```

That means if an attacker happens to get hold of the list of hashed passwords, it's
extremely easy for them to find out what the user's password is -- *despite* the fact that
hashes are "difficult to reverse".

The attacker knows that many people choose [very common passwords][common-passwords] and
that "qwerty" is one of these, and that the MD5 hash of "qwerty" is
`d8578edf8458ce06fbc5bb76a58c5ca4`. So if the attacker has a list of the hashes of common
passwords, they'll easily recognize them whenever they appear.

[common-passwords]: https://en.wikipedia.org/wiki/Wikipedia:10,000_most_common_passwords
[rt]: https://en.wikipedia.org/wiki/Rainbow_table

Adding a random salt to the password destroys this straightforward correspondence between
password and hash.



In a bit more detail -- how could attackers try to make use of a list of leaked, but hashed passwords?
Let's assume an attacker has access to a list of hashes for 100,000 of our customers, and
wants to obtain the original passwords. There are a
few options, depending on whether the hashes are salted or unsalted, and what kind of hash
algorithm we used.

1.  **Full brute-force with real-time hashing (fast hash algorithm and unsalted hashes only)**

    Modern GPUs can compute billions of hashes per second using fast hash algorithms like
    MD5 (e.g., \~67 billion/sec on a
    mid-range 5-year-old NVIDIA GPU).[^nvidia] This sounds fast, and can be used to
    brute-force _short_ passwords that use these algorithms with no salt.

    But once we consider all alphanumeric passwords up to length 8,
    that's roughly 200 trillion passwords,[^len-8-p] which would take over 8 hours
    for one full scan. For large-scale attacks (e.g., cracking 100,000 user hashes), this
    becomes practically impossible due to enormous total time and cost. So attackers
    _don't_ normally rely on pure brute force.

    Salts are combined with the password (e.g. concatenated or prepended) before hashing, so
    they effectively expand the password space (e.g. just a 1-byte salt prepended to our
    $\leq$ length 8 passwords expands the password space from 200 trillion to around 5
    quadrillion). This makes pure brute force infeasible in most real-world cases.

    (And as we know, modern systems *shouldn't* be using fast hash algorithms like MD5, but dedicated
    slow password hashing algorithms like bcrypt, scrypt and Argon2.)

    *tl;dr:* Only feasible for very short, unsalted passwords using fast hash functions like
    MD5.

[^nvidia]: See [here][hashcat-bench]
  for benchmarks of the Hashcat tool using unsalted MD5 hashes on an
  NVIDIA GeForce RTX 3090. Graphics processors are often used for password cracking, because
  they contain many thousands of cores, so can be used to calculate a large number of hashes
  in parallel.

[hashcat-bench]: https://openbenchmarking.org/test/pts/hashcat&eval%3D56eb2bb43fd8ce50f21bde1f712a2c57b37a8ac9

[^len-8-p]: The number of possible characters is $26 + 26 + 10$ (uppercase, lowercase and
  digits). So the total number of passwords is
  $62^1 + 62^2 + ... + 62^8 \approx 2.2 \times 10^{14}$, or around 200 trillion.

2.  **Precomputed hashes (simple in-memory lookup table -- only for fast hash algorithms,
    with small hash size, and unsalted hashes)**

    Leaked lists exist of, say, 10 million popular plaintext passwords (e.g. the RockYou
    list[^rockyou]). Assume each password--hash pair includes the plaintext (say, 10 bytes
    on average -- true for the RockYou list) and an MD5 hash (16 bytes), total storage is
    then around 300 MB -- easily small enough
    to fit into RAM. This allows for extremely fast hash-to-password lookups via a simple table.

    The hashes need to be precomputed, but that doesn't take long -- at 67 billions of
    hashes per second, it takes less than a millisecond.

    The approach breaks down completely, however, if the stored hashes are salted. Each user's
    hash depends on both the password and a unique salt. For 10,000 users with unique
    salts, that's effectively 10,000 versions of the 300 MB table -- about 3 terabytes total.
    (Even more with larger dictionaries or hash algorithms that produce longer bytestrings.
    SHA-1 produces 20-byte output. Modern algorithms like scrypt, bcrypt and Argon2 are
    configurable, but typically are used to produce 32 byte hashes, so 6 terabytes total;
    and the time to precompute the hashes would be much longer, too.)

    *tl;dr:* Very efficient for unsalted hashes, generated from fast hash algorithms which
    produce smallish-sized output (e.g. MD5), but completely undermined by salting.

[^rockyou]: In 2009, software development company RockYou [was breached][rockyou-wiki]; they stored a list
  of 14 million passwords in plain text. (See
  <https://www.kaggle.com/datasets/wjburns/common-password-list-rockyoutxt>). It is widely
  used in security research and password cracking.

[rockyou-wiki]: https://en.wikipedia.org/wiki/RockYou

3.  **Rainbow tables (in-memory tables with space--time trade-offs)**

    Rainbow tables are a clever optimisation of precomputed hash attacks. Rather than
    storing every possible password--hash pair, they perform additional calculations
    at runtime, but can reduce storage requirements drastically. ([Wikipedia][rt]
    gives a fuller explanation, for those who are interested.)

    For hash algorithms like MD5 or SHA-1, rainbow tables can compress the
    entire space of all short (e.g. $\leq 8$ character) passwords into a few gigabytes, making
    it feasible to load the table into RAM. Once in memory, lookups are very fast,
    even with the extra calculations needed.

    But there are two drawbacks. Firstly, rainbow tables need to be pre-prepared
    (we need to precompute all the hashes) -- this can take hours or days.
    Secondly, the entire technique fails if even a single salt byte is added. Since each salt
    value changes the output hash, a separate rainbow table would be needed for each
    possible salt. This ends up multiplying storage needs by billions.

    Widespread use of salts has rendered rainbow tables obsolete, except when attacking
    systems that are old or have very poor security. These do still occur, though -- in
    June 2020, the online antiques marketplace LiveAuctioneers suffered a data
    breach, and was discovered to be storing passwords as unsalted MD5 hashes.[^live]

    *tl;dr* Rainbow tables shrink the storage needed for unsalted hash attacks, but are useless against salted hashes.

[^live]: See Troy Hunt, <https://x.com/troyhunt/status/1297036195315085313>, linking to
  *The Daily Swig* cybersecurity news article, ["LiveAuctioneers data breach: Millions of
  cracked passwords for sale, say researchers"][liveau]

[liveau]: https://portswigger.net/daily-swig/liveauctioneers-data-breach-millions-of-cracked-passwords-for-sale-say-researchers

4.  **Salted hashes with slow, modern algorithms**

    Best-practice password storage uses a unique, random salt per user, and a
    key-stretching algorithm designed to be expensive to compute, such as bcrypt,
    scrypt, or Argon2. These algorithms deliberately slow down hashing to make
    large-scale attacks computationally impractical, even with modern GPUs or custom
    hardware.[^asic]

    In practice, how many guesses could an attacker attempt? The above algorithms
    allow system designers to alter the RAM and time needed to compute a single hash.

    - With bcrypt at cost factor 12 (default in many libraries), a single GPU can
      manage only 100--200 guesses per second per target.
    - Argon2 or scrypt with high memory usage may reduce this to 10 guesses
      per second or fewer.

    So even if a user has used one of the 10 million most common passwords,
    attacking the hash of just that one user could take a million seconds, which is about
    12 days. We can't re-use the results of our calculations for other customers,
    because they all will have a different salt. And spending 12 days each for _all_ the
    10,000 customers is completely uneconomic.

    This is why salts and slow hashes are important -- they reduce targeted,
    per-user brute-force attacks to a very slow rate, _even_ when the user has
    used a short, not very secure password -- and prevent attackers from
    re-using the results of previous calculations.

    And if a long, unique password is used? Then an attack is not feasible at all --
    the space of all possible passwords is just too large.

    *tl;dr*: Renders brute force attacks infeasible even for short, bad passwords. For long, good
    passwords -- no chance.

[^asic]: Field-programmable gate arrays
  ([FPGAs][fpga]) are more expensive than GPUs, but faster, and tyically have lower power
  consumption. Custom integrated circuits with a specific hash algorithm "baked in"
  to them (application-specific integrated circuit, or [ASICs][asic]) are fastest of all and
  have even lower power consumption, but are inflexible and expensive to produce -- they're
  used for tasks like Bitcoin mining due to their speed and low operational costs.


[fpga]: https://en.wikipedia.org/wiki/Field-programmable_gate_array
[asic]: https://en.wikipedia.org/wiki/Application-specific_integrated_circuit

<!--

todo --

provide some illustrative figures

A roughly five-year-old graphics card can compute about 67 billion MD5 hashes per
second.[^nvidia] This means that an attacker using just an old graphics card could

1.  Check all 10 million passwords from a leaked list like RockYou[^rockyou] in less than a
    millisecond.
2.  Brute-force all (exactly) 8-character length lowercase passwords (\~200 billion combinations) in just a few seconds.
3.  Try all (exactly) 10-character lowercase passwords (\~26 trillion combinations) in under a minute.
4.  Search through all $\leq$ 8-character alphanumeric passwords (\~200 trillion combinations) could be done in
    about 3--4 minutes.



TODO:

do we have any stats on how widespread use of salts is?

Troy Hunt of haveibeenpwned occasionally comments

<https://www.troyhunt.com/the-race-to-the-bottom-of-credential-stuffing-lists-and-collections-2-through-5-and-more/>
- in 2019, mentions salted MD5 hashes, from a breach "at least 10 years old"

in 2020, he tweeted

https://x.com/haveibeenpwned/status/1297034875988357130

> New breach: LiveAuctioneers was hacked in June and 3.4M user accounts exposed. Data
> included names, email and IP addresses, physical addresses, phones numbers and passwords
> stored as unsalted MD5 hashes. 79% were already in @haveibeenpwned > . Read more:
> https://portswigger.net/daily-swig/liveauctioneers-data-breach-millions-of-cracked-passwords-for-sale-say-researchers

so some systems clearly are not using salt at all.

-->

</div>



**Question 3(c)**

:   Look up Wikipedia to refresh your memory of what a *hash collision* is. Explain why hash
    collisions necessarily occur. That is, why must there always be two different plaintexts
    that have the same hash value?



<div class="solutions">

::: block-caption

Sample solution

:::

Every hash function outputs results which are of some exact, fixed size; the exact size will
depend on the function. (For instance, we've seen above that the MD5 algorithm always
outputs hashes of 16 bytes.)

The *input* to a hash function, however, is a sequence (usually of bytes) of arbitrary
length. The input domain is therefore infinite, but the output range of the function is
finite: hence, for any one hash value, there must always be an infinite number of plaintexts
which produce that hash value.

We can see this more straightforwardly if we imagine a hash function that produces outputs of only
*one* byte in length. Such a function would not be very useful for cryptography purposes
(can you explain why?), but we could use it for example to distribute items across a hash
table of size less than 256.

The output of the function is one byte (256 different values), but it will operate on any
arbitrary sequence of input bytes. It therefore follows that for each of the 256 output
results, there must be an infinite number of inputs which produce it.

</div>



## 3. CITS3007 project

You can use your lab time to work on the CITS3007 project. You may wish to discuss your
project tests and code design with other students or the lab facilitators (although the
actual code you submit must be your own, individual work).

<!-- vim: syntax=markdown tw=92 :
-->
