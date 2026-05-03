---
title:  CITS3007 lab 8 (week 10)&nbsp;--&nbsp;Passwords
---

## Introduction

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

## Modern user password best practice

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

## Cryptography exercises

### Digital signatures and hash collisions

Visit the MD5 Collision Demo page, at <https://www.mscs.dal.ca/~selinger/md5collision/>. In
lectures, we've noted that the MD5 hash algorithm has been considered cryptographically
broken since 2004. It is vulnerable to collision attacks, where two different inputs
produce the same hash value -- thus, it should never be used for password hashing, digital
signatures, or sensitive data integrity checks.

Follow the provided links on that page to two PostScript documents -- the first a
letter of recommendation to an intern, and the second, an order to grant the intern
a security clearance. Download them (e.g. with `wget`), and confirm that they have
the same MD5 hash. (The command `md5 <somefile>` will display the MD5 hash.)

What exactly is a digital signature? In essence, it's an assertion of the form:

> "Person A signed this exact document."

But how do we make such an assertion? We need a way of doing so which also allows the assertion to be easily _checked_.
The trick is: rather than working with the whole document contents, we pass it through a hash function.
This produces a short, fixed-size value that acts like a "fingerprint" of the document -- changing even a single
byte of the document will result in a radically different hash value.

When someone "signs" a document, what they actually sign is this hash value. So the claim
they are making is really: "I, person A, signed a document whose hash is H."
For a good cryptographic hash function, it is easy to compute the hash of a
document, but infeasible to find a different document with the same hash. That means the
hash uniquely (for practical purposes) identifies the document.

When MD5 was "broken" in 2005, researchers showed it was possible to generate a collision
(like the PostScript documents linked to) on a typical home PC in several hours. Today,
generating an MD5 collision typically takes only minutes or second (and if an attacker
has access to GPUs to do the computation, it is effectively instantaneous).[^collision]

[^collision]: You might ask -- what exactly does it mean to "generate a collision"?
  It means that you can find two files which produces the same hash -- but there are no
  other constraints on what the files need to contain. If you need the files to, say,
  both be valid PNG files, or both be human-readable text, the task becomes harder. \
  &nbsp; Other attacks besides "collision attacks" are "preimage attacks" and
  "second preimage attacks". In a "preimage attack", you know the _hash_ of some file X,
  but don't have access to X itself, and your task is to find a second file which produces
  the same hash. In a "second preimage attack", you have some file X -- and therefore
  can easily calculate its hash -- and want to again find a second file which produces the
  same hash. MD5 is still secure for these latter two kind of attacks; it is only collision
  attacks it is vulnerable to. Nevertheless, that is enough to mean that it shouldn't be
  used for any kind of cryptographic purpose.

<div style="border: solid 2pt blue; background-color: hsla(241, 100%,50%, 0.1); padding: 1em; border-radius: 5pt; margin-top: 1em;">

::: block-caption

Generating hash collisions

:::

Technically, doing something like finding two PDF documents with the same hash is harder
than just finding a _collision_. Finding an MD5 collision means only that you have found two
binary strings -- which will just look like random binary junk -- that both produce the same
hash.  To produce controlled, meaningful messages -- documents or programs, say -- is a
harder task, and is called a "chosen-prefix collision" attack, but doing that too for MD5 is
quite feasible on a home computer or laptop.

If you are interested in generating your own MD5 collisions or chosen-prefix collisions,
software to do so is available at <https://github.com/cr-marcstevens/hashclash>, but
compiling and running it is not an essential part of this lab.

A lab worksheet that works through the process of generating collisions is available
at the Seed Security Labs site, [here][seed-hash-coll].

[seed-hash-coll]: https://seedsecuritylabs.org/Labs_20.04/Files/Crypto_MD5_Collision/Crypto_MD5_Collision.pdf

</div>

### Checking for password breaches

[pwn]: https://haveibeenpwned.com/Passwords

The ["Pwned Passwords"][pwn] site, at <https://haveibeenpwned.com/Passwords>, allows passwords
to be checked to see if they have been exposed in known data breaches.

Do you feel safe entering your password into the site? Perhaps not. Fortunately, you don't have to.
Save the following in your development environment as `passcheck.sh`, and make it executable with
`chmod a+rx passcheck.sh`:

```bash
  #!/usr/bin/env bash

  baseurl="https://api.pwnedpasswords.com/range"
  read -s pass
  hash=$(echo -n "$pass"|sha1sum)
  hashhead=${hash:0:5}
  hashtail=${hash:5:35}

  # "^^" converts to uppercase -- needed because sha1sum use _lower_-case
  # hex digits for its hash
  curl -s "${baseurl}/${hashhead}" | grep "${hashtail^^}"
```

The Pwned Passwords site relies on a system call "k-anonymity"[^k] -- you never actually send your
plaintext password to the website, or even the full hash. Rather, you just send a small _prefix_
of your hash (in this case, the first 5 characters) to the service, and it returns  a list of all
the _suffixes_ (in this case, the last 35 characters) of breached password hashes that start with that prefix.
So a full password hash is never sent between you and the server, or seen by the server.

The prefix you send is far too short to uniquely identify your password's hash -- many
different hashes will share the same prefix, so the server never sees enough information to
reconstruct or recognise your specific password.

In effect, you are asking:

> "Give me all breached hashes that start like this ..."

And you can then check, locally, "Does my password match any of them exactly?"
Your query is effectively "hidden" amongst many possible candidates, so your actual password
(or its full hash) is never revealed.

Try using the script to see if the password "password" has been breached:

```
$ printf 'password' | ./passcheck.sh
```

You should see something like

```
  1E4C9B93F3F0682250B6CF8331B7EE68FD8:52256179
```

as output, indicating that an instance of the password "password" has been found over 52 million
times in known data breaches. The pass-phrase "correct horse battery staple" had never been used
before Randall Munroe used it in his comic Xkcd -- how many times has it now been found in known data
breaches?

[^k]: See ["Validating Leaked Passwords with k-Anonymity"][val] and
  <https://haveibeenpwned.com/API/v3#PwnedPasswords> for more information on how this works.

[val]: https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity


## Cryptography questions

See if you can answer the following questions, after reviewing the material on cryptography
in the lectures.

**Question 3(a)**

:   Suppose in the CITS3007 SDE you create the MD5 hash of some password, using a command like:

    ```
    $ printf mypassword | md5sum
    ```

    In what format is the hash displayed? How large is the hash, in bytes?
    How would you write it in C syntax?




**Question 3(b)**

:   Explain why *hash collisions* occur. That is: when we are using a hash function,
    why must there always be multiple inputs that have the same hash
    value? And how many inputs will there be that "collide" to give the same hash value?



**Question 3(c)**

:   Bruce Bitwise needs a cryptographic hash function for an application he is writing.
    He decides on the following: represent the input as a single hex number; then calculate
    the hash as `h(x) = x mod 10000`. Is this a good hash function? Why or why not?




**Question 3(d)**

:   What is the purpose of salting passwords, when creating a password hash?



<!--

**Question 3(c)**

:   Look up Wikipedia to refresh your memory of what a *hash collision* is. Explain why hash
    collisions necessarily occur. That is, why must there always be two different plaintexts
    that have the same hash value?



-->


<!-- vim: syntax=markdown tw=92 :
-->
