# Flat Terminal Visual System

## Palette

Use these exact tokens unless the current request supplies a different brand:

| Role | Token | Use |
| --- | --- | --- |
| canvas | `#0A0D0B` | solid full-frame background |
| panel | `#111713` | primary terminal and code surfaces |
| raised panel | `#17201A` | selected state or nested machine surface |
| structural rule | `#26332B` | borders, rails, dividers |
| safe / active | `#8CCB9A` | valid data, success, current state |
| output / pointer | `#B3D8C2` | secondary mint, output, addresses |
| instruction | `#D8BE73` | format tokens, interpreters, counters |
| danger / write | `#F0786E` | unsafe boundaries, write arrows, failures |
| primary ink | `#F1F3EE` | titles and important text |
| muted ink | `#9EA8A0` | labels and supporting copy |

Do not introduce blue, purple, cyan, or neon hues when the semantic roles above can carry
the information. Do not use pure white or pure black except where a codec or export tool
requires it.

## Background

- The canvas is a solid `#0A0D0B`.
- Never use linear, radial, conic, or text gradients.
- Never use `backdrop-filter`, large blur filters, color grading filters, warped textures,
  glow clouds, or full-frame grain.
- A sparse flat grid may be used only when it helps spatial explanation. Keep it below
  6 percent opacity and remove it if compression makes the background crawl or distort.
- Background elements must never compete with code or captions.

## Type

- Code, numbers, technical labels, and captions:
  `"JetBrainsMono Nerd Font", "JetBrains Mono", monospace`.
- Display and short prose: `Inter`, `Noto Sans`, or another neutral grotesk available
  locally.
- 1080p starting sizes:
  - hero: 88-132 px, 800-900;
  - scene title: 58-84 px, 750-900;
  - code: 34-54 px, 600-800;
  - body: 30-42 px, 450-650;
  - metadata: 20-26 px, 650-800;
  - caption rail: 52-60 px, 600-700.
- Do not use tiny web typography. Anything below 24 px needs a specific justification.

## UI language

- Build terminal windows, code panels, memory rows, shelves, byte boxes, parser machines,
  meters, gates, and block diagrams.
- Use flat opaque surfaces, 2 px structural borders, and 14-30 px corner radii.
- Shadows are normally absent. If separation is impossible otherwise, use one hard,
  low-opacity black shadow; never use colored glow.
- Rounded cards must represent a real object or state. Do not use decorative repeated-card
  grids.
- Keep strong asymmetric hierarchy. Anchor layouts to edges and let the eye travel between
  at least two focal points.
- Use approximately 110-130 px side margins and 70-100 px top/bottom safe margins.

## Semantic motion

- Mint objects remain data or become confirmed state.
- Amber objects are being interpreted, counted, or selected.
- Coral objects cross an unsafe boundary or modify state.
- Off-white carries the main explanation.
- Motion must preserve these meanings across the entire video.

## Forbidden defaults

- gradients of any kind;
- glassmorphism or frosted panels;
- blurred or distorted canvas backgrounds;
- generic neon cyberpunk blue/purple;
- low-contrast translucent body text;
- glowing outlines;
- slide-deck compositions;
- overlapping text used as decoration;
- captions smaller than 52 px in a 1080p master.

