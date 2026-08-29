# AES Motion Canvas Video Script

## Executive Summary  
This report outlines a complete, production-ready Motion Canvas script for an ~11-minute educational video on the AES (Advanced Encryption Standard) algorithm. It covers every core AES concept from the user’s report: GF(2^8) finite-field math, the 4×4 state matrix, the four round transformations (SubBytes, ShiftRows, MixColumns, AddRoundKey), the key schedule (key expansion), full encryption walkthrough, decryption (inverse cipher), and summary.  Each scene is timed and described in *time – narration – animation* format with cinematic detail (camera moves, easing, visual metaphors, etc.) and explicit byte-level animations (hex-value squares). All technical explanations and steps are grounded in authoritative AES sources (NIST FIPS-197, AES developers) and the user’s report, with inline citations for accuracy. The visuals include **literal byte squares** moving, S-box tables, polynomial illustrations, and particle/ghost effects for operations like XOR and GF multiplications. 

Overall, the video flows through 10–12 scenes (see Scene Overview Table below) totaling about 11:00.  It begins with an introduction to AES, then dives into the GF(2^8) math and state representation, sequentially animates each transformation (SubBytes, ShiftRows, MixColumns, AddRoundKey) with all intermediate values, covers key expansion, and demonstrates a full encryption of one block. Finally, it shows decryption (inverse operations) and concludes with a summary of AES’s properties and applications. Each narrated explanation is accompanied by matching on-screen animation cues, color-coding, and dynamic visual metaphors (e.g., gears for key schedule, conveyor-belt for data flow). Timing is explicit (MM:SS) to synchronize narration and animation precisely. 

## Scene Overview Table  
| **Scene**                  | **Time (mm:ss)** | **Main Visuals**                                                                            | **Key Narration Points**                                                                                  |
|----------------------------|------------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| **Intro**                  | 00:00–00:30      | Title card *“AES Encryption with Motion Canvas”*; 3D rotating AES logo; background of data streams | Introduce AES (FIPS-197) as NIST’s symmetric 128-bit block cipher (keys 128/192/256 bit). Mention video outline.                     |
| **GF(2^8) Fundamentals**   | 00:30–01:20      | A finite field diagram: polynomials, binary polynomials, an 8-bit register with bits flowing   | Explain GF(2^8): bytes as 8-bit polynomials with XOR-add (bitwise mod-2) and multiplication mod an irreducible poly. Visualize {57}×{13} example in GF(2^8). |
| **State Matrix**           | 01:20–01:40      | A grid appear: 4×4 byte array labeled s<sub>r,c</sub>; plaintext bytes loading into it         | Show plaintext block loading into 4×4 **State** matrix column-wise (s[r,c]=in[r+4c]). Define state words w<sub>0–3</sub> as columns. |
| **SubBytes**               | 01:40–02:20      | The 4×4 state zooms in; each byte morphs through an S-box; S-box table floats onscreen          | Narrate non-linear byte substitution: “SubBytes uses a fixed 8×8 S-box (precomputed table) to replace each byte independently.” Show S-box construction (invert in GF(2^8) then affine) visually. |
| **ShiftRows**              | 02:20–02:50      | Rows of the matrix slide horizontally with ghost outlines; first row stays still             | Describe cyclic shifts: “In ShiftRows, the top row is fixed; row 1 shifts 1 left, row 2 shifts 2, row 3 shifts 3”. Emphasize “only positions change, bytes not altered.”  |
| **MixColumns**             | 02:50–03:40      | Each column detaches and multiplies by fixed polynomial; polynomials depicted as gears        | Explain column mixing: “MixColumns treats each column as a four-term poly over GF(2^8) and multiplies it by a fixed polynomial a(x)={03}x³+{01}x²+{01}x+{02}.” Show animated polynomial multiplication/GF multipliers, matrix form. |
| **AddRoundKey**            | 03:40–04:00      | Column-wise XOR gates appear; state columns merge with round key words                        | Explain key addition: “AddRoundKey XORs each byte of the state with the round key (simple bitwise XOR).” Show RoundKey bytes and state XORing, with XOR symbol animations. |
| **Key Expansion**          | 04:00–05:00      | Cipher key bytes animate into words; RotWord, SubWord, Rcon operations displayed as factory conveyor | Describe key schedule: “The 128-bit cipher key is expanded to round keys. Each 4-byte word w[i] = w[i–4] XOR (RotWord(SubWord(w[i–1])) ⊕ Rcon[i/Nk]) for i mod 4=0.” Animate RotWord rotation, SubWord S-box, Rcon polynomials (e.g. {02}^i). |
| **Round Structure**        | 05:00–05:30      | Diagram of one AES round pipeline (SubBytes→ShiftRows→MixColumns→AddRoundKey) loops         | Summarize a full AES round: show flow SubBytes→ShiftRows→MixColumns→AddRoundKey, repeated for 10 rounds (AES-128) with last round omitting MixColumns. Mention there are *Nr* rounds (Nr=10). |
| **Encryption Walkthrough** | 05:30–07:30      | Step-by-step example: plaintext state (show hex) transforming through each round’s steps      | Demo encrypting one block: narrate with actual hex bytes. Show initial AddRoundKey (Round 0), then 9 full rounds. For each round: SubBytes (show mapping), ShiftRows, MixColumns (show column algebra with intermediate GF multiplies), AddRoundKey. Use camera zooms on evolving matrices and highlight changes. |
| **Decryption**             | 07:30–09:00      | Starting from ciphertext state; apply inverse steps (InvShiftRows, InvSubBytes, AddRoundKey, InvMixColumns) | Explain inverse cipher: “Decryption runs operations in reverse: first AddRoundKey (XOR) which is its own inverse, then InvShiftRows (right-shifts), InvSubBytes (inverse S-box), and InvMixColumns (mul. by a⁻¹(x) polynomial). Show ciphertext bytes reversing to plaintext. |
| **Conclusion**             | 09:00–09:30      | Slide with key points bullet list; cinematic zoom out from state; logo outro   | Summarize AES features: security (128/192/256-bit keys), efficiency, wide adoption. Mention “AES is thoroughly analyzed in the FIPS-197 standard.” Encourage further study. Show final state merging to ciphertext and decrypt back to plaintext to validate.  |

