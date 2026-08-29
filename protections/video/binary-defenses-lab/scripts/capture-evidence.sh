#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN="$ROOT/bin"
SRC="$ROOT/src"
RAW="$ROOT/evidence/raw"
SEL="$ROOT/evidence/selected"
mkdir -p "$RAW" "$SEL"

{
  echo '$ uname -a'
  uname -a
  echo
  echo '$ gcc --version | head -n 1'
  gcc --version | head -n 1
  echo
  echo '$ ld --version | head -n 1'
  ld --version | head -n 1
  echo
  echo '$ cat /proc/sys/kernel/randomize_va_space'
  cat /proc/sys/kernel/randomize_va_space
} > "$RAW/00-environment.txt"

{
  echo '$ find . -maxdepth 3 -type f | sort'
  cd "$ROOT"
  find . -maxdepth 3 -type f | sort
} > "$RAW/01-file-tree.txt"

{
  for f in "$SRC"/*.c "$ROOT/scripts/build.sh"; do
    echo "===== ${f#$ROOT/} ====="
    nl -ba "$f"
    echo
  done
} > "$RAW/02-complete-sources.txt"

{
  echo '$ ./scripts/build.sh'
  "$ROOT/scripts/build.sh"
} > "$RAW/03-build.stdout.txt" 2> "$RAW/03-build.stderr.txt" || true

{
  echo '$ file bin/*'
  file "$BIN"/*
  echo
  echo '$ sha256sum bin/*'
  sha256sum "$BIN"/*
} > "$RAW/04-built-artifacts.txt"

for name in exec-probe-rwx exec-probe-nx; do
  {
    echo "$ readelf -W -l bin/$name"
    readelf -W -l "$BIN/$name"
  } > "$RAW/10-$name-program-headers.txt"
done

python3 - "$ROOT" > "$RAW/11-nx-runtime.txt" <<'PY'
from pathlib import Path
import subprocess, sys
root=Path(sys.argv[1])
for name in ("exec-probe-rwx", "exec-probe-nx"):
    cp=subprocess.run([str(root/'bin'/name)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    print(f"$ ./bin/{name}")
    print(cp.stdout, end='')
    print(cp.stderr, end='')
    if cp.returncode < 0:
        print(f"terminated_by_signal={-cp.returncode}")
        print(f"shell_status={128-cp.returncode}")
    else:
        print(f"shell_status={cp.returncode}")
    print()
PY

{
  echo '$ objdump -d -M intel -S --disassemble=probe bin/canary-probe'
  objdump -d -M intel -S --disassemble=probe "$BIN/canary-probe"
  echo
  for i in 1 2 3; do
    echo "$ ./bin/canary-probe  # run $i"
    "$BIN/canary-probe"
  done
} > "$RAW/19-canary-guard-and-frame-copy.txt"

for name in vuln-plain vuln-canary; do
  {
    echo "$ objdump -d -M intel -S --disassemble=greet bin/$name"
    objdump -d -M intel -S --disassemble=greet "$BIN/$name"
  } > "$RAW/20-$name-greet-disassembly.txt"
done

python3 - "$ROOT" > "$RAW/21-canary-runtime.txt" <<'PY'
from pathlib import Path
import subprocess, sys
root=Path(sys.argv[1])
payload=b"A"*96
for name in ("vuln-plain", "vuln-canary", "vuln-full"):
    cp=subprocess.run([str(root/'bin'/name)], input=payload, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(f"$ python3 -c 'import sys; sys.stdout.buffer.write(b\"A\"*96)' | ./bin/{name}")
    print(cp.stdout.decode(errors='replace'), end='')
    print(cp.stderr.decode(errors='replace'), end='')
    if cp.returncode < 0:
        print(f"terminated_by_signal={-cp.returncode}")
        print(f"shell_status={128-cp.returncode}")
    else:
        print(f"shell_status={cp.returncode}")
    print()
PY

{
  echo '$ cat /proc/sys/kernel/randomize_va_space'
  cat /proc/sys/kernel/randomize_va_space
  echo
  for name in address-nopie address-pie; do
    echo "=== $name: four runs ==="
    for i in 1 2 3 4; do
      echo "-- run $i --"
      "$BIN/$name"
    done
    echo
  done
} > "$RAW/30-aslr-runtime-addresses.txt"

{
  for name in address-nopie address-pie; do
    echo "===== $name ====="
    echo "$ readelf -hW bin/$name"
    readelf -hW "$BIN/$name"
    echo
    echo "$ nm -n bin/$name"
    nm -n "$BIN/$name"
    echo
  done
} > "$RAW/31-pie-headers-and-symbols.txt"

python3 - "$ROOT" > "$RAW/32-process-maps.txt" <<'PY'
from pathlib import Path
import subprocess, sys
root=Path(sys.argv[1])
for name in ("address-nopie", "address-pie"):
    p=subprocess.Popen([str(root/'bin'/name), '--hold'], stdin=subprocess.PIPE,
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    first=[p.stdout.readline().rstrip('\n') for _ in range(5)]
    maps=Path(f'/proc/{p.pid}/maps').read_text()
    print(f"$ ./bin/{name} --hold")
    print('\n'.join(first))
    print(f"$ cat /proc/{p.pid}/maps")
    print(maps, end='')
    p.stdin.write('\n'); p.stdin.flush()
    p.wait(timeout=3)
    print()
PY

for name in relro-none relro-partial relro-full; do
  {
    echo "$ readelf -W -l bin/$name"
    readelf -W -l "$BIN/$name"
    echo
    echo "$ readelf -W -d bin/$name"
    readelf -W -d "$BIN/$name"
    echo
    echo "$ objdump -R bin/$name"
    objdump -R "$BIN/$name"
    echo
    echo "$ readelf -W -S bin/$name"
    readelf -W -S "$BIN/$name"
  } > "$RAW/40-$name-elf-context.txt"
done

python3 - "$ROOT" > "$RAW/41-relro-runtime-pages.txt" <<'PY'
from pathlib import Path
import re, subprocess, sys, time
root=Path(sys.argv[1])
for name in ('relro-none','relro-partial','relro-full'):
    path=root/'bin'/name
    reloc=subprocess.check_output(['objdump','-R',str(path)], text=True)
    m=re.search(r'^([0-9a-fA-F]+)\s+R_X86_64_JUMP_SLOT\s+puts', reloc, re.M)
    if not m:
        raise SystemExit(f'puts relocation not found in {name}')
    addr=int(m.group(1),16)
    p=subprocess.Popen([str(path)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    time.sleep(0.15)
    maps=Path(f'/proc/{p.pid}/maps').read_text().splitlines()
    containing=[]
    for line in maps:
        start,end=[int(x,16) for x in line.split()[0].split('-')]
        if start <= addr < end:
            containing.append(line)
    out,err=p.communicate(timeout=4)
    print(f"===== {name} =====")
    print(f"$ objdump -R bin/{name} | grep 'puts@'")
    for line in reloc.splitlines():
        if 'puts@' in line:
            print(line)
    print(f"$ cat /proc/{p.pid}/maps  # row containing 0x{addr:x}")
    print('\n'.join(containing))
    print(err, end='')
    print(out, end='')
    print()
PY

for name in relro-partial relro-full; do
  env LD_DEBUG=bindings "$BIN/$name" > "$RAW/42-$name-ld-debug.stdout.txt" 2> "$RAW/42-$name-ld-debug.stderr.txt" || true
  {
    echo "$ env LD_DEBUG=bindings ./bin/$name"
    grep -n -E "transferring control|binding file .*normal symbol .(puts|write|sleep).|PROGRAM:" \
      "$RAW/42-$name-ld-debug.stderr.txt" || true
    echo '-- stdout --'
    cat "$RAW/42-$name-ld-debug.stdout.txt"
  } > "$SEL/42-$name-binding-order.txt"
done

# Compact, exact extracts for animation imports. Each starts with its provenance command.
{
  echo '$ readelf -W -l bin/exec-probe-rwx | grep GNU_STACK'
  readelf -W -l "$BIN/exec-probe-rwx" | grep GNU_STACK
  echo '$ readelf -W -l bin/exec-probe-nx | grep GNU_STACK'
  readelf -W -l "$BIN/exec-probe-nx" | grep GNU_STACK
} > "$SEL/10-gnu-stack-rows.txt"

{
  echo '$ objdump -d -M intel -S --disassemble=greet bin/vuln-canary'
  objdump -d -M intel -S --disassemble=greet "$BIN/vuln-canary" \
    | sed -n '/<greet>:/,/ret/p'
} > "$SEL/20-canary-greet.txt"

{
  for name in address-nopie address-pie; do
    echo "$ readelf -hW bin/$name | grep -E 'Type:|Entry point'"
    readelf -hW "$BIN/$name" | grep -E 'Type:|Entry point'
    echo "$ nm -n bin/$name | grep ' main$'"
    nm -n "$BIN/$name" | grep ' main$'
  done
} > "$SEL/31-pie-type-main.txt"

{
  for name in relro-none relro-partial relro-full; do
    echo "===== $name ====="
    echo "$ readelf -W -l bin/$name | grep GNU_RELRO"
    readelf -W -l "$BIN/$name" | grep GNU_RELRO || true
    echo "$ readelf -W -d bin/$name | grep -E 'BIND_NOW|FLAGS_1'"
    readelf -W -d "$BIN/$name" | grep -E 'BIND_NOW|FLAGS_1' || true
  done
} > "$SEL/40-relro-markers.txt"
