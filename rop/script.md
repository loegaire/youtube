

* dark green-black background
* thin grid lines
* muted mint highlights
* pale yellow current state values
* flat cards, code panels, stack blocks, register panels
* no fantasy portal / skeleton key / magic objects
* but keep the poetic hacker narration and the “stack becomes a script” idea

Below is the **expanded version** of the previous script style, with denser dialogue and much more animation detail.

---

# TITLE

**Return-Oriented Programming: When the Stack Becomes a Program**

Challenge anchor:

```text
picoCTF 2018 / can-you-gets-me
```

Visual identity:

```text
background: #050b08 / almost black green
primary text: off-white
secondary text: gray-green
active highlight: mint
current value: pale yellow
bad / blocked: muted red
return address: muted purple
gadget cards: desaturated orange
```

---

# INTRO

## 0:00-0:08

**dialog** -
hello again, hackers. last time, we learned that text is not always just text.

**animation** -
Dark empty UI. A small mint cursor blinks in the center.

Top-left appears:

```text
00 · RECAP
```

Top-right appears:

```text
picoCTF / MEMORY CORRUPTION
```

A flat input box appears:

```text
USER INPUT
AAAAAAAAAAAA
```

The text starts as ordinary letters. Each `A` slowly splits into:

```text
0x41
01000001
```

Small labels appear underneath:

```text
character
byte
number
```

The camera does not move dramatically; the UI elements slide in cleanly, like a technical dashboard.

---

## 0:08-0:20

**dialog** -
a name can become bytes. bytes can become numbers. and if those numbers land in the wrong place, they can become control.

**animation** -
The `A` bytes flow into a horizontal memory row:

```text
[41][41][41][41][41][41][41][41]
```

The memory row rotates into a vertical stack:

```text
buffer
saved ebp
return address
```

The bytes fill the buffer. Then they keep going.

As they touch `return address`, that slot changes color from gray to muted purple.

Right-side state panel appears:

```text
CURRENT STATE

EIP
0x08048492
```

The return address slot overwrites:

```text
0x08048492
→
0x41414141
```

A thin mint arrow labeled `control flow` snaps off its normal route.

---

## 0:20-0:34

**dialog** -
but a basic overflow is only the beginning. it gives us the steering wheel. it does not tell us where to drive.

**animation** -
The screen divides into two flat panels.

Left panel:

```text
BUG
overflow reaches saved return address
```

Right panel:

```text
QUESTION
what should EIP become?
```

A minimal flow diagram appears:

```text
input bytes
   ↓
saved return address
   ↓
EIP
   ↓
next instruction
```

The `next instruction` box pulses pale yellow.

---

## 0:34-0:48

**dialog** -
in a ret2win challenge, the answer is simple. point the return address at a nice little win function, and the program does the rest for us.

**animation** -
Flat code-map appears:

```text
.text
 ├─ main()
 ├─ vuln()
 ├─ win()
 └─ print_flag()
```

`win()` is highlighted mint.

Payload timeline appears at bottom:

```text
[ padding ][ address of win() ]
```

The saved return address becomes:

```text
0x080485cb
```

The `EIP` arrow points directly to `win()`.

A small caption appears:

```text
one overwrite
one destination
one jump
```

---

## 0:48-1:04

**dialog** -
today, we take away the easy destination. no win function. no friendly flag function. no clean shortcut waiting in the binary.

**animation** -
The same code-map is searched.

A search bar appears:

```text
find: win
```

Result:

```text
no symbol found
```

Search changes:

```text
find: print_flag
```

Result:

```text
no symbol found
```

Search changes:

```text
find: system("/bin/sh")
```

Result:

```text
no direct call found
```

The code-map dims. Only tiny assembly fragments remain visible inside `.text`.

---

## 1:04-1:22

**dialog** -
so instead of returning to one perfect function, we return through many imperfect fragments. tiny pieces of existing code, chained together by the stack.

**animation** -
Small flat gadget cards are extracted from the `.text` panel:

```asm
pop eax
ret
```

```asm
pop edx
ret
```

```asm
mov [edx], eax
ret
```

```asm
int 0x80
```

Each card slides into a vertical list labeled:

```text
GADGET LIBRARY
```

Then a stack appears beside it:

```text
[ gadget address ]
[ data value     ]
[ gadget address ]
[ data value     ]
```

A thin line connects each stack address to a gadget card.