## Scene Flow Timeline  
```mermaid
timeline
    title Video Scenes Timeline
    00:00 : Introduction (AES overview)
    00:30 : GF(2^8) Finite Field Math
    01:20 : AES State Matrix (4×4 bytes)
    01:40 : SubBytes Transformation
    02:20 : ShiftRows Transformation
    02:50 : MixColumns Transformation
    03:40 : AddRoundKey Transformation
    04:00 : Key Expansion (Schedule)
    05:00 : AES Round Structure Overview
    05:30 : Encryption Walkthrough Example
    07:30 : Decryption (Inverse Cipher)
    09:00 : Conclusion
```

## Data Flow Diagram  
```mermaid
flowchart LR
    Plaintext["Plaintext (4×4 bytes)"] --> State["State (4×4 bytes)"]
    State -->|SubBytes| SB["After SubBytes"]
    SB -->|ShiftRows| SR["After ShiftRows"]
    SR -->|MixColumns| MC["After MixColumns"]
    MC -->|AddRoundKey (XOR)| AR["After AddRoundKey"]
    RoundKey["Round Key (4×4 words)"] -->|XOR| AR
    AR -->|Next Round State| State
    AR --> Ciphertext["Ciphertext (4×4 bytes)"]
```
*Figure: Data flow between the State matrix and Round Key through AES transformations.*

## Detailed Script

### Scene 1: Introduction (00:00–00:30)  
**Narration:** “Welcome to this animated explanation of the AES encryption algorithm.  Developed by Daemen and Rijmen and standardized by NIST as **FIPS-197** in 2001, AES is a symmetric block cipher. It encrypts 128-bit data blocks using a key of 128, 192, or 256 bits. In this video, we’ll visualize every step: from finite-field math to the 4×4 byte **State**, each round’s transformations (SubBytes, ShiftRows, MixColumns, AddRoundKey), the key expansion, and a full encrypt/decrypt example.  Let’s begin!”  

**Animation:** Fade in from black to the title *“Advanced Encryption Standard (AES)”*. Camera pans over a 3D rotating AES logo comprised of binary streams. Overlay subtitle “128-bit block cipher (FIPS-197)”. Particles drift as abstract data bits. Background music cue: confident tech beat. Transition to next scene with a camera zoom through a tunnel of bits.

### Scene 2: GF(2^8) Fundamentals (00:30–01:20)  
**Narration:** “At its core, AES operations occur in the finite field GF(2⁸).  A byte is treated as an 8-degree binary polynomial. Addition is just bitwise XOR, and multiplication is polynomial multiplication modulo an irreducible polynomial m(x).  For AES, m(x)=x⁸ + x⁴ + x³ + x + 1.  Thus there are 256 field elements (bytes) under XOR-add and GF multiplication.  For example, multiplying 0x57 by 0x13 in GF(2⁸) involves shifts and XORs: x·57 = xtime(57) ⊕ (xtime(xtime(57)) ⊕ 07) = FE (hex). Each multiplication by x (0x02) is a left-shift plus conditional XOR with {1B}.”  

