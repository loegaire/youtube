#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/src"
BIN="$ROOT/bin"
mkdir -p "$BIN"
CC="${CC:-gcc}"
COMMON=(-O0 -g -fno-omit-frame-pointer -fcf-protection=none -Wall -Wextra)

"$CC" "${COMMON[@]}" "$SRC/vuln.c" -o "$BIN/vuln-plain" \
  -fno-stack-protector -fno-pie -no-pie \
  -Wl,-z,execstack -Wl,-z,norelro

"$CC" "${COMMON[@]}" "$SRC/vuln.c" -o "$BIN/vuln-nx" \
  -fno-stack-protector -fno-pie -no-pie \
  -Wl,-z,noexecstack -Wl,-z,norelro

"$CC" "${COMMON[@]}" "$SRC/vuln.c" -o "$BIN/vuln-canary" \
  -fstack-protector-strong -fno-pie -no-pie \
  -Wl,-z,noexecstack -Wl,-z,norelro

"$CC" "${COMMON[@]}" "$SRC/vuln.c" -o "$BIN/vuln-pie" \
  -fstack-protector-strong -fPIE -pie \
  -Wl,-z,noexecstack -Wl,-z,norelro

"$CC" "${COMMON[@]}" "$SRC/vuln.c" -o "$BIN/vuln-full" \
  -fstack-protector-strong -fPIE -pie \
  -Wl,-z,noexecstack -Wl,-z,relro,-z,now

"$CC" "${COMMON[@]}" "$SRC/exec_probe.c" -o "$BIN/exec-probe-rwx" \
  -fno-stack-protector -fno-pie -no-pie -Wl,-z,execstack,-z,norelro

"$CC" "${COMMON[@]}" "$SRC/exec_probe.c" -o "$BIN/exec-probe-nx" \
  -fno-stack-protector -fno-pie -no-pie -Wl,-z,noexecstack,-z,norelro

"$CC" "${COMMON[@]}" "$SRC/canary_probe.c" -o "$BIN/canary-probe" \
  -fstack-protector-all -fno-pie -no-pie -Wl,-z,noexecstack,-z,norelro

"$CC" "${COMMON[@]}" "$SRC/address_probe.c" -o "$BIN/address-nopie" \
  -fno-stack-protector -fno-pie -no-pie -Wl,-z,noexecstack,-z,relro -ldl

"$CC" "${COMMON[@]}" "$SRC/address_probe.c" -o "$BIN/address-pie" \
  -fno-stack-protector -fPIE -pie -Wl,-z,noexecstack,-z,relro -ldl

"$CC" "${COMMON[@]}" "$SRC/relro_demo.c" -o "$BIN/relro-none" \
  -fno-stack-protector -fno-pie -no-pie -Wl,-z,norelro,-z,lazy

"$CC" "${COMMON[@]}" "$SRC/relro_demo.c" -o "$BIN/relro-partial" \
  -fno-stack-protector -fno-pie -no-pie -Wl,-z,relro,-z,lazy

"$CC" "${COMMON[@]}" "$SRC/relro_demo.c" -o "$BIN/relro-full" \
  -fno-stack-protector -fno-pie -no-pie -Wl,-z,relro,-z,now
