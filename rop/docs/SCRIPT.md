# Return-Oriented Programming: When the Stack Becomes a Program

Challenge anchor: `picoCTF 2018 / can-you-gets-me`

## 00 · RECAP · 0:00-0:08

**Text is not always just text**

Hello again, hackers. Last time, we learned that text is not always just text.

## 00 · RECAP · 0:08-0:20

**Bytes can become control**

A name can become bytes. Bytes can become numbers. And if those numbers land in the wrong place, they can become control.

## 00 · RECAP · 0:20-0:34

**Control is only the beginning**

But a basic overflow is only the beginning. It gives us the steering wheel. It does not tell us where to drive.

## 00 · RECAP · 0:34-0:48

**Ret2win has one destination**

In a ret2win challenge, the answer is simple. Point the return address at a nice little win function, and the program does the rest for us.

## 00 · RECAP · 0:48-1:04

**Now remove the easy destination**

Today, we take away the easy destination. No win function. No friendly flag function. No clean shortcut waiting in the binary.

## 00 · RECAP · 1:04-1:22

**Many imperfect fragments**

So instead of returning to one perfect function, we return through many imperfect fragments. Tiny pieces of existing code, chained together by the stack.

## 00 · RECAP · 1:22-1:38

**The stack becomes a program**

This is return-oriented programming. ROP. Shellcode brings its own instructions. ROP steals instructions the program already has.

## 01 · THE RETURN MACHINE · 1:38-1:52

**ret is just state change**

Before ROP makes sense, we need to slow down and look at the smallest moving part: the return instruction.

## 01 · THE RETURN MACHINE · 1:52-2:08

**A call stores the way back**

When a function is called, the CPU stores a return address on the stack. That address means: after this function is done, continue here.

## 01 · THE RETURN MACHINE · 2:08-2:26

**ret trusts the stack**

When the function finishes, ret does not perform a ceremony. It does not ask whether the address is safe. It reads the top stack value, removes it, and copies it into EIP.

## 01 · THE RETURN MACHINE · 2:26-2:42

**Valid does not mean intended**

That is the whole rule. Ret trusts the stack. If the stack says return to main, it returns to main. If the stack says return somewhere strange, it still obeys.

## 01 · THE RETURN MACHINE · 2:42-3:00

**The programmer's story breaks**

ROP lives inside that gap. The CPU follows valid rules, but the story those rules create is no longer the programmer's story.

## 02 · THE CHALLENGE · 3:00-3:14

**A tiny bug with no win button**

Our challenge is picoCTF two thousand eighteen, can-you-gets-me. It is a good ROP lesson because the source is tiny, but the exploit is not just a single jump.

## 02 · THE CHALLENGE · 3:14-3:32

**Sixteen bytes and gets**

The vulnerable function is almost comically small. A sixteen byte buffer, a prompt, and gets.

## 02 · THE CHALLENGE · 3:32-3:50

**gets keeps writing**

Gets does not ask how big the destination is. It keeps copying input until the line ends. The buffer can be full, and gets will still keep writing.

## 02 · THE CHALLENGE · 3:50-4:06

**The overflow is the entrance**

So yes, there is still a buffer overflow. But in this episode, the overflow is only the entrance. The real topic is what we put after the entrance.

## 02 · THE CHALLENGE · 4:06-4:24

**Every ret asks what comes next**

The first gadget address becomes the fake return address. After that, every ret keeps asking the stack what comes next.

## 03 · THE WALL · 4:24-4:40

**The tempting shellcode plan**

At this point, the tempting plan is shellcode. Put machine code in the input, jump to the stack, and let the CPU execute our bytes.

## 03 · THE WALL · 4:40-4:58

**Data becomes code only with execute**

That plan depends on one assumption: the stack must be executable. If the CPU is allowed to fetch instructions from the stack, then data becomes code.

## 03 · THE WALL · 4:58-5:16

**NX blocks execution from the stack**

But this binary has NX enabled. Non executable stack. The input can sit there as data, but the CPU cannot run it from there.

## 03 · THE WALL · 5:16-5:34

**Executable memory still exists**

So shellcode is blocked, but code execution is not impossible. NX does not say the CPU cannot execute anything. It says this memory region is not executable.

## 03 · THE WALL · 5:34-5:50

**Reuse what is already executable**

The program's own instructions still live in executable memory. And if we can return into the right tiny instructions, NX has nothing to complain about.

## 04 · GADGETS · 5:50-6:06

**A tiny job, then back to the script**