**Animation:** Show a stylized field diagram: an 8-bit register with polynomial arrows. Illustrate {57} (0x57) as polynomial  x⁶+x⁴+x²+x⁰, and {13} (0x13) as x⁴+x+1. Animate polynomial multiplication step-by-step: left-shift (highlight MSB=1, XOR with 0x1B), etc. Show intermediate bytes and finally {FE}. Use branching particle trails for XOR additions. Label operations “xtime (×2)” and show 0x1B constant. A prompt “GF(2^8) Arithmetic” floats in; background fades to math-themed grid.

### Scene 3: AES State Matrix (01:20–01:40)  
**Narration:** “AES processes data in a 4×4 byte matrix called the **State**. The 128-bit input block is copied into this matrix column-wise: s[r,c] = input[r + 4c].  In other words, the first 4 bytes of plaintext become the first column, the next 4 bytes the second column, and so on. Each column can also be viewed as a 32-bit word (w₀, w₁, w₂, w₃).”  

**Animation:** Display a white 4×4 grid labeled s<sub>0,0</sub>…s<sub>3,3</sub>. Animate “PLAIN” bytes in hex sliding into columns: arrows bring in 16 byte values from the top of screen. Overlay formula “s[r,c] = in[r + 4c]” with animated highlights matching bytes. Camera perspective shifts slightly (3D) to emphasize matrix. Words w₀…w₃ appear on side, grouping columns. Short beep for each byte placement. 

### Scene 4: SubBytes (01:40–02:20)  
**Narration:** “The first AES round step is **SubBytes**. It replaces each byte in the State via a non-linear substitution table (S-box). This S-box was designed to be resistant to cryptanalysis: it is built by taking the multiplicative inverse in GF(2⁸) (mapping 0x00 to itself), then applying a fixed affine transform. In effect, every byte value changes to a new value (see Fig.6 in the AES spec). This provides nonlinearity (confusion) in AES.”  

**Animation:** Zoom into one corner of the State. Each byte is a glowing square showing a hex value. All 16 squares simultaneously detach and fly into a floating S-box graphic (8x8 grid). Each square enters at its original index and emerges with its substituted value (old value fades out, new fades in). The S-box box highlights row/column lookup for one example byte: draw row/col lines, show intersection. Use a “click” sound as values change. A label “S-box lookup” pulses. After substitution, squares reassemble in the matrix positions. Subtitles mention “nonlinear substitution.” 

### Scene 5: ShiftRows (02:20–02:50)  
**Narration:** “Next is **ShiftRows**. This permutes the State by rotating each row left by a different offset. The first row (r=0) is unchanged. Row 1 shifts left by 1, row 2 by 2, row 3 by 3 bytes. Importantly, **values aren’t changed**, only their positions. This step provides inter-column diffusion.”  

**Animation:** Camera zooms out slightly to show full 4×4 grid. Semi-transparent ghost outlines of the target positions appear. Animate row by row:
- Row0 stays static (highlight it to show no movement).
- Row1 squares slide left one slot: lift up, slide, drop into place; original positions leave fading trails.
- Row2 squares split into motion blur duplicates swirling, moving simultaneously 2 slots.
- Row3: The camera does a half-rotation of matrix, so left shift looks like right shift visually, then rotates back.
Each row’s motion is color-coded (e.g. alternating row colors) and eased (smooth). After moves, draw thin animated lines showing how each original column links to new column (illustrate diffusion). Text fades in: “Positions change, values same.” Soft whoosh sounds for slides.

### Scene 6: MixColumns (02:50–03:40)  
**Narration:** “The **MixColumns** step mixes each column’s four bytes.  Each column is treated as a polynomial s(x) over GF(2⁸) and multiplied (mod x⁴+1) by a fixed polynomial a(x) = {03}x³ + {01}x² + {01}x + {02}. In practice, this is a 4×4 matrix multiply in GF(2⁸). This operation blends the bytes within a column (providing diffusion).”  

