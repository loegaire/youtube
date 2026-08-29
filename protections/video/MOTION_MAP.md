# Motion map

The 53 script scenes are compiled from the source script into `assets/scene-data.js`. Each scene has a distinct dominant mode, with a four-phase causal phrase: full evidence establishment, scan/trace operation, visible state change, then a leftward carrier handoff.

| Script region | Perspective modes | Object-level operation | Carrier |
| --- | --- | --- | --- |
| 00–01 recap and lab | wide map, terminal wide, source close-up | question rails assemble; command rows scan; source ruler overflows | question rail / source cursor |
| 02 baseline | dense disassembly, vertical stack, lateral byte feed | selected instructions detach; buffer fills toward return cell | `ret` row |
| 03 NX | split ELF headers, page close-up, instruction route | GNU_STACK row changes RWE → RW; fetch hits no-execute page | permission tab |
| 04 canaries | split disassembly, stack cross-section, runtime comparison | guard copied, crossed, compared, and failure blocks `ret` | guard value |
| 05 ASLR | process-map rail, four-run comparison, arithmetic close-up | regions relocate as intact objects; base + offset is measured | relocated libc block |
| 06 PIE | ELF header comparison, four-run map, base arithmetic | `EXEC` changes to `DYN`; main joins a randomized base | `main` symbol |
| 07 RELRO | source-to-ELF-to-loader travel, GOT slot close-up, timeline | lazy binding writes late; full RELRO binds early then locks page | `puts` relocation slot |
| 08 synthesis | evidence graph, five-pipeline comparison, closing research wall | assumptions fail at different checkpoints; matrix traces back to raw evidence | cyan leak pointer |

No scene uses a static title-card hold. Each mode executes a scan, mutation, trace, or comparison on a 3–5 second cadence. The recurring physical objects evolve: a source row becomes a stack ruler, then a page permission tab, a guard, a moving map region, and finally a locked relocation slot.
