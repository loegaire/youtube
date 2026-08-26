# SHA-256: HOW HASHING ACTUALLY WORKS

## Production contract

**Target runtime:** ~20:30
**Visual language:** dark flat technical-cinematic.
**Background:** `#000000`.
**Normal/primary:** teal.
**Secondary accent:** light orange.
**Important:** yellow.
**Supplementary:** cyan.
**Bug/failure/security warning:** light red.
**Typography:** Google Code Nerd Font / equivalent monospace Nerd Font for all code, terminals, hexadecimal, paths, labels.
**Geometry:** hard rectangular panels, square corners, thin technical borders. No transparency. No glassmorphism. No rounded cards.
**Animation density:** every shot contains at least two simultaneous motion systems: camera motion + object/data/UI motion.
**Camera vocabulary:** macro push-in, dolly, parallax slide, orbital movement, rack-focus simulation, whip-pan transitions, top-down inspection, extreme close-up, diagonal tracking, pull-back reveal.
**Icons:** use Font Awesome/Nerd Font glyphs wherever a symbol can replace prose: `\uf023` lock, `\uf084` key, `\uf15b` file, `\uf07b` folder, `\uf120` terminal, `\uf1c0` database, `\uf1eb` network/wireless, `\uf188` bug, `\uf002` search, `\uf00c` check, `\uf00d` failure, `\uf3ed` shield, `\uf013` settings/gear. Verify the exact glyph mapping in the selected Nerd Font before rendering.

## Suggested project structure

```text
sha-video/
├── components/
│   ├── TerminalWindow.ts
│   ├── CodeEditor.ts
│   ├── HexViewer.ts
│   ├── PacketInspector.ts
│   ├── LoginPanel.ts
│   ├── FileExplorer.ts
│   ├── HashDigest.ts
│   ├── RegisterBank.ts
│   ├── BitStrip.ts
│   ├── MessageSchedule.ts
│   ├── HashRound.ts
│   ├── CameraRig.ts
│   ├── Label.ts
│   ├── Scanline.ts
│   ├── Cursor.ts
│   └── GlitchText.ts
├── scenes/
│   ├── 01-hook.ts
│   ├── 02-examples.ts
│   ├── 03-toy-hash.ts
│   ├── 04-sha-inner-workings.ts
│   ├── 05-mini-sha.ts
│   ├── 06-security.ts
│   └── 07-break-the-toy.ts
└── components/index.ts
```

**Reusable-component rule:** every repeated terminal, code-editor, hex-editor, register bank, digest strip, packet panel, file explorer, cursor, scanline, or camera behavior must live in `/components`; scene files orchestrate them rather than duplicating their implementation.

---

# SCRIPT

## SCENE 01 — THE LOCKED SECRET

### 01

**Speech:** “Hello again, hackers. Have you ever wondered how your laptop can check your password without needing to keep the actual password sitting inside the machine?”
**Animation:** Start on pure black. A single cyan `\uf023` lock glyph appears as a tiny point in the center. Camera performs an extremely slow macro push-in. The lock suddenly expands into a full-screen hard-edged login interface: username field, password field, `ENTER` key, system clock. A cursor enters the password field. Characters appear for `hunter2`, immediately transforming into seven large teal password bullets. No rounded UI. The camera tracks the cursor from field to field.
**Timing:** `0:00–0:08`

### 02

**Speech:** “You type characters. The computer turns those characters into numbers. And those numbers are transformed again and again until what comes out looks nothing like what you typed.”
**Animation:** Freeze the login screen. Camera pushes through the password bullets. Each bullet breaks apart into ASCII byte values: `68 75 6E 74 65 72 32`. The byte stream accelerates toward the center and enters a cyan processing tunnel. The camera follows the data rather than cutting away. The bytes stretch into binary, then fold into a long 64-character hexadecimal digest.
**Timing:** `0:08–0:18`

### 03

**Speech:** “That process is hashing. And one particular family of hash functions has been hiding inside operating systems, software downloads, signatures, protocols, and security tools for years: SHA.”
**Animation:** The digest rotates edge-on. Camera pulls back to reveal five separate environments orbiting it: a laptop login, a file download, a packet capture window, a source-code editor, and a database. The central digest remains fixed while the environments rotate around it like a technical carousel. Large title `HASH FUNCTIONS` appears in teal; `SHA-2` appears in yellow.
**Timing:** `0:18–0:30`

### 04

**Speech:** “But before we touch SHA-256, we need to understand what a hash is actually doing.”
**Animation:** Whip-pan from the orbiting environments into a black technical workspace. The word `HASH` is assembled from individual hexadecimal characters. Camera lands directly on the first example.
**Timing:** `0:30–0:38`

---

# SCENE 02 — WHERE HASHES SHOW UP

## Passwords

### 05

**Speech:** “The first example is the obvious one: passwords.”
**Animation:** Hard-cut into a simulated Linux-style authentication server. Left side is a terminal with `auth.log`; right side is a database viewer showing columns `user`, `salt`, `password_hash`. The user types `correct-horse-battery-staple`. The password visibly flows toward the hash function and disappears into the digest.
**Timing:** `0:38–0:48`

### 06

**Speech:** “A properly designed password system should not need to store your password as readable text. It stores a verifier instead, allowing a future login attempt to be checked against the stored result.”
**Animation:** Camera dives into the database row. Replace the plaintext-looking field with a salted password-hashing record. Split-screen comparison appears: left `PLAINTEXT`, right `VERIFIER`. The left side flashes light red and receives a `\uf00d`; the right receives a yellow `\uf00c`. Show the conceptual flow `password + unique salt + password KDF → verifier`.
**Timing:** `0:48–1:04`

### 07

**Speech:** “There is an important catch, though: SHA-256 itself is not the right tool for storing passwords. It is deliberately fast.”
**Animation:** The SHA-256 digest on the right accelerates through thousands of simulated guesses per second. Camera shakes subtly with each accelerated iteration. A large red stamp `TOO FAST FOR PASSWORD STORAGE` slams onto the screen. Immediately replace the stamp with `ARGON2ID / SCRYPT / BCRYPT / PBKDF2` in yellow.
**Timing:** `1:04–1:18`

---

## File integrity

### 08

**Speech:** “The second use is file integrity. You download a file, calculate its hash, and compare that result with a trusted value.”
**Animation:** Simulated browser download screen displays `debian-image.iso`. Camera tracks the file into a terminal. Run:

```text
$ sha256sum debian-image.iso
...
```

