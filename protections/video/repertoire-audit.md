# Repertoire audit — Binary Defenses

## Sources inspected

| Source | Existing primitive | Decision |
| --- | --- | --- |
| `../motion-repertoire/motion-canvas/src/choreography.ts` | `cameraTravel`, `cascadeIn`, `fanIn`, `drawPaths`, `trackedPoints`, `sweep` | Restage as GSAP camera, evidence-row, byte-conveyor, and tether patterns; the Motion Canvas implementation itself cannot be imported into an HTML composition. |
| `../motion-repertoire/motion-canvas/src/toolSurfaces.tsx` | `ThinhTerminal`, `ThinhEditor`, `ThinhDisassembler`, `ThinhToolSurface` | Reuse the provenance-first dense-workspace concept and semantic color logic; rebuild as flat HTML terminal/source/ELF surfaces. |
| `../shellcode/video/index.html` | root track assembly, leftward cut-the-curve seams, audio as a separate track | Reuse the continuous leftward seam language and separate narration track; no visual layout is copied. |
| `../fmstr2/format-string-wizard/compositions/00-intro-universal-manpage.html` | terminal reveal, command-to-consequence staging | Restage as evidence-fed terminal scans followed by detached, tethered rows. |

## Current project decisions

- **Reused:** dense terminal before close-up; measured code rows; leftward scene current; terminal/evidence provenance rails; staged input-to-memory movement.
- **Extended:** a generic `EvidenceStage` in `index.html` switches among terminal, source, ELF, map, and conceptual-model modes while retaining the exact file/command breadcrumb.
- **New, project-specific choreography:** the five-defense rail, GNU_STACK permission flip, guard-crossing stack ruler, ASLR/PIE base arithmetic, and RELRO loader timeline. These are specific to this film.
- **Not extracted upstream:** the shared repertoire directory is Motion Canvas-only and outside this workspace's write scope. The HTML equivalent is deliberately local until validated in a finished HyperFrames production.
