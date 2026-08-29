# Evidence ledger

The workspace began without supplied challenge files. These public picoCTF 2024 downloads
were fetched on 2026-07-26 from the challenge artifact paths linked by the cited writeups.

| Asset | Build ID / SHA-256 | Visual use |
| --- | --- | --- |
| `heap1-chall` | Build ID `e191661a34476dabf75adb49242d4b71521a6295` | data-only overflow warm-up |
| `heap1-chall.c` | `fce62f8f12193c323d299cf000c98d1598abfb3015f044fd097b6d556365068d` | `safe_var` context |
| `heap2-chall` | Build ID `d5184d264ae0c1259ba3bb7a1e20fc348b4274b0` | primary evidence artifact |
| `heap2-chall.c` | `8237708ad277c43c76a75255264d6fea90f53f18cda7ebb12a11d6e55af060cc` | primary source context |
| `heap3-chall` | Build ID `3fa64145c4efbd5a267e0525f58e294fba23ad2f` | use-after-free bridge |
| `heap3-chall.c` | `f8998f9cfa7d857fa5c577e498d456dfd75afaf8112bdc04ec1bc0ef9c0fad23` | UAF source context |

Verified local facts used in the video:

- `heap2-chall` is an ELF64 little-endian non-PIE executable; `objdump -d` reports
  `win` at `0x4011a0` and `check_win` at `0x4011f0`.
- A normal local run prints `input_data` and `x` 0x20 (32) bytes apart. Heap addresses
  vary with ASLR, so the animation labels the captured numbers as one observed run.
- `checksec` was not installed in the production environment. The video shows this as
  an unavailable tool rather than inventing its output.
- The downloaded binaries have no `flag.txt`; the video therefore never presents a
  fabricated flag. The final terminal explains that a flag fixture was intentionally
  not supplied and shows the verified source-to-payload-to-control-flow chain instead.
