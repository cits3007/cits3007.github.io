

struct Capturer {

  // NB: we mustn't outlive stdout_tgt and stderr_tgt
  Capturer(std::string &stdout_tgt, std::string &stderr_tgt)
  :
    stdout_target( stdout_tgt ),
    stderr_target( stderr_tgt )
  {
    real_stdout = fdopen(dup(fileno(stdout)), "w");
    if (!real_stdout)
      die("couldn't dupe stdout");

    real_stderr = fdopen(dup(fileno(stderr)), "w");
    if (!real_stderr)
      die("couldn't dupe stderr");

    mem_stdout = memfd_create("log_out.txt", 0);
    mem_stderr = memfd_create("log_err.txt", 0);

    int res;
    res = dup2(mem_stdout, 1); // stdout
    if (res < 0)
      die("couldn't dup2 mem_stdout");

    res = dup2(mem_stderr, 2); // stderr
    if (res < 0)
      die("couldn't dup2 mem_stderr");
  }

  Capturer(const Capturer& other) = delete;

  ~Capturer() {
    // restore stdout and stderr
    {
    int res;
    res = dup2( fileno(real_stdout), 1); // stdout
    if (res < 0)
      die("couldn't restore real_stdout");

    res = dup2( fileno(real_stderr), 2); // stderr
    if (res < 0)
      die("couldn't restore real_stderr");
    }

    // seek to start of mem files
    {
    off_t res = lseek(mem_stdout, 0, SEEK_SET);
    if (res < 0)
      die("couldn't lseek mem_stdout");

    res = lseek(mem_stderr, 0, SEEK_SET);
    if (res < 0)
      die("couldn't lseek mem_stderr");
    }

    std::string captured_out = slurpFd(mem_stdout);
    std::string captured_err = slurpFd(mem_stderr);

    stdout_target = captured_out;
    stderr_target = captured_err;
  }

  FILE* real_stdout;
  FILE* real_stderr;
  int mem_stdout;
  int mem_stderr;

  std::string &stdout_target;
  std::string &stderr_target;
};

typedef int (*cli_type)(int, char**);

// malloc storage for captured stdout and stderr. caller to free.
void capture(cli_type cli, int argc, char **argv, char ** stdout, char ** stderr) {
  assert(stdout != nullptr);
  assert(stderr != nullptr);

  std::string captured_stdout;
  std::string captured_stderr;

  {
    Capturer cap(captured_stdout, captured_stderr);
    cli(argc, argv);
  }

  size_t outlen = captured_stdout.size();
  size_t errlen = captured_stderr.size();

  *stdout = static_cast<char*>( malloc(outlen + 1) );
  if (*stdout == nullptr)
    die("couldn't malloc stdout");

  *stderr = static_cast<char*>( malloc(errlen + 1) );
  if (*stderr == nullptr)
    die("couldn't malloc stderr");

  memcpy(*stdout, captured_stdout.c_str(), outlen+1);
  memcpy(*stderr, captured_stderr.c_str(), errlen+1);
}


