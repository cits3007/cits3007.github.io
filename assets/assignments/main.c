
#define _POSIX_C_SOURCE 1

// for `open` flags
#define _GNU_SOURCE

#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <string.h>

// used for fstat, lseek
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#include <signal.h>

#include "curdle.h"

int adjust_score(uid_t uid, const char * player_name, int score_to_add, char **message);

int main() {
  // get the (real, unprivileged) user that launched us
  uid_t unpriv_uid = getuid();
  // get the (effective, privileged) user we're running as
  uid_t priv_uid   = geteuid();

  // drop privileges
  int res = seteuid(unpriv_uid);
  if (res == -1)
    die_perror(__FILE__, __LINE__, "main: call to seteuid() to drop privileges failed");

  char *message = NULL;

  res = adjust_score(priv_uid, "alice", 99, &message);
  //res = 1;

  // TODO: some assertions here about whether `adjust_score`
  // properly restored the state of euid

  if (res == 1) {
    exit(EXIT_SUCCESS);
  } else {
    if (!message)
      fprintf(stderr, "adjust_score() failed, and did not properly set a message\n");
    else
      fprintf(stderr, "adjust_score() failed: '%s'\n", message);
    exit(EXIT_FAILURE);
  }
}


