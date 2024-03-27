---
title:  CITS3007 lab  9 (week 10)&nbsp;--&nbsp;Cryptography
---

`~\vspace{-5em}`{=latex}

This lab demonstrates how to perform basic encryption tasks using a
cryptograpyhy library called [libsodium][libso].
The library allows us to perform tasks like encryption, decryption,
signature checking, and password hashing.
It provides a C API, but for convenience, we will make use of it from
Python for this lab.

In general, it's best to use high-level cryptography libraries like libsodium
rather than low-level ones which require us to have a thorough knowledge
of cryptography primitives in order to use them correctly.


[libso]: https://doc.libsodium.org



First, we need to install libsodium installed in our Python environment.
Run the following commands in your development VM:

```bash
$ sudo apt-get install python3-pip
$ pip install pysodium
```

This ensure we have the `pip` command available for managing Python
libraries, then uses it to install pysodium.


### Exercise -- generating a key pair

Save the following as `keygen.py`:

```{.python .numberLines}
import nacl.utils
from nacl.public import PrivateKey
from nacl.encoding import HexEncoder

def write(name, hex, suffix):
    filename = 'key_' + name + suffix 
    with open(filename, 'wb') as ofp:
      ofp.write(hex)

def make_keys(name):
    secretKey = PrivateKey.generate()
    write(name, secretKey.encode(encoder=HexEncoder), '.sk')
    publicKey = secretKey.public_key
    write(name, publicKey.encode(encoder=HexEncoder), '.pk')

key_name = input("Enter a name for the key pair to generate: ")

make_keys(key_name)
```

Run it by executing `python3 keygen.py`, and entering a name
(this could be a particular purpose you're generating the key pair
for -- for instance, `secret-communications-with-lawyer` -- or just
your own name).

This will generate two files, `key_[NAME].sk` and `key_[NAME].pk`,
which hold our private and public keys, respectively.

In detail, here's how the code works:

- Lines 1-4 import several modules:

  - `nacl.utils`: This module provides general utility functions for
    working with libsodium.
  - `nacl.public.PrivateKey`: This is a class from the `nacl.public`
    module used to generate a pair of public and private keys for
    encryption.
  - `nacl.encoding.HexEncoder`: This class from the `nacl.encoding`
    module is used to encode binary data as hexadecimal strings.

- The code defines two functions:
  - `write(name, hex, suffix)`: This function is responsible for writing
    the hexadecimal representation of a key (either a secret key or a
    public key) to a file with a specific name and suffix.
  - `make_keys(name)`: This function generates a pair of public and
    private keys, writes them to separate files, and takes a
    user-provided name for the key pair.

- Lines 11-15:
   - Inside the `make_keys(name)` function, a secret key is generated
     using `PrivateKey.generate()`. This secret key will be used for
     encryption and decryption by you (the user creating the key pair).
   - The secret key is encoded as a hexadecimal string using
     `HexEncoder` and written to a file with the `.sk` suffix.
   - The public key is extracted from the secret key and similarly
     encoded and written to a file with the `.pk` suffix.

- Lines 17--19:

  The code uses `input()` to prompt the user to enter a name for the key
  pair they want to generate, then calls `make_keys` to do the
  generation.

The secret key (in the ".sk" file) can be used by the user, you, to
encrypt, decrypt and sign messages. The public key (in the ".pk" file)
can be published to others, and can be used by other people to encrypt
messages written to you, or decrypt messages written by you.

### Using the key pair to encrypt

If possible, get another person in the lab to generate a key pair,
and exchange public keys. Alternatively, create a second key pair with
a different name (e.g. "other"), and choose this to be the "other
person".

Encrypt a message using the recipient's public key and your private key.
Save the following script as `encrypt.py`:

```{.python .numberLines}
import nacl.utils
from nacl.public import PrivateKey, PublicKey, Box
from nacl.encoding import HexEncoder

class EncryptFile :
    def __init__(self, sender, receiver):
        self.sender = sender
        self.receiver = receiver
        self.sk = PrivateKey(self.get_key(sender, '.sk'), encoder=HexEncoder)
        self.pk = PublicKey(self.get_key(receiver, '.pk'), encoder=HexEncoder)

    def get_key(self, name, suffix):
        filename = 'key_' + name + suffix
        file = open(filename, 'rb')
        data = file.read()
        file.close()
        return data

    def encrypt(self, textfile, encfile):
        box = Box(self.sk, self.pk)
        tfile = open(textfile, 'rb')
        text = tfile.read()
        tfile.close()
        etext = box.encrypt(text)
        efile = open(encfile, 'wb')
        efile.write(etext)
        efile.close()

sender = input("Enter the name for your key pair: ")
recip = input("Enter the name for the recipient's key pair: ")
encrypter = EncryptFile(sender, recip)
target_file = input("Enter a file to encrypt: ")
encrypter.encrypt(target_file, f'{target_file}.enc')
print('Done!')
```

