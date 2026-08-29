# WHY MODERN EXPLOITS FAIL
## NX, Stack Canaries, ASLR, PIE, and RELRO — evidence-first production script

**Series position:** Buffer overflow → shellcode → ROP → **binary defenses** → information leaks → ret2libc

**Target duration:** approximately 31 minutes. Do not compress dialogue to meet a hard limit.

**Lab:** Linux x86-64, GCC 14.2.0, GNU binutils 2.44, kernel ASLR mode `2`.

---

# HARD RELEASE GATES

These are not optional style suggestions. A scene fails review if any applicable gate is missing.

1. **Context before close-up.** Every instruction, address, ELF row, or paper fragment must first appear inside its complete source workspace, terminal output, disassembly, memory map, or paper page.
2. **Visible provenance.** Every extraction retains a breadcrumb such as:

   ```text
   LAB > bin/vuln-canary > objdump -d -M intel -S --disassemble=greet > 0x40116e
   ```

   The cropped fragment remains tethered to its original row by a thin line, miniature source window, command chip, address, function name, or selected-row marker.
3. **No invented output.** Terminal text must be loaded from the evidence bundle or generated again by the bundled scripts. Addresses may change when rerun; never manually type replacement addresses merely because they look plausible.
4. **Honest reconstruction labels.** Any explanatory stack, page table, process map, or GOT animation that is not a literal tool rendering carries one of:

   ```text
   RECONSTRUCTION — DERIVED FROM <command / file / rows>
   CONCEPTUAL MODEL — IMPLEMENTATION DETAILS SIMPLIFIED
   ```
5. **Four motion phases.** Every substantial beat contains **ESTABLISH → OPERATE → CONSEQUENCE → HANDOFF**. A fade, panel entrance, or slow camera drift cannot serve as the only action in a phase.
6. **Repertoire inspection before implementation.** Before writing a new HyperFrames mechanic, inspect the parent animation repertoire and at least two relevant sibling projects. Produce `repertoire-audit.md` listing the existing primitives reused, restaged, extended, or rejected.
7. **Extract generic mechanics upward.** Any new context-free mechanic—provenance tether, terminal row extraction, evidence diff, paper trace, permission transition, four-phase beat controller—belongs in the parent repertoire rather than being buried inside this video.
8. **Traceability release test.** Freeze the video on any teaching close-up. A reviewer must be able to answer, without guessing: *Which file? Which command? Which function or mapping? Which exact row or address produced this?*

**Repository status note:** the script defines the mandatory repertoire audit, but does not falsely claim that audit is complete; no HyperFrames repository or sibling-project directory was attached to this script-writing session.

---

# VISUAL SYSTEM

```text
Background                  #050B08
Primary text                warm off-white
Secondary text              gray-green
Safe / valid                light mint
Current value               pale yellow
Warning / transition        desaturated orange
Failure                     muted red
Pointers / control flow     muted purple
ELF / linker / mappings     pale cyan
Paper                       warm aged off-white
Paper ink                   charcoal
```

Use flat geometry, thin borders, an 8-pixel spacing grid, restrained rounding, and strong typographic hierarchy. Avoid glassmorphism, generic floating cards, gratuitous glow, and decorative wire diagrams.

Persistent screen furniture:

```text
Top-left     section number and name
Top-right    BINARY DEFENSES / LINUX x86-64
Bottom-left  evidence or source breadcrumb
Bottom-right REAL OUTPUT / RECONSTRUCTION / CONCEPTUAL MODEL badge
```

The bottom provenance bar must survive zooms. When a row leaves a terminal, its command chip, line address, and source window remain attached.

---

# EVIDENCE IDS

```text
E00  evidence/raw/00-environment.txt
E01  evidence/raw/01-file-tree.txt
E02  evidence/raw/02-complete-sources.txt
E03  evidence/raw/03-build.stderr.txt
E04  evidence/raw/04-built-artifacts.txt
E10  evidence/raw/10-exec-probe-rwx-program-headers.txt
E11  evidence/raw/10-exec-probe-nx-program-headers.txt
E12  evidence/raw/11-nx-runtime.txt
E20  evidence/raw/20-vuln-plain-greet-disassembly.txt
E21  evidence/raw/20-vuln-canary-greet-disassembly.txt
E22  evidence/raw/19-canary-guard-and-frame-copy.txt
E23  evidence/raw/21-canary-runtime.txt
E30  evidence/raw/30-aslr-runtime-addresses.txt
E31  evidence/raw/31-pie-headers-and-symbols.txt
E32  evidence/raw/32-process-maps.txt
E33  evidence/raw/33-libc-puts-offset.txt
E40  evidence/raw/40-relro-none-elf-context.txt
E41  evidence/raw/40-relro-partial-elf-context.txt
E42  evidence/raw/40-relro-full-elf-context.txt
E43  evidence/raw/41-relro-runtime-pages.txt
E44  evidence/raw/42-relro-partial-ld-debug.stderr.txt
E45  evidence/raw/42-relro-full-ld-debug.stderr.txt
E46  evidence/selected/42-relro-partial-binding-order.txt
E47  evidence/selected/42-relro-full-binding-order.txt
```

Research artifacts:

```text
P01  Aleph One, “Smashing the Stack for Fun and Profit,” Phrack 49, 1996
P02  Cowan et al., “StackGuard,” USENIX Security, 1998
P03  PaX Team, NOEXEC/PAGEEXEC design documentation and retrospective
P04  PaX Team, ASLR design documentation and retrospective
P05  Bhatkar, DuVarney, Sekar, “Address Obfuscation,” USENIX Security, 2003
P06  Shacham et al., “On the Effectiveness of Address-Space Randomization,” CCS, 2004
P07  Ulrich Drepper, “Security Enhancements in Red Hat Enterprise Linux,” 2005
```

---

# COMPLETE SCRIPT

## 00 · HOW DID WE GET HERE?

### Scene 1 — The exploit we already built

**(00:00–00:24 — Dialogue:**  
“Hello again, hackers. In the last few lessons, we turned an innocent-looking input into control of a program. First the bytes escaped a buffer. Then they crossed the stack, replaced a saved return address, and sent the processor somewhere the original programmer never selected. With shellcode, that destination was our own data. With ROP, it was a chain of instructions already inside the executable.”  
**— Animation:**

- `00:00–00:05 — ESTABLISH:` Open on the *full* final ROP workspace from the previous episode: terminal, source panel, disassembly panel, stack, registers, and completed gadget chain. Add `RECONSTRUCTION — PREVIOUS EPISODE` rather than pretending this is a new live capture.
- `00:05–00:13 — OPERATE:` Replay the causal chain physically. Input bytes flow from the terminal into the visible source call, descend into the stack buffer, cross the saved frame boundary, replace the purple return-address cell, and make RIP travel through three real-looking but intentionally unlabeled gadget blocks.
- `00:13–00:19 — CONSEQUENCE:` The chain reaches a symbolic success function. Do not celebrate. Freeze the machine and place five small question marks beside the assumptions it relied upon.
- `00:19–00:24 — HANDOFF:` Pull each question mark into a labeled rail: `CAN DATA EXECUTE?`, `CAN CONTROL DATA CHANGE UNSEEN?`, `DO ADDRESSES STAY FIXED?`, `DOES THE BINARY STAY FIXED?`, `CAN LINKER TABLES BE WRITTEN?` Those rails become the section map for the video.

**Provenance:** Previous episode reconstruction; no claim of live terminal evidence in this scene.  
**Badge:** `RECONSTRUCTION — SERIES RECAP`  
**)**

### Scene 2 — The uncomfortable laboratory conditions

**(00:24–00:51 — Dialogue:**  
“Our earlier targets were intentionally generous. The stack could execute. The executable lived at predictable addresses. No secret value guarded the return address. Linker data remained writable. That was not a mistake in the lessons; stripping away defenses let us isolate one exploit primitive at a time. But it also gave us a distorted idea of what a contemporary Linux binary normally looks like.”  
**— Animation:**

- `00:24–00:30 — ESTABLISH:` The five assumption rails connect to a miniature unprotected ELF artifact. Bolts, permission tabs, and guard slots are visibly absent rather than represented by abstract red crosses.
- `00:30–00:40 — OPERATE:` A compiler command from the old lab expands token by token: `-fno-stack-protector`, `-no-pie`, `-z execstack`, `-z norelro`. Each token physically removes one protective part from the artifact.
- `00:40–00:46 — CONSEQUENCE:` The old exploit runs smoothly only because all five rails remain open. Label the result `CONTROLLED TEACHING BUILD`, not `NORMAL PROGRAM`.
- `00:46–00:51 — HANDOFF:` A defender-side hand replaces the stripped artifact with five new compiled binaries. Their names are initially obscured; the camera follows them into a real lab directory.

**Provenance:** Build flags are shown again later from `scripts/build.sh`; this recap uses only those actual flags.  
**Badge:** `DERIVED SUMMARY — SOURCE SHOWN IN SECTION 01`  
**)**

### Scene 3 — Title and historical honesty

**(00:51–01:28 — Dialogue:**  
“So today, we reverse perspectives. We keep the memory bug, then add the defenses one at a time and observe exactly what changes—from source code, to ELF metadata, to disassembly, to the live process map. And one historical warning: these defenses did not all emerge from one neat sequence of famous papers. StackGuard has a canonical research paper. PaX developed executable-space protection and ASLR through implementation documents. PIE and RELRO grew through compiler, linker, loader, and distribution engineering. We will show those primary artifacts honestly.”  
**— Animation:**

- `00:51–00:58 — ESTABLISH:` Title assembles from the five assumption rails:

  ```text
  WHY MODERN EXPLOITS FAIL
  NX · CANARIES · ASLR · PIE · RELRO
  ```

- `00:58–01:11 — OPERATE:` Real first pages and document surfaces enter as physical evidence: Phrack ASCII page, StackGuard title page, PaX monospaced documents, Bhatkar title, Shacham first page, Drepper report. Each is shown unmodified for at least one second before styling.
- `01:11–01:21 — CONSEQUENCE:` Accurate labels stamp onto them: `SEMINAL ATTACK-SIDE ARTICLE`, `ORIGINAL RESEARCH PAPER`, `PRIMARY IMPLEMENTATION DOCUMENT`, `CRITICAL EVALUATION`, `ENGINEERING REPORT`. Do not call every artifact an “original paper.”
- `01:21–01:28 — HANDOFF:` The documents fold into a research timeline along the lower edge. One mint thread leaves the timeline and enters the local lab folder, making history visibly hand off to measurement.

**Provenance:** P01–P07.  
**Badge:** `PRIMARY-SOURCE MONTAGE`  
**)**

