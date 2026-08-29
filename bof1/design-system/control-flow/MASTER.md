# Control Flow — Master Design System

## Direction

Swiss Modernism 2.0 mixed with exaggerated minimalism and restrained dark glassmorphism. Typography, alignment, and negative space establish hierarchy before effects are introduced.

## Grid and spacing

- 12-column grid across 1920×1080.
- 80 px outer safe area.
- 8 px base spacing unit.
- Fixed masthead, central proof field, and lower conclusion band.
- Corners use 0–8 px radius; pills are forbidden as general containers.

## Color tokens

| Role | Value | Use |
|---|---|---|
| Background | `#0A0D0B` | Neutral charcoal canvas |
| Elevated | `#111713` | Opaque technical regions |
| Glass | `rgba(244,247,240,.04)` | Standard panels |
| Glass strong | `rgba(244,247,240,.07)` | Selected or foreground panels |
| Text | `#F1F3EE` | Primary narrative |
| Muted | `#9EA8A0` | Secondary labels |
| Green | `#8CCB9A` | Valid data and recurring accent |
| Mint | `#B3D8C2` | CPU action and direction |
| Amber | `#D8BE73` | Addresses and targets |
| Coral | `#F0786E` | Corruption and unsafe writes |
| Border | `rgba(255,255,255,.14)` | One-pixel glass edge |

Green is an undertone, not the background color. Semantic colors must remain sparse and must be reinforced by labels, position, or shape.

## Typography

- Narrative: Helvetica Neue, Helvetica, Inter, Arial.
- Machine values: IBM Plex Mono, JetBrains Mono.
- Titles: 47 px, weight 700, tight tracking.
- Conclusions: 30 px, weight 700.
- Code: 18–29 px depending on density.
- Labels: 15–20 px, uppercase, expanded tracking.

## Glass material

- 4–7% white surface over charcoal.
- One-pixel neutral border and faint top edge.
- Shallow 16 px black shadow only where separation is needed.
- No luminous blobs, ornamental blur, neon glow, or stacked translucent decoration.

## Motion

- Animate one causal action at a time.
- Use short ease-out entrances and faster exits.
- No continuous decorative animation.
- Color changes communicate state changes, never ambiance.

## Forbidden patterns

- Rounded dashboard-card grids without editorial purpose.
- Pills used as default containers.
- Decorative particles, botanical ornaments, halos, and large ambient gradients.
- Matrix green, rainbow palettes, or low-contrast green-on-green text.
- Multiple competing animations in the same explanatory beat.

## Delivery checks

- Confirm no text, arrows, or panels overlap at 1920×1080.
- Inspect all eleven scenes from the rendered canvas.
- Keep primary and secondary text above WCAG AA contrast against the canvas.
- Ensure color is not the only carrier of meaning.
