# Binary Defenses — Motion Map

The piece is one continuous Motion Canvas camera space, not a sequence of title cards. Every narration segment has an entrance, a source/evidence moment where relevant, a movement at roughly 3–5 second intervals, and an outgoing camera seam. Chapter text appears only at chapter starts, then clears.

| Beats | Visual world | 3–5 second progression | Seam |
|---|---|---|---|
| 01–03 | Input → buffer → saved return → existing code | route draws; return node becomes focal; camera tracks to evidence | push into lab |
| 04–08 | Reproducible laboratory | complete evidence window first; selected row traces into source/build/ELF chips | pull from lab into stack |
| 09–10 | Derived stack reconstruction | objdump row appears, frame cells cascade in, overflow path rises toward return address | camera rises to permission map |
| 11–16 | NX page model | stack/code/heap permission cards appear; instruction arrow attempts stack then is denied; ROP route recovers through code | track right to guard |
| 17–25 | Canary tripwire | input crosses buffer, meets a guard, then check/abort relationship becomes focal; leak discussion retains the guard rather than erasing it | drop into runtime map |
| 26–33 | ASLR process map | mappings move as a group; a dashed offset tether persists while bases travel; arithmetic is resolved only after a leak cue | track to movable executable |
| 34–38 | PIE mapping | DYN evidence establishes movable main binary; base and `main + 0x1189` separate, then recombine | push into linker table |
| 39–47 | RELRO relocation data | GOT slots cascade in; bindings are visible before main for full RELRO; write arrow is deflected by a lock | pull to final path |
| 48–53 | Layered conclusion | one red path crosses a defect and then meets NX, canary, ASLR/PIE, and RELRO constraints in sequence | settle on a quiet closing state |

## Beat-level focus

| Beat | Focus | Meaningful action |
|---:|---|---|
| 01 | return address | input route turns into existing code |
| 02 | baseline assumptions | route is intentionally unobstructed |
| 03 | methodology | camera leaves the recap for the evidence lab |
| 04 | complete laboratory | evidence window establishes the corpus |
| 05 | runtime variance | mapping positions imply rerun movement |
| 06 | `read(..., 128)` | source row is the focal evidence |
| 07 | compiler warning | warning row turns coral without becoming a “defense” |
| 08 | artifact identity | source → build → ELF → capture chain lands |
| 09 | `sub rsp,0x30` | derived stack cells enter from objdump geometry |
| 10 | saved return | overflow guide climbs to the control cell |
| 11 | executable stack probe | permission cards split code from data |
| 12 | GNU_STACK | evidence row introduces the missing X bit |
| 13 | instruction fetch | blocked arrow hits stack card |
| 14 | executable-space history | code page remains the only X location |
| 15 | fetch boundary | data stays present as fetch fails |
| 16 | ROP route | red route re-enters executable code |
| 17 | guard | canary arrives between buffer and return path |
| 18 | TLS probe | guard is tethered to the source evidence row |
| 19 | stack placement | guard occupies a physical stack cell |
| 20 | corruption | write path touches guard before control |
| 21 | check | guard becomes the focal tripwire |
| 22 | disclosure | guard remains, but the threat model changes |
| 23 | scope | camera tracks across the untouched defect |
| 24 | limitation | canary is framed as constraint, not repair |
| 25 | next assumption | guard clears into the moving map |
| 26 | map movement | bases translate together |
| 27 | runtime truth | map cards become the primary source |
| 28 | surviving offsets | dashed tether survives base movement |
| 29 | PaX history | page map is held, not mythologized |
| 30 | leak | one leaked anchor reduces uncertainty |
| 31 | arithmetic | base + offset ruler draws |
| 32 | entropy | mappings re-randomize while relationship remains |
| 33 | moving target | camera follows the shifting binary |
| 34 | PIE | main binary enters as a movable region |
| 35 | ELF type | `DYN` evidence becomes focal |
| 36 | arithmetic | `main + 0x1189` locks to its base |
| 37 | partnership | PIE joins ASLR motion |
| 38 | no fixed island | binary slides as one object |
| 39 | relocation | GOT table enters in context |
| 40 | one slot | `puts` slot resolves |
| 41 | partial/full | lock state distinguishes configurations |
| 42 | runtime page | write arrow tests the data table |
| 43 | eager binding | binding occurs before `main` |
| 44 | history | loader/linker chain stays visible |
| 45 | limitation | read-only is not secret |
| 46 | non-goal | control data is not all control flow |
| 47 | final transition | lock sends camera to summary |
| 48 | synthesis | red route meets layered walls |
| 49 | failure points | each wall becomes focal in turn |
| 50 | interaction | route changes only after prior constraints |
| 51 | repair | source-level write is held apart from mitigations |
| 52 | ret2libc context | existing-code route has an explicit cause |
| 53 | closing | motion settles without a final dashboard |
