// House style design tokens — Thinh YouTube aesthetic.
// Near-black canvas, flat fills, crisp rules, mint/amber/coral semantics.

export const COLORS = {
  // Canvas & surfaces
  canvas: '#0a0d0b', // near-black with faint green undertone
  panel: '#11140f', // terminal / panel background
  panelLight: '#181c14', // elevated panel
  panelBorder: '#222719', // subtle border

  // Text
  text: '#e8e6df', // warm off-white primary text
  textDim: '#8a9489', // muted mint-gray secondary
  textMuted: '#5c655d',

  // Semantic accents
  mint: '#5fe3a1', // safe / active / public key
  mintDeep: '#3ba978',
  amber: '#f0b35e', // instructions / exponents
  amberDeep: '#c98a36',
  coral: '#ff6b5e', // danger / writes / ciphertext
  coralDeep: '#d94a3d',

  // Code syntax (subtle)
  codeKeyword: '#7fbf7f',
  codeNumber: '#f0b35e',
  codeString: '#a8c98a',
  codeComment: '#5c655d',
  codeFn: '#e8e6df',
} as const;

export const FONTS = {
  mono: 'JetBrains Mono, DejaVu Sans Mono, monospace',
  monoNerd: 'JetBrainsMono Nerd Font, JetBrains Mono, monospace',
  display: 'Inter, Helvetica Neue, Arial, sans-serif',
} as const;

export const SIZES = {
  // Caption rail
  captionText: 54,
  captionChevron: 48,

  // Body / labels
  label: 28,
  body: 32,
  bodyLarge: 40,

  // Headers
  h3: 48,
  h2: 64,
  h1: 84,

  // Terminal
  terminalText: 26,
  terminalHeader: 22,
} as const;

export const EASE = {
  smooth: 'easeInOutCubic',
  out: 'easeOutCubic',
  in: 'easeInCubic',
  quad: 'easeInOutQuad',
} as const;