A gadget is a short sequence of existing instructions that ends in ret. Not because ret is powerful by itself, but because ret gives control back to our stack.

## 04 · GADGETS · 6:06-6:24

**pop loads · ret jumps**

Take pop EAX ret. Pop EAX reads the next four bytes from the stack and puts them into EAX. Then ret reads the next four bytes and jumps there.

## 04 · GADGETS · 6:24-6:42

**Every gadget consumes stack**

So every gadget has two effects. The obvious effect is the instruction, like changing EAX. The hidden effect is stack consumption.

## 04 · GADGETS · 6:42-7:00

**The stack schedules executable fragments**

This is why the stack becomes a program. Not because the stack is executed, but because the stack decides which executable fragment runs next, and what data that fragment receives.

## 04 · GADGETS · 7:00-7:16

**Same bytes · different meaning**

Instead of writing assembly directly, we write a list of addresses and values. Ret and pop interpret that list for us.

## 05 · TARGET STATE · 7:16-7:34

**ROP is building a CPU state**

Now we need the chain to do something useful. For this challenge, the classic goal is to ask Linux to run slash bin slash sh.

## 05 · TARGET STATE · 7:34-7:54

**The syscall ABI is a register contract**

On thirty-two bit Linux, a syscall through int zero eighty uses registers as arguments. EAX chooses the syscall. EBX, ECX, and EDX hold the first three arguments.

## 05 · TARGET STATE · 7:54-8:12

**The final state is precise**

So our desired final state is precise. EAX must be eleven. EBX must point to the string. ECX and EDX must be null.

## 05 · TARGET STATE · 8:12-8:30

**Construct state without new code**

ROP is how we construct that state without writing new code. We need gadgets that load registers, gadgets that write memory, and one final gadget that triggers the syscall.

## 06 · WRITING MEMORY · 8:30-8:48

**A pointer needs something to point at**

The string slash bin slash sh needs to exist somewhere in memory. EBX cannot point to an idea. It needs a real address.

## 06 · WRITING MEMORY · 8:48-9:06

**Write four bytes at a time**

We choose a writable area, like data or BSS. Then the chain writes the string there four bytes at a time.

## 06 · WRITING MEMORY · 9:06-9:24

**The double slash makes clean chunks**

The double slash is not a typo. Slash bin slash slash sh is eight bytes, two clean four-byte chunks, and Linux treats repeated slashes in a path normally.

## 06 · WRITING MEMORY · 9:24-9:44

**The first write is three steps**

The first write is a tiny three-step program. Put slash bin into EAX. Put the writable address into EDX. Then store EAX into memory at EDX.

## 06 · WRITING MEMORY · 9:44-10:02

**A stack slot can be data**

First, ret enters pop EAX ret. Pop consumes the next stack slot. That slot is not an address. It is data for the gadget.

## 06 · WRITING MEMORY · 10:02-10:20

**ret selects the next gadget**

Then the ret at the end of that gadget reads the next address. That address sends execution to pop EDX ret.

## 06 · WRITING MEMORY · 10:20-10:38

**EDX holds the destination**

Pop EDX consumes the writable address. Now EDX is not the string. EDX is the place where the string will be written.

## 06 · WRITING MEMORY · 10:38-10:56

**mov copies bytes into memory**

Finally, mov bracket EDX comma EAX writes the four bytes from EAX into the memory address stored inside EDX.

## 06 · WRITING MEMORY · 10:56-11:12

**Small boring moves compose**

That is the first chunk. Not glamorous, but extremely important. Most real ROP chains are made from small boring moves like this.

## 06 · WRITING MEMORY · 11:12-11:30

**Repeat for the second chunk**

Then we repeat the same pattern for the second chunk. EAX becomes slash slash sh. EDX becomes the writable address plus four.

## 06 · WRITING MEMORY · 11:30-11:48

**C strings end at zero**

And then we write zero after it. C strings do not carry their length around. They end when a zero byte appears.

## 06 · WRITING MEMORY · 11:48-12:04

**Now the string has an address**

Now the string is real. It has an address. EBX can point to it.

## 07 · REGISTER STATE · 12:04-12:20

**The payload becomes assignments**

With the string prepared, the chain changes jobs. It stops writing memory and starts shaping the register state.

## 07 · REGISTER STATE · 12:20-12:38

**EAX selects execve**

EAX needs the syscall number. So we reuse the same kind of gadget: pop EAX ret, followed by the value zero B.

## 07 · REGISTER STATE · 12:38-12:58

**EBX must be a pointer**

