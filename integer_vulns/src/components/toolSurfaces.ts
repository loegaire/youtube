import {C, MONO, SANS} from '../theme';

// Align locally built primitives with the shared repertoire theme contract.
export const THINH_TOOL_THEME = {
  background: C.canvas,
  surface: C.panel,
  raised: C.raised,
  selected: '#1A2A20',
  rule: C.rule,
  text: C.ink,
  muted: C.muted,
  mint: C.mint,
  mintSoft: C.mintSoft,
  amber: C.amber,
  coral: C.coral,
  purple: '#9B87B4',
  orange: '#C89563',
  mono: MONO,
  sans: SANS,
} as const;
