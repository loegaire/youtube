# Shared Motion Canvas repertoire

Small, context-free choreography primitives extracted from finished YouTube explainers.
These are motion techniques, not scene templates. Every project still needs a
script-specific motion map and its own spatial compositions.

## `src/toolSurfaces.tsx`

Thinh-themed technical workspaces for provenance-first explainer scenes. They resemble
the job performed by familiar tools without copying their exact vendor UI:

- `ThinhTerminal`: commands, stdout/stderr, and active-line focus.
- `ThinhGdb`: registers, disassembly, stack, and debugger command output.
- `ThinhDisassembler` / `ThinhIDA`: function tree, dense pseudocode, and listing.
- `ThinhProxy` / `ThinhBurp`: HTTP history with request/response inspection.
- `ThinhEditor`: file tree and measured source rows.
- `ThinhPacketViewer` / `ThinhWireshark`: packet table, protocol details, and bytes.
- `ThinhToolSurface`: the shared flat near-black shell for new tool families.
- `THINH_TOOL_THEME`: semantic palette and typography tokens.

The branded aliases are convenient vocabulary, not pixel-accurate replicas. Prefer the
generic component names when a video should not name a commercial tool.

All data is supplied through props. For factual videos, populate the components from real
captured commands, source, debugger output, decompiler output, HTTP traffic, or packet
evidence. The rows in `examples/ToolSurfaceShowcase.tsx` are visual QA fixtures only.

Example:

```tsx
const activeInstruction = createSignal(0);

<ThinhGdb
  registers={registers}
  instructions={instructions}
  stack={stack}
  activeInstruction={activeInstruction}
  command={'x/4wx $esp'}
  output={debuggerOutput}
/>

yield* activeInstruction(3, 0.7);
```

`activeLine`, `activeInstruction`, `activeFunction`, `activeCodeLine`,
`activeListing`, `activeRequest`, `activeFile`, and `activePacket` accept either a number
or a reactive zero-argument function such as a Motion Canvas signal.

Visual QA:

- six full-resolution fixtures: `review/tool-surfaces/0_50s.png` through `5_50s.png`;
- reviewed contact sheet: `review/tool-surfaces/contact-sheet.png`;
- TypeScript, Motion Canvas production build, and player build passed on 2026-07-25.

### Tool-surface rules

- Show the full or dense workspace before extracting a fragment.
- Preserve provenance with a measured zoom, crop, spotlight, or row pull-forward.
- Keep native evidence text; add editorial labels only when the view is ambiguous.
- Animate the active index and camera, not every label.
- Scale the whole surface for camera travel. Do not individually reposition rows and
  recreate connector bugs.
- If a new technical tool shares one of these layouts, compose it from
  `ThinhToolSurface` and the same theme instead of creating another dashboard shell.

## `src/choreography.ts`

- `prepareEntrance` / `enterStage` / `exitStage`: velocity-compatible scene seams.
- `cameraTravel`: motivated push, pull, track, tilt, rise, and drop poses.
- `cascadeIn`: staggered technical-object entrance.
- `fanIn`: fragments assemble from a shared origin.
- `drawPaths`: sequential pointer, control-flow, and data-route drawing.
- `trackedPoints`: reactive connector endpoints for nodes that move, reorder, or orbit.
- `sweep`: opposing lateral motion for reclassification or reinterpretation.

Example:

```tsx
prepareEntrance(stage(), 'track-right');
const reveal = cascadeIn(byteTiles, 0.06, 0.35);
const routes = drawPaths(pointerLines, 0.08, 0.5);

yield* all(
  enterStage(stage(), 0.65),
  delay(0.25, reveal),
  delay(0.9, routes),
  delay(1.2, cameraTravel(world(), 'push', 2.4)),
);
```

Connected-geometry example:

```tsx
<Line
  zIndex={-10}
  points={trackedPoints(() => source(), () => target())}
  stroke={'#B3D8C2'}
  lineWidth={4}
  endArrow
/>
```

Never connect moving targets with hand-entered static coordinates. Inspect the connector
at maximum displacement, not only after the animation settles.

## Reuse rule

Reuse motion mechanics when the script calls for them. Do not copy a previous video's
dashboard, card grid, colors, wording, or camera plan. A returning motif must change its
meaning or state.

## Provenance

- Initial camera and byte-cascade ideas: `youtube/bof1`.
- Generalized seams, route drawing, fan assembly, and opposing sweeps:
  `youtube/rop`, July 2026.
- Tool surfaces and provenance-first dense workspaces:
  `youtube/rop`, July 2026.