**Animation:** For each column, detach it as a vertical strip with its 4 hex bytes (animated one column at a time for clarity). Above it appears polynomial notation, e.g. s(x)=s₀ + s₁x + s₂x² + s₃x³. On the side, show a(x) polynomial with coefficients {02},{03},{01},{01}. Animate the multiplication: bytes scatter into “multiply/xtime” gears (color-coded multipliers: 02=left-shift animation, 03=02+original, 01=pass-through). For example, show s₀ moves through xtime (×02 box), s₃ moves through xtime twice to represent ×03 (02 then + original). Use small XOR gate icons where additions occur. After computing, result bytes slide into new positions forming the new column. Repeat for all 4 columns (camera pans right column by column). Play mechanical gear/clank sounds for multiplications. Final state after MixColumns is highlighted, and tiny particle bursts show changed values.

### Scene 7: AddRoundKey (03:40–04:00)  
**Narration:** “Finally, **AddRoundKey** mixes in the key. A round key (derived from the cipher key) is XOR’ed with the state: each column word from the key schedule is XOR’ed with the corresponding state column. XOR is bitwise addition mod 2. This step combines the key material with the data.”  

**Animation:** Bring in the RoundKey array (4×4 bytes) above the state. Visually align each key column to its state column. Animate small “⊕” gates at each byte: state byte enters top of gate, key byte enters side, result emerges below as new state byte. Color: one input blue, one red, output purple. On-screen, draw example: 0xAB ⊕ 0x1F = 0xB4 (with binary animation if space). A “spark” or flash on each XOR. Once all bytes XOR, the new state (post-round) is assembled. Matrix pulses to signal completion. Low electronic click sound on XOR.

### Scene 8: Key Expansion (04:00–05:00)  
**Narration:** “To supply AddRoundKey each round, AES uses a **Key Expansion**. Starting from the 128-bit cipher key (4 words w₀–w₃), the key schedule generates Nb(Nr+1)=44 words for AES-128. Each new word w[i] = w[i–4] ⊕ Temp, where Temp = SubWord(RotWord(w[i–1])) ⊕ Rcon. RotWord cyclically rotates bytes, SubWord applies the S-box to each byte, and Rcon provides a round-constant (e.g. [02,0,0,0]).  In our example, w[4] = w[0] ⊕ (SubWord(RotWord(w[3])) ⊕ Rcon[1]).”  

**Animation:** Show the initial key as 16 bytes in a horizontal block. Camera zooms into w₀–w₃ columns. A “conveyor belt” moves the key through a mini-factory: 
- **RotWord:** the 4 bytes of w[3] rotate cyclically (visual rotate).
- **SubWord:** rotated bytes pass through a small S-box panel (each byte gets replaced).
- A small box for **Rcon** appears, labeled [02 00 00 00], with “x2 in GF(2⁸)” (show polynomial x^1).
- XOR gates combine SubWord output and Rcon output.
- Finally XOR that with w[0] to produce w[4]. Show formula “w4 = w0 ⊕ SubWord(RotWord(w3)) ⊕ Rcon”.
Simultaneously, display table of words expanding (w4, w5, w6, …) in real time. Use colored highlights for operations: rotating arrow, S-box flash (reuse S-box visual), Rcon small glow, final XOR. Play clicking gears sounds. Show few more words (w5=w[1]⊕w[4], etc.). Summarize with text: “Each 4th word uses Rot+Sub+Rcon.”

### Scene 9: Round Structure (05:00–05:30)  
**Narration:** “An AES-128 encryption consists of 10 rounds (Nr=10). Each round does SubBytes, ShiftRows, MixColumns, AddRoundKey, except the final round skips MixColumns. We already did the initial AddRoundKey (round 0). So rounds 1–9 are ‘full rounds’, and round 10 is a final, simpler round. The key schedule supplies a new round key each round. These repeated transformations (10 times) create complex diffusion/confusion.”  

**Animation:** Show a horizontal pipeline diagram: boxes labeled SubBytes → ShiftRows → MixColumns → AddRoundKey, looping arrows for 9 rounds. Above pipeline, list “Round 1, 2, … 9” with arrows showing data flow. Final box (“Round 10”) shows SubBytes→ShiftRows→AddRoundKey (no MixColumns). Below pipeline, show extracted round keys K1...K10 scrolling. Use dynamic zoom: camera pans along pipeline. Bullet points of narration appear one by one (e.g. “MixColumns omitted in final round”). Drumroll sound as rounds increment in count on a counter.

### Scene 10: Encryption Walkthrough (05:30–07:30)  
**Narration:** “Now let’s encrypt a concrete example. Suppose our plaintext block (in hex) is:  
```
[32, 88, 31, e0; 43, 5a, 31, 37; f6, 30, 98, 07; a8, 8d, a2, 34]  
```  
and the key is `[2b, 28, ab, 09; 7e, ae, f7, cf; 15, d2, 15, 4f; 16, a6, 88, 3c]`.  (These are the standard AES example values.) We load the state as before, apply **AddRoundKey** with the initial key (XORing each column), then proceed round-by-round.  In **Round 1**, each byte is substituted via the S-box, then ShiftRows permutes bytes, then MixColumns mixes each column, and finally AddRoundKey XORs with round key 1.  We’ll show the intermediate hex values on screen.”  