The resulting 64-character digest types itself onto the terminal. A web-style release page slides in from the opposite side showing a trusted SHA-256 value. Draw a teal scanning line across both strings. Every character matches.
**Timing:** `1:18–1:34`

### 09

**Speech:** “Change even one bit of the message, and the resulting digest should change dramatically.”
**Animation:** Camera zooms to one hexadecimal byte. Change one bit in the file from `0` to `1`. The digest does not simply change locally: every displayed hexadecimal character rapidly flickers and resolves to a new value. Use a radial outward ripple made only from hard-edged teal characters.
**Timing:** `1:34–1:48`

---

## Digital signatures

### 10

**Speech:** “Hashes also sit underneath digital signatures. The hash compresses the message into a fixed-size digest, and the signature mechanism protects that digest.”
**Animation:** Show a software release package entering a SHA-256 engine. The resulting digest enters a stylized private-key signature operation. The signature file is shown as a second rectangular artifact. Camera rotates around the package and signature together. A verification machine receives both and reconstructs the digest from the downloaded package.
**Timing:** `1:48–2:06`

### 11

**Speech:** “So the hash by itself is not the identity of the publisher. The signature and its public-key verification are what provide authenticity.”
**Animation:** Temporarily make the unsigned hash panel light red and label it `INTEGRITY SIGNAL`. Then bring in the public key and verified signature, turning the complete chain into yellow `AUTHENTIC + UNMODIFIED`.
**Timing:** `2:06–2:18`

---

## Network and systems checks

### 12

**Speech:** “They also appear in integrity checks around systems and networks, where the hash acts like a compact fingerprint of some larger piece of data.”
**Animation:** Simulated packet inspector appears. Packets stream across the screen as colored hexadecimal payloads. The payloads converge into a digest indicator. Camera follows one packet from source to destination and performs a diagonal tracking move as the digest is recomputed.
**Timing:** `2:18–2:30`

### 13

**Speech:** “And then there is the much broader world of hash tables.”
**Animation:** Camera pulls away from the packet inspector into a source-code editor. Display:

```cpp
unordered_map<string, int> users;
```

Animate several keys entering the hash function and landing in bucket columns. Show two different keys landing in the same bucket, then being resolved through equality checking.
**Timing:** `2:30–2:42`

### 14

**Speech:** “Hash tables use hashing to quickly choose a bucket. That is the same broad idea, but a normal hash-table hash does not automatically have the security properties of a cryptographic hash.”
**Animation:** Split the screen vertically. Left: `HASH TABLE → SPEED`. Right: `CRYPTOGRAPHIC HASH → SECURITY PROPERTIES`. Camera performs a slow horizontal scan across both, stopping on the words `DIFFERENT GOALS`.
**Timing:** `2:42–2:55`

### 15

**Speech:** “So now we have the vocabulary. Let’s build a hash from the ground up.”
**Animation:** Everything disappears except one incoming binary stream. The camera pulls far back until the stream becomes a tiny line on a giant black canvas. The title `FROM ONE BIT → SHA-256` appears in yellow.
**Timing:** `2:55–3:02`

---

# SCENE 03 — THE ABSURDLY SIMPLE TOY HASH

### 16

**Speech:** “Forget SHA-256 for a moment. Imagine the entire hash function is just this: count the number of one-bits.”
**Animation:** Show a giant eight-bit strip:

```text
10110010
```

Each `1` lights up sequentially. Camera makes a shallow top-down movement across the bit strip while the counter increments `1…2…3…5`.
**Timing:** `3:02–3:12`

### 17

**Speech:** “If the count is odd, output one. If it is even, output zero.”
**Animation:** The number `5` slams into a modulo operation. Result becomes `1`. The entire eight-bit input collapses into a single giant `1`. Camera performs a dramatic pull-back to emphasize the extreme compression.
**Timing:** `3:12–3:24`

### 18

**Speech:** “That is technically a hash.”
**Animation:** Tiny label appears: `FIXED OUTPUT`. Then below it: `1 BIT`. A subtle cinematic push-in makes the single bit look absurdly small compared with the original input.
**Timing:** `3:24–3:30`

### 19

**Speech:** “But it is a terrible cryptographic hash, because millions of different inputs can produce exactly the same answer.”
**Animation:** Duplicate the input into a cascade of hundreds of binary strings. Half collapse to `0`, half collapse to `1`. Camera rises overhead as the strings form two enormous columns. Use cyan for inputs and light red for collisions.
**Timing:** `3:30–3:42`

### 20

**Speech:** “This gives us the first security lesson: compression is not enough. Security comes from how difficult it is to manipulate that compressed result in useful ways.”
**Animation:** The two columns collapse into the labels `PREIMAGE`, `SECOND PREIMAGE`, and `COLLISION`. Each label enters from a different camera direction and locks into a triangular technical diagram.
**Timing:** `3:42–3:54`

### 21

**Speech:** “A cryptographic hash is expected to make finding a chosen input, a second matching input, or a useful collision computationally infeasible.”
**Animation:** Three attack paths race toward the digest: target-output arrow, known-message arrow, two-message collision arrow. Each gets blocked by an expanding matrix of transformations. Camera orbits once around the blocked paths.
**Timing:** `3:54–4:08`

---

# SCENE 04 — ENTER SHA-256

## Establishing shot

### 22

**Speech:** “Now replace our pathetic one-bit toy with SHA-256.”
**Animation:** The single-bit `1` cracks apart. Behind it, a gigantic technical engine assembles from hundreds of hexadecimal symbols. The camera flies directly into its center. Title `SHA-256` appears in yellow.
**Timing:** `4:08–4:15`

### 23

**Speech:** “SHA-256 accepts an arbitrary-length message, processes it in 512-bit blocks, and produces a 256-bit message digest.”
**Animation:** Show a 64-byte visual strip entering a giant rectangular processing frame. Label the input `512 BITS`. The output becomes eight stacked 32-bit registers totaling `256 BITS`. Camera pans from input to output with a controlled mechanical movement.
**Timing:** `4:15–4:27`

### 24

**Speech:** “Internally, the 256-bit state is represented as eight 32-bit words.”
**Animation:** Create registers:

```text
a  b  c  d  e  f  g  h
```

Each receives a 32-bit hexadecimal value. The camera performs an arc over the register bank while the values stabilize.
**Timing:** `4:27–4:36`

---

## Step one: padding

### 25

**Speech:** “Before the real compression begins, SHA-256 pads the message.”
**Animation:** Display the word:

