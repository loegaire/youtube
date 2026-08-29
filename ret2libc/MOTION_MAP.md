# Motion map — ret2libc rebuild

The rebuild treats real command output as source context. The viewer sees enough raw
output to trust where a value came from, then the shot immediately dives into a visual
model of the bytes, stack slots, registers, data routes, or loader constraint.

No large editorial scene titles. No repeated evidence dashboard. No persistent phase
labels. Every scene has a different dominant composition and object-level motion.

| Scene | Duration | Source context | Deep visual model | Main motion |
| --- | ---: | --- | --- | --- |
| 00 | 28s | animation hook only | echo glyphs over a hidden stack | letters flip case, then sink into saved-RIP slots |
| 01 | 50s | `ls`, `file`, `Makefile.share` | artifact bench | real rows emit three physical artifacts; Makefile becomes build-context strip |
| 02 | 64s | `readelf` protection rows | NX route choice | shellcode bytes hit a barrier; address tiles become the only viable path |
| 03 | 50s | symbol table excerpt | function topology | symbol rows pull into a live call graph; camera dives into `do_stuff` |
| 04 | 90s | full `do_stuff` disassembly and `.rodata` | scanf parser + stack birth | selected instructions draw buffer arrows; hex bytes decode into `%[^\n]` and `%c` |
| 05 | 148s | `lea [rbp-0x80]`, `leave`, `ret` | measured stack tower | input fills from buffer to saved RIP; bracket grows to `128 + 8 = 136` |
| 06 | 152s | `convert_case` and loop bound | mutation conveyor | byte cells pass through a case gate; counter ends at `0x64` and stamps `d` |
| 07 | 108s | relocation table and PLT row | PLT/GOT process map | `puts@plt` tunnel reads `puts@got`; raw pointer bytes travel toward stdout |
| 08 | 95s | CSU and `_init` disassembly | byte decoder window | decoder window shifts from `41 5f c3` to `5f c3`; ret shim is parked |
| 09 | 97s | sourced constants | stage-one ROP ladder | RIP consumes blocks, RDI receives `puts@got`, leak path returns to `do_stuff` |
| 10 | 123s | libc symbol and string offsets | sliding libc ruler | leak pin aligns the library; offset ticks compute `base`, `system`, `/bin/sh` |
| 11 | 155s | runtime constraint plus prior facts | stage-two route + pitfalls + compression | ret shim flips alignment, route calls symbolic `system("/bin/sh")`, pitfalls collapse into the final recipe |

Reusable mechanics used:

- `ThinhTerminal` from the shared motion repertoire for source context panes.
- Camera/scene seam ideas from `bof1` and the shared repertoire, restaged per shot.
- Byte cascades, stack consumption, route drawing, and shifted decode windows.

Project-specific mechanics kept local:

- ret2libc stack tower with offset bracket.
- `%[^\n]` byte decoder linked back to `scanf`.
- PLT/GOT leak map.
- libc sliding ruler.