---

## 1:22-1:38

**dialog** -
this is return-oriented programming. rop. shellcode brings its own instructions. rop steals instructions the program already has.

**animation** -
Title card:

```text
RETURN-ORIENTED PROGRAMMING
```

Subtitle:

```text
the stack becomes a program
```

Below, a comparison table animates in:

```text
SHELLCODE
input contains instructions

ROP
input contains addresses
```

The shellcode side shows raw bytes:

```text
31 c0 50 68 ...
```

The ROP side shows:

```text
0x080b81c6
0x0000000b
0x0806f02a
```

The ROP addresses align vertically like a script.

---

# 01 · THE RETURN MACHINE

## 1:38-1:52

**dialog** -
before rop makes sense, we need to slow down and look at the smallest moving part: the return instruction.

**animation** -
Top-left changes:

```text
01 · THE RETURN MACHINE
```

Main title:

```text
ret is just state change
```

Center screen shows one large assembly instruction:

```asm
ret
```

Right-side state panel:

```text
CURRENT STATE

EIP = 0x08048420
ESP = 0xffffd12c
```

Below center, stack top is shown:

```text
ESP →
[ 0x08048492 ]
[ 0xffffd150 ]
[ 0x00000000 ]
```

---

## 1:52-2:08

**dialog** -
when a function is called, the cpu stores a return address on the stack. that address means: after this function is done, continue here.

**animation** -
Code panel appears left:

```c
int main() {
    greet();
    puts("bye");
}
```

The line `greet();` highlights mint.

A small address card appears:

```text
return to puts("bye")
```

It compresses into:

```text
0x08048492
```

The card slides onto the stack.

Stack updates:

```text
ESP →
[ 0x08048492 ]  return address
```

A tiny label appears under the code line:

```text
next instruction after call
```

---

## 2:08-2:26

**dialog** -
when the function finishes, ret does not perform a ceremony. it does not ask whether the address is safe. it reads the top stack value, removes it, and copies it into eip.

**animation** -
The `ret` instruction highlights.

Step labels appear one by one:

```text
1. read [ESP]
2. ESP = ESP + 4
3. EIP = value
```

The value `0x08048492` moves from the top stack slot into the right-side `EIP` field.

State panel changes:

```text
EIP = 0x08048492
ESP = 0xffffd130
```

The top stack slot disappears.

---

## 2:26-2:42

**dialog** -
that is the whole rule. ret trusts the stack. if the stack says return to main, it returns to main. if the stack says return somewhere strange, it still obeys.

**animation** -
The stack top is replaced three times:

```text
0x08048492  normal return
0x080485cb  win function
0x080b81c6  gadget
```

Each value moves into `EIP`.

The UI stamps each transition:

```text
valid state transition
```

Then a warning appears:

```text
valid does not mean intended
```

---

## 2:42-3:00

**dialog** -
rop lives inside that gap. the cpu follows valid rules, but the story those rules create is no longer the programmer's story.

**animation** -
Two paths appear.

Top path:

```text
intended control flow
main → vuln → main
```

Bottom path:

```text
rop control flow
vuln → gadget → gadget → gadget → syscall
```

The top path is a simple straight mint line.

The bottom path is a stepped line moving between small gadget cards.

The word `ret` appears at every step.

---

# 02 · THE CHALLENGE

## 3:00-3:14

**dialog** -
our challenge is picoctf two thousand eighteen, can-you-gets-me. it is a good rop lesson because the source is tiny, but the exploit is not just a single jump.

**animation** -
Top-left:

```text
02 · THE CHALLENGE
```

Main title:

```text
A tiny bug with no win button
```

Terminal-style flat card:

```text
picoCTF 2018
binary exploitation
can-you-gets-me
```

Small metadata pills appear:

```text
32-bit
gets()
NX enabled
PIE disabled
```

---

## 3:14-3:32

**dialog** -
the vulnerable function is almost comically small. a sixteen byte buffer, a prompt, and gets.

**animation** -
Code panel:

```c
void vuln() {
    char buf[16];
    printf("GIVE ME YOUR NAME!\n");
    return gets(buf);
}
```

Each line maps to a visual object:

`char buf[16]` → stack block with `16 bytes`

`printf(...)` → terminal output card:

```text
GIVE ME YOUR NAME!
```

`gets(buf)` → input rail with no length limiter