---

## 01 · THE EVIDENCE LAB

### Scene 4 — Challenge files before conclusions

**(01:28–02:00 — Dialogue:**  
“Before discussing a single instruction, here is the complete laboratory. It contains five small source files, one reproducible build script, one capture script, thirteen binaries, and the raw outputs used throughout this video. We are not beginning from a cropped instruction or a tidy diagram. We are beginning from the files that produced every later claim.”  
**— Animation:**

- `01:28–01:35 — ESTABLISH:` Open a full terminal in `/mnt/data/binary-defenses-lab`. Type the real command:

  ```bash
  find . -maxdepth 3 -type f | sort
  ```

- `01:35–01:48 — OPERATE:` Let the actual file list stream at readable speed. The viewport may scroll, but no lines are fabricated. Source files receive small mint ticks, binaries orange ticks, raw evidence cyan ticks, selected extracts pale-yellow ticks.
- `01:48–01:55 — CONSEQUENCE:` The complete terminal shrinks to the left while a spatial file tree is generated *from those exact rows*. Every spatial node remains tethered to its terminal line.
- `01:55–02:00 — HANDOFF:` Select `src/vuln.c`; the file-tree branch stretches into a code editor while the command breadcrumb remains at the bottom.

**Provenance:** E01.  
**Badge:** `REAL OUTPUT`  
**)**

### Scene 5 — Constraints and toolchain

**(02:00–02:32 — Dialogue:**  
“This capture was made on sixty-four-bit Linux with GCC fourteen point two and GNU binutils two point forty-four. Kernel address randomization is set to mode two. We do not disable ASLR for convenient screenshots, and we do not invent addresses that remain stable across reruns. When this lab is captured again, several pointers and process IDs should change. That change is evidence, not an inconvenience.”  
**— Animation:**

- `02:00–02:06 — ESTABLISH:` Return to full terminal. Run the commands exactly as recorded:

  ```bash
  uname -a
  gcc --version | head -n 1
  ld --version | head -n 1
  cat /proc/sys/kernel/randomize_va_space
  ```

- `02:06–02:18 — OPERATE:` The real output appears:

  ```text
  Linux ... 6.12.13 ... x86_64 GNU/Linux
  gcc (Debian 14.2.0-19) 14.2.0
  GNU ld (GNU Binutils for Debian) 2.44
  2
  ```

  Preserve the full original kernel row in the terminal; the abbreviated rendering above is only for script readability.
- `02:18–02:26 — CONSEQUENCE:` Extract four fact chips from the output, each still connected to its source row. Add `CAPTURE-SPECIFIC` beneath them.
- `02:26–02:32 — HANDOFF:` The `x86_64` chip snaps onto the top-right persistent label. The ASLR `2` chip moves into a dormant runtime-control slot for later use.

**Provenance:** E00.  
**Badge:** `REAL OUTPUT`  
**)**

### Scene 6 — Complete vulnerable source

**(02:32–03:08 — Dialogue:**  
“This is the complete vulnerable program. There is no hidden helper and no omitted cleanup path. `greet` reserves thirty-two bytes for `name`, then passes that address to `read` while requesting as many as one hundred and twenty-eight bytes. `main` disables output buffering only so the runtime evidence appears in a predictable order. Every protected variant begins with this same source.”  
**— Animation:**

- `02:32–02:39 — ESTABLISH:` Open `src/vuln.c` in a full editor with line numbers 1 through 17 visible simultaneously. Do not begin with lines 6 and 9 alone.
- `02:39–02:51 — OPERATE:` A token-level execution trace walks the whole file: headers provide `puts`, `read`, and `setvbuf`; `main` calls `greet`; `greet` creates `name[32]`; `read` receives `128`. Beside the editor, a 32-cell destination and a 128-tick request ruler are generated directly from the two literals.
- `02:51–03:01 — CONSEQUENCE:` The request ruler overshoots the destination. The source remains fully visible while a red interval marks bytes `32..127` as beyond the declared object. Label `SOURCE-LEVEL BUG`.
- `03:01–03:08 — HANDOFF:` Lines 6 and 9 detach as linked excerpts, but a miniature full-source editor and breadcrumbs remain attached:

  ```text
  LAB > src/vuln.c > greet > lines 6 and 9
  ```

**Provenance:** E02 / `src/vuln.c`.  
**Badge:** `REAL SOURCE`  
**)**

### Scene 7 — The compiler already notices

**(03:08–03:42 — Dialogue:**  
“When we build the variants, GCC warns us before the program ever runs. The warning is unusually direct: `read` may write one hundred and twenty-eight bytes into an object of size thirty-two. That warning is not NX, a canary, ASLR, PIE, or RELRO. It identifies the defect. The mitigations we study later only constrain what can happen after the defective write is allowed to exist.”  
**— Animation:**

- `03:08–03:15 — ESTABLISH:` Show `scripts/build.sh` in full, with all thirteen compile commands visible through a controlled editor scroll. Stop on no individual flag yet.
- `03:15–03:24 — OPERATE:` Execute:

  ```bash
  ./scripts/build.sh 2>evidence/raw/03-build.stderr.txt
  ```

  The real warning fills a dense terminal. First show the entire warning block, including source line, note, and declaration from `unistd.h`.
- `03:24–03:34 — CONSEQUENCE:` Track-extract only these genuine rows:

  ```text
  warning: ‘read’ writing 128 bytes into a region of size 32
  note: destination object ‘name’ of size 32
  ```

  Keep line `9` and line `6` chips attached to the full terminal and editor.
- `03:34–03:42 — HANDOFF:` The warning transforms into a permanent red bug marker placed at the center of a five-column binary matrix. The marker remains unchanged as defenses are added around it.

**Provenance:** E03 and `scripts/build.sh`.  
**Badge:** `REAL COMPILER OUTPUT`  
**)**

### Scene 8 — The actual binaries

**(03:42–04:14 — Dialogue:**  
“The build produces real ELF files, with distinct build IDs and hashes. `file` identifies which are ordinary executables and which are position-independent executables. We record those identities because later screenshots must point back to the exact artifact that generated them. A clean diagram is useful only after the evidence chain is intact.”  
**— Animation:**

- `03:42–03:49 — ESTABLISH:` Run `file bin/*` and then `sha256sum bin/*`. Fill the terminal with the real thirteen-file output.
- `03:49–03:59 — OPERATE:` Select three representative rows: `vuln-plain`, `vuln-full`, and `address-pie`. A scanning bar reads their actual ELF type, BuildID, debug-info, and hash fields.
- `03:59–04:07 — CONSEQUENCE:` Each binary becomes a physical artifact tile bearing a short hash prefix and BuildID. This prevents later scenes from silently swapping files.
- `04:07–04:14 — HANDOFF:` Arrange five core tiles—plain, NX, canary, PIE, full—around the unchanged red source bug. The `vuln-plain` tile enters a terminal for baseline inspection.

**Provenance:** E04.  
**Badge:** `REAL OUTPUT → DERIVED ARTIFACT IDS`  
**)**

---

## 02 · BASELINE: WHAT THE UNPROTECTED FUNCTION BECOMES

### Scene 9 — Dense disassembly before a stack diagram

**(04:14–04:50 — Dialogue:**  
“Before drawing a stack frame, we ask the binary what GCC actually emitted. `objdump` interleaves the full source with the machine instructions for `greet`. The function starts at address `0x401156`, reserves `0x30` bytes, calculates the buffer as `rbp minus 0x30`, loads `0x80`—one hundred and twenty-eight—into the third argument register, calls `read`, then reaches `leave` and `ret` without an integrity check.”  
**— Animation:**

- `04:14–04:22 — ESTABLISH:` Run the exact command in a full terminal:

  ```bash
  objdump -d -M intel -S --disassemble=greet bin/vuln-plain
  ```

  Show the complete output from function heading through `ret`; source and assembly remain dense and legible.
- `04:22–04:34 — OPERATE:` A selection cursor walks the rows in order: `0x401156`, `sub rsp,0x30`, `lea rax,[rbp-0x30]`, `mov edx,0x80`, `call read@plt`, `leave`, `ret`. Each row receives a numbered marker while the terminal stays full-screen.
- `04:34–04:44 — CONSEQUENCE:` Copy the seven selected rows into a right-side strip, but retain address chips, the command breadcrumb, function name, and thin tethers to their original terminal positions.
- `04:44–04:50 — HANDOFF:` The selected rows rotate into a stack-frame reconstruction. The full disassembly shrinks but remains visible at left.

**Provenance:** E20.  
**Badge:** `REAL DISASSEMBLY`  
**)**

### Scene 10 — Stack reconstruction from exact offsets

**(04:50–05:22 — Dialogue:**  
“Now the diagram has a provenance. `sub rsp,0x30` gives the local frame area. `rbp minus 0x30` locates the first byte of `name`. The saved frame pointer and return address sit above the current frame. This is still a reconstruction—we did not dump every stack byte—but its distances are derived from the instructions we just inspected, not from a generic textbook layout.”  
**— Animation:**

- `04:50–04:57 — ESTABLISH:` Display `RECONSTRUCTION — DERIVED FROM E20, greet 0x401156–0x40119a`. Keep the seven disassembly rows as a vertical provenance rail.
- `04:57–05:08 — OPERATE:` `sub rsp,0x30` mechanically extends a 48-byte frame. `lea [rbp-0x30]` pins the buffer start. The `0x80` argument creates a 128-byte input stream. Saved RBP and return address are placed relative to RBP, with uncertainty-free labels only where the ABI/frame instructions justify them.
- `05:08–05:16 — CONSEQUENCE:` Input bytes fill the 32-byte array, continue through adjacent frame storage, then reach saved control data. `leave; ret` consumes the now-corrupted frame.
- `05:16–05:22 — HANDOFF:` The return target becomes a stack address containing six machine-code bytes. That stack address flows into the NX probe source file.

**Provenance:** E20, exact instruction addresses retained on screen.  
**Badge:** `RECONSTRUCTION — DERIVED FROM REAL DISASSEMBLY`  
**)**

