# RSA Motion Canvas Explainer

A Motion Canvas v3 YouTube explainer video on the RSA algorithm, built in Thinh's YouTube house style.

## What's here

- **16 scenes** covering the full RSA story: key generation, encryption/decryption, Euler's theorem, the multiplicative group, prime generation, fast exponentiation, CRT decryption, Garner recombination, CRT exponent reduction, key-size security, prime-selection attacks, side-channel attacks, chosen-ciphertext/OAEP, and conclusion.
- **Stylized captions** — every narrated beat has a timed subtitle on a fading 80%-opaque near-black rounded rail at bottom-center, with a mint-green `>` chevron prefixing each cue. JetBrains Mono SemiBold, warm-white text. See `src/narration/captions.ts` for the full cue list and `src/components/CaptionOverlay.tsx` for the rail.
- **Lively visual elements** — terminals (title bar, traffic dots, typed commands, prime-search output), app UI windows (message composer, decrypted envelope), labeled blocks/chips, math equation lines, circular Euler cycle, number-line groups, progress bars, bit-length bar scales, factorization saws, timing-attack graphs, OAEP shields, and lucide-style icons (lock, key, CPU, shield, hammer, saw, envelope).

## Run

```bash
cd mc-rsa
npm install
npm run dev        # opens the Motion Canvas editor in the browser
npm run build      # production build
npm run typecheck  # type-check only
```

The dev server opens the Motion Canvas editor where you can scrub through all 16 scenes and verify captions, timing, and visuals.

## Structure

```
mc-rsa/
  src/
    project.ts              # wires all 16 scenes together
    narration/captions.ts   # caption cues + narration segments
    components/
      tokens.ts             # house-style colors, fonts, sizes
      CaptionOverlay.tsx    # caption rail + cue driver
      Terminal.tsx          # stylized terminal window + typing
      AppWindow.tsx         # app cards, chips, labeled blocks
      MathBlock.tsx         # equation lines with rules
    scenes/
      scene1KeyGen.tsx      ... scene16Conclusion.tsx
```

## Design notes

- Near-black canvas with faint green undertone, flat fills, crisp rules — no gradients, glass, or glow.
- Semantic color: mint = safe/active, amber = instructions/exponents, coral = danger/writes.
- Each scene has a small orientation tag (not a dashboard), then lets motion carry the explanation.
- Captions are driven by `runCaptions(refs, fromTime, toTime)` per scene, so they stay synced to each scene's local timeline.