```text
abc
```

beneath its ASCII bytes:

```text
61 62 63
```

Camera pushes into the final byte. Append a binary `1`, then a field of zeros, then a 64-bit message-length field. The camera follows the padding expanding the message until the frame reaches exactly 512 bits.
**Timing:** `4:36–4:52`

### 26

**Speech:** “The padding ends with the original message length, encoded as a 64-bit value, so the final block carries both the data and information about how long that data originally was.”
**Animation:** Highlight the final 64 bits in yellow. Morph `24` into binary:

```text
000...00011000
```

Camera performs a vertical rack-focus from the original `abc` to the length field.
**Timing:** `4:52–5:04`

---

## Step two: sixteen words become sixty-four

### 27

**Speech:** “That 512-bit block is split into sixteen 32-bit words.”
**Animation:** The 512-bit strip breaks into `W0` through `W15`. Rather than using simple boxes, render each word as a moving hexadecimal packet traveling along a conveyor with a mechanical indexing cursor.
**Timing:** `5:04–5:16`

### 28

**Speech:** “But SHA-256 does not stop at sixteen. It expands that data into a message schedule containing sixty-four 32-bit words.”
**Animation:** Camera follows `W15`. The final word bends into a branching data path that generates `W16`. Continue visually expanding the schedule until the screen contains `W0 … W63`. The camera continuously tracks the newly generated word instead of cutting.
**Timing:** `5:16–5:30`

### 29

**Speech:** “Each later word is derived from earlier words using rotations, shifts, and modular addition.”
**Animation:** Show a single schedule-generation lane:

```text
W[t-16] ─┐
W[t-15] ─┼─ σ0 / σ1 ── + ── W[t-7] ── W[t-2] ──> W[t]
```

Animate the actual bit pattern being rotated and shifted. Use yellow for `σ0` and `σ1`, teal for ordinary data, cyan for intermediate values. Camera tracks the bit lanes physically.
**Timing:** `5:30–5:46`

---

# SCENE 05 — THE COMPRESSION ENGINE

## Initialize state

### 30

**Speech:** “Now the interesting part. SHA-256 starts with eight predefined 32-bit state values.”
**Animation:** Eight register rails enter from the left. Each gets an initial hexadecimal constant. Camera performs an overhead sweep across all eight, then locks onto register `a`.
**Timing:** `5:46–5:56`

### 31

**Speech:** “Call them `a`, `b`, `c`, `d`, `e`, `f`, `g`, and `h`.”
**Animation:** The letters animate into their positions as if stamped onto hardware registers. Immediately behind them, a faint numerical trace shows each register being updated.
**Timing:** `5:56–6:02`

---

## The logical functions

### 32

**Speech:** “SHA-256 uses small Boolean functions to mix individual bits together.”
**Animation:** Camera zooms inside the `e`, `f`, `g` registers. Individual bits become large square particles. Two logical operations appear: `Ch` and `Maj`.
**Timing:** `6:02–6:10`

### 33

**Speech:** “The Choose function selects bits from one input or another.”
**Animation:** Animate:

```text
Ch(e,f,g) = (e AND f) XOR ((NOT e) AND g)
```

The `e` bit stream becomes a rapidly moving control mask. Bits from `f` and `g` physically pass through it and emerge as a new stream.
**Timing:** `6:10–6:22`

### 34

**Speech:** “The Majority function looks at three inputs and chooses the bit value that appears most often.”
**Animation:** Show three vertically aligned bit columns entering a majority gate. Triple examples animate simultaneously: `0,0,1 → 0`; `1,1,0 → 1`; `1,0,1 → 1`.
**Timing:** `6:22–6:34`

### 35

**Speech:** “These are tiny operations. The difficulty comes from repeating them across many rounds while constantly changing the state.”
**Animation:** Pull the camera out from the individual gate to reveal the entire compression engine. Hundreds of small data movements become visible simultaneously. The words `REPEAT × 64` appear in yellow.
**Timing:** `6:34–6:44`

---

## The big sigma functions

### 36

**Speech:** “SHA-256 also uses large sigma functions built from bit rotations and XOR.”
**Animation:** Focus on register `a`. Its 32-bit pattern rotates physically in three separate copies. Overlay:

```text
Σ0(a) = ROTR²(a) XOR ROTR¹³(a) XOR ROTR²²(a)
```

The three rotated streams converge into a single XOR network.
**Timing:** `6:44–6:58`

### 37

**Speech:** “For the `e` side of the state, the rotations are different.”
**Animation:** Camera whip-pans to `e`. Show:

```text
Σ1(e) = ROTR⁶(e) XOR ROTR¹¹(e) XOR ROTR²⁵(e)
```

The bit lanes rotate at visibly different speeds before merging.
**Timing:** `6:58–7:10`

---

## One complete SHA-256 round

### 38

**Speech:** “Now watch one complete round.”
**Animation:** Everything except the eight working registers and current `W[t]` fades by moving offscreen; no transparency. Camera begins a slow circular orbit around the compression engine. A large `ROUND 17` indicator appears.
**Timing:** `7:10–7:15`

### 39

**Speech:** “First, SHA-256 computes `T1` from `h`, the sigma function of `e`, the Choose function, a round constant, and the current message word.”
**Animation:** Render the equation:

```text
T1 = h + Σ1(e) + Ch(e,f,g) + K[t] + W[t]
```

Every operand physically travels along its own rail and enters a modular-addition stage. Yellow highlights `K[t]`; cyan highlights `W[t]`. The addition is shown modulo `2^32`.
**Timing:** `7:15–7:32`

### 40

**Speech:** “Then `T2` is computed from the sigma function of `a` and the Majority function.”
**Animation:** Parallel rail on the upper half:

```text
T2 = Σ0(a) + Maj(a,b,c)
```

The two intermediate values slam together into `T2`. Camera tracks both paths and meets at the addition node.
**Timing:** `7:32–7:42`

### 41

**Speech:** “The registers then shift forward, while the new values enter the front of the chain.”
**Animation:** This is the key cinematic shot. The eight registers move left like a high-speed conveyor. `h` exits. `g` becomes `h`, `f` becomes `g`, and so on. The new `a` becomes `T1 + T2`. The new `e` becomes `d + T1`. Use actual moving register contents rather than merely arrows. Camera travels alongside the register bank at the same velocity.
**Timing:** `7:42–8:00`

### 42