---

## 03 · NX: DATA MAY EXIST WITHOUT BEING EXECUTABLE

### Scene 11 — Complete execution probe

**(05:22–05:55 — Dialogue:**  
“To isolate execute permission, we use a second complete program. Its local array contains six x86-64 bytes: `mov eax, 42; ret`. The program prints the array’s address, casts that address to a function pointer, and calls it. The two binaries are identical except for the linker’s stack-execution request. This is safer and clearer than asking a full shell payload to prove several things at once.”  
**— Animation:**

- `05:22–05:29 — ESTABLISH:` Open all fourteen lines of `src/exec_probe.c`. Keep comment, byte array, print, cast, call, and result visible.
- `05:29–05:40 — OPERATE:` The six source bytes are tokenized and sent through a tiny instruction decoder: `b8 2a 00 00 00` becomes `mov eax,42`; `c3` becomes `ret`. The decoder is labeled `RECONSTRUCTION — x86-64 instruction meaning`, while the original source remains tethered.
- `05:40–05:49 — CONSEQUENCE:` The array is placed into a stack page and the function-pointer call routes RIP toward its address. Pause before the fetch.
- `05:49–05:55 — HANDOFF:` Duplicate the source into two build lanes labeled `exec-probe-rwx` and `exec-probe-nx`; only the linker flag token changes.

**Provenance:** E02 / `src/exec_probe.c`; build flags from `scripts/build.sh`.  
**Badge:** `REAL SOURCE + LABELED INSTRUCTION RECONSTRUCTION`  
**)**

### Scene 12 — Full program headers, then the selected row

**(05:55–06:28 — Dialogue:**  
“First we inspect the ELF program headers, not a hand-written permission card. In the executable-stack build, the `GNU_STACK` row ends in `RWE`: read, write, execute. In the protected build, the same row ends in `RW`: read and write, with execute absent. The close-up only appears after the complete header table has established where that row came from.”  
**— Animation:**

- `05:55–06:02 — ESTABLISH:` Split two full terminals and run:

  ```bash
  readelf -W -l bin/exec-probe-rwx
  readelf -W -l bin/exec-probe-nx
  ```

  Show complete program-header tables and section-to-segment mappings from E10 and E11.
- `06:02–06:15 — OPERATE:` A synchronized row scanner moves down both tables until `GNU_STACK`. Selected rows brighten in place; nothing is cropped yet.
- `06:15–06:23 — CONSEQUENCE:` Extract the two rows into the center. Their command chips and tethers stay visible. The single `E` glyph detaches from `RWE`, crosses the center, and leaves `RW` on the NX side.
- `06:23–06:28 — HANDOFF:` Each selected row unfolds into a live stack-page permission tab set while the original terminal remains as a thumbnail.

**Provenance:** E10, E11.  
**Badge:** `REAL ELF OUTPUT`  
**)**

### Scene 13 — The real runtime result

**(06:28–07:00 — Dialogue:**  
“Now we run both artifacts. With the executable stack, the program prints its stack buffer, calls those bytes, and returns forty-two with status zero. With NX, the same call is terminated by signal eleven and the shell reports status one hundred and thirty-nine. The bytes were accepted as data in both cases. The difference appears only when the CPU tries to fetch instructions from that page.”  
**— Animation:**

- `06:28–06:35 — ESTABLISH:` Display E12 as one complete terminal capture with both commands and outputs visible.
- `06:35–06:45 — OPERATE:` Replay the first command directly from the recorded lines:

  ```text
  code buffer: 0x7fffa4950f36
  calling bytes stored on the stack...
  returned: 42
  shell_status=0
  ```

  The printed address becomes a pointer chip tethered to its terminal row.
- `06:45–06:54 — CONSEQUENCE:` Replay the NX command. The process terminates at the call, and the actual lines `terminated_by_signal=11` and `shell_status=139` become diagnostic chips. Do not add a fake `Segmentation fault` line if it was not captured.
- `06:54–07:00 — HANDOFF:` The two runtime paths align under their `GNU_STACK` rows: `RWE → returned 42`, `RW → signal 11`. A thread pulls the NX failure into a page-table teaching model.

**Provenance:** E12.  
**Badge:** `REAL RUNTIME OUTPUT`  
**)**

### Scene 14 — Historical source: PaX executable-space protection

**(07:00–07:34 — Dialogue:**  
“The wider idea is executable-space protection. PaX developed PAGEEXEC and related mechanisms for systems where convenient hardware support was not always available, and its documents describe making stacks, heaps, and anonymous mappings non-executable while reserving execution for mappings that contain code. NX is not a detector looking for suspicious byte patterns. It is permission enforcement.”  
**— Animation:**

- `07:00–07:08 — ESTABLISH:` Show the actual PaX NOEXEC document and PAGEEXEC retrospective page unmodified, with native typography and layout.
- `07:08–07:20 — OPERATE:` Highlight the real passages concerning non-executable stack/heap mappings and executable code mappings. Trace—not retype—the relevant rows.
- `07:20–07:28 — CONSEQUENCE:` Pull three traced permission strips from the paper: `STACK RW-`, `HEAP RW-`, `CODE R-X`. Keep ghosted document pages behind them and show source classification `PRIMARY IMPLEMENTATION DOCUMENT`.
- `07:28–07:34 — HANDOFF:` The strips snap onto the live process model derived from E12 and E10/E11.

**Provenance:** P03.  
**Badge:** `PRIMARY DOCUMENT → LABELED RECONSTRUCTION`  
**)**

### Scene 15 — The exact point of failure

**(07:34–08:10 — Dialogue:**  
“The write into the array succeeds because the stack is writable. The indirect call also succeeds in changing RIP because NX is not control-flow integrity. Failure occurs at the next stage: instruction fetch. The translation and permission machinery sees an address in a page without execute permission, so no instruction from `b8 2a...` reaches the decoder. The data survives; execution does not begin.”  
**— Animation:**

- `07:34–07:42 — ESTABLISH:` Label `CONCEPTUAL MODEL — IMPLEMENTATION DETAILS SIMPLIFIED; DERIVED FROM E10–E12`. Show the exact captured stack address as a terminal-linked chip for the RWE run; for the NX run, use `CURRENT RUN ADDRESS` only if recaptured, never copy the first address.
- `07:42–07:55 — OPERATE:` Bytes are written into a stack page with `W=1`; RIP is loaded with the buffer address; an instruction-fetch request travels through a simplified page-table permission gate.
- `07:55–08:04 — CONSEQUENCE:` RWE gate emits `mov eax,42` to the decoder. RW gate rejects the fetch before decode, producing the signal-11 branch. Keep the six bytes visibly unchanged on both pages.
- `08:04–08:10 — HANDOFF:` Replace the bytes on the stack with a sequence of addresses. Those addresses point into an `R-X` code page, naturally restaging the previous ROP primitive.

**Provenance:** E10–E12 and P03.  
**Badge:** `CONCEPTUAL MODEL — DERIVED FROM REAL HEADER AND RUNTIME EVIDENCE`  
**)**

### Scene 16 — Why ROP survived

**(08:10–08:42 — Dialogue:**  
“This is why ROP was the next logical technique. The corrupted stack supplies data—addresses and values—while instruction fetches stay inside executable code pages. NX removed the assumption that writable bytes could also be instructions. It did not remove the overflow, stop `ret`, or erase the program’s own executable code. One attack route closed; another remained.”  
**— Animation:**

- `08:10–08:17 — ESTABLISH:` Return to the full NX evidence board: source, `GNU_STACK RW`, signal 11, and page model.
- `08:17–08:27 — OPERATE:` Restage the stack as purple address cells. Each `ret` reads from `RW` stack data, then fetches from `R-X` text. Both page checks visibly pass for their respective access type.
- `08:27–08:35 — CONSEQUENCE:` Produce an evidence-backed comparison:

  ```text
  SHELLCODE  fetch from stack  → denied
  ROP        read stack data   → allowed
             fetch from .text  → allowed
  ```

- `08:35–08:42 — HANDOFF:` A defender inserts a pale-yellow guard word between the buffer and saved control data. The ROP chain can no longer reach its first return address unnoticed.

**Provenance:** NX behavior from E10–E12; ROP portion labeled recap reconstruction.  
**Badge:** `DERIVED COMPARISON`  
**)**

---

## 04 · STACK CANARIES: DETECT THE PATH TO THE RETURN ADDRESS

### Scene 17 — Full plain and protected disassembly

**(08:42–09:18 — Dialogue:**  
“To see what stack protection changes, we compare the complete `greet` functions. The unprotected version reserves `0x30` bytes and returns directly. The protected version reserves `0x40`, loads a value from `fs:0x28`, stores it at `rbp minus eight`, performs the same vulnerable `read`, then reloads and compares that saved value before `leave` and `ret`.”  
**— Animation:**

- `08:42–08:50 — ESTABLISH:` Open two dense, full-height `objdump -d -M intel -S --disassemble=greet` terminals using E20 and E21. Source interleaving, addresses, bytes, and all instructions remain visible.
- `08:50–09:02 — OPERATE:` A structural diff engine aligns corresponding source lines and instructions. Common instructions lock together; only additions and changed offsets move outward. This mechanic must come from or be added to the parent repertoire as `TerminalStructuralDiff`.
- `09:02–09:11 — CONSEQUENCE:` Select the genuine added rows at `0x40116e`, `0x401177`, `0x4011b8`, `0x4011bc`, `0x4011c5`, and `0x4011c7`. Their address chips and terminal tethers remain attached.
- `09:11–09:18 — HANDOFF:` The prologue pair and epilogue group move into two side trays labeled `FUNCTION ENTRY` and `BEFORE RETURN`, while the full disassemblies remain behind.

**Provenance:** E20, E21.  
**Badge:** `REAL DISASSEMBLY DIFF`  
**)**

### Scene 18 — Probe the guard rather than guessing

