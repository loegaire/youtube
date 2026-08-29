# ROP visual system

- Motion Canvas, 1920x1080, 24 fps, 19:55.
- Solid `#050B08` canvas with a sparse 64 px technical grid.
- Flat opaque panels, 2 px rules, no gradients, blur, glow, texture, or glass.
- Mint means active/valid, pale yellow means current values, red means blocked/write,
  purple means return addresses, orange means gadget cards.
- Persistent chapter label top-left, challenge anchor top-right, current-state panel at
  right, and stack/payload rail at bottom.
- Every narration beat contains multiple causal state changes, not a static slide.