**Speech:** “Then the next round starts immediately.”
**Animation:** `ROUND 17` flips to `ROUND 18`; `W17` flips to `W18`; the entire register conveyor accelerates. Camera pulls back while the rounds multiply around the frame.
**Timing:** `8:00–8:06`

---

# SCENE 06 — SIXTY-FOUR ROUNDS IN MOTION

### 43

**Speech:** “And this happens sixty-four times for each 512-bit block.”
**Animation:** Display a circular progress dial with indices `00` through `63`. Instead of a static progress bar, the current round marker physically races around a circular path. The eight registers update every loop.
**Timing:** `8:06–8:18`

### 44

**Speech:** “Do not imagine a password simply passing through one magic box. Think of it as a tightly controlled avalanche of bit operations.”
**Animation:** Camera enters the compression loop at extreme close range. Bits split, rotate, collide, XOR, and recombine. The shot deliberately avoids a generic rectangle-and-arrow diagram: every value remains physically attached to its register or operation.
**Timing:** `8:18–8:30`

### 45

**Speech:** “The same engine processes the next block, carrying the previous hash state forward.”
**Animation:** Finish block one. Eight final working values merge into eight accumulated state registers. The camera follows them sideways into `BLOCK 2`, then `BLOCK 3`. Show multiple blocks physically chained together.
**Timing:** `8:30–8:42`

---

# SCENE 07 — THE FINAL DIGEST

### 46

**Speech:** “After the final block, the eight 32-bit state words are concatenated into the 256-bit digest.”
**Animation:** The eight registers slide together into one uninterrupted hexadecimal stream. Camera starts at the left edge and tracks across the complete 64-character output.
**Timing:** `8:42–8:53`

### 47

**Speech:** “For the message `abc`, SHA-256 produces this.”
**Animation:** Full-screen black. Centered monospace digest types in:

```text
ba7816bf8f01cfea414140de5dae2223
b00361a396177a9cb410ff61f20015ad
```

First line appears character-by-character, second line follows. Camera slowly pushes closer until individual hexadecimal symbols occupy most of the frame.
**Timing:** `8:53–9:05`

### 48

**Speech:** “Sixty-four hexadecimal characters. Two hundred and fifty-six bits. And absolutely no visible resemblance to the three characters that went in.”
**Animation:** Split screen: `abc` on left and digest on right. Stretch a thin teal line between them. Camera pulls all the way back until the original `abc` becomes a microscopic input point compared with the digest.
**Timing:** `9:05–9:15`

---

# SCENE 08 — FROM REAL SHA TO A TOY IMPLEMENTATION

### 49

**Speech:** “Now let’s build something ourselves. Not SHA-256—because reproducing a secure production hash from scratch is a cryptography project—but a deliberately tiny teaching hash that lets us watch every operation.”
**Animation:** The real SHA-256 engine exits through the top of the frame. A much smaller engine assembles below it. Large warning label appears: `EDUCATIONAL — NOT CRYPTOGRAPHICALLY SECURE`.
**Timing:** `9:15–9:28`

### 50

**Speech:** “Call it `ToyHash8`.”
**Animation:** Title `ToyHash8` is typed into a simulated code editor. Camera moves from the title to line one of the implementation.
**Timing:** `9:28–9:32`

---

## ToyHash8 source

### 51

**Speech:** “We start with an eight-bit state.”
**Animation:** Code editor highlights:

```python
h = 0x6d
```

The hexadecimal `6d` instantly appears as binary `01101101` in a hardware register beside the editor.
**Timing:** `9:32–9:38`

### 52

**Speech:** “For every input byte, XOR it with the state, add a constant, then rotate the result left by three bits.”
**Animation:** Show the exact implementation:

```python
def toyhash(data):
    h = 0x6d

    for x in data:
        h = (h ^ x) + 0x3d
        h &= 0xff
        h = ((h << 3) & 0xff) | (h >> 5)

    return h
```

The code editor highlights exactly one statement at a time. Beside the editor, the current byte physically travels through XOR → addition → mask → rotate. No generic blocks: the actual eight bits move through each operation.
**Timing:** `9:38–10:00`

### 53

**Speech:** “That is the entire function.”
**Animation:** Camera rapidly pulls back from the code editor, revealing that the apparently complicated machine is only four operations repeated in a loop. The code remains visible in the corner while the data path dominates the scene.
**Timing:** `10:00–10:06`

---

# SCENE 09 — PHYSICALLY EXECUTING THE TOY HASH

### 54

**Speech:** “Let’s hash the text `abc` and watch every byte move.”
**Animation:** Simulated terminal:

```text
$ python toyhash.py abc
```

The text `abc` is converted to:

```text
61 62 63
```

The three bytes detach from the terminal and travel into the visual execution engine.
**Timing:** `10:06–10:15`

### 55

**Speech:** “First byte: `0x61`.”
**Animation:** `0x61` enters the XOR stage against `0x6d`. Display both binary values vertically and physically align their bits. The XOR result becomes the next packet. Camera performs a macro push into the least significant bits.
**Timing:** `10:15–10:24`

### 56

**Speech:** “XOR the byte with the current state.”
**Animation:** Show the exact bitwise transformation, bit by bit. Each resulting bit moves into a new horizontal row.
**Timing:** `10:24–10:30`

### 57

**Speech:** “Add `0x3d`, then keep only the lowest eight bits.”
**Animation:** The intermediate byte enters a visible modulo-256 arithmetic unit. Higher carry bits physically fall through a trapdoor and disappear off the bottom of frame. The surviving eight bits continue forward. Yellow highlights the discarded overflow.
**Timing:** `10:30–10:40`

### 58

**Speech:** “Then rotate left by three.”
**Animation:** The eight bits are arranged on an octagonal ring. The entire ring physically rotates three positions clockwise while maintaining bit order. The camera orbits the ring simultaneously.
**Timing:** `10:40–10:50`

### 59

**Speech:** “That output becomes the state for the next byte.”
**Animation:** The rotated value lands in the central state register. The camera pulls back enough to reveal bytes `62` and `63` waiting in a queue.
**Timing:** `10:50–10:56`

### 60

**Speech:** “Second byte: `0x62`. Same machinery. New state.”
**Animation:** `0x62` accelerates through the exact same operations. Reuse the `ToyHash8` component, but change its internal data, register state, and camera target rather than copying scene code.
**Timing:** `10:56–11:06`

### 61

**Speech:** “Third byte: `0x63`.”
**Animation:** Repeat the transformation, but faster. Increase camera speed, add a mechanical scanline traveling across the bits, and show intermediate values accumulating in a side trace.
**Timing:** `11:06–11:16`

