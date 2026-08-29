# Motion map — Heap Overflow and Underflow

This map turns the supplied 23:45 script into a continuous Motion Canvas argument. Each
beat has a distinct composition, a causal operation, and a seam into the next beat. The
source of truth for artifact-specific material is [`evidence/README.md`](./evidence/README.md).

| Time | Beat | Composition and causal motion | Seam |
| --- | --- | --- | --- |
| 0:00–0:18 | Cold open | Wide heap city; a coral byte train crosses one room wall, then reverses across the left wall. | Byte train becomes artifact cursor. |
| 0:18–0:55 | Crime scene | Real artifact inventory moves from `file`/`readelf` to a complete source scroll. | Source scroll resolves to call graph. |
| 0:55–1:32 | Normal run | Real heap 2 terminal shows `pico`/`bico`; a ruler derives the observed `0x20`. | Ruler grows into chunk corridor. |
| 1:32–2:18 | Ownership | Dense `init()` source pulls two `malloc(5)` lines into separate named heap rooms. | Pointer labels tether to observed addresses. |
| 2:18–3:08 | Allocator model | User area and dim metadata explain an aligned lease, not a private drawer. | Cursor reaches option 2. |
| 3:08–4:05 | Vulnerable line | `scanf("%s", input_data)` is spotlighted from dense source; a parser mouth passes five tiles. | Input becomes a payload ribbon. |
| 4:05–5:12 | Heap 1 warm-up | A 32-byte ribbon lands `pico` on `safe_var`; state flips `bico → pico`. | Mutated field fans out to consequences. |
| 5:12–6:05 | Quiet corruption | Role, payment, length, callback objects mutate in sequence. | Callback stays bright. |
| 6:05–7:15 | Heap 2 bridge | Dense `check_win()` source is mechanically decomposed from bytes to function call. | Call arrow points to terminal. |
| 7:15–8:05 | Find `win` | Genuine `objdump` output is typed and cropped to `0x4011a0`. | Address tiles move to endian lane. |
| 8:05–9:05 | Endianness | Human address flips into eight memory-order tiles. | Tiles snap onto `x`. |
| 9:05–10:18 | Build payload | Source, heap, and pwntools panes connect to every literal exploit line. | Packet collapses into terminal input. |
| 10:18–11:15 | Execute | Raw bytes replace `bico`; a live call path leaves `check_win()` for `win()`. No flag is invented. | Call path becomes an equation. |
| 11:15–12:20 | Stack vs heap | Vertical stack path and lateral heap street animate in contrast. | Heap street rotates. |
| 12:20–13:30 | Underflow | Clearly marked conceptual reconstruction walks a negative index left into prior bytes. | Leftward bytes become three causes. |
| 13:30–14:38 | Underflow causes | Negative index, pointer decrement, and trusted offset independently violate the lower bound. | All merge into one invariant. |
| 14:38–15:55 | Metadata, carefully | Dim allocator layer branches to a crash or later trusted-field corruption without claiming an allocator exploit. | Bright branch becomes forensic board. |
| 15:55–17:10 | Forensic recap | Bug → evidence → strategy → result receive real artifact crops. | Chain of custody turns into a reuse loop. |
| 17:10–18:40 | UAF bridge | Full heap 3 source scroll resolves into a 35-byte struct; `free(x)` leaves a dangling key. | Freed room rides tcache conveyor. |
| 18:40–20:05 | UAF mechanics | Same-size reallocation reuses the room; thirty filler bytes and `pico` change the stale object. | Three directional icons assemble. |
| 20:05–21:20 | Mental model | START / BOUND / NEIGHBOR / LATER USE compass sweeps heap 1, 2, 3. | Compass becomes a boundary shield. |
| 21:20–22:25 | Defensive lens | Bounds, lower bounds, ownership, and ASan-style *illustrative* diagnostics contain each room. | Shield compresses to final map. |
| 22:25–23:18 | Recap | Underflow left, overflow right, UAF loop animate simultaneously on shared geometry. | City powers down. |
| 23:18–23:45 | Outro | A single terminal cursor types `watch the addresses.` Two neighboring rooms remain lit. | Hard cut to black. |

Reusable mechanics inventoried before implementation: shared tool surfaces for real source and
terminal evidence; camera travel for source-to-close-up provenance; `cascadeIn` for bytes;
`drawPaths` and `trackedPoints` for live data/control-flow connectors; `sweep` for the
overflow/underflow reversal. Bespoke work stays in this project: the heap street, chunk
corridor, ownership-key handoff, and three-bug compass.