**(09:18–09:53 — Dialogue:**  
“The disassembly tells us where the compiler reads and stores the guard, but we can also measure the values. This architecture-specific probe reads the x86-64 thread-local guard from `fs:0x28` and the compiler’s frame copy from `rbp minus eight`, then prints both. It is instrumentation for this lab, not portable application code, and its complete source remains on screen before we inspect the numbers.”  
**— Animation:**

- `09:18–09:25 — ESTABLISH:` Show all twenty-four lines of `src/canary_probe.c`, including the `#if defined(__x86_64__)` guard.
- `09:25–09:37 — OPERATE:` Track source line 12 to disassembly `0x40116d`, and line 13 to `0x40117a`, inside the complete `objdump` output from E22. Keep both source and dense disassembly visible.
- `09:37–09:47 — CONSEQUENCE:` Extract the two instruction rows with breadcrumbs:

  ```text
  LAB > canary-probe > probe > 0x40116d > fs:0x28
  LAB > canary-probe > probe > 0x40117a > [rbp-0x8]
  ```

  Add `LAB INSTRUMENTATION — X86-64-SPECIFIC`.
- `09:47–09:53 — HANDOFF:` The instruction rows become two measurement leads entering a live frame: one at TLS, one at the frame canary slot.

**Provenance:** E22 and `src/canary_probe.c`.  
**Badge:** `REAL SOURCE + REAL DISASSEMBLY`  
**)**

### Scene 19 — Three real runs

**(09:53–10:25 — Dialogue:**  
“Across three executions, the guard changes. In each execution, however, the thread-local guard and the frame copy are identical. The first run prints `cc6f...2200`; the second prints `8f19...7a00`; the third prints `5b33...3800`. We are not choosing aesthetically convenient values. These are the values recorded by the probe on this capture.”  
**— Animation:**

- `09:53–10:00 — ESTABLISH:` Show E22’s complete three-run output under the preceding disassembly. Do not start with just one canary.
- `10:00–10:12 — OPERATE:` For each run, pair `tls-guard` and `frame-copy` byte by byte. Eight tiny equality checks travel across each pair.
- `10:12–10:20 — CONSEQUENCE:` Stamp `MATCH WITHIN RUN` on all three, then vertically compare the runs and stamp `CHANGES BETWEEN RUNS`. Retain exact printed hex values and buffer addresses in the full terminal.
- `10:20–10:25 — HANDOFF:` The first run’s pair is selected and carried into a stack-frame model, with its terminal row tether still visible.

**Provenance:** E22.  
**Badge:** `REAL RUNTIME OUTPUT`  
**)**

### Scene 20 — Historical source: the actual StackGuard figure

**(10:25–10:58 — Dialogue:**  
“In 1998, Crispin Cowan and his coauthors presented StackGuard. Their paper places a canary word between local data and the return address, then verifies it before the function returns. Its Figure Two is not merely decorative history; it gives us a primary-source stack relationship to compare with the compiler output we just measured.”  
**— Animation:**

- `10:25–10:33 — ESTABLISH:` Show the actual StackGuard title page, then turn to the real page containing Figure Two. Preserve native USENIX branding and monochrome layout.
- `10:33–10:44 — OPERATE:` Spotlight the complete figure first. Then trace `buffer`, `local variables`, `canary word`, and `return address` in the original drawing. A page-coordinate breadcrumb identifies the figure.
- `10:44–10:52 — CONSEQUENCE:` Pull the trace out, align it beside the E21-derived frame layout, and show the common ordering without claiming byte-for-byte identity across implementations.
- `10:52–10:58 — HANDOFF:` The historical trace and current compiler frame merge into one labeled reconstruction, while both original sources remain as thumbnails.

**Provenance:** P02, E21, E22.  
**Badge:** `PRIMARY PAPER + CURRENT TOOLCHAIN EVIDENCE`  
**)**

### Scene 21 — Function entry, reconstructed from exact rows

**(10:58–11:34 — Dialogue:**  
“At function entry, the protected binary reserves sixty-four bytes. Instruction `0x40116e` copies the thread-local guard into `rax`. Instruction `0x401177` stores it at `rbp minus eight`. The buffer begins at `rbp minus 0x30`. That puts the canary above the buffer in the path toward saved frame data. The diagram is a reconstruction, but every distance shown comes from the selected instructions.”  
**— Animation:**

- `10:58–11:05 — ESTABLISH:` Put the three full E21 rows on the left with addresses intact: `sub rsp,0x40`, `mov rax,fs:0x28`, `mov [rbp-0x8],rax`, plus the later `lea [rbp-0x30]`.
- `11:05–11:18 — OPERATE:` `sub rsp,0x40` extends the frame. The buffer anchor enters at `-0x30`; the canary anchor enters at `-0x8`. A ruler counts exact offsets rather than drawing arbitrary spacings.
- `11:18–11:28 — CONSEQUENCE:` Copy the captured guard into the frame slot. Mark the interval between buffer start and canary. Do not name unspecified padding bytes as variables.
- `11:28–11:34 — HANDOFF:` The 128-byte `read` stream from source line 9 arrives at the frame and begins filling from `rbp-0x30`.

**Provenance:** E21, E22.  
**Badge:** `RECONSTRUCTION — EXACT OFFSETS FROM REAL DISASSEMBLY`  
**)**

### Scene 22 — The canary is crossed, not blocked

**(11:34–12:05 — Dialogue:**  
“The canary does not stop the write. The first thirty-two bytes occupy the declared array. More bytes continue through adjacent frame storage. Eventually the stream overwrites the saved guard, then can continue toward saved `rbp` and the return address. The defensive action is delayed. Stack protection records that corruption now so it can react before control is returned later.”  
**— Animation:**

- `11:34–11:41 — ESTABLISH:` Keep source line 9, disassembly `lea [rbp-0x30]`, and `mov edx,0x80` visible above the frame.
- `11:41–11:52 — OPERATE:` Send exactly 128 indexed byte tokens into the frame. The first 32 fill `name`; later bytes continue. When the canary is reached, show its actual first captured value changing byte by byte.
- `11:52–12:00 — CONSEQUENCE:` The return-address cell becomes purple attacker data, but RIP does not change yet. Stamp `WRITE COMPLETED` and `CHECK NOT YET EXECUTED` simultaneously.
- `12:00–12:05 — HANDOFF:` The function’s control-flow cursor leaves `printf` and enters the genuine epilogue rows at `0x4011b8`.

**Provenance:** E21; frame is labeled reconstruction.  
**Badge:** `RECONSTRUCTION — DERIVED FROM E21`  
**)**

### Scene 23 — Check before return

**(12:05–12:40 — Dialogue:**  
“The epilogue reloads the frame copy at `0x4011b8`, subtracts the current thread-local guard at `0x4011bc`, and jumps over the failure call only if the result is zero. If the values differ, `0x4011c7` calls `__stack_chk_fail`. Only after the equality path reaches `0x4011cc` do `leave` and `ret` execute. The corrupted return address can exist in memory and still never reach RIP.”  
**— Animation:**

- `12:05–12:12 — ESTABLISH:` Return to full E21 terminal and spotlight the complete epilogue block in place.
- `12:12–12:24 — OPERATE:` Extract rows one at a time with provenance tethers. The saved corrupted guard enters `rax`; the TLS guard enters the subtractor; zero flag becomes visibly false; branch path chooses the call.
- `12:24–12:33 — CONSEQUENCE:` `__stack_chk_fail@plt` activates before `leave; ret`. Gray out the overwritten return-address cell and add `NEVER CONSUMED`.
- `12:33–12:40 — HANDOFF:` The failure call’s terminal consequence expands into the side-by-side runtime comparison.

**Provenance:** E21, addresses `0x4011b8–0x4011cd`.  
**Badge:** `REAL INSTRUCTIONS → LABELED EXECUTION RECONSTRUCTION`  
**)**

### Scene 24 — Real plain-versus-canary failure signatures

**(12:40–13:12 — Dialogue:**  
“With ninety-six `A` bytes, the plain build prints that it read ninety-six bytes, then dies by signal eleven with status one hundred and thirty-nine. The canary build reads the same ninety-six bytes, prints `stack smashing detected`, then terminates by signal six with status one hundred and thirty-four. One crashes after corrupted control state is consumed. The other detects corruption before returning.”  
**— Animation:**

- `12:40–12:47 — ESTABLISH:` Show E23 as a complete terminal with all three commands: plain, canary, and full-protection runs.
- `12:47–12:58 — OPERATE:` Track the identical payload command into each pipeline:

  ```bash
  python3 -c 'import sys; sys.stdout.buffer.write(b"A"*96)'
  ```

  Preserve the full command breadcrumb.
- `12:58–13:06 — CONSEQUENCE:` Extract actual diagnostics: plain `signal=11/status=139`; canary and full `stack smashing detected`, `signal=6/status=134`. Align them with the previous instruction paths.
- `13:06–13:12 — HANDOFF:` The word `detected` becomes a boundary around the narrow corruption route the canary watches; other memory objects remain outside it.

**Provenance:** E23.  
**Badge:** `REAL RUNTIME OUTPUT`  
**)**

### Scene 25 — Limits and the future leak

**(13:12–13:42 — Dialogue:**  
“A stack canary is therefore a tamper check for particular protected frames, not a universal memory-safety system. It does not repair `read`, protect every heap object, or make all pointer corruption impossible. And if another bug reveals the current guard, an attacker may reproduce that value while overwriting data around it. The next defenses also rely on hidden values—and that makes disclosure our recurring enemy.”  
**— Animation:**

- `13:12–13:19 — ESTABLISH:` Show the canary’s proven coverage corridor from buffer through frame control data, with E21 and E23 thumbnails attached.
- `13:19–13:29 — OPERATE:` Pull the camera outward to reveal heap objects, global function pointers, adjacent locals, and an unprotected function. The canary corridor does not expand to cover them.
- `13:29–13:36 — CONSEQUENCE:` A symbolic output primitive reads the canary value; a copied payload preserves it. Label this `CONCEPTUAL FUTURE BYPASS — NOT EXECUTED IN THIS VIDEO`.
- `13:36–13:42 — HANDOFF:` The leaked yellow value transforms into a cyan pointer. The pointer enters `/proc/PID/maps`, beginning the ASLR section.

**Provenance:** Canary limitations are conceptual, grounded by E21–E23.  
**Badge:** `CONCEPTUAL MODEL — FUTURE TOPIC`  
**)**

---

## 05 · ASLR: ADDRESSES BECOME PROCESS STATE

### Scene 26 — Complete address probe and runtime policy

**(13:42–14:18 — Dialogue:**  
“To observe address randomization, we use another complete program. It prints its process ID, the address of `main`, one local stack variable, a reference to `puts`, and the actual libc implementation found with `dlsym`. If launched with `--hold`, it waits so we can inspect `/proc` while that exact process is still alive. The kernel reports randomization mode two.”  
**— Animation:**

- `13:42–13:49 — ESTABLISH:` Show all twenty-five lines of `src/address_probe.c`. Keep `dlsym`, every `printf`, and the `--hold` branch visible.
- `13:49–14:01 — OPERATE:` Trace each printed field to its source expression: `&main`, `&local`, `&puts`, and `dlsym`. Build a five-row output schema beside the full source.
- `14:01–14:10 — CONSEQUENCE:` Run `cat /proc/sys/kernel/randomize_va_space`; actual output `2` is connected to the process-launch icon. Add `SYSTEM POLICY — RUNTIME, NOT A COMPILER FLAG`.
- `14:10–14:18 — HANDOFF:` Compile lanes `address-nopie` and `address-pie` emerge from the same source. For now, select only the non-PIE lane.

**Provenance:** E00, E02 / `src/address_probe.c`, build script.  
**Badge:** `REAL SOURCE + REAL SYSTEM OUTPUT`  
**)**

### Scene 27 — Four non-PIE runs

**(14:18–14:50 — Dialogue:**  
“Across four runs of the non-PIE binary, `main` remains `0x401186`, and its PLT reference for `puts` remains `0x401030`. The local stack pointer changes every time. The actual libc `puts` address changes every time. This is the first important separation: ASLR is active, but an ordinary non-PIE main executable can still provide fixed addresses.”  
**— Animation:**

- `14:18–14:25 — ESTABLISH:` Show the complete `address-nopie: four runs` block from E30 in a dense terminal.
- `14:25–14:36 — OPERATE:` A column comparator scans all rows. Equal `main` and `puts-ref` values lock into vertical rails; differing stack and `libc-puts` values physically separate into four positions.
- `14:36–14:44 — CONSEQUENCE:` Produce four miniature process strips *from the output rows*, each pointer tethered to its printed address. Stamp `FIXED MAIN`, `MOVING STACK`, `MOVING LIBC`.
- `14:44–14:50 — HANDOFF:` Select run PID `1521`, then follow its process-ID row into the matching `/proc/1521/maps` capture.

**Provenance:** E30.  
**Badge:** `REAL RUNTIME OUTPUT`  
**)**

### Scene 28 — Full process map before the abstract rail

**(14:50–15:25 — Dialogue:**  
“This is the actual map for that held process. The executable begins at `0x00400000`. Its executable page is the next mapping. Libc’s file mapping begins at `0x7f704aa1e000`, and the user stack occupies the high-address range beginning at `0x7ffe4a34d000`. We show the whole map first because a selected row without its process and file context is easy to misread.”  
**— Animation:**

- `14:50–14:57 — ESTABLISH:` Fill the screen with the full `/proc/1521/maps` text from E32, plus the five printed addresses above it.
- `14:57–15:10 — OPERATE:` Search markers select all rows for `address-nopie`, then all rows for `libc.so.6`, then `[stack]`. The full file remains visible; selected groups receive brackets rather than disappearing into crops.
- `15:10–15:19 — CONSEQUENCE:` Extract the first executable row, first libc file row, and stack row into a side rail, each retaining path, permissions, range, PID, and source command.
- `15:19–15:25 — HANDOFF:` Those three exact ranges unfold proportionally into a simplified vertical address-space reconstruction. Add a permanent label indicating that gaps and scale are compressed.

**Provenance:** E32, PID 1521.  
**Badge:** `REAL /proc MAP → COMPRESSED RECONSTRUCTION`  
**)**

### Scene 29 — Historical source: PaX ASLR

**(15:25–15:57 — Dialogue:**  
“The PaX ASLR design states the central objective plainly: introduce randomness into addresses so attacks requiring advance knowledge become unreliable. It also states the central weakness: if the process can disclose its randomized layout, guessing is no longer necessary. The protection is not that the addresses cease to exist. It is that their current values become secret process state.”  
**— Animation:**

- `15:25–15:33 — ESTABLISH:` Show the actual PaX ASLR monospaced document and retrospective ASLR page in their original form.
- `15:33–15:44 — OPERATE:` Highlight the real passages about introducing randomness and the role of address disclosure. Trace only short phrases; keep the full paragraph visible.
- `15:44–15:51 — CONSEQUENCE:` Pull three tokens out of the page: `RANDOM BASE`, `ADVANCE KNOWLEDGE`, `DISCLOSURE`. Arrange them into a causal mechanism rather than a slogan.
- `15:51–15:57 — HANDOFF:` `RANDOM BASE` becomes the movable left edge of the E32-derived libc mapping; `DISCLOSURE` becomes a dormant output pointer.

**Provenance:** P04.  
**Badge:** `PRIMARY IMPLEMENTATION DOCUMENT`  
**)**

### Scene 30 — Regions move as complete objects

**(15:57–16:30 — Dialogue:**  
“ASLR does not normally throw every function into an independent random slot. It randomizes the base of mappings or regions. In one particular libc build, `puts` remains at a fixed offset from the library’s base. When the library moves, the base and `puts` move together. That preserved internal distance is precisely what later allows one leaked pointer to reveal the whole region.”  
**— Animation:**

- `15:57–16:04 — ESTABLISH:` Label `RECONSTRUCTION — DERIVED FROM E30 AND E32; SCALE COMPRESSED`. Show executable, heap, libc, loader, and stack as complete slabs with exact selected addresses attached.
- `16:04–16:17 — OPERATE:` Replay four process launches. Each movable slab travels through a seeded placement track; symbols inside libc remain bolted to a ruler on that slab. The main executable stays fixed for non-PIE.
- `16:17–16:25 — CONSEQUENCE:` Try to reuse run-one stack and libc pointers in run two. They land in empty or unrelated ranges. Do not claim every stale pointer necessarily faults; label outcomes `UNMAPPED OR WRONG OBJECT`.
- `16:25–16:30 — HANDOFF:` Focus on the ruler from libc base to `puts`. It expands into an exact arithmetic workspace from E33.

**Provenance:** E30, E32.  
**Badge:** `RECONSTRUCTION — DERIVED FROM REAL RUNS AND MAPS`  
**)**

### Scene 31 — Exact base-plus-offset arithmetic from this libc

**(16:30–17:02 — Dialogue:**  
“For PID fifteen twenty-one, the captured libc mapping begins at `0x7f704aa1e000`, while `dlsym` reports `puts` at `0x7f704aa9e5a0`. `nm` independently reports the `puts` symbol offset as `0x805a0` in this exact libc file. Adding the captured base and that file offset reproduces the runtime address exactly. These numbers belong to this build and this run; the relationship is the reusable part.”  
**— Animation:**

- `16:30–16:37 — ESTABLISH:` Show E33 in a complete terminal, with the `nm -D` command and Python arithmetic output. Also keep the relevant E32 libc map and `libc-puts` row visible.
- `16:37–16:49 — OPERATE:` Track-extract three exact values: base `0x7f704aa1e000`, offset `0x805a0`, runtime `0x7f704aa9e5a0`. Animate hexadecimal column addition, preserving carries.
- `16:49–16:57 — CONSEQUENCE:` The calculation lands exactly on the printed `libc-puts` row and locks with an equality mark. Add `THIS LIBC BUILD` to the offset and `THIS PROCESS RUN` to the base.
- `16:57–17:02 — HANDOFF:` Reverse the operation into subtraction: `runtime - offset = base`. A small output leak icon is attached but not yet executed.

**Provenance:** E32, E33.  
**Badge:** `REAL SYMBOL TABLE + REAL PROCESS MAP + DERIVED ARITHMETIC`  
**)**

### Scene 32 — Design and critical evaluation

**(17:02–17:34 — Dialogue:**  
“Address randomization was also studied as a broader compiler and loader strategy. Bhatkar, DuVarney, and Sekar described address obfuscation across code and data. Shacham and colleagues later evaluated the practical limits of ASLR in a thirty-two-bit setting, where restricted entropy and repeated attempts mattered greatly. The correct lesson is neither ‘ASLR solves exploitation’ nor ‘ASLR is useless.’ Its strength depends on entropy, restart behavior, architecture, and especially information disclosure.”  
**— Animation:**

- `17:02–17:10 — ESTABLISH:` Show P05’s actual title page and P06’s actual first page side by side, with artifact classifications `RESEARCH PAPER` and `CRITICAL EVALUATION`.
- `17:10–17:21 — OPERATE:` On P05, spotlight the layout-randomization discussion. On P06, show the actual page containing the relevant stack/randomization figures before tracing the limited-address-space experiment.
- `17:21–17:29 — CONSEQUENCE:` Convert paper traces into four variable dials: `ENTROPY`, `RESTART MODEL`, `ARCHITECTURE`, `DISCLOSURE`. Do not assign universal values.
- `17:29–17:34 — HANDOFF:` The `DISCLOSURE` dial turns to maximum and emits the `puts` pointer from Scene 31.

**Provenance:** P05, P06.  
**Badge:** `PRIMARY RESEARCH CONTEXT`  
**)**

### Scene 33 — The bridge to ret2libc

**(17:34–18:02 — Dialogue:**  
“When a program reveals a pointer into libc, the attacker no longer needs to guess that run’s base. Subtract the known offset of the revealed object, and the randomized base becomes measurable. ASLR has not been switched off. Its hidden state has been observed. That is the ASLR part of ret2libc—but before we can use the main executable to perform such a leak, we must ask whether the executable itself is fixed.”  
**— Animation:**

- `17:34–17:41 — ESTABLISH:` Start from the exact E33 subtraction equation with all provenance chips attached.
- `17:41–17:51 — OPERATE:` A conceptual output primitive prints the `puts` address; subtraction reveals the base; other libc symbols appear at their file offsets. Label `CONCEPTUAL EXPLOIT PRIMITIVE — NO PAYLOAD EXECUTED HERE`.
- `17:51–17:58 — CONSEQUENCE:` The fixed non-PIE executable supplies visible `puts@plt`, a GOT relocation location, and `main` as potential stable tools.
- `17:58–18:02 — HANDOFF:` The defender removes the bolts from the main executable. The entire binary begins moving, introducing PIE.

**Provenance:** Arithmetic from E33; exploit use is conceptual and clearly labeled.  
**Badge:** `CONCEPTUAL BRIDGE — NEXT EXPLOIT ARC`  
**)**

---

## 06 · PIE: LET ASLR MOVE THE MAIN EXECUTABLE

### Scene 34 — Full ELF headers and symbol tables

**(18:02–18:38 — Dialogue:**  
“PIE is visible before runtime. `readelf` identifies `address-nopie` as type `EXEC` with entry point `0x4010a0`; `nm` places `main` at `0x401186`. The PIE build is type `DYN`, specifically a position-independent executable, with entry point `0x10a0`; `nm` records `main` as offset `0x1189`. We first inspect the complete headers and symbol tables, then extract those rows.”  
**— Animation:**

- `18:02–18:10 — ESTABLISH:` Show E31 in two full terminals. Include complete ELF headers and complete `nm -n` listings for both binaries.
- `18:10–18:23 — OPERATE:` Search scanner locates `Type`, `Entry point address`, and `main`. Selected rows brighten in place. The output around them remains visible.
- `18:23–18:31 — CONSEQUENCE:` Extract six rows into a comparison strip, retaining command, file, symbol, and tethers. Show `0x401186` as an absolute linked address and `0x1189` as a relative symbol value in the PIE file.
- `18:31–18:38 — HANDOFF:` The two ELF types become physical forms: a bolted `EXEC` block and a rail-mounted `DYN / PIE` block.

**Provenance:** E31.  
**Badge:** `REAL ELF HEADER + SYMBOL OUTPUT`  
**)**

### Scene 35 — PIE is capability; ASLR is placement

**(18:38–19:10 — Dialogue:**  
“PIE and ASLR are related but not synonymous. PIE is the property that lets the executable operate at different bases. ASLR is the runtime policy that selects a base for a particular execution. A relocatable executable can be placed somewhere new. A fixed-address executable still expects its linked home. Only the combination gives us a randomized main binary.”  
**— Animation:**

- `18:38–18:45 — ESTABLISH:` Show P07’s actual report page headed `Position Independent Executables`, complete and unmodified for one second.
- `18:45–18:56 — OPERATE:` Highlight the real discussion of relocatable executables and the compiler/linker options. Pull `-fPIE` and `-pie` into the actual build-script lane.
- `18:56–19:04 — CONSEQUENCE:` The `EXEC` block resists a runtime placement selector; the PIE block slides to the selected base and retains internal offsets.
- `19:04–19:10 — HANDOFF:` Attach the dormant ASLR `2` chip from Scene 5 to the PIE placement selector, then launch four real runs.

**Provenance:** P07, build script, E00.  
**Badge:** `ENGINEERING REPORT + LAB BUILD FLAGS`  
**)**

### Scene 36 — Four PIE runs

**(19:10–19:42 — Dialogue:**  
“In the four PIE executions, `main` changes from `0x55949c2c2189` to three other bases. The stack changes, and libc changes as before. Here the printed `puts` reference also resolves to the randomized libc implementation. The important result is that the executable’s own code address is no longer a stable island across runs.”  
**— Animation:**

- `19:10–19:17 — ESTABLISH:` Show the complete `address-pie: four runs` block from E30 beneath the non-PIE block for context.
- `19:17–19:28 — OPERATE:` Column comparator scans `main`, stack, `puts-ref`, and `libc-puts`. All runtime-address rows separate across runs; `puts-ref` and `libc-puts` pair within each run.
- `19:28–19:36 — CONSEQUENCE:` The previously fixed executable platform now appears at four distinct bases. Old `0x401...` anchor tokens fall into empty space.
- `19:36–19:42 — HANDOFF:` Select held PIE process PID `1522` and follow it into its full `/proc/1522/maps` evidence.

**Provenance:** E30.  
**Badge:** `REAL RUNTIME OUTPUT`  
**)**

### Scene 37 — Exact PIE base arithmetic

**(19:42–20:16 — Dialogue:**  
“For PID fifteen twenty-two, `/proc` shows the PIE file mapping beginning at `0x55bce0674000`. The binary’s symbol table gives `main` an offset of `0x1189`. Add them, and we obtain the printed runtime address exactly: `0x55bce0675189`. PIE therefore changes absolute addresses while preserving offsets within that build, just as ASLR-preserved offsets existed inside libc.”  
**— Animation:**

- `19:42–19:49 — ESTABLISH:` Show the complete E32 PIE process map and printed addresses, plus E31’s full symbol listing thumbnail.
- `19:49–20:01 — OPERATE:` Select the first PIE mapping row `55bce0674000...`, symbol `main 0x1189`, and printed `main 0x55bce0675189`. Keep PID and file path visible.
- `20:01–20:10 — CONSEQUENCE:` Perform exact hexadecimal addition. The result snaps onto the runtime row. Then move the whole binary slab and repeat symbol placement without changing `0x1189`.
- `20:10–20:16 — HANDOFF:` Reverse the equation: a hypothetical leaked `main` pointer minus `0x1189` reveals the PIE base. Send that base into a gadget/PLT/GOT layout.

**Provenance:** E31, E32.  
**Badge:** `REAL MAP + REAL SYMBOL TABLE + DERIVED ARITHMETIC`  
**)**

### Scene 38 — What PIE removes and what it leaves

**(20:16–20:48 — Dialogue:**  
“Without PIE, fixed addresses in the main binary can provide a PLT call, a GOT location, a re-entry point, or a ROP gadget even while libc moves. With PIE, those objects move together with the executable. An exploit often needs a binary pointer leak before using them reliably. But PIE does not erase the objects, change their internal offsets on every launch, fix the overflow, or conceal a pointer that the program itself prints.”  
**— Animation:**

- `20:16–20:23 — ESTABLISH:` On a non-PIE island, place genuine labels from the binary structure: `main`, `.plt`, `.got`, and a generic text gadget. Keep `CONCEPTUAL OBJECT LAYOUT` badge.
- `20:23–20:33 — OPERATE:` Build a first-stage symbolic chain using the fixed island. Then enable PIE; the island and every object move as one unit, leaving hardcoded pointers behind.
- `20:33–20:41 — CONSEQUENCE:` A leaked `main` pointer plus E31’s `0x1189` offset reveals the new island base. Internal objects become addressable again.
- `20:41–20:48 — HANDOFF:` Focus on the GOT object. Its cells contain runtime addresses, but a defender changes their page from writable to read-only, introducing RELRO.

**Provenance:** Fixed/moving addresses from E30–E32; exploit composition is labeled conceptual.  
**Badge:** `CONCEPTUAL CONSEQUENCE — GROUNDED BY REAL ADDRESS EVIDENCE`  
**)**

---

## 07 · RELRO: RELOCATION DATA STOPS BEING A WRITABLE ADDRESS BOOK

### Scene 39 — Complete RELRO probe source

**(20:48–21:22 — Dialogue:**  
“To observe dynamic binding order, we use a fourth complete program. It writes explicit markers to standard error before and after the first call to `puts`, then sleeps so its mappings can be inspected. Three non-PIE binaries are built from this source: no RELRO with lazy binding, partial RELRO with lazy binding, and full RELRO with immediate binding.”  
**— Animation:**

- `20:48–20:55 — ESTABLISH:` Show all nineteen lines of `src/relro_demo.c` and the three exact compile commands in `scripts/build.sh`.
- `20:55–21:06 — OPERATE:` Trace control through `marker(entered)`, `marker(before)`, `puts`, `marker(after)`, and `sleep`. Produce an event ruler directly from those source lines.
- `21:06–21:15 — CONSEQUENCE:` Duplicate the source into `relro-none`, `relro-partial`, and `relro-full`; changed linker tokens remain highlighted: `norelro/lazy`, `relro/lazy`, `relro/now`.
- `21:15–21:22 — HANDOFF:` The three binaries enter three full `readelf`/`objdump` workspaces.

**Provenance:** E02 / `src/relro_demo.c`, `scripts/build.sh`.  
**Badge:** `REAL SOURCE + REAL BUILD FLAGS`  
**)**

### Scene 40 — Dense ELF context first

**(21:22–22:00 — Dialogue:**  
“RELRO cannot be understood from one green label. For each binary, we record program headers, the dynamic section, relocation records, and section headers. No RELRO has no `GNU_RELRO` segment. Partial RELRO has one beginning at `0x403df8`, but no `BIND_NOW`. Full RELRO has a larger protected range beginning at `0x403dc0`, and its dynamic section contains both `BIND_NOW` and the `NOW` flag.”  
**— Animation:**

- `21:22–21:30 — ESTABLISH:` Display E40, E41, and E42 as three dense, vertically scrolling terminal workspaces. Their complete `readelf -l`, `readelf -d`, `objdump -R`, and `readelf -S` outputs appear before any summary.
- `21:30–21:44 — OPERATE:` A four-pass scanner moves through each workspace: `PROGRAM HEADERS`, `DYNAMIC`, `RELOCATIONS`, `SECTIONS`. Selected findings are marked but remain in context.
- `21:44–21:54 — CONSEQUENCE:` Extract only the genuine `GNU_RELRO`, `BIND_NOW/NOW`, `PLTGOT`, `.got`, and `puts` relocation rows. Each carries file, command, address, and a tether to its full output.
- `21:54–22:00 — HANDOFF:` The extracted rows assemble into a three-column evidence board—not yet a conceptual GOT animation.

**Provenance:** E40–E42.  
**Badge:** `REAL ELF OUTPUT`  
**)**

### Scene 41 — Locate the exact `puts` relocation page

**(22:00–22:34 — Dialogue:**  
“Next we connect the file’s relocation address to the live process page that contains it. In the no-RELRO binary, `puts` has relocation address `0x4033a0`, inside a writable mapping. With partial RELRO, `puts` is at `0x404000`, again inside a writable mapping. With full RELRO, `puts` is at `0x403fd8`, and the containing page is mapped read-only.”  
**— Animation:**

- `22:00–22:07 — ESTABLISH:` Show all of E43: three `objdump -R` commands, the matching `/proc/PID/maps` rows, and program marker output.
- `22:07–22:20 — OPERATE:` For each binary, take the relocation address and run it along a hexadecimal range ruler until it lands inside the selected mapping. Keep the actual PID, address range, file path, and permissions visible.
- `22:20–22:29 — CONSEQUENCE:` Stamp exact results:

  ```text
  0x4033a0 ∈ 00403000–00404000  rw-p
  0x404000 ∈ 00404000–00405000  rw-p
  0x403fd8 ∈ 00403000–00404000  r--p
  ```

- `22:29–22:34 — HANDOFF:` The three mapping rows unfold into page objects whose permission tabs come directly from `rw-p` or `r--p`.

**Provenance:** E43.  
**Badge:** `REAL RELOCATION ADDRESSES + REAL RUNTIME MAPS`  
**)**

### Scene 42 — Full loader output before selected binding lines

**(22:34–23:10 — Dialogue:**  
“To see *when* symbols are resolved, we ask the dynamic loader for binding diagnostics. The raw output is dense—more than a hundred lines—because the loader reports bindings for the executable, libc, and the loader itself. We show that complete stream first. Only then do we select the lines around `transferring control`, our program markers, and the bindings for `write`, `puts`, and `sleep`.”  
**— Animation:**

- `22:34–22:41 — ESTABLISH:` Run `env LD_DEBUG=bindings ./bin/relro-partial` and display the full E44 stream in an uncropped terminal beside stdout.
- `22:41–22:52 — OPERATE:` A line counter advances through all raw rows. Search terms appear as real terminal find operations: `transferring control`, `PROGRAM:`, `symbol 'puts'`, `symbol 'write'`, `symbol 'sleep'`.
- `22:52–23:03 — CONSEQUENCE:` Select the exact rows stored in E46, but keep line numbers `103`, `105–110`, PID `1551`, and full-command breadcrumb. No selected line appears without its raw-output thumbnail.
- `23:03–23:10 — HANDOFF:` Those ordered rows transform into a temporal event track for partial RELRO.

**Provenance:** E44, E46.  
**Badge:** `REAL DYNAMIC-LOADER OUTPUT`  
**)**

### Scene 43 — Partial RELRO and lazy binding, measured

**(23:10–23:42 — Dialogue:**  
“In the partial build, the loader transfers control to the program first. `write` is bound as the first marker runs. The program announces that it is before its first `puts`. Only then does the loader bind `puts`. `sleep` is bound later as well. Lazy binding postpones these writes until the corresponding call path is used, which is why the procedure-linkage slot must remain writable during normal execution.”  
**— Animation:**

- `23:10–23:17 — ESTABLISH:` Lay E46’s exact selected rows on a horizontal time axis, still tethered to the full E44 terminal.
- `23:17–23:28 — OPERATE:` A loader cursor crosses `transferring control`; program cursor emits markers; on first `puts`, resolver cursor writes the resolved address into the `0x404000` slot/page identified in E43.
- `23:28–23:36 — CONSEQUENCE:` Permission tab remains `RW` after main begins because later lazy bindings are legitimate. Place the attacker-write symbol beside, but visually distinct from, the loader’s legitimate write.
- `23:36–23:42 — HANDOFF:` Rewind to process startup and switch to the full-RELRO loader stream.

**Provenance:** E43, E44, E46.  
**Badge:** `RECONSTRUCTION — ORDER AND PAGE DERIVED FROM REAL LOADER/MAP OUTPUT`  
**)**

### Scene 44 — Full RELRO and immediate binding, measured

**(23:42–24:16 — Dialogue:**  
“In the full build, the order reverses. The loader binds `puts`, `write`, and `sleep` before the line that transfers control to the executable. Only afterward do our `entered main` and `before first puts` markers appear. Because the required procedure-linkage writes are completed during startup, the page containing `puts` can be read-only by the time ordinary program code runs.”  
**— Animation:**

- `23:42–23:49 — ESTABLISH:` Show the complete E45 raw stream first, with its line counter and stdout, then select E47’s exact rows.
- `23:49–24:00 — OPERATE:` Place binding rows `88–90` before `transferring control` row `106`; attach PID `1554` and command breadcrumb. Resolver fills all three function slots during a startup sweep.
- `24:00–24:10 — CONSEQUENCE:` Loader exits the region; page permission changes to `r--p`, matching E43’s runtime map. An attempted later write physically stops at the page boundary.
- `24:10–24:16 — HANDOFF:` The page boundary expands into the actual RELRO layout diagrams from P07.

**Provenance:** E43, E45, E47.  
**Badge:** `REAL LOADER ORDER → RUNTIME PERMISSION RECONSTRUCTION`  
**)**

### Scene 45 — Historical engineering source and actual layout

**(24:16–24:50 — Dialogue:**  
“Drepper’s engineering report explains the layout problem behind RELRO. Some ELF structures must be writable while relocations are performed, but should not remain writable afterward. The report’s own diagrams show protected ELF data reordered next to read-only data so the loader can cover it with a read-only page range after relocation. Full RELRO combines that layout with immediate binding.”  
**— Animation:**

- `24:16–24:24 — ESTABLISH:` Show P07’s actual report page containing the first ELF data-layout figure, then the page containing the expanded protected region and `-z relro`/`-z now` discussion.
- `24:24–24:36 — OPERATE:` Trace the real colored section bars and page boundary. Keep figure captions and page coordinates visible before pulling the trace away.
- `24:36–24:44 — CONSEQUENCE:` Align the traced layout with E42’s real section rows and E43’s `r--p` page. Differences between conceptual grouping and exact section names remain explicit.
- `24:44–24:50 — HANDOFF:` The traced protected range wraps around a live GOT directory whose rows are populated using the actual relocation names `puts`, `write`, and `sleep`.

**Provenance:** P07, E42, E43.  
**Badge:** `ENGINEERING REPORT + CURRENT ELF EVIDENCE`  
**)**

### Scene 46 — PLT/GOT mechanism, with provenance

**(24:50–25:24 — Dialogue:**  
“The conceptual calling path is now safe to animate because we have already located its real relocation entries and binding events. A call reaches the PLT route. The route consults the relevant GOT slot. Before resolution, that route can enter the dynamic resolver. After resolution, the slot contains the libc destination. Partial RELRO permits later loader writes for lazy binding. Full RELRO resolves first, then removes write permission.”  
**— Animation:**

- `24:50–24:57 — ESTABLISH:` Label `CONCEPTUAL MODEL — DERIVED FROM E40–E47`. Keep actual `objdump -R`, `LD_DEBUG`, and `/proc` thumbnails attached to the three nodes: PLT, GOT slot, resolver.
- `24:57–25:09 — OPERATE:` Execute the partial path: `call puts@plt` → unresolved slot/resolver → binding row from E46 → write to `0x404000` → subsequent direct route.
- `25:09–25:18 — CONSEQUENCE:` Execute the full path: startup binding rows from E47 → write to `0x403fd8` → page becomes `r--p` → later call follows resolved address without a write.
- `25:18–25:24 — HANDOFF:` Present an attacker write and attacker read as two different operations against the full-RELRO slot.

**Provenance:** E40–E47.  
**Badge:** `CONCEPTUAL MODEL — COMPLETE EVIDENCE CHAIN VISIBLE`  
**)**

### Scene 47 — Read-only is not secret

**(25:24–25:55 — Dialogue:**  
“Full RELRO blocks writes to the protected relocation page. It does not make the page unreadable. The mapping we measured is `r--p`, not inaccessible. A disclosure primitive may still read the resolved `puts` pointer, and that pointer can still reveal libc’s randomized base. RELRO closes the GOT-overwrite route. It does not close code reuse, information leakage, or corruption of unrelated writable objects.”  
**— Animation:**

- `25:24–25:31 — ESTABLISH:` Return to E43’s full-RELRO `0x403fd8` relocation and `r--p` mapping row.
- `25:31–25:41 — OPERATE:` Red write request checks `W=0` and fails. Cyan read request checks `R=1` and succeeds, copying the resolved pointer to a symbolic output line.
- `25:41–25:49 — CONSEQUENCE:` Feed the pointer into the exact base-minus-offset mechanism from E33. Mark `GOT OVERWRITE CLOSED`; leave `GOT READ / LEAK POSSIBLE` open.
- `25:49–25:55 — HANDOFF:` Pull all five defense mechanisms into one evidence-backed matrix around the original source bug.

**Provenance:** E43, E33; leak operation conceptual and labeled.  
**Badge:** `REAL PERMISSIONS + CONCEPTUAL DISCLOSURE`  
**)**

---

## 08 · DEFENSE IN DEPTH

### Scene 48 — Build the summary only after the evidence

**(25:55–26:30 — Dialogue:**  
“Only now do we compress the evidence into a summary. NX comes from stack execution metadata and page enforcement. The canary appears as compiler-generated prologue and epilogue instructions. ASLR appears in changing runtime mappings. PIE changes the ELF type and lets the main binary receive a randomized base. RELRO combines ELF layout, binding policy, and loader-enforced read-only pages.”  
**— Animation:**

- `25:55–26:02 — ESTABLISH:` Reopen five full evidence thumbnails: E10/E11, E21, E30/E32, E31, E42/E43/E47.
- `26:02–26:14 — OPERATE:` Derive one matrix cell at a time. Each cell is created by pulling a row from its evidence thumbnail, never by typing a generic checkmark.
- `26:14–26:24 — CONSEQUENCE:` Completed matrix:

  ```text
  NX       GNU_STACK lacks E; instruction fetch from stack fails
  CANARY   fs:0x28 copy/check; __stack_chk_fail before ret
  ASLR     stack/libc mappings vary by run
  PIE      ELF DYN; main = base + 0x1189 in captured build
  RELRO    puts slot page becomes r--p; BIND_NOW before main
  ```

- `26:24–26:30 — HANDOFF:` Each row connects to one attacker assumption from the opening.

**Provenance:** E10–E47.  
**Badge:** `DERIVED SUMMARY — EVERY CELL TRACEABLE`  
**)**

### Scene 49 — Same bug, different failure point

**(26:30–27:06 — Dialogue:**  
“The source-level defect never changed: thirty-two bytes of storage, one hundred and twenty-eight bytes requested. What changed was the point at which an exploit’s assumptions failed. NX waits until instruction fetch. The canary reacts before `ret`. ASLR invalidates yesterday’s runtime pointer. PIE removes fixed main-binary addresses. Full RELRO rejects a write to the relocation page.”  
**— Animation:**

- `26:30–26:37 — ESTABLISH:` Place the full `vuln.c` at center, red bug interval visible, with five actual binary artifact IDs around it.
- `26:37–26:49 — OPERATE:` One symbolic payload is sent through five time-aligned pipelines. Each pipeline uses evidence-backed checkpoints rather than generic shields.
- `26:49–26:58 — CONSEQUENCE:` Freeze each at its distinct failure point and attach real diagnostics where available: signal 11, `stack smashing detected`, changing addresses, DYN base, `r--p` page.
- `26:58–27:06 — HANDOFF:` The five stopped paths become five requirements an attacker would need to satisfy simultaneously.

**Provenance:** E03, E12, E23, E30–E32, E43.  
**Badge:** `DERIVED COMPARATIVE MODEL`  
**)**

### Scene 50 — Why layers matter

**(27:06–27:42 — Dialogue:**  
“No single layer is the final answer. ROP can route around NX. A pointer disclosure can reveal an ASLR base. A leaked canary can preserve the stack check. A leaked code pointer can reveal a PIE base. Full RELRO can force an attacker away from GOT overwrites without preventing every code-reuse path. Defense in depth works by making a successful chain require several independent capabilities in the same vulnerable process.”  
**— Animation:**

- `27:06–27:13 — ESTABLISH:` Show five closed routes with their evidence-backed defense nodes.
- `27:13–27:25 — OPERATE:` Introduce conceptual capability tokens one at a time: `CONTROL RIP`, `CANARY VALUE`, `PIE BASE`, `LIBC BASE`, `VALID CODE-REUSE PATH`. Tokens must travel through the exact defense nodes they answer.
- `27:25–27:34 — CONSEQUENCE:` Requirements accumulate into a tall exploit state machine. Losing any token collapses the later stages. Label `CONCEPTUAL ATTACK CHAIN — NOT A LIVE EXPLOIT`.
- `27:34–27:42 — HANDOFF:` All tokens except `INFORMATION LEAK` dim. The leak token splits into `CANARY`, `PIE`, and `LIBC` revelations.

**Provenance:** Consequences derived from preceding evidence; combined exploit remains conceptual.  
**Badge:** `CONCEPTUAL SYNTHESIS`  
**)**

### Scene 51 — Mitigation is not repair

**(27:42–28:16 — Dialogue:**  
“Return once more to the compiler warning. It identified the actual engineering failure before any mitigation activated. NX did not reduce the requested length. The canary did not make the destination larger. ASLR and PIE did not validate the pointer. RELRO did not constrain `read`. A corrected bound, a memory-safe abstraction, or a design that cannot express this mismatch addresses the bug itself. The protections reduce exploitability when bugs remain.”  
**— Animation:**

- `27:42–27:49 — ESTABLISH:` Reopen E03’s complete compiler warning and full `vuln.c`; all mitigation thumbnails remain around it.
- `27:49–28:01 — OPERATE:` Toggle each defense off and on while the source line `read(..., 128)` remains unchanged. The 128-byte request continues overshooting the 32-byte object.
- `28:01–28:09 — CONSEQUENCE:` Edit the laboratory copy to use `sizeof name` only inside a clearly labeled `CORRECTED EXAMPLE — NOT THE CAPTURED BINARY`. The request ruler contracts to 32; the source-level overflow disappears.
- `28:09–28:16 — HANDOFF:` Put the original vulnerable source back, because the next episode will exploit rather than repair it. One leaked pointer begins printing in the terminal.

**Provenance:** E03 and `src/vuln.c`; corrected variant explicitly labeled non-captured example.  
**Badge:** `REAL WARNING + LABELED CORRECTED EXAMPLE`  
**)**

### Scene 52 — Ret2libc now has a reason

**(28:16–28:52 — Dialogue:**  
“And now ret2libc stops looking like a bag of arbitrary tricks. NX explains why we reuse executable code instead of running bytes from the stack. ASLR explains why libc’s base must be learned. PIE explains why even our PLT entries, GOT locations, and gadgets may require a binary-base leak. The canary explains why a blind overflow can die before `ret`. RELRO explains why reading a GOT entry may remain useful even when overwriting it is blocked.”  
**— Animation:**

- `28:16–28:23 — ESTABLISH:` Put the five evidence-backed defense rows on the left and an empty ret2libc chain on the right.
- `28:23–28:35 — OPERATE:` Each defense contributes one necessity to the chain: `REUSE CODE`, `LEAK LIBC`, `LEAK PIE`, `PRESERVE CANARY`, `READ RATHER THAN OVERWRITE`.
- `28:35–28:45 — CONSEQUENCE:` Assemble a high-level two-stage flow without payload bytes:

  ```text
  STAGE 1  disclose a runtime pointer
  CALCULATE region base from exact-build offset
  STAGE 2  reuse code at calculated addresses
  ```

  Label `NEXT EPISODES — NOT EXECUTED HERE`.
- `28:45–28:52 — HANDOFF:` The stage-one disclosure pointer becomes the title of the next episode.

**Provenance:** Synthesis of E10–E47; future exploit flow conceptual.  
**Badge:** `CONCEPTUAL SERIES BRIDGE`  
**)**

### Scene 53 — Research wall and closing

**(28:52–29:28 — Dialogue:**  
“Today we did not begin with five floating shields and assign them magical powers. We followed real source into real binaries, inspected their headers and instructions, ran them, read their live mappings, and then built the diagrams from that evidence. The result is a defender’s map of exploitation: executable permission, stack integrity, randomized placement, relocatable code, and hardened relocation data. Next time, we ask what happens when the program leaks the map.”  
**— Animation:**

- `28:52–29:00 — ESTABLISH:` Expand the entire evidence graph: sources, commands, terminal captures, selected rows, reconstructions, and P01–P07 paper pages.
- `29:00–29:12 — OPERATE:` A provenance pulse travels backward from each final concept to its originating command and artifact, proving traceability in reverse.
- `29:12–29:21 — CONSEQUENCE:` Research documents and lab evidence interlock into five columns. No concept remains unsupported or unlabeled.
- `29:21–29:28 — HANDOFF:` Center text:

  ```text
  NEXT:
  INFORMATION LEAKS
  HOW ONE POINTER REVEALS A RANDOMIZED BASE
  ```

  A terminal cursor prints one cyan pointer. Cut to black before arithmetic begins.

**Provenance:** Entire evidence graph; P01–P07.  
**Badge:** `TRACEABILITY CHECK PASSED ONLY AFTER IMPLEMENTATION REVIEW`  
**)**

---

# IMPLEMENTATION PREFLIGHT FOR CODEX / HYPERFRAMES

Before implementing Scene 1, perform this repository audit. Do not infer component names from this script and silently create duplicates.

```text
1. Locate the parent shared animation repertoire.
2. Locate at least two sibling videos containing:
   - terminal animation,
   - code/disassembly panels,
   - stack or memory animation,
   - paper/document treatment,
   - evidence extraction or zoom mechanics.
3. Produce repertoire-audit.md with:
   - actual component/class/file names,
   - screenshots or render-frame references,
   - what can be reused unchanged,
   - what should be restaged,
   - what needs extension,
   - what genuinely does not exist.
4. Map the semantic names below to actual repository primitives.
5. Implement new generic mechanics in the parent repertoire.
6. Only then implement video-specific scenes.
```

Semantic needs, not presumed class names:

```text
Terminal workspace with real file-fed output
Full-source editor
Dense disassembly/decompiler workspace
Tracked row extraction with command/address provenance
Structural terminal diff
Stack frame with exact-offset ruler
Memory page with R/W/X access operations
Process-map rail generated from /proc rows
ELF section/program-header visualization
PLT/GOT/resolver call-path reconstruction
Paper page viewer with figure tracing
Evidence graph and reverse provenance pulse
Four-phase scene controller
```

Generic mechanics that must be extracted to the parent repertoire if absent:

```text
ProvenanceTether
EvidenceRowExtractor
TerminalStructuralDiff
PaperFigureTrace
HexRangeLocator
HexArithmeticTrack
PermissionTransition
EvidenceDerivedBadge
FourPhaseBeat
```

# AUTOMATED RELEASE CHECKS

The render/review pipeline should fail when:

```text
- a teaching close-up has no source breadcrumb;
- an instruction close-up lacks function and address;
- a selected ELF/mapping row lacks file and command;
- terminal text is not loaded from an evidence file or fresh command capture;
- a reconstruction lacks an honesty badge;
- a substantial beat omits establish, operate, consequence, or handoff;
- a scene relies only on opacity, panel translation, or camera drift;
- a new generic mechanic has no repertoire-audit decision;
- an exact address is typed manually instead of parsed from evidence;
- a paper figure is recreated before the actual source page is shown.
```

# EVIDENCE CAPTURE COMMAND

From the lab root:

```bash
./scripts/build.sh && ./scripts/capture-evidence.sh
```

Rerunning the capture is expected to change PIDs, stack addresses, PIE bases, libc bases, and canary values. The animation data loader should parse the newly captured outputs rather than relying on this script’s example addresses.

# PAPER ASSET TREATMENT

For every research artifact:

1. Show the actual page at readable scale before styling.
2. Preserve title, author, venue or document identity, and year.
3. Spotlight the complete relevant figure or paragraph first.
4. Highlight the smallest supporting phrase or figure region.
5. Keep a source-page thumbnail and page/figure breadcrumb attached after extraction.
6. Pull the trace into the visual world.
7. Keep the original page ghosted behind the reconstruction for several seconds.
8. Never fabricate a modern cover or imply that an engineering document is an academic paper.