A red note appears beside `gets`:

```text
no bounds check
```

---

## 3:32-3:50

**dialog** -
gets does not ask how big the destination is. it keeps copying input until the line ends. the buffer can be full, and gets will still keep writing.

**animation** -
Input tape begins:

```text
A A A A A A A A A A A A A A A A
```

Counter above tape:

```text
16 / 16 bytes
```

Buffer fills exactly.

Then more bytes appear:

```text
B B B B
C C C C
```

Counter continues:

```text
20 / 16
24 / 16
```

The extra bytes spill into:

```text
saved ebp
saved return address
```

---

## 3:50-4:06

**dialog** -
so yes, there is still a buffer overflow. but in this episode, the overflow is only the entrance. the real topic is what we put after the entrance.

**animation** -
The buffer block dims.

The overwritten return address and everything after it brighten.

A bracket appears:

```text
payload after saved return address
```

Bottom timeline becomes:

```text
[ padding ][ first gadget ][ value ][ next gadget ][ value ][ next gadget ]
```

The label `padding` is gray. `gadget` is purple. `value` is mint.

---

## 4:06-4:24

**dialog** -
the first gadget address becomes the fake return address. after that, every ret keeps asking the stack what comes next.

**animation** -
The saved return address slot becomes:

```text
0x080b81c6
```

A line connects it to gadget card:

```asm
pop eax
ret
```

After the gadget card, the animation traces back down to the stack:

```text
next stack slot → consumed by pop
next stack slot → next return address
```

A loop marker appears:

```text
ret loop begins
```

---

# 03 · THE WALL: NX

## 4:24-4:40

**dialog** -
at this point, the tempting plan is shellcode. put machine code in the input, jump to the stack, and let the cpu execute our bytes.

**animation** -
Top-left:

```text
03 · THE WALL
```

Main title:

```text
The stack stores bytes, but it is not code
```

Payload mockup appears:

```text
[ padding ][ shellcode bytes ][ jump to stack ]
```

Raw shellcode bytes appear as small blocks:

```text
31 c0 50 68 2f 2f 73 68
```

They sit inside the stack.

An `EIP` arrow points toward them.

---

## 4:40-4:58

**dialog** -
that plan depends on one assumption: the stack must be executable. if the cpu is allowed to fetch instructions from the stack, then data becomes code.

**animation** -
Permission panel appears:

```text
region      read   write   execute
stack       yes    yes     ?
```

The `?` flips between yes and no.

A small diagram shows the CPU fetch cycle:

```text
EIP points somewhere
CPU reads bytes there
CPU decodes them as instructions
```

When `execute = yes`, stack bytes transform into assembly.

---

## 4:58-5:16

**dialog** -
but this binary has nx enabled. non executable stack. the input can sit there as data, but the cpu cannot run it from there.

**animation** -
Checksec card slides in:

```text
CANARY  disabled
NX      enabled
PIE     disabled
```

`NX enabled` expands into:

```text
stack permissions: rw-
```

The `EIP` arrow tries to enter the stack.

It stops at a flat red boundary labeled:

```text
execute permission missing
```

No explosion; just a clean blocked arrow and a red `X`.

---

## 5:16-5:34

**dialog** -
so shellcode is blocked, but code execution is not impossible. nx does not say the cpu cannot execute anything. it says this memory region is not executable.

**animation** -
Full memory map appears:

```text
0x08048000  .text   r-x
0x080ea000  .data   rw-
0xffffd000  stack   rw-
```

`.text r-x` highlights.

`stack rw-` remains blocked.

A caption appears:

```text
use executable memory
not injected stack bytes
```

---

## 5:34-5:50

**dialog** -
the program’s own instructions still live in executable memory. and if we can return into the right tiny instructions, nx has nothing to complain about.

**animation** -
The `EIP` arrow reroutes from stack to `.text`.

Inside `.text`, a gadget card lights up:

```asm
pop eax
ret
```

Permission card:

```text
.text execute: yes
```

The arrow is accepted.

The stack remains visible below, now labeled:

```text
not executed
only read by ret and pop
```

---

# 04 · GADGETS

## 5:50-6:06

**dialog** -
a gadget is a short sequence of existing instructions that ends in ret. not because ret is powerful by itself, but because ret gives control back to our stack.

**animation** -
Top-left:

```text
04 · GADGETS
```

Main title:

```text
A gadget does a tiny job, then returns to the script
```

Assembly list scrolls:

```asm
add esp, 4
pop eax
ret
mov ebx, eax
call edx
pop edx
ret
```

The UI isolates:

```asm
pop eax
ret
```

and cuts it into a card.

---

## 6:06-6:24

**dialog** -
take pop eax ret. pop eax reads the next four bytes from the stack and puts them into eax. then ret reads the next four bytes and jumps there.

**animation** -
Stack snippet:

```text
ESP →
[ 0x0000000b ]  value for eax
[ 0x0806f02a ]  next gadget address
```

Gadget card:

```asm
pop eax
ret
```

Step 1:
`0x0000000b` moves into register panel:

```text
EAX = 0x0000000b
```

Step 2:
`0x0806f02a` moves into:

```text
EIP = 0x0806f02a
```

`ESP` increments twice.

---

## 6:24-6:42

**dialog** -
so every gadget has two effects. the obvious effect is the instruction, like changing eax. the hidden effect is stack consumption.

**animation** -
Two-column card:

```text
visible effect
eax changes

hidden effect
esp moves
```

An ESP pointer moves down the stack:

```text
ESP + 4
ESP + 4
```

The stack slots fade after being consumed.

Caption:

```text
ROP is also stack accounting
```

---

## 6:42-7:00

**dialog** -
this is why the stack becomes a program. not because the stack is executed, but because the stack decides which executable fragment runs next, and what data that fragment receives.

**animation** -
Stack shown left; `.text` gadget library shown right.

Stack:

```text
[ addr: pop eax; ret ]
[ data: 0x0b         ]
[ addr: pop edx; ret ]
[ data: 0x080ea060   ]
```

Arrows:

* address slots point to gadget cards
* data slots point to register assignments

Large centered formula:

```text
stack = schedule + constants
```

---

## 7:00-7:16

**dialog** -
instead of writing assembly directly, we write a list of addresses and values. ret and pop interpret that list for us.

**animation** -
The payload timeline is reinterpreted.

Raw bytes:

```text
c6 81 0b 08 0b 00 00 00 2a f0 06 08
```

transform into annotated chunks:

```text
0x080b81c6  pop eax; ret
0x0000000b  value
0x0806f02a  next gadget
```

A small label appears:

```text
same bytes, different meaning
```

---

# 05 · TARGET STATE: EXECVE

## 7:16-7:34

**dialog** -
now we need the chain to do something useful. for this challenge, the classic goal is to ask linux to run slash bin slash sh.

**animation** -
Top-left:

```text
05 · TARGET STATE
```

Main title:

```text
ROP is building a CPU state
```

Register panel appears:

```text
EAX = ?
EBX = ?
ECX = ?
EDX = ?
```

Below it, target card:

```text
execve("/bin/sh", 0, 0)
```

---

## 7:34-7:54

**dialog** -
on thirty-two bit linux, a syscall through int zero eighty uses registers as arguments. eax chooses the syscall. ebx, ecx, and edx hold the first three arguments.

**animation** -
Flat syscall ABI diagram:

```text
eax → syscall number
ebx → arg1
ecx → arg2
edx → arg3
```

Then it specializes:

```text
eax → 0x0b        execve
ebx → filename    "/bin/sh"
ecx → argv        0
edx → envp        0
```

The values are initially ghosted.

---

## 7:54-8:12

**dialog** -
so our desired final state is precise. eax must be eleven. ebx must point to the string. ecx and edx must be null.

**animation** -
Target state panel fills in pale yellow:

```text
TARGET STATE

EAX = 0x0000000b
EBX = address of "/bin/sh"
ECX = 0x00000000
EDX = 0x00000000
NEXT = int 0x80
```

Each line gets a small checkbox, all empty.

---

## 8:12-8:30

**dialog** -
rop is how we construct that state without writing new code. we need gadgets that load registers, gadgets that write memory, and one final gadget that triggers the syscall.

**animation** -
Three gadget categories appear:

```text
load register
pop eax; ret

write memory
mov [edx], eax; ret

syscall
int 0x80
```

They align under the target state checklist.

A dependency graph appears:

```text
write string first
then point ebx at it
then syscall
```

---

# 06 · WRITING "/BIN//SH"

## 8:30-8:48

**dialog** -
the string slash bin slash sh needs to exist somewhere in memory. ebx cannot point to an idea. it needs a real address.

**animation** -
Top-left:

```text
06 · WRITING MEMORY
```

Main title:

```text
A pointer needs something to point at
```

`EBX` box tries to point at floating text:

```text
"/bin/sh"
```

The pointer line is dotted and marked:

```text
not in memory yet
```

Writable memory row appears:

```text
0x080ea060: __ __ __ __ __ __ __ __ __ __ __ __
```

---

## 8:48-9:06

**dialog** -
we choose a writable area, like data or bss. then the chain writes the string there four bytes at a time.

**animation** -
Memory map:

```text
.text   r-x
.data   rw-
.bss    rw-
stack   rw-
```

`.bss` or `.data` highlights mint.

Address label:

```text
chosen writable address
0x080ea060
```

String splits:

```text
/bin//sh\0
```

into:

```text
"/bin"  "//sh"  "\0\0\0\0"
```

Each chunk becomes a flat value card.

---

## 9:06-9:24

**dialog** -
the double slash is not a typo. slash bin slash slash sh is eight bytes, two clean four-byte chunks, and linux treats repeated slashes in a path normally.

**animation** -
Comparison card:

```text
/bin/sh
7 bytes
awkward final chunk
```

flips to:

```text
/bin//sh
8 bytes
clean 4 + 4 split
```

Chunk boxes align perfectly with memory cells:

```text
[ / b i n ][ / / s h ][ 00 00 00 00 ]
```

---

## 9:24-9:44

**dialog** -
the first write is a tiny three-step program. put slash bin into eax. put the writable address into edx. then store eax into memory at edx.

**animation** -
ROP chain snippet appears:

```text
pop eax; ret
"/bin"
pop edx; ret
0x080ea060
mov [edx], eax; ret
```

Beside it, a three-step checklist:

```text
1. eax = "/bin"
2. edx = destination
3. [edx] = eax
```

All unchecked.

---

## 9:44-10:02

**dialog** -
first, ret enters pop eax ret. pop consumes the next stack slot. that slot is not an address. it is data for the gadget.

**animation** -
`EIP` becomes address of `pop eax; ret`.

Gadget card highlights.

Stack:

```text
ESP →
[ "/bin"        ]  consumed by pop eax
[ pop edx; ret  ]  next return target
```

`"/bin"` moves into `EAX`.

Register panel:

```text
EAX = 0x6e69622f
```

Decoded label:

```text
"/bin"
```

Checklist item 1 fills.

---

## 10:02-10:20

**dialog** -
then the ret at the end of that gadget reads the next address. that address sends execution to pop edx ret.

**animation** -
The next stack slot `pop edx; ret` moves into `EIP`.

State panel updates:

```text
EIP = 0x0806f02a
ESP = next slot
```

A thin line connects the address to the `pop edx; ret` gadget card in `.text`.

---

## 10:20-10:38

**dialog** -
pop edx consumes the writable address. now edx is not the string. edx is the place where the string will be written.

**animation** -
Stack:

```text
ESP →
[ 0x080ea060 ]  consumed by pop edx
[ mov [edx], eax; ret ]
```

`0x080ea060` moves into `EDX`.

A pointer line from `EDX` lands on the memory row:

```text
0x080ea060: __ __ __ __
```

Checklist item 2 fills.

---

## 10:38-10:56

**dialog** -
finally, mov bracket edx comma eax writes the four bytes from eax into the memory address stored inside edx.

**animation** -
Gadget card:

```asm
mov [edx], eax
ret
```

Highlight `edx` in the instruction and highlight the `EDX` register.

Highlight `eax` and `EAX`.

Then move the bytes:

```text
EAX: / b i n
```

into memory:

```text
0x080ea060: / b i n
```

Checklist item 3 fills.

---

## 10:56-11:12

**dialog** -
that is the first chunk. not glamorous, but extremely important. most real rop chains are made from small boring moves like this.

**animation** -
The three-step mini-chain compresses into one labeled block:

```text
WRITE 4 BYTES
```

Under it:

```text
[edx] = eax
```

The memory row now shows:

```text
0x080ea060: / b i n __ __ __ __
```

---

## 11:12-11:30

**dialog** -
then we repeat the same pattern for the second chunk. eax becomes slash slash sh. edx becomes the writable address plus four.

**animation** -
Second chain snippet appears:

```text
pop eax; ret
"//sh"
pop edx; ret
0x080ea064
mov [edx], eax; ret
```

Quick animation:

* `EAX = "//sh"`
* `EDX = 0x080ea064`
* memory at `0x080ea064` fills

Memory row becomes:

```text
0x080ea060: / b i n / / s h
```

---

## 11:30-11:48

**dialog** -
and then we write zero after it. c strings do not carry their length around. they end when a zero byte appears.

**animation** -
String interpretation panel appears:

```text
memory scan starts at 0x080ea060
read byte
read byte
read byte
...
stop at 00
```

Before terminator:

```text
/bin//sh?????
```

Then third mini-chain writes:

```text
00 00 00 00
```

Memory becomes:

```text
0x080ea060: / b i n / / s h 00 00 00 00
```

---

## 11:48-12:04

**dialog** -
now the string is real. it has an address. ebx can point to it.

**animation** -
The floating text `"/bin/sh"` disappears.

Only memory remains:

```text
0x080ea060 → "/bin//sh\0"
```

`EBX` pointer line becomes solid.

Target checklist updates:

```text
string in memory ✓
```

---

# 07 · SETTING THE REGISTERS

## 12:04-12:20

**dialog** -
with the string prepared, the chain changes jobs. it stops writing memory and starts shaping the register state.

**animation** -
Top-left:

```text
07 · REGISTER STATE
```

Main title:

```text
The payload becomes register assignments
```

Register panel returns:

```text
EAX = ?
EBX = ?
ECX = ?
EDX = ?
```

Target state remains faintly visible behind it.

---

## 12:20-12:38

**dialog** -
eax needs the syscall number. so we reuse the same kind of gadget: pop eax ret, followed by the value zero b.

**animation** -
Stack snippet:

```text
pop eax; ret
0x0000000b
```

`0x0000000b` moves into `EAX`.

Register panel:

```text
EAX = 0x0000000b
```

A small label appears:

```text
11 decimal = execve
```

Checklist:

```text
eax ✓
```

---

## 12:38-12:58

**dialog** -
ebx needs the address of the filename string. not the bytes slash bin slash sh themselves, but the address where we wrote those bytes.

**animation** -
Two wrong/right cards appear.

Wrong:

```text
EBX = "/bin//sh"
```

marked red:

```text
not a pointer
```

Right:

```text
EBX = 0x080ea060
```

marked mint:

```text
points to string
```

`EBX` draws a pointer to the memory row.

Checklist:

```text
ebx ✓
```

---

## 12:58-13:18

**dialog** -
ecx and edx represent argv and envp. for this minimal chain, they can point to zero, or be zero, depending on the gadgets we have.

**animation** -
Zero area after the string highlights:

```text
0x080ea068: 00 00 00 00
```

Both `ECX` and `EDX` point there.

Register panel:

```text
ECX = 0x080ea068 → 0
EDX = 0x080ea068 → 0
```

Small note:

```text
null pointer area
```

Checklist:

```text
ecx ✓
edx ✓
```

---

## 13:18-13:38

**dialog** -
sometimes a useful gadget sets several registers at once. that sounds convenient, but it means the stack must match the gadget’s exact appetite.

**animation** -
Gadget card appears:

```asm
pop edx
pop ecx
pop ebx
ret
```

Under it, three slots animate:

```text
first stack value  → edx
second stack value → ecx
third stack value  → ebx
```

The word `appetite` is visualized only as clean input sockets, not cartoon food.

---

## 13:38-13:58

**dialog** -
if we accidentally place the ebx value first, it goes into edx. the cpu will not fix our meaning. it only follows order.

**animation** -
Wrong stack order:

```text
0x080ea060  ; wanted ebx
0x080ea068  ; wanted ecx
0x080ea068  ; wanted edx
```

Animation runs:

* first value goes to `EDX`
* red warning:

```text
EDX received filename pointer
wrong state
```

Then rewind.

Correct order:

```text
0x080ea068  ; edx
0x080ea068  ; ecx
0x080ea060  ; ebx
```

Runs again, all green.

---

## 13:58-14:16

**dialog** -
this is the discipline of rop. you are not only choosing gadgets. you are predicting how each gadget will consume the future stack.

**animation** -
A vertical payload scroll appears with consumption markers:

```text
[ gadget address ]  used by ret
[ value          ]  used by pop
[ value          ]  used by pop
[ value          ]  used by pop
[ next gadget    ]  used by ret
```

`ESP` pointer moves down one slot at a time.

A caption:

```text
execution is controlled by consumption
```

---

## 14:16-14:30

**dialog** -
when the setup is finished, the cpu state matches the execve syscall contract.

**animation** -
Final register panel:

```text
EAX = 0x0000000b
EBX = 0x080ea060 → "/bin//sh"
ECX = 0x080ea068 → 0
EDX = 0x080ea068 → 0
```

Target state card overlays behind it and aligns perfectly.

A stamp appears:

```text
TARGET STATE REACHED
```

---

# 08 · THE FINAL RETURN

## 14:30-14:46

**dialog** -
the final address in the chain points to int zero eighty. this is the moment where the prepared state becomes an operating system request.

**animation** -
Top-left:

```text
08 · SYSCALL
```

Main title:

```text
The last gadget uses the state we built
```

Stack final slot:

```text
0x08049563  int 0x80
```

It moves into `EIP`.

Code card appears:

```asm
int 0x80
```

---

## 14:46-15:04

**dialog** -
int zero eighty crosses from user mode into kernel mode. the kernel looks at eax, sees syscall eleven, and interprets the other registers as execve arguments.

**animation** -
Flat boundary line appears:

```text
USER MODE
────────────────
KERNEL MODE
```

`int 0x80` sits on the line.

Four register values slide into a syscall decoder panel:

```text
eax = 0x0b        → execve
ebx = 0x080ea060  → filename
ecx = 0x080ea068  → argv
edx = 0x080ea068  → envp
```

---

## 15:04-15:22

**dialog** -
and because ebx points at slash bin slash sh, the request becomes: execute this program.

**animation** -
Memory row expands:

```text
0x080ea060: / b i n / / s h 00
```

Decoder resolves:

```text
filename = "/bin//sh"
```

Then normalized display:

```text
execve("/bin/sh", 0, 0)
```

The syscall panel turns mint.

---

## 15:22-15:38

**dialog** -
the vulnerable program asked for a name. but the bytes we gave it were not a name. they were a return schedule.

**animation** -
Terminal prompt:

```text
GIVE ME YOUR NAME!
```

Below it, payload is classified:

```text
AAAA...AAAA        padding
0x080b81c6         first gadget
0x6e69622f         "/bin"
0x0806f02a         next gadget
...
```

The label `name` fades out.

New label:

```text
control-flow script
```

---

## 15:38-15:54

**dialog** -
the stack was never executed. the stack simply kept answering the same question: where should ret go next?

**animation** -
Loop diagram returns:

```text
ret asks stack
stack gives gadget
gadget changes state
ret asks stack again
```

The loop runs three times quickly, with different highlighted gadgets.

Right-side state panel updates each time:

* `EAX` changes
* `EDX` changes
* memory changes
* `EIP` changes

---

## 15:54-16:10

**dialog** -
that is the strange power of rop. nx blocks injected code, but it cannot block the program from executing its own code.

**animation** -
Comparison appears again:

```text
shellcode path
EIP → stack rw-    blocked

rop path
EIP → .text r-x    allowed
```

The ROP path animates cleanly through `.text`.

The stack is labeled:

```text
data source
not instruction source
```

---

# 09 · WHY THIS IS NOT RET2WIN

## 16:10-16:28

**dialog** -
this is not ret2win. ret2win is one fake return address pointing to one useful function.

**animation** -
Top-left:

```text
09 · NOT RET2WIN
```

Main title:

```text
One jump versus a chain of state changes
```

Left panel:

```text
RET2WIN

[ padding ]
[ win()   ]
```

One arrow:

```text
ret → win()
```

---

## 16:28-16:46

**dialog** -
rop is many fake return addresses, mixed with values, each one moving the machine a little closer to the target state.

**animation** -
Right panel:

```text
ROP

[ padding          ]
[ pop eax; ret     ]
[ 0x0b             ]
[ pop edx; ret     ]
[ writable address ]
[ mov [edx], eax   ]
[ ...              ]
[ int 0x80         ]
```

Multiple arrows step down the chain.

Each step updates a small state diff:

```text
EAX changed
memory changed
EDX changed
EIP changed
```

---

## 16:46-17:04

**dialog** -
ret2win asks: where is the useful function. rop asks: what useful machine states can i assemble from the fragments available.

**animation** -
Question cards:

```text
RET2WIN QUESTION
where is win()?
```

```text
ROP QUESTION
which gadgets let me build the state?
```

The ROP side opens a gadget search panel:

```text
need: load eax
found: pop eax; ret

need: write memory
found: mov [edx], eax; ret

need: syscall
found: int 0x80
```

---

## 17:04-17:22

**dialog** -
so the stack stops being a place where functions remember the past, and becomes a place where we describe the future.

**animation** -
Stack initially labeled:

```text
call history
```

Slots:

```text
return to main
return to caller
```

Then it transforms into:

```text
execution plan
```

Slots:

```text
set eax
write string
set ebx
syscall
```

The transformation is clean and flat: labels slide, colors shift, no fantasy effects.

---

# 10 · DEEP IDEA

## 17:22-17:42

**dialog** -
when programmers read code, we see functions, names, intentions, and structure. when the cpu runs code, it sees addresses, bytes, registers, and state transitions.

**animation** -
Split view.

Left:

```c
vuln();
return;
```

Labels:

```text
human view
function
intent
source structure
```

Right:

```asm
8048420: call 80483f0
8048425: add esp, 4
8048428: ret
```

Labels:

```text
machine view
address
bytes
state change
```

The right side gradually takes over the screen.

---

## 17:42-18:02

**dialog** -
rop works because the machine view is lower level than the human story. if a byte sequence is executable and eip points to it, the cpu will run it.

**animation** -
State rule card:

```text
IF memory[EIP] is executable:
    decode instruction
    update state
```

Then:

```text
ret:
    EIP = stack_top
    ESP = ESP + 4
```

These two rules combine into:

```text
stack controls next executable address
```

The combined statement highlights mint.

---

## 18:02-18:22

**dialog** -
the cpu is not confused. it is obeying perfectly. the exploit is that we changed the data it obeys.

**animation** -
The state panel updates deterministically:

```text
before:
ESP → 0x080b81c6
EIP = ret

after:
EIP = 0x080b81c6
```

A stamp appears:

```text
correct transition
```

Then another:

```text
unintended source
```

The two stamps sit side by side.

---

## 18:22-18:40

**dialog** -
that is why rop is such an important idea. it separates code execution from code injection.

**animation** -
Final conceptual table:

```text
code injection
bring new instructions

code reuse
reorder existing instructions
```

`code reuse` is highlighted.

Under it:

```text
ROP = return-driven code reuse
```

---

# OUTRO

## 18:40-18:58

**dialog** -
so, the whole chain is this: overflow to control the first return, use gadgets from executable memory, build the register state, and finish with a syscall.

**animation** -
Four-step summary appears:

```text
1. overflow reaches saved return address
2. ret enters first gadget
3. gadgets build memory and registers
4. int 0x80 asks kernel for execve
```

Each step animates with a tiny corresponding model:

* stack overwrite
* gadget card
* register panel
* syscall decoder

---

## 18:58-19:16

**dialog** -
shellcode says: let me bring my own instructions. rop says: your binary already has enough instructions. i only need to choose the order.

**animation** -
Final comparison:

```text
SHELLCODE
instructions in payload

ROP
order in payload
```

The word `order` expands into the vertical ROP chain.

---

## 19:16-19:32

**dialog** -
and the tiny instruction that makes the whole thing possible is ret. one boring instruction, repeated until the stack becomes a program.

**animation** -
Minimal final visual:

```text
ret
ret
ret
ret
int 0x80
```

Each `ret` is a flat card connected by a thin mint line.

Below:

```text
the stack becomes the program
```

---

## 19:32-19:45

**dialog** -
next time, we can go one layer deeper: leaking libc, calculating base addresses, and returning into the shared library every c program carries around.

**animation** -
Memory map expands:

```text
binary .text
binary .data
libc .text
stack
```

A pointer leak appears:

```text
puts@libc = 0xf7e5f140
```

Then:

```text
libc base = leak - offset
```

Preview card:

```text
NEXT: ret2libc
```

---

## 19:45-19:55

**dialog** -
but for today, remember this: rop is not putting code on the stack. rop is using the stack to schedule code that already exists.

**animation** -
Final title card:

```text
ROP
Return-Oriented Programming
```

Subtitle:

```text
not code injection
code scheduling
```

Terminal at bottom:

```text
$ exit
```

Cursor blinks once. Cut to black.