EBX needs the address of the filename string. Not the bytes slash bin slash sh themselves, but the address where we wrote those bytes.

## 07 · REGISTER STATE · 12:58-13:18

**ECX and EDX become null**

ECX and EDX represent ARGV and ENVP. For this minimal chain, they can point to zero, or be zero, depending on the gadgets we have.

## 07 · REGISTER STATE · 13:18-13:38

**A multi-pop gadget has an appetite**

Sometimes a useful gadget sets several registers at once. That sounds convenient, but it means the stack must match the gadget's exact appetite.

## 07 · REGISTER STATE · 13:38-13:58

**The CPU follows order, not intent**

If we accidentally place the EBX value first, it goes into EDX. The CPU will not fix our meaning. It only follows order.

## 07 · REGISTER STATE · 13:58-14:18

**Predict the future stack**

This is the discipline of ROP. You are not only choosing gadgets. You are predicting how each gadget will consume the future stack.

## 07 · REGISTER STATE · 14:18-14:30

**Target state reached**

When the setup is finished, the CPU state matches the execve syscall contract.

## 08 · SYSCALL · 14:30-14:46

**The final gadget uses the state**

The final address in the chain points to int zero eighty. This is the moment where the prepared state becomes an operating system request.

## 08 · SYSCALL · 14:46-15:04

**The kernel decodes the registers**

Int zero eighty crosses from user mode into kernel mode. The kernel looks at EAX, sees syscall eleven, and interprets the other registers as execve arguments.

## 08 · SYSCALL · 15:04-15:22

**Execute this program**

And because EBX points at slash bin slash sh, the request becomes: execute this program.

## 08 · SYSCALL · 15:22-15:38

**The name was a return schedule**

The vulnerable program asked for a name. But the bytes we gave it were not a name. They were a return schedule.

## 08 · SYSCALL · 15:38-15:54

**ret keeps asking the same question**

The stack was never executed. The stack simply kept answering the same question: where should ret go next?

## 08 · SYSCALL · 15:54-16:10

**NX blocks injection, not reuse**

That is the strange power of ROP. NX blocks injected code, but it cannot block the program from executing its own code.

## 09 · NOT RET2WIN · 16:10-16:28

**One jump versus a chain**

This is not ret2win. Ret2win is one fake return address pointing to one useful function.

## 09 · NOT RET2WIN · 16:28-16:46

**ROP moves the machine by degrees**

ROP is many fake return addresses, mixed with values, each one moving the machine a little closer to the target state.

## 09 · NOT RET2WIN · 16:46-17:04

**Search for states, not a win function**

Ret2win asks: where is the useful function. ROP asks: what useful machine states can I assemble from the fragments available.

## 09 · NOT RET2WIN · 17:04-17:22

**The stack describes the future**

So the stack stops being a place where functions remember the past, and becomes a place where we describe the future.

## 10 · DEEP IDEA · 17:22-17:42

**Humans see intention · CPUs see state**

When programmers read code, we see functions, names, intentions, and structure. When the CPU runs code, it sees addresses, bytes, registers, and state transitions.

## 10 · DEEP IDEA · 17:42-18:02

**The machine view is lower level**

ROP works because the machine view is lower level than the human story. If a byte sequence is executable and EIP points to it, the CPU will run it.

## 10 · DEEP IDEA · 18:02-18:22

**The CPU is obeying perfectly**

The CPU is not confused. It is obeying perfectly. The exploit is that we changed the data it obeys.

## 10 · DEEP IDEA · 18:22-18:40

**Code execution without code injection**

That is why ROP is such an important idea. It separates code execution from code injection.

## 11 · OUTRO · 18:40-18:58

**The whole chain**

So, the whole chain is this: overflow to control the first return, use gadgets from executable memory, build the register state, and finish with a syscall.

## 11 · OUTRO · 18:58-19:16

**ROP carries order, not instructions**

Shellcode says: let me bring my own instructions. ROP says: your binary already has enough instructions. I only need to choose the order.

## 11 · OUTRO · 19:16-19:32

**One boring instruction, repeated**

And the tiny instruction that makes the whole thing possible is ret. One boring instruction, repeated until the stack becomes a program.

## 11 · OUTRO · 19:32-19:45

**Next: ret2libc**

Next time, we can go one layer deeper: leaking libc, calculating base addresses, and returning into the shared library every C program carries around.

## 11 · OUTRO · 19:45-19:55

**Not code injection · code scheduling**

But for today, remember this: ROP is not putting code on the stack. ROP is using the stack to schedule code that already exists.
