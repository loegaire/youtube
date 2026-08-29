# Binary defenses evidence lab

A reproducible Linux x86-64 lab for observing NX, stack canaries, ASLR, PIE,
and RELRO with actual GCC/binutils output and live process mappings.

## Reproduce everything

```bash
./scripts/build.sh && ./scripts/capture-evidence.sh
```

The capture intentionally leaves ASLR enabled. On every rerun, expect PIDs,
stack addresses, PIE bases, libc bases, and canary values to change. Animation
code should parse the new evidence files rather than hardcoding the example
addresses in the accompanying script.

## Contents

- `src/`: complete source for every probe.
- `scripts/build.sh`: all compile/link commands.
- `scripts/capture-evidence.sh`: all inspection/runtime commands.
- `bin/`: the locally built ELF artifacts.
- `evidence/raw/`: complete command output.
- `evidence/selected/`: mechanically selected rows used after the full output
  has already been established on screen.

## Safety and scope

The programs are intentionally unsafe teaching binaries. Run them only in a
local disposable lab. The evidence was captured on Linux x86-64 using GCC
14.2.0 and GNU binutils 2.44; architecture- and toolchain-specific details may
differ elsewhere.
