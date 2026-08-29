# Heap Overflow and Underflow — The Heap Is Not a Safe Place

## 0:00–0:18 — Cold open

Hello again, hackers. Tonight we leave the stack and walk into the heap: dynamic memory,
rented in little adjacent rooms. There is no return-address staircase here. Just names,
addresses, and walls that exist only if the program respects them.

## 0:18–0:55 — The crime scene first

Before the cartoon, we need the crime scene. picoCTF gives us a binary and source file.
The local evidence for this build is the public heap 2 ELF and its matching `chall.c`.
We identify the ELF, inspect its header, read the complete source, and run the program
normally before isolating any line. The binary is 64-bit little-endian, dynamically linked,
and carries debug information. `checksec` is not installed in this production environment,
so the video says that plainly instead of inventing a mitigation report. The promise that
heap data is safe is the bait.

## 0:55–1:32 — Run it normally

An exploit is not magic typed into a void. It begins as a conversation with a program.
The normal heap print gives us two strings, `pico` and `bico`, and two addresses. In the
captured run they differ by `0x20`, or 32 decimal. That is not a magical offset; it is an
observed distance in this allocator run. ASLR will change the full addresses next time, but
the printed difference is the part we need to reason about. The terminal is not decoration:
it is where the model gets its spacing from.

## 1:32–2:18 — Who owns the heap?

In `init`, the program asks `malloc` for two five-byte pieces of heap memory. One pointer
is `input_data`; the other is `x`. At source level they look separate: two names, two
pointers, two strings. But source names are labels, not walls. The real wall is the number
of bytes the program protects, and here the write protects nothing. A pointer variable is
only an address stored somewhere else. It does not carry a magical guard around the
allocation. Every later access depends on the program remembering the same size and
ownership rule. The compiler cannot infer the future length of a string read from standard
input. That is why the boundary must be explicit at the operation that writes bytes.

## 2:18–3:08 — malloc is a landlord

`malloc` does not give a magical private drawer. It gives a lease: an address to usable
space while the allocator tracks aligned chunks around it. The pointer cannot predict the
future. If the program writes five bytes, fine. If it writes fifty, the CPU keeps moving
forward until something important changes. On a typical 64-bit allocator, the request is
rounded, headers exist before user space, and the next user pointer can land farther away
than five bytes. Those implementation details help explain spacing, but they do not make
an unbounded write safe. Measure from the first valid byte of one object to the first
valid byte of its neighbor.

## 3:08–4:05 — The vulnerable line

The bug lives in one line: `scanf("%s", input_data)`. Percent-s reads a word until
whitespace. It does not stop because `malloc` asked for five bytes or because the next
object has another name. The user decides where the write ends. Write start is
`input_data`; write end is the first whitespace; bounds are none. A width in a format
string would tell `scanf` how much room exists. This format has no width. It accepts one
non-whitespace word and keeps copying characters until the input says stop. The room is
five bytes. The programmer chose the start address; the attacker controls the finish line.
This is a useful reading habit: every input primitive deserves a start, an end condition,
and a capacity. When one of those answers is missing, stop and map the adjacent objects.

## 4:05–5:12 — Heap 1: data-only corruption

Before code execution, start quietly. In heap 1 the neighbor is `safe_var`. It begins as
`bico`, while the program grants success when it sees `pico`. Thirty-two filler bytes
reach the observed neighbor; four more bytes rewrite its tiny word. No return address is
needed. The payload is `b"A" * 32 + b"pico"`. Read it slowly. The filler is not a spell and
it is not universal. It occupies the observed corridor between the first returned pointer
and the second. The last four visible bytes change the string comparison. The same layout
lesson applies to configuration fields, account roles, authorization bits, and lengths in
ordinary applications. The string is small enough to see every byte, which is what makes
this warm-up useful. In larger programs the same walk may be hidden in a longer request,
but the arithmetic does not change: start plus supplied length must stay inside capacity.

## 5:12–6:05 — Why this is serious

Programs make decisions from data: role, payment state, length, callback, permission.
Heap corruption can change the data that answers the question. The program may keep
running, confidently wrong, long before anyone sees a control-flow hijack. Imagine a
nearby field that says `guest`, `paid = false`, or `length = 16`. An overflow that changes
one of those values can unlock a door, skip a payment check, or create a second dangerous
write later. This is why memory corruption is also a data-integrity story, and it can be
quiet enough to survive normal testing. A test suite that only supplies friendly short
inputs can see clean behavior forever. Boundary bugs reveal themselves when input length,
field order, or object reuse violates an assumption that was never written down.

## 6:05–7:15 — Heap 2: a function pointer neighbor

Heap 2 sharpens the target. `x` begins with the bytes for `bico`, but `check_win()` reads
bytes at `x`, interprets them as an address, casts that value to a function pointer, and
calls it. `x` points to heap bytes; the cast treats those bytes as an address; the final
parentheses jump there. That is the bridge from text corruption to control-flow corruption.
Notice what makes this challenge special: `x` is a character pointer at source level, but
the later cast changes its meaning. The CPU does not care that the bytes used to spell a
word. Once code interprets them as an address and calls through that address, their meaning
has changed. This is why nearby pointers, callbacks, virtual tables, and dispatch fields
are such valuable targets in real programs. We do not need to memorize the cast syntax to
understand the result. First the program loads bytes. Next it calls the numeric value those
bytes represent. That later use is the dangerous moment, and it is why the heap map keeps
`x` visible from source, through payload construction, all the way to the call arrow.

## 7:15–8:05 — Find win with provenance

We need a measured number, not a blog-copy number. The locally downloaded non-PIE heap 2
binary reports `00000000004011a0 <win>:` and `00000000004011f0 <check_win>:` from
`objdump -d ./evidence/heap2-chall | grep -E '<win>|<check_win>'`. The destination is
`0x00000000004011a0`. The command stays on screen with its output because provenance
matters. The address is not coming from an animation artist or a remembered writeup. It
comes from this exact downloadable file. The build is non-PIE, so this symbol address is
stable for that ELF. In a position-independent binary, a base address and an additional
leak or calculation would become part of the story. The source and the disassembler answer
different questions. Source tells us why a function exists and how the menu reaches it.
The disassembly tells us where its executable instructions live in this binary. We need
both before a payload can responsibly name a destination.

## 8:05–9:05 — Little endian

Humans write the address from the largest place to the smallest. Little-endian memory
stores the least significant byte first. So the address becomes byte tiles `a0 11 40 00
00 00 00 00`. It is backwards to us and exactly right to the CPU. The low byte, `a0`,
occupies the first byte in memory; `11` follows it; then `40`; then the zero bytes that
complete the 64-bit value. We read a hexadecimal address in a human order. The processor
reconstructs its integer from bytes at increasing memory addresses. That small mismatch is
responsible for many first exploit failures, so the video lets the bytes physically walk
into their storage positions. Keep null bytes in mind as well. A printable terminal line
cannot show them faithfully, but a byte-oriented payload can include them. The animation
uses eight individual cells so the invisible zero bytes remain part of the explanation.

## 9:05–10:18 — Build the exploit

The payload has two parts: 32 filler bytes from the observed heap distance, then the
little-endian address of `win`. A pwntools sketch ties every line to evidence:
`ELF("./chall")` names the binary, `elf.symbols["win"]` resolves the symbol,
`b"A" * 32` uses the measurement, `p64(win)` supplies the bytes, option 2 writes them,
and option 4 calls through `x`. The code is a teaching sketch, not a promise that every
remote instance has the same listener, flag file, address space, or libc. `ELF` gives us a
symbol from the downloaded artifact. The 32 bytes come from the observed heap print. The
packing helper gives the architecture’s byte order. The menu choices follow the normal
program conversation. Those are independent pieces of evidence that line up before we ask
the program to make a dangerous call. If one fact changes, repeat the measurement. Do not
carry an offset across builds, swap an address from a different ELF, or mistake a successful
writeup for proof about a fresh challenge instance.

## 10:18–11:15 — Execution, without a fabricated flag

We choose Write, send the overflow, then choose Print Flag. `x` changes from printable
text into raw pointer bytes, and control flows from `check_win()` to `win()`. This
downloaded binary has no `flag.txt` fixture, so this production intentionally does not
invent a success flag. The proof shown is the actual source, the measured offset, the
real symbol address, and the byte-level call path. The `win` function attempts to open
`flag.txt`, which is exactly what the source tells us. The distribution here deliberately
contains no local flag fixture, so the terminal cannot honestly display a flag. That
absence is not a gap we paper over with fake output. The instructional proof is that the
overwrite places the `win` address where `check_win` reads its callable value. A real CTF
instance would supply the secret file on its challenge host. Ethical video proof means
marking this boundary. The absence of a local secret does not weaken the source-level
explanation; it prevents a teaching animation from claiming an output this machine did not
produce.

## 11:15–12:20 — Stack versus heap

Classic stack overflow often walks upward from a local buffer to a saved return address.
Heap overflow walks sideways from one allocation to its neighbor. The target depends on
who lives next door: a string, a size, a pointer, a callback, or a vtable. The heap is a
neighborhood, not one exploit. On the stack, the landmark is often a saved instruction
pointer. On the heap, the landmark is semantic: whatever the program placed next door and
will trust later. That makes heap work less like memorizing one offset and more like
reading an object graph. First ask what the allocation contains. Then ask which nearby
object matters. Finally, wait for the moment the program turns that object into a decision,
a length, a pointer, or a control-flow destination. This horizontal perspective explains
why two heap overflows can have completely different outcomes. The write may be the same
shape, but the neighbor’s later job determines what the attacker can influence.

## 12:20–13:30 — Heap underflow

Heap underflow here means a write starts from a heap object but reaches before its start.
Overflow crosses the right wall. Underflow crosses the left wall. This is an
animation-only conceptual reconstruction, not output from the picoCTF binary. A negative
index or a pointer moved backward can mutate the previous object and perhaps its metadata.
The direction is the key. An overflow begins valid and walks too far right. An underflow
begins from a shifted pointer or a negative index and walks too far left. Both are
out-of-bounds writes, but their neighbors differ. Because this picoCTF program only
demonstrates the rightward case, the underflow source panel is explicitly pseudo-code. It
teaches the boundary model without pretending the challenge emitted an underflow trace.
Think of the left wall as equally real. If the write address is already one byte before the
returned pointer, the first corruption can happen before the program reaches the object it
thinks it is filling.

## 13:30–14:38 — Underflow causes

The usual shapes are a negative index, pointer arithmetic that moves before the base, and
trusted offset or parser math. The invariant is simple: `base <= write_address < base +
allocation_size`. An underflow is what happens when code never enforces the lower bound. A
signed integer may become negative before it is converted into an index. Pointer arithmetic
may decrement one time too many. A file parser can trust an offset that does not belong to
the current record. These shapes look different in source, but they collapse into the same
address mistake. Code must prove where a write begins, where it ends, and whether both
addresses belong to the allocation it claims to own. This lower-bound proof must happen
before an unsigned conversion, pointer cast, or multiplication hides the negative value.
Otherwise a small logical mistake becomes a large address calculation.

## 14:38–15:55 — Allocator metadata, carefully

Older heap exploitation frequently attacked allocator bookkeeping. Modern allocators add
checks, tcache rules, safe-linking, and consistency validation. The core danger survives:
an out-of-bounds write can corrupt something the program or allocator trusts later. Today’s
case is data and function-pointer corruption, not a full allocator attack. Older tutorials
often jump immediately to corrupting chunk sizes or freelist links. That history is useful,
but modern glibc adds consistency checks, tcache rules, and safe-linking that make many old
recipes crash. A crash is still evidence that a boundary was violated; it is not automatic
proof of an exploit. Our small challenge has a simpler trusted object next door, so we keep
the story precise instead of claiming every metadata flicker becomes arbitrary code. The
later free or malloc is simply another moment when corrupted state may be consumed. In this
episode we choose the more direct and beginner-readable route: show a trusted neighbor
change and then show the program use it.

## 15:55–17:10 — Name the exploit precisely

`malloc` only placed two small objects near one another. The bug is the program’s
unbounded write. The observed 32-byte distance reaches `x`; the later function-pointer
use turns corruption into control flow; `win` is the destination. Source leads to
measurement, measurement to payload, and payload to consequence. This wording keeps the
responsibility in the right place. `malloc` did not overflow anything. It performed two
ordinary allocations. The program then offered an unbounded write into the first returned
pointer. We measured adjacency instead of assuming it. We selected a symbol from the actual
ELF rather than inventing an address. Finally, the program itself decided that the bytes in
`x` were callable. Heap overflow is the bug. Function-pointer overwrite is the strategy.
`win` is the destination. The challenge result is only proof that the model was right.
That chain of custody is useful beyond CTFs. A debugger observation, a source line, a
memory map, and a payload should agree. If they disagree, pause before trying longer input.

## 17:10–18:40 — UAF bridge

Heap 3 adds use-after-free. Its `object` has `a[10]`, `b[10]`, `c[10]`, and `flag[5]`.
The global `x` is freed but never cleared. A pointer survives while the room can be given
to a new tenant. The old key still opens the old address. This is not a write outside a
currently owned room. It is a write after ownership changed. In heap 3, the structure is
thirty-five bytes: ten for `a`, ten for `b`, ten for `c`, and five for the flag string.
The global pointer survives `free(x)`. It is dangling: syntactically present, physically
pointing at an address, but no longer authorized to describe the old object. The allocator
is allowed to reuse that chunk for the next compatible request. Good code treats `free` as
an ownership boundary. The pointer may still contain bits, but those bits no longer grant a
right to read, write, or interpret that storage as the original object.

## 18:40–20:05 — UAF mechanics

Free `x`; allocate the same `sizeof(object)` size; write thirty filler bytes and `pico`.
The allocator can reuse the freed 35-byte chunk. The new allocation wears a new identity,
but the stale `x` still points there, so `check_win()` can see the new data through the old
pointer. A same-size request is important because allocators group allocations by sizes.
After `free(x)`, a later request for `sizeof(object)` can reclaim the same chunk from the
reuse path. We write thirty bytes to occupy `a`, `b`, and `c`, then land `pico` on the
five-byte flag field. The stale pointer has not moved. Its address now refers to the new
allocation’s data. When `check_win` follows `x->flag`, it reads the new tenant through the
old key. That is use-after-free: old handle, newly reused memory, later trusted read. The
allocator is not confused. It is behaving efficiently. The vulnerable program is confused
because it retained a reference past the lifetime it promised to end.

## 20:05–21:20 — Beginner compass

Every heap investigation asks four questions: where does the write start, how far can it
go, what object is nearby, and how will the program use that object later? Heap 1 answers
with a string comparison; heap 2 with a function call; heap 3 with a stale pointer to a
recycled allocation. Treat the four prompts as a compass before you run tools. Where does
input begin? In heap 1 and heap 2, it begins at `input_data`. In heap 3, it begins in a
new allocation that may recycle the old one. How far can it travel? Percent-s has no bound
in the first two challenges; a supplied size and an unbounded read interact in heap 3. What
is nearby? A string, a function-pointer value, or an old global pointer. How will it be
used later? `strcmp`, an indirect call, or a stale field read. That is a reusable way to
turn an unfamiliar heap program into a short list of concrete questions. It also keeps you
from jumping directly to advanced allocator folklore. First identify input, distance,
neighbor, and later trust. Only then decide whether internal allocator details are relevant.

## 21:20–22:25 — Defensive lens

Never write without a bound. Prove both sides of every index: not below zero and not past
the end. Do not use a pointer after `free`; set it to null when ownership is gone, while
recognizing that real fixes depend on clear ownership design. AddressSanitizer makes
invisible boundaries visible during testing. Bounded input means the code knows the size of
the destination. Validated indexing means proving `index >= 0` before any conversion and
proving `index < size` before every access. Clear ownership means knowing who frees an
object and who is allowed to keep a pointer after that moment. Setting a pointer to null is
helpful only when all aliases are handled by a real ownership design; it is not a spell.
AddressSanitizer is valuable because it puts red zones around allocations and reports heap
buffer overflows, heap underflows, and use-after-free during testing. Capture real sanitizer
output when you have it; this video only shows the diagnostic style, not a fake trace.

## 22:25–23:18 — Recap

Overflow walks right. Underflow walks left. Use-after-free keeps the key after moving out.
Different bugs, same truth: bytes obey boundaries only when the program checks them.
Stack, heap, global, local, old object, new object—when the check is missing, a neighbor’s
memory becomes part of your input. `malloc` gave us addresses. The heap print gave us a
distance. The source gave that distance meaning. The disassembly gave us a destination.
Overflow walked right into the next object. Underflow walked left into the previous object.
Use-after-free kept a pointer after the room changed tenants. Different bug families use
different motions, but they all depend on a program trusting memory beyond a boundary or
beyond an ownership lifetime. The heap is not safe because it is dynamic. It is safe only
when its boundaries and its ownership rules are real.

## 23:18–23:45 — Outro

Next time, we can follow the allocator’s freed-chunk footprints, tcache recycling, and the
way a dangling pointer becomes a doorway. Keep the difference between a label and a wall in
your head. A variable name is a label. A pointer is an address. A bound is a check the code
must actually perform. Until then, watch the addresses.