### 62

**Speech:** “And the final eight-bit state becomes our digest.”
**Animation:** The last register ejects a two-character hexadecimal output into a terminal window. Use an exact scripted output generated by the implementation at render time. The digest grows from two digits into a giant center-screen `0x??`, with `ToyHash8` stamped underneath.
**Timing:** `11:16–11:24`

---

# SCENE 10 — WHY THIS IS NOT SHA-256

### 63

**Speech:** “Notice what we just built: fixed-size output, repeated mixing, bitwise operations, and state that changes as the input is processed.”
**Animation:** Four visual labels orbit the toy engine: `FIXED OUTPUT`, `STATE`, `MIXING`, `ITERATION`. Each locks into a hard rectangular position as the camera completes one orbit.
**Timing:** `11:24–11:34`

### 64

**Speech:** “But it is nowhere near the security design of SHA-256.”
**Animation:** Place `ToyHash8` beside `SHA-256`. The toy engine visibly contains an eight-bit state and one byte of output; SHA-256 contains eight 32-bit working variables, a 64-word schedule, and 64 rounds per block. Camera pulls back to show the enormous difference in state and structure.
**Timing:** `11:34–11:44`

### 65

**Speech:** “The point of the toy is not security. The point is being able to see the algorithm.”
**Animation:** The large real SHA engine becomes a distant background silhouette while the tiny toy engine takes foreground focus. Camera performs a cinematic rack-focus simulation from the complex engine to the tiny teaching engine.
**Timing:** `11:44–11:50`

---

# SCENE 11 — HASHING SPEED

### 66

**Speech:** “Now here is where hashing gets counterintuitive: SHA-256 is fast.”
**Animation:** Terminal benchmark simulation appears:

```text
$ openssl speed sha256
```

Rows of SHA-256 throughput values rapidly populate the terminal. Camera pans downward through the benchmark table while a live counter climbs.
**Timing:** `11:50–12:00`

### 67

**Speech:** “That speed is excellent for verifying files and processing data, but it is exactly why raw SHA-256 is a poor password-storage primitive.”
**Animation:** Split the scene into two synchronized machines. Left machine hashes one file quickly and immediately verifies it. Right machine launches a password-guessing loop. The right side accelerates dramatically. Camera gradually favors the attack side until a red warning `FAST = BAD FOR PASSWORD STORAGE` dominates.
**Timing:** `12:00–12:14`

### 68

**Speech:** “A password database should therefore use a password-hashing scheme designed to make each guess deliberately expensive, such as Argon2id, with salt and appropriate cost parameters.”
**Animation:** Replace the fast SHA engine with a memory-heavy Argon2-style conceptual machine. Large memory tiles fill the frame while the attacker’s guess pipeline slows. Do not imply SHA-256 is internally part of Argon2id. The labels clearly read `CONCEPTUAL COST MODEL`.
**Timing:** `12:14–12:28`

---

# SCENE 12 — WHY HASHING BEATS PLAINTEXT STORAGE

### 69

**Speech:** “Compare that with simply saving the password.”
**Animation:** Simulated server file appears:

```text
users.db

alice : correct-horse-battery-staple
bob   : letmein123
```

Camera slowly approaches the file. A light-red `\uf188` bug icon appears at the edge of the frame.
**Timing:** `12:28–12:36`

### 70

**Speech:** “If an attacker gains read access to that database, the secret is already there. No cracking is necessary.”
**Animation:** Camera crosses the permission boundary and lands directly on the readable password. The text is copied instantly into an attacker terminal. The entire animation takes less than a second to emphasize immediate exposure.
**Timing:** `12:36–12:45`

### 71

**Speech:** “Hashing changes the situation: stealing the verifier does not immediately reveal the password, although weak passwords can still be guessed offline.”
**Animation:** Replace plaintext storage with salted verifier storage. Attacker copies the database again, but receives only salt + verifier. An offline cracking terminal begins trying guesses and comparing derived verifiers. Camera moves between database and cracking terminal.
**Timing:** `12:45–13:00`

### 72

**Speech:** “And this distinction matters for side-channel and accidental-leak scenarios too: plaintext copies are dangerous wherever the secret can leak, including configuration, logs, backups, memory, or diagnostic data.”
**Animation:** Four environments flash around the password: `CONFIG`, `LOG`, `BACKUP`, `MEMORY DUMP`. Each produces a duplicate plaintext copy and turns light red. Then show the verifier surviving as a non-reversible representation. Avoid implying that hashing magically prevents every side-channel.
**Timing:** `13:00–13:14`

### 73

**Speech:** “The correct lesson is not ‘SHA is safer than plaintext because SHA is hard.’ The lesson is ‘use the primitive that matches the threat model.’”
**Animation:** Camera centers on a large decision matrix:

```text
FILE INTEGRITY       → SHA-256
DIGITAL SIGNATURE    → HASH + SIGNATURE SCHEME
HASH TABLE            → HASH FUNCTION
PASSWORD STORAGE      → ARGON2ID / SCRYPT / BCRYPT / PBKDF2
```

Each row animates in independently.
**Timing:** `13:14–13:26`

---

# SCENE 13 — WHAT DOES “BREAKING SHA” ACTUALLY MEAN?

### 74

**Speech:** “So can SHA be broken?”
**Animation:** Hard cut to a giant red `?`. Camera slowly circles it. The question cracks into four technical labels: `COLLISION`, `PREIMAGE`, `SECOND PREIMAGE`, `IMPLEMENTATION / MISUSE`.
**Timing:** `13:26–13:32`

### 75

**Speech:** “The answer depends on what attack you mean.”
**Animation:** Each attack path gets its own small simulated terminal window. The camera travels from one to another in a continuous arc.
**Timing:** `13:32–13:38`

---

## Collision attacks

### 76

**Speech:** “A collision means finding two different messages that produce the same digest.”
**Animation:** Two completely different file names enter separate SHA-like engines. They converge onto one identical digest. Put the word `COLLISION` between them.
**Timing:** `13:38–13:50`

### 77

**Speech:** “This is the classic failure that eventually destroyed confidence in SHA-1.”
**Animation:** Label one engine `SHA-1`. Two visually different document icons enter. The digest values converge. Large red text `SHA-1 COLLISION` appears. Camera violently pulls backward after the collision completes.
**Timing:** `13:50–14:02`

### 78