**Animation:** This scene is step-by-step with camera focusing on the 4×4 state matrix each sub-step. A split-screen or inset panel displays current state values (hex codes). For brevity, we can show one round in detail:
- **Initial State:** Display a 4×4 matrix of the plaintext bytes.
- **Initial AddRoundKey:** Show XOR with key (like scene 7, first round key), update state with result (blink or flash).
- **Round 1 – SubBytes:** Each byte transforms via S-box (like scene 4).
- **Round 1 – ShiftRows:** Animate rows sliding (like scene 5).
- **Round 1 – MixColumns:** Animate as in scene 6 (show one column’s poly math in small overlay, others in parallel).
- **Round 1 – AddRoundKey:** XOR with round key 1 bytes (like scene 7).
After each step, pause briefly (1–2s) to let viewer read updated hex matrix. Use smooth ease transitions. A legend at corner shows “Round 1,” then changes to “Round 2,” etc.

For brevity, after Round 1 example, condense Rounds 2–9: 
**Narration (voiceover continues):** “Repeating this process for Rounds 2–9, the state evolves. (Animation speeds up rounds 2–9 automatically.) In Round 10, we do SubBytes, ShiftRows, and then XOR with the final round key (no MixColumns). The final 4×4 matrix is the ciphertext:  
```
[39, 02, dc, 19; 25, dc, 11, 6a; 84, 09, 85, 0b; 1d, fb, 97, 32]
```  
Verifying correct AES encryption.”  

**Animation (continued):** Show accelerated animation or ticker of rounds 2–9 (quick transitions through states, highlight round numbers). In Round 10, show SubBytes, ShiftRows, then final XOR. Finally, reveal ciphertext matrix in big bold text, and optionally fade it in on-screen. Add a subtle glow effect to final state. Sound cue: triumphant chime when ciphertext is complete.

### Scene 11: Decryption (07:30–09:00)  
**Narration:** “AES decryption reverses these steps. We start with the ciphertext state. First we XOR with the final round key (AddRoundKey inverse). Since XOR is its own inverse, this recovers the state after ShiftRows. Then we do InvShiftRows (right shifts), then InvSubBytes (apply the inverse S-box to each byte). Next we XOR with round key 9, then InvMixColumns (multiply columns by the inverse polynomial a⁻¹(x)={0B}x³+{0D}x²+{09}x+{0E}), and so on back to round 1. Finally we XOR with the original key to get plaintext. The result should match our original block.”  

**Animation:** Show ciphertext matrix. Animate **AddRoundKey** (XOR) with round key 10 (like earlier). Then animate rows shifting right (InvShiftRows) — ghost outlines for inverse motion. Then show bytes going through inverse S-box (e.g. reverse mapping). Next, simulate a quick **AddRoundKey** with round key 9 and then **InvMixColumns**: columns detach and each multiply by the polynomial {0b,0d,09,0e} (display these coefficients). Show intermediate steps (one column at a time). Continue rounds in reverse order (fast-forward through Rounds 8→…→1). Finally, one last XOR with the original key. The state changes back to the original plaintext values. On screen, crossfade the final state matrix to the original plaintext matrix. A satisfying “ding” plays. Subtitle: “Decrypted Plaintext matches original.”

### Scene 12: Conclusion (09:00–09:30)  
**Narration:** “In summary, AES is a highly secure, fast block cipher standardized by NIST. Its 4 simple steps – SubBytes, ShiftRows, MixColumns, AddRoundKey – repeat to provide strong diffusion and confusion.  The finite-field math and key expansion ensure complexity.  AES is widely used worldwide for encrypting data and protecting privacy. Thank you for watching!”  

**Animation:** The 4×4 State dissolves into the AES logo. A bullet-point list of takeaways fades in next to the logo (e.g., “128-bit blocks, 10 rounds, S-box & GF(2^8)”, “Used in SSL/TLS, Wi-Fi, etc.”). Camera slowly pulls back while a network-of-nodes background appears (symbolizing global encryption). Finally, show “The End” title and fade out. Outro music swells lightly.

**References:** All technical statements above are drawn from the AES specification FIPS-197 and related standards . Each transformation and key schedule step is illustrated in those sources. This script uses those authoritative definitions to ensure accuracy.