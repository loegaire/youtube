
# How Input Becomes Control

**Challenge:** picoCTF — `buffer overflow 1`
**Target runtime:** 9:10–9:40
**Audience:** Curious beginners who understand that programs contain instructions, but do not yet understand assembly, process memory, or exploitation.

## Visual language

* Off-white: explanations and ordinary labels.
* Light green: ordinary data.
* Blue: CPU activity and instructions.
* Orange: addresses and pointers.
* Red: corrupted or attacker-controlled state.
* Dark gray: inactive or irrelevant machine state.
* Never introduce a visual object before explaining what it represents.
* Keep the mental computer persistent whenever possible: addressable memory above or left, CPU below or right, and a visible instruction pointer.
* Every major movement should represent a state change, transfer, transformation, or causal relationship.

---

## 0:00–0:35 — How can text choose code?

### Visual

A terminal displays:

```text
Please enter your string:
```

The user enters:

```text
hello
```

A simple control-flow line shows:

```text
main → vuln → main
```

Reset.

A long ribbon of `A` characters enters. The route from `vuln` back to `main` bends, fractures, and redirects toward a function labeled `win`.

Freeze immediately before the flag appears.

### Narration

How can typing a long line of text make a computer execute a function that the programmer never called?

At first, that sounds like text somehow turning into code. But that is not quite what happens.

Our input remains ordinary data.

The trick is that, inside a computer, data and the information controlling what happens next are both ultimately stored as numbers.

In this challenge, we will not inject a new program. We will change one number the existing program trusts: the address telling it where to continue.

To see why that is possible, we first need a small computer we can hold in our heads.

---

## 0:35–1:28 — Computation as changing state

### Visual

An empty dark field becomes a horizontal strip of square cells.

```text
0  1  1  0  0  1
      ▲
```

A small mechanical head rests over one cell.

A compact rule card appears:

```text
State A + read 0
→ write 1
→ move right
→ enter state B
```

Execute several steps slowly.

Every operation visibly changes one of three things:

* a tape cell,
* the head position,
* the machine’s current state.

The changed item briefly pulses blue.

### Narration

Imagine the simplest useful picture of computation: a strip of cells, a reader positioned over one cell, and a small collection of rules.

Read a symbol.

Use the current state to choose a rule.

Maybe write a different symbol.

Move.

Change state.

Repeat.

This is a Turing machine.

It is not a diagram of the processor inside your laptop, but it captures an idea that survives every layer of complexity:

A computation is a sequence of precise state changes.

There is no little person inside who understands that a value represents a username, a color, or a return address.

The machine reads patterns, applies rules, and changes its state.

Now let us reshape this model into something closer to the computer we will exploit.

---

## 1:28–2:24 — The mental computer

### Visual

The tape bends, coils, and folds into a rectangular grid of cells.

Binary symbols shrink. Address labels appear beside the cells:

```text
0x1000
0x1001
0x1002
0x1003
```

The Turing-machine head detaches from the grid and transforms into a simple CPU block.

Inside the CPU:

```text
Instruction pointer
Registers
Arithmetic / logic
```

Blue arrows animate reads and writes between CPU and memory.

One memory cell contains an instruction. The instruction pointer points to its address.

### Narration

Instead of reaching memory by moving a head one square at a time, give every byte a numbered address.

Now separate the part that stores values from the part that performs operations.

We will call those memory and the CPU.

Our mental CPU only needs three abilities today.

It can read and write memory.

It has a few tiny, fast storage locations called registers.

And it keeps one especially important number: the instruction pointer.

The instruction pointer is the address of the instruction the CPU is currently executing.

So our mental computer repeatedly does something like this:

Fetch the instruction at the current address.

Execute it, changing registers or memory.

Then choose the address of the next instruction.

Real processors are vastly more sophisticated. Programs also receive a virtual address space rather than owning physical RAM directly.

But this CPU-plus-addressable-memory model is accurate enough to predict our exploit.

---

## 2:24–3:15 — What a running program is

### Visual

A line of C appears:

```c
x = x + 1;
```

It unfolds into a short, intentionally simplified assembly sequence:

```asm
mov eax, [x]
add eax, 1
mov [x], eax
```

The assembly instructions become encoded byte tiles and enter the code region of memory.

The instruction pointer advances through them.

A register changes from `4` to `5`.

The memory cell representing `x` changes from `4` to `5`.

The scene returns to the C line, now connected to its visible effect on machine state.

### Narration

Source code is written for humans.

The CPU does not execute the text “x equals x plus one.”

A compiler translates that intention into machine instructions. Those instructions are encoded as bytes and placed in the program’s address space.

When the program runs, the instruction pointer moves through those instructions.

Each one causes a small state change: load a value, add two numbers, store a result, compare, or jump somewhere else.

This gives us a useful definition:

A running program is not merely a file full of code.

It is code plus a changing machine state.

Exploitation is the game of finding a state the programmer did not intend, but the machine will still obediently process.

---

## 3:15–4:15 — Stack, heap, and function calls

### Visual

The memory grid stretches vertically and becomes a simplified process address space:

```text
Higher addresses

Stack

Unused / mapped space

Heap

Global data

Program instructions

Lower addresses
```

Briefly animate:

```c
malloc(64);
```

A 64-byte allocation appears in the heap. It then fades to dark gray because the heap is not important to this challenge.

Zoom into the stack.

A frame labeled `main` appears.

The CPU executes:

```asm
call vuln
```

An orange return-address tile is placed on the stack.

A new frame labeled `vuln` appears.

### Narration

Programs organize their address space into regions used according to different conventions.

The code region holds instructions.

The heap is commonly used for data whose lifetime the program controls explicitly.

And the stack helps manage active function calls and temporary local data.

The stack is not a magical separate kind of memory. It is ordinary addressed memory used according to a convention.

Suppose `main` is executing and calls `vuln`.

The CPU must begin executing `vuln`, but it also needs to remember where `main` should resume afterward.

So the call operation saves a return address: the address of the instruction immediately after the call.

Then `vuln` receives a stack frame containing its local storage and saved bookkeeping.

When `vuln` finishes, a `ret` instruction retrieves the saved return address and places it into the instruction pointer.

Normally, that makes control return to `main`.

That small orange number is the entire target of this challenge.

---

## 4:15–5:16 — Reading the program

### Visual

The exact source appears in a themed code panel.

First isolate `main`:

```c
int main(int argc, char **argv) {
    setvbuf(stdout, NULL, _IONBF, 0);

    gid_t gid = getegid();
    setresgid(gid, gid, gid);

    puts("Please enter your string: ");
    vuln();
    return 0;
}
```

Mute the challenge-environment setup lines.

Highlight:

```c
puts("Please enter your string: ");
vuln();
```

Morph to:

```c
void vuln() {
    char buf[32];
    gets(buf);

    printf(
        "Okay, time to return... Fingers Crossed... Jumping to 0x%x\n",
        get_return_address()
    );
}
```

Highlight in sequence:

```c
char buf[32];
```

```c
gets(buf);
```

```c
get_return_address()
```

Finally, move `win()` onto the other side of the screen as an unreachable island:

```c
void win() {
    char buf[64];
    FILE *f = fopen("flag.txt", "r");
    ...
    fgets(buf, 64, f);
    printf(buf);
}
```

No arrow points to `win`.

### Narration

Here is the program.

`main` performs some challenge-environment setup, prints a prompt, and calls `vuln`.

Inside `vuln`, the program reserves an array named `buf` with room for thirty-two characters.

Then it calls `gets` and gives it the address of the first byte of that array.

Afterward, the program prints the return address it is about to use.

That helper is not where the vulnerability lives. It is simply a window into the saved control data on the stack.

Finally, elsewhere in the binary is `win`.

It opens `flag.txt`, reads the flag, and prints it.

Normal execution never calls `win`.

So our goal is now precise:

Make the saved return address of `vuln` contain the address of `win`.

---

## 5:16–6:30 — Why `gets` crosses the boundary

### Visual

A 32-cell buffer appears inside the real stack frame.

Cells are grouped visually as bytes:

```text
buf[0] buf[1] ... buf[31]
```

Keyboard bytes enter sequentially:

```text
H E L L O
```

Reset.

A safe-copy comparison appears briefly. A visible counter reaches 32 and closes a barrier at the end of the buffer.

Remove the counter and barrier.

Show the signature:

```c
gets(buf);
```

Emphasize that no capacity argument exists.

A long input enters.

The first 32 bytes turn green.

The 33rd byte crosses the boundary and enters compiler-reserved space.

Additional bytes overwrite padding and saved frame state.

Pause before reaching the return address.

The next byte collides with the orange return-address tile.

Its glow changes from orange to red.

### Narration

The program gives `gets` only one crucial piece of information: where the buffer begins.

It does not give `gets` the number thirty-two.

So `gets` copies the characters it receives into consecutive memory addresses until it reaches a newline or the end of its input.

It has no reliable way to know where this particular array ends.

The first thirty-two bytes fit.

The next bytes still have perfectly valid addresses, so the CPU keeps writing.

They may pass through compiler padding, saved registers, or a saved frame pointer.

The exact layout depends on how this binary was compiled.

Eventually, the writes reach the saved return address.

Notice what has—and has not—been damaged.

We did not overwrite the machine instruction `ret`.

The code containing that instruction lives elsewhere.

We overwrote the data that `ret` will consume.

This distinction is the heart of the exploit.

The instruction remains trustworthy.

Its input does not.

---

## 6:30–7:31 — Asking the real binary

### Visual

Shrink the clean mental model onto the left.

Open a terminal and disassembly panel on the right.

Show the actual commands used during analysis:

```bash
file ./vuln
checksec --file=./vuln
gdb ./vuln
```

Inside GDB:

```gdb
disassemble vuln
disassemble win
```

Show the relevant prologue and epilogue only.

Draw a line from the stack-space reservation instruction to the frame in the mental model.

Draw another line from:

```asm
leave
ret
```

to the frame removal and return-address consumption.

Replace repeated `A` characters with a cyclic, color-coded pattern:

```text
aaaabaaacaaadaaae...
```

Crash the program.

Zoom into the overwritten instruction-pointer value.

Search the pattern and reveal:

```text
offset = [OFFSET]
```

### Narration

Our diagram explains what must happen, but it does not tell us the exact distance from the first byte of `buf` to the saved return address.

We should not guess.

The compiler may insert padding for alignment, and the frame may contain saved state that the C source never names explicitly.

So we interrogate the actual binary.

Its disassembly shows how much stack space `vuln` reserves and how the function returns.

Its security properties tell us whether protections such as a stack canary or position-independent code are present.

Then we send a cyclic pattern instead of identical `A` characters.

Every small window in this pattern is distinctive.

When the program crashes, the value that reached the instruction pointer identifies exactly which part of the input arrived there.

For this binary, that distance is `[OFFSET]` bytes.

Now our clean model and the real machine agree.

---

## 7:31–8:30 — Building the payload

### Visual

Query the verified `win` symbol.

The address appears:

```text
win = [WIN_ADDR]
```

Assemble a payload bar:

```text
[       padding: OFFSET bytes       ][ address of win ]
```

The address of `win` appears as one 32-bit hexadecimal tile.

Split it into four byte tiles.

Rotate the number and reverse the displayed byte order to represent little-endian storage.

Place the four bytes over the saved return-address cells.

Show the corresponding exploit fragment:

```python
payload = flat({
    offset: elf.symbols["win"],
})
```

Optionally show the equivalent:

```python
payload = b"A" * offset + p32(win_address)
```

### Narration

Next, we find the address of the existing `win` function: `[WIN_ADDR]`.

Our payload needs only two parts.

First, `[OFFSET]` bytes of padding.

Their values do not matter. Their job is to carry us from the beginning of `buf` to the saved return-address slot.

Second, the address of `win`.

There is one representation detail.

This binary stores a multi-byte integer in little-endian order, meaning the least significant byte is placed at the lowest address.

Pwntools handles that conversion with `p32`, or more generally with `flat` when the binary context is configured.

So the exploit says:

Place ordinary padding at offset zero.

At offset `[OFFSET]`, place the encoded address of `win`.

Nothing in this payload needs to be executable.

We are redirecting execution to code already present in the program.

---

## 8:30–9:18 — The return

### Visual

Replay the exploit from `gets`, now at greater speed.

The stack fills.

The return address becomes `[WIN_ADDR]`.

The diagnostic output appears:

```text
Okay, time to return...
Jumping to [WIN_ADDR]
```

Display the function epilogue.

Animate `leave` restoring the appropriate stack position.

Animate `ret` removing the red address tile from the stack and inserting it into the instruction pointer.

Follow the instruction pointer across the code map.

It lands at the first instruction of `win`.

`win` opens `flag.txt`.

The flag appears, then dissolves back into the mental-machine diagram.

### Narration

Now run it.

`gets` copies our padding through the buffer and across the intervening stack data.

The final address bytes land exactly where the original return address used to be.

The program even announces the address it is about to trust.

Then `vuln` reaches its epilogue.

The stack frame is dismantled.

`ret` reads the value on top of the stack and installs it as the next instruction address.

But that value no longer points back into `main`.

It points to `win`.

The CPU does not ask whether this destination was intended by the programmer.

It follows the same rule it always follows.

And the flag is printed.

---

## 9:18–9:48 — Data became control

### Visual

Return to the original mental computer.

Build four connected visual objects:

```text
Finite buffer
      ↓
Unbounded write
      ↓
Corrupted address
      ↓
Redirected instruction pointer
```

Do not present these as ordinary bullet points. Each object should be a surviving object from an earlier scene.

The final frame branches toward future topics:

```text
Format strings
ROP
Heap corruption
```

### Narration

The exploit can be compressed into four ideas.

Memory stores both ordinary values and control information.

A function call saves an address describing where execution should continue.

`gets` writes beyond the object it was meant to fill.

And `ret` trusts the corrupted address.

Our text never became machine code.

Data became control because we placed it where the machine expected an address.

That relationship—between representations, memory, and the rules a machine blindly follows—is the game at the center of binary exploitation.

Today we changed one return address.

Later, the same mental computer will let us understand format strings, chains of return addresses, and eventually the much stranger world of the heap.