**Speech:** “Google and CWI demonstrated a practical SHA-1 collision in 2017, and NIST had already deprecated SHA-1 for collision-sensitive applications.”
**Animation:** Timeline appears: `2011 → SHA-1 deprecated` then `2013 → no new digital signatures` then `2017 → demonstrated collision`. Camera tracks the timeline horizontally while a SHA-1 badge moves from yellow to light red.
**Timing:** `14:02–14:15`

---

## Preimage attacks

### 79

**Speech:** “A preimage attack is different: here the attacker is given a target digest and tries to find an input that produces it.”
**Animation:** Put a fixed 256-bit-looking target on the right. On the left, generate candidate messages at increasing speed. Every failed candidate receives a tiny `\uf00d` and exits the frame. Camera is locked to the target while the candidates blur past.
**Timing:** `14:15–14:27`

### 80

**Speech:** “For SHA-256, the idealized generic preimage work is on the order of 2 to the 256 possibilities, which is fundamentally different from a practical collision attack’s roughly 2 to the 128 birthday scale.”
**Animation:** Show two logarithmic-style scales. One grows to `2^256`; the other to `2^128`. The camera pulls back as each number becomes visually enormous. Add a small footnote: `generic security estimates; real attacks depend on construction and constraints`.
**Timing:** `14:27–14:43`

---

## Second-preimage attacks

### 81

**Speech:** “A second-preimage attack starts with one known message and tries to find a different message with the same digest.”
**Animation:** Original file is pinned to the center with a yellow fingerprint. Attacker generates alternate files around it. One candidate attempts to converge onto the same digest and is rejected repeatedly.
**Timing:** `14:43–14:53`

---

# SCENE 14 — THE BIG NUANCE: SHA-256 IS NOT SHA-1

### 82

**Speech:** “This distinction matters because SHA-1 and SHA-256 are not interchangeable just because both start with the letters S-H-A.”
**Animation:** Two vertical algorithm trees appear: SHA-1 on left, SHA-2/SHA-256 on right. The SHA-1 side receives a light-red collision marker. SHA-256 remains yellow/teal.
**Timing:** `14:53–15:02`

### 83

**Speech:** “NIST currently lists SHA-256 among the acceptable SHA-2 hash functions, and its published security-strength guidance gives SHA-256 128-bit collision strength and 256-bit preimage strength.”
**Animation:** Display a clean technical specification panel. Zoom directly into:

```text
SHA-256
OUTPUT       256 bits
COLLISION    128-bit strength
PREIMAGE     256-bit strength
BLOCK        512 bits
```

Camera makes a controlled documentary-style push toward the values.
**Timing:** `15:02–15:16`

### 84

**Speech:** “So the story is not ‘SHA is broken.’ The story is that different versions, attack goals, and applications have different security margins.”
**Animation:** The word `SHA` splits into `SHA-1`, `SHA-256`, and `SHA-3`. Each receives a different status indicator.
**Timing:** `15:16–15:25`

---

# SCENE 15 — ATTACKING OUR TOY HASH

### 85

**Speech:** “Now we can actually break something on screen.”
**Animation:** Camera slams into the `ToyHash8` source code. Terminal opens beside it:

```text
$ ./toyhash --collision
```

A red attack cursor blinks.
**Timing:** `15:25–15:31`

### 86

**Speech:** “Our toy hash outputs only eight bits.”
**Animation:** Display `256 bits` for SHA-256, then physically compress it to `8 bits` for ToyHash8. Camera moves between the two as if comparing processor dies.
**Timing:** `15:31–15:37`

### 87

**Speech:** “That gives us only 256 possible outputs.”
**Animation:** Eight binary switches flip through all values. Then display:

```text
00000000
...
11111111

2^8 = 256
```

Camera pulls back to show the entire output space as a finite grid.
**Timing:** `15:37–15:45`

### 88

**Speech:** “So instead of attempting some sophisticated cryptanalysis, we can simply generate candidates and search for a collision.”
**Animation:** Terminal starts a brute-force loop. Candidate strings stream through at high speed. Each candidate is rendered briefly in the code editor before being processed. The camera tracks the newest candidate.
**Timing:** `15:45–15:55`

### 89

**Speech:** “The first collision we care about is any two different inputs with the same eight-bit result.”
**Animation:** Two candidate streams branch from one search pipeline. One gets a hash result, the other eventually lands on the same result. A red beam links the two digest values.
**Timing:** `15:55–16:05`

### 90

**Speech:** “For this deliberately tiny function, `y` and the string containing a space followed by `@` both produce the same eight-bit result: `0x8a`.”
**Animation:** Show two terminal executions:

```text
$ ./toyhash y
8a

$ ./toyhash " @"
8a
```

The two outputs merge into one large center-screen `0x8a`. Use `\uf188` and a light-red `COLLISION FOUND` stamp.
**Timing:** `16:05–16:16`

### 91

**Speech:** “Same digest. Different input. That is a collision.”
**Animation:** Freeze the two inputs above the shared digest. Camera rotates 90 degrees around them, creating a three-dimensional-feeling reveal while remaining flat 2D geometry.
**Timing:** `16:16–16:22`

### 92

**Speech:** “And because the output is only eight bits, this was never a serious challenge.”
**Animation:** Show a birthday-search visualization where candidate hashes rapidly populate a 256-slot table. One slot gets hit twice almost immediately. Camera zooms directly into that bucket.
**Timing:** `16:22–16:30`

### 93

**Speech:** “This is why output size matters: shrinking a hash from 256 bits to 8 bits does not merely make the digest shorter. It makes generic collision searching astronomically easier.”
**Animation:** Camera rapidly zooms backward through scales:

```text
2^8
2^16
2^32
2^64
2^128
```

The `2^128` collision-security marker disappears into an enormous field of numbers.
**Timing:** `16:30–16:43`

---

# SCENE 16 — THE OTHER WAYS REAL SYSTEMS FAIL

### 94

**Speech:** “And here is the part people often miss: real-world hash failures are frequently caused by using a good primitive incorrectly.”
**Animation:** The SHA-256 engine appears perfectly intact. Around it, four external attack vectors approach it: `WEAK PASSWORD`, `NO SALT`, `WRONG ALGORITHM`, `BAD IMPLEMENTATION`. Camera circles the intact engine while each external vector lights up.
**Timing:** `16:43–16:53`

### 95

**Speech:** “A cryptographically strong hash does not turn a weak password into a strong password.”
**Animation:** Show:

```text
password123
```

entering a SHA-256 engine. The attacker guesses it immediately. Then replace the password with a long random passphrase and show the search space expanding.
**Timing:** `16:53–17:02`

### 96

**Speech:** “A plain fast hash also does not provide the work factor required for modern password storage.”
**Animation:** Thousands of SHA-256 password guesses race through a fast pipeline. Replace the same architecture with memory-hard blocks and show the pipeline slowed dramatically.
**Timing:** `17:02–17:11`

### 97

**Speech:** “And collisions do not let an attacker magically recover an original password from SHA-256. Collision resistance, preimage resistance, and password guessing are different problems.”
**Animation:** Three isolated lanes appear with labels `COLLISION`, `PREIMAGE`, `PASSWORD GUESSING`. Different attacks move through each lane. Camera pans across all three.
**Timing:** `17:11–17:21`

---

# SCENE 17 — RETURN TO THE REAL SHA-256 ENGINE

### 98

**Speech:** “So go back to the real machine.”
**Animation:** Camera pulls from the tiny `ToyHash8` collision into darkness. One 32-bit register appears. Then all eight registers appear. Then the 64-word schedule. Then the 64 rounds. Finally the full 512-bit block. Each layer is revealed by camera movement rather than a cut.
**Timing:** `17:21–17:31`

### 99

**Speech:** “The data is padded. The block is expanded into a message schedule. Eight state words enter a sixty-four-round compression loop. The state is accumulated. The process repeats for every block.”
**Animation:** Perform a full accelerated cinematic run of the SHA-256 pipeline: padding → sixteen words → sixty-four words → round counter 00–63 → accumulated state → next block. Use a continuous camera fly-through.
**Timing:** `17:31–17:45`

### 100

**Speech:** “Then, after the final block, eight words become the digest you recognize.”
**Animation:** Eight hexadecimal register streams merge into the 64-character output. Camera travels through the string and emerges from the right side into a black void.
**Timing:** `17:45–17:55`

---

# SCENE 18 — FINAL SUMMARY

### 101

**Speech:** “A hash takes arbitrary-length input and produces a fixed-length digest.”
**Animation:** Wide shot showing data streams of different lengths converging into identical-width digest strips.
**Timing:** `17:55–18:04`

### 102

**Speech:** “SHA-256 does it with 512-bit blocks, 32-bit words, eight working variables, a sixty-four-word message schedule, and sixty-four compression rounds.”
**Animation:** Five labels appear sequentially while the actual corresponding machinery animates behind each one. Do not show generic static blocks; each label is attached to the actual object it describes.
**Timing:** `18:04–18:16`

### 103

**Speech:** “Its security is about making certain attacks computationally infeasible—not about making the output impossible to compute.”
**Animation:** Show SHA-256 calculation completing instantly, then show attempted reverse/preimage/collision paths becoming computationally enormous. Camera steadily zooms outward as the attack space expands.
**Timing:** `18:16–18:28`

### 104

**Speech:** “SHA-1 is a useful warning: when practical collision attacks arrive, an old hash can become the wrong primitive even if the basic idea of hashing remains sound.”
**Animation:** SHA-1 collision demonstration briefly reappears, then fades into SHA-2 and SHA-3. NIST policy panel remains visible at the bottom.
**Timing:** `18:28–18:38`

### 105

**Speech:** “And for passwords, remember the distinction: never store plaintext passwords, but also do not replace plaintext with a raw fast SHA-256 hash. Use a dedicated password-hashing scheme such as Argon2id with a unique salt and appropriately tuned cost.”
**Animation:** Final security checklist assembles:

```text
PLAINTEXT PASSWORD       ✗
FAST RAW SHA-256         ✗
UNIQUE SALT              ✓
ARGON2ID / SCRYPT / ...  ✓
TUNED COST               ✓
```

Each row enters from a different direction. The camera gently pulls backward as the complete checklist settles into a clean technical frame.
**Timing:** `18:38–18:52`

### 106

**Speech:** “The final mental model is simple: the input goes in, the state gets mixed over and over, and a fixed-size digest comes out.”
**Animation:** Return to the original `abc → digest` visualization, but now the camera flies through the complete SHA-256 machine while the narration describes it. Exit from the machine into the final digest.
**Timing:** `18:52–19:02`

### 107

**Speech:** “The magic is not that the computer cannot calculate the hash.”
**Animation:** Show `SHA-256("abc")` being calculated immediately. Camera holds on the completed digest.
**Timing:** `19:02–19:07`

### 108

**Speech:** “The magic is that, when the construction is sound, calculating the digest is easy—and producing the right kind of input from the digest, or producing a useful collision, is supposed to be hard.”
**Animation:** Three paths separate from the digest: `CALCULATE`, `PREIMAGE`, `COLLISION`. `CALCULATE` completes instantly in teal. The other two extend into enormous black space and become visually unreachable.
**Timing:** `19:07–19:19`

### 109

**Speech:** “That is the core idea behind cryptographic hashing.”
**Animation:** All technical components collapse into one clean centered SHA-256 glyph/wordmark. Camera performs one final slow pull-back until the word becomes small against pure black.
**Timing:** `19:19–19:25`

### 110

**Speech:** “And once you understand the bits moving through the machine, SHA-256 stops looking like a magic incantation and starts looking like what it really is: a carefully engineered state machine.”
**Animation:** Final reveal. Reconstruct the entire path from login password → bytes → padded block → message schedule → 64 rounds → digest. The entire chain animates backward once, then forward again at high speed, ending on the digest. Hard cut to black.
**Timing:** `19:25–19:40`

### 111

**Speech:** “One input. One fixed-size digest. A lot of very deliberate mathematics in between.”
**Animation:** Three words appear one at a time in yellow:

```text
INPUT.
STATE.
DIGEST.
```

Each word is accompanied by a tight camera punch-in. Final frame holds for 1 second, then cuts to black.
**Timing:** `19:40–19:50`

---

# END CARD

### 112

**Speech:** [No narration]
**Animation:** Black background. Centered teal text:

```text
SHA-256
```

Under it:

```text
512-bit blocks
256-bit digest
64 rounds
```

Bottom-left: `\uf023 CRYPTOGRAPHIC HASH`
Bottom-right: `\uf120 MOTION CANVAS`

Camera performs an almost imperceptible slow pull-back. No rounded rectangles, no transparency.
**Timing:** `19:50–20:00`

---

# VISUAL IMPLEMENTATION NOTES

## Scene-specific GUI simulation