Run it with the command `python3 encrypt.py`.
You will need to provide the name of your key pair (from the
previous exercise), the recipients key pair, and a file to encrypt
(you can just choose the `encrypt.py` script if you have
no other text file handy).

The script should create a binary file `ORIG_FILE.enc` (where
`ORIG_FILE` is whatever the name of the original file was) -- this is
the encrypted file.

In more detail, here is what the script does:

- Define a class `EncryptFile`.

  - The code defines a Python class named `EncryptFile`. This class is
    designed to handle file encryption operations.
  - The constructor (`__init__`) of this class initializes the sender
    and receiver names and loads the sender's private key (with
    extension `.sk`) and the
    receiver's public key (with extension `.pk`) from files.
   - The `get_key` method is used to read the contents of a key file
     (either a `.sk` or `.pk` file) and return it as binary data.
   - The `encrypt` method is used to encrypt a file. It loads the
     contents of a text file specified by `textfile`, encrypts it using
     the sender's private key (`sk`) and the recipient's public key
     (`pk`), and then writes the encrypted data to a new file specified
     by `encfile`.

- lines 29--34:

  - The code prompts the user to enter the names for their key pair
    (`sender`) and the recipient's key pair (`recip`) and a file to
    encrypt.
  - An instance of the `EncryptFile` class is created with the sender's name and the recipient's name.
  - The `encrypt` method of the `EncryptFile` instance is called with
    the target file and the name of the encrypted output file (the
    encrypted file will have a `.enc` extension).

### Using the key pair to decrypt

Save the following as `decrypt.py`:

```python
import nacl.utils
from nacl.public import PrivateKey, PublicKey, Box
from nacl.encoding import HexEncoder
import sys

class DecryptFile:
    def __init__(self, sender, receiver):
        self.sender = sender
        self.receiver = receiver
        self.sk = PrivateKey(self.get_key(receiver, '.sk'), encoder=HexEncoder)
        self.pk = PublicKey(self.get_key(sender, '.pk'), encoder=HexEncoder)

    def get_key(self, name, suffix):
        filename = 'key_' + name + suffix
        try:
            with open(filename, 'rb') as file:
                data = file.read()
            return data
        except FileNotFoundError:
            print(f"Key file '{filename}' not found.")
            sys.exit(1)

    def decrypt(self, encfile, textfile):
        box = Box(self.sk, self.pk)
        try:
            with open(encfile, 'rb') as efile:
                etext = efile.read()
            dtext = box.decrypt(etext)
            with open(textfile, 'wb') as tfile:
                tfile.write(dtext)
            print(f"Decrypted file saved as '{textfile}'")
        except FileNotFoundError:
            print(f"Encrypted file '{encfile}' not found.")
            sys.exit(1)

sender = input("Enter the name for the sender's key pair: ")
recip = input("Enter your name for your key pair: ")
decrypter = DecryptFile(sender, recip)
enc_file = input("Enter the name of the encrypted file to decrypt: ")
target_file = input("Enter the name for the decrypted output file: ")
decrypter.decrypt(enc_file, target_file)
```

To use the script, you need to have
an encrypted file (with a `.enc` extension) generated by the
"encrypt.py" script in the same directory -- ideally, swap
with another person and attempt to decrypt their `.enc` file --
together with your private
key (with an `.sk` extension), and the other person's public key (with
a `.pk` extension).

Run `python3 decrypt.py` and follow the prompts: enter the sender's key
pair name, your key pair name, the name of the encrypted file to
decrypt, and the name for the decrypted output file.

The script will decrypt the file using the private key associated with
your name and the sender's public key and save the decrypted content to
the specified output file.

### Extension task

As an extension task, you might like to research how to use libsodium
to *sign* a message with your key pair so that other users can verify
a (plaintext) message came from you.

### Project work

The remainder of the lab is available for you to work on your project.



<!-- vim: syntax=markdown tw=72 :
-->
