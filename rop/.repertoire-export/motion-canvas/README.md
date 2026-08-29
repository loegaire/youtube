# Shared Motion Canvas repertoire

Small, context-free choreography primitives extracted from finished YouTube explainers.
These are motion techniques, not scene templates. Every project still needs a
script-specific motion map and its own spatial compositions.

## `src/choreography.ts`

- `prepareEntrance` / `enterStage` / `exitStage`: velocity-compatible scene seams.
- `cameraTravel`: motivated push, pull, track, tilt, rise, and drop poses.
- `cascadeIn`: staggered technical-object entrance.
- `fanIn`: fragments assemble from a shared origin.
- `drawPaths`: sequential pointer, control-flow, and data-route drawing.
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

## Reuse rule

Reuse motion mechanics when the script calls for them. Do not copy a previous video's
dashboard, card grid, colors, wording, or camera plan. A returning motif must change its
meaning or state.

## Provenance

- Initial camera and byte-cascade ideas: `youtube/bof1`.
- Generalized seams, route drawing, fan assembly, and opposing sweeps:
  `youtube/rop`, July 2026.