**Login GUI:** hard-edged desktop lock screen with cursor, password field, keyboard indicator, system status glyphs.

**Terminal GUI:** use real shell-like typography and spacing. Suggested simulated commands:

```text
$ sha256sum debian-image.iso
$ openssl dgst -sha256 debian-image.iso
$ python toyhash.py abc
$ ./toyhash --collision
$ openssl speed sha256
```

**File verification GUI:** browser/download pane + terminal + trusted digest side-by-side.

**Packet inspector:** packet rows with timestamps, source/destination, protocol labels, payload bytes, checksum/hash field. Make it visually resemble a real packet-analysis tool without reproducing a proprietary UI pixel-for-pixel.

**Code editor:** dark rectangular editor, line numbers, syntax highlighting limited to the five palette colors. Cursor should visibly move to the executed line.

**Hex viewer:** address column, hexadecimal bytes, ASCII column. When a byte changes, the camera should push into that byte and then follow its propagation through the hash engine.

**Hash-map GUI:** source-code editor on left, bucket visualization on right, collision shown as two keys landing in the same bucket.

## Animation hierarchy

Every computational operation should have three simultaneous visual layers:

1. **Data layer:** actual bits/bytes/hexadecimal values physically move.
2. **Algorithm layer:** the relevant function/equation is highlighted.
3. **Camera layer:** camera follows the active computation rather than remaining static.

Avoid scenes where the only motion is “box appears → arrow moves → box disappears.”

## Camera direction

For explanatory material, move **with the data**.

For conceptual material, move **around the system**.

For security failures, move **toward the vulnerability**.

For successful verification, move **from raw data → digest → trust decision**.

For attack demonstrations, move **from target → attacker search space → collision/preimage result**.

## Color semantics

```text
#000000       background
TEAL          normal computation, lines, primary text
LIGHT ORANGE  secondary accent / active control
YELLOW        important equations, variables, function calls
CYAN          files, directories, hexadecimal, neutral data
LIGHT RED     bugs, invalid designs, attack success, collisions
```

Do not use color decoration without meaning. A color change should communicate state.

---

# TECHNICAL ACCURACY GUARDRAILS

**Do not say:** “SHA-256 encrypts the password.”
**Say:** “SHA-256 hashes the input.”

**Do not say:** “The hash is impossible to reverse.”
**Say:** “Finding a preimage from a secure cryptographic hash is intended to be computationally infeasible.”

**Do not say:** “A hash guarantees a file came from the vendor.”
**Say:** “A trusted digest can detect modification; authenticity requires a trusted channel or a digital-signature mechanism.”

**Do not imply:** “A SHA-256 collision lets you recover a password.”
**Collision resistance and password guessing are separate security properties.**

**Do not say:** “SHA-1 and SHA-256 are equally broken.”
SHA-1 has practical collision attacks; NIST continues to approve SHA-256 for appropriate hash applications.

**Do not recommend raw SHA-256 for password storage.** Use a dedicated password-hashing scheme with salt and cost, such as Argon2id.

---

# RENDER VALIDATION PASSES

## Pass 1 — Layout

Render every scene to low-resolution preview and inspect for:

```text
[ ] Text touching frame edges
[ ] Equation clipped by camera
[ ] Digest overflowing terminal width
[ ] Register labels colliding
[ ] GUI panels overlapping
[ ] Long hex strings wrapping unexpectedly
[ ] Bit strips exceeding viewport
[ ] Camera target leaving important content off-screen
```

## Pass 2 — Motion

Review at normal playback and half-speed:

```text
[ ] No text appears before its narration
[ ] No computation finishes before the spoken explanation
[ ] Camera arrives at target before important labels appear
[ ] Fast data movement remains readable
[ ] Attack demonstrations clearly distinguish input/output
[ ] Collision is visible and unambiguous
[ ] Register shifts preserve correct labels
```

## Pass 3 — Cryptographic state consistency

For the real SHA-256 visualization:

```text
[ ] 512-bit input block
[ ] 16 initial 32-bit words
[ ] 64-word message schedule
[ ] 8 working variables a..h
[ ] 64 rounds
[ ] T1/T2 updates
[ ] feed-forward accumulation
[ ] 256-bit final digest
```

The visual implementation must not animate one set of values while the spoken equation describes another.

## Pass 4 — ToyHash8 correctness

Use one canonical implementation for both the animation and collision demo:

```python
def toyhash(data):
    h = 0x6d

    for x in data:
        h = (h ^ x) + 0x3d
        h &= 0xff
        h = ((h << 3) & 0xff) | (h >> 5)

    return h
```

The collision demonstration should be generated programmatically from this exact function rather than hard-coded visually.

For the scripted collision:

```text
toyhash(b"y")     == 0x8a
toyhash(b" @")    == 0x8a
```

## Pass 5 — Final compositing

```text
[ ] No transparency
[ ] No glassmorphism
[ ] No rounded borders
[ ] Background remains #000000
[ ] Palette semantics remain consistent
[ ] Nerd Font glyphs render correctly
[ ] Font Awesome glyphs have no missing-glyph boxes
[ ] Code remains readable at YouTube compression levels
[ ] Important numbers are not hidden behind camera movement
[ ] No accidental overlap of labels and digest strings
```

---

# RESEARCH BASIS

The SHA-256 structure shown here follows NIST FIPS 180-4 and the SHA-256 processing description in RFC 6234: 512-bit message blocks, 32-bit words, a 64-word message schedule, eight 32-bit working variables, and the 64-round compression process.

NIST defines cryptographic hash functions around properties including collision resistance, preimage resistance, and second-preimage resistance; its published strength table gives SHA-256 128-bit collision strength and 256-bit preimage strength.

NIST records the practical SHA-1 collision demonstration announced in February 2017 and notes SHA-1's deprecation for collision-sensitive applications. Current NIST policy states that SHA-256 remains acceptable for hash-function applications and that there is no current requirement to migrate from SHA-2 to SHA-3.

OWASP recommends against plaintext password storage and against fast hashes such as SHA-256 for password storage; it recommends dedicated password-hashing schemes such as Argon2id, scrypt, bcrypt, or PBKDF2 with salts and appropriate work factors. NIST SP 800-63B likewise requires password verifiers to use salted password hashing designed to resist offline attacks.

Digital signatures use hashing as part of the signature construction, but the signature mechanism—not the bare digest—provides authenticity and signer verification.

Hash tables are a different application: a hash function maps keys to buckets for efficient lookup, and collisions are handled as part of the data-structure design.
