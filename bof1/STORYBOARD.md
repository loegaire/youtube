# Dense Animation Storyboard

The film is divided into 43 cinematic scenes totaling exactly 588 seconds. Each scene contains several visual actions; the intended cadence is one meaningful change every 3–5 seconds. Camera movement uses 2D scale, pan, and slight rotation to reframe causal details without introducing decorative motion.

| Time | ID | Scene | Duration | Primary animation |
|---:|---|---|---:|---|
| 0:00 | 00a | A harmless prompt | 15s | Terminal rises; prompt and `hello` type character-by-character |
| 0:15 | 00b | When the input keeps going | 14s | Forty-four characters pop in; terminal border becomes unsafe |
| 0:29 | 00c | One trusted number changes | 15s | `main → vuln` grows, address appears, route bends to `win` |
| 0:44 | 01a | Begin with a strip of cells | 13s | Tape cells assemble; reader drops onto a cell |
| 0:57 | 01b | Read one symbol | 13s | Read head highlights a value and selects a rule |
| 1:10 | 01c | Write, move, change state | 13s | Cell flips, reader moves, state changes A → B |
| 1:23 | 01d | Computation is precise state change | 13s | Repeated head moves demonstrate the machine loop |
| 1:36 | 02a | Give every byte an address | 15s | Memory rows assemble and receive numeric addresses |
| 1:51 | 02b | Separate storage from action | 15s | CPU arrives; bidirectional bus connects it to memory |
| 2:06 | 02c | Keep the next instruction address | 16s | Instruction pointer selects one addressed row |
| 2:22 | 02d | Fetch, execute, choose again | 16s | Pointer advances; register and address update |
| 2:38 | 03a | Source code states an intention | 12s | Source appears before its lower-level representations |
| 2:50 | 03b | The compiler makes instructions | 12s | Assembly instructions reveal sequentially |
| 3:02 | 03c | Instructions become bytes | 12s | Encoded byte tiles pop into the code region |
| 3:14 | 03d | Code plus changing machine state | 13s | Register and memory values change 4 → 5 |
| 3:27 | 04a | One address space, several conventions | 16s | Process-memory regions grow into place |
| 3:43 | 04b | The heap is not today’s target | 16s | Allocation expands, then fades while camera moves to stack |
| 3:59 | 04c | `call` saves a way back | 16s | Main frame, return address, and vuln frame push onto stack |
| 4:15 | 04d | `ret` restores that address | 16s | Return tile travels from stack to instruction pointer |
| 4:31 | 05a | `main` prepares and calls `vuln` | 12s | Code types in; setup fades; relevant calls highlight |
| 4:43 | 05b | `vuln` owns a 32-byte array | 13s | Buffer declaration, `gets`, and helper highlight in sequence |
| 4:56 | 05c | The helper exposes saved control data | 12s | Named source objects map onto saved stack objects |
| 5:08 | 05d | `win` already contains the prize | 12s | Win island enters; missing normal-control arrow stays broken |
| 5:20 | 06a | `gets` knows only the starting address | 12s | Signature assembles around `buf`; missing capacity pulses |
| 5:32 | 06b | A bounded copy stops at 32 | 12s | Buffer cells fill; boundary closes; counter reaches 32 |
| 5:44 | 06c | Byte 33 still has a valid address | 13s | First 32 bytes fill green; byte 33 crosses into red data |
| 5:57 | 06d | The input walks across saved state | 13s | Per-byte writes traverse padding and saved bookkeeping |
| 6:10 | 06e | `ret` stays intact; its input changes | 13s | Return-address tile changes from trusted amber to controlled coral |
| 6:23 | 07a | Interrogate the compiled file | 15s | Commands type in and properties reveal |
| 6:38 | 07b | Disassembly reveals the real frame | 15s | Prologue and epilogue lines enter; key operations recolor |
| 6:53 | 07c | A cyclic pattern labels every position | 15s | Pattern characters pop in color-coded groups and camera pushes in |
| 7:08 | 07d | The crash tells us the distance | 15s | EIP value maps through pattern search to offset 44 |
| 7:23 | 08a | Find the existing `win` symbol | 13s | Symbol address resolves inside the binary |
| 7:36 | 08b | Padding carries us to the slot | 13s | Padding cells expand left-to-right to offset 44 |
| 7:49 | 08c | Little-endian reverses byte order | 14s | Address splits into four bytes and reorders |
| 8:03 | 08d | Encode an address, not new code | 14s | Payload code types while byte bar assembles above it |
| 8:17 | 09a | Replay the write at full speed | 11s | Stack fills rapidly and original return address disappears |
| 8:28 | 09b | The program announces its trust | 11s | Diagnostic output types; instruction pointer updates |
| 8:39 | 09c | `ret` installs the corrupted address | 11s | Address travels from stack through CPU toward `win` |
| 8:50 | 09d | Execution lands inside `win` | 12s | Camera follows the route; file calls and flag reveal |
| 9:02 | 10a | Four surviving objects explain it | 15s | Earlier objects return and reconnect causally |
| 9:17 | 10b | Our text never became code | 15s | Final statement rewrites itself into the precise conclusion |
| 9:32 | 10c | The same computer opens new doors | 16s | Prior chain dims; format strings, ROP, and heap branch outward; final statement resolves in the glass caption |

The machine values used by the visuals are verified for this challenge: offset `44`, `win = 0x080491f6`, and little-endian bytes `f6 91 04 08`.
