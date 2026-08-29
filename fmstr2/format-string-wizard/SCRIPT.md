# Format String Wizard — owner-voice narration

## 00 — The innocent machine

Hello once again, hackers. Today we are pwning a program with the humble print
function. `printf` looks innocent: compile a tiny C file, run it, and `hello world`
comes out. But that output did not happen by magic. Something interpreted a recipe.

## 01 — A print function hides a language

Every language has a way to make numbers human: `print`, `console.log`,
`System.out.println`, `fmt.Println`, `println!`, `puts`. Our target is C's `printf`,
the formatted output function. The word formatted is doing almost all the work here.

## 02 — The crime-scene signature

The man page gives us the whole crime scene in one line: `printf(const char *format,
...)`. One argument is the recipe. The dots are however many extra values that recipe
asks for. Normal letters simply pass through. A percent sign makes `printf` stop being
a typewriter and become an interpreter.

## 03 — Read tokens, consume ingredients

Percent d prints a decimal. Percent x prints hexadecimal. Percent p prints an
address-shaped value. Percent s follows a pointer and reads bytes until a null byte.
Percent c prints one character, double percent prints a literal percent, and widths
such as percent zero eight x change padding. Percent twenty c can add twenty printed
characters while showing only one visible letter. Then percent n does something
different: it writes the printed-character count through a pointer.

## 04 — First argument, special power

That first argument is special. `printf("%s", input)` keeps input as data; even the
string `%x %x %x` is printed literally. But `printf(input)` promotes the same user
bytes into the recipe. The wrong person is now writing the recipe, so the interpreter
starts asking for arguments the programmer never supplied.

## 05 — Meet the wizard gate

Our challenge starts with a global variable named `sus`, equal to `0x21737573`.
It reads a word into `buf`, prints a fixed label safely, and then calls `printf(buf)`.
Finally it opens the wizard gate only if `sus` equals `0x67616c66`. We do not need to
smash the whole program. We only need to change exactly this variable into exactly
that value.

## 06 — Numbers hiding text

The first number is not random. In memory its bytes are seventy-three, seventy-five,
seventy-three, twenty-one: `s u s !`. The target integer looks like `g a l f` when
read left to right, but this is little endian. In memory it becomes sixty-six,
six-c, sixty-one, sixty-seven: `f l a g`. Our question is now mechanical: how can
typed text write these bytes into `sus`?

## 07 — Observe before exploiting

First we run normal input. `hello` prints as hello, and sus stays unchanged. Then we
probe with `%p.%p.%p.%p`. A safe program would print those percent signs literally.
This target prints pointer-looking values instead. That confirms a format string
vulnerability: the format recipe is walking an argument shelf that was never intended
to be exposed.

## 08 — What printf thinks happened

The actual call is just `printf(buf)`. But after reading our percent p tokens,
`printf` behaves as if it saw `printf("%p.%p.%p", arg1, arg2, arg3)`. It is not evil
and it is not random. The recipe requests ingredients; the chef was never given them,
so the machine reads from the places where arguments normally live. Percent p prints
the value. Percent s follows it. Percent n writes through it.

## 09 — Find our own bytes

For control, we find where our input lands in that shelf. We place `ABCDEFGH` and
try slots. At slot fourteen, the target returns `0x4847464544434241`. Flip that
little-endian number into memory order and it spells A through H. So, in this local
run, argument fourteen is the first controlled eight-byte block. Alignment padding
is not the exploit; it makes the recipe read exactly one clean eight-byte address.

## 10 — Find the destination

`sus` is global, so this local non-PIE target exposes it in `.data` at `0x404060`.
Two bytes higher is `0x404062`. We will write the high half, `0x6761`, to `sus + 2`,
then the low half, `0x6c66`, to `sus`. After the first write the bytes begin to look
like flag; after the second, they are exactly flag.

## 11 — Percent n is a counter copy

Percent n does not print the letter n. It takes a pointer and writes the number of
characters printed so far. `printf("hello%n", &count)` leaves count equal to five.
The h modifier makes `%hn` copy only the low two bytes. If our fake argument shelf
contains the address of sus, the same feature becomes our controlled two-byte write.

## 12 — Do not count to a billion

One giant write would require more than one point seven billion printed characters.
That is ridiculous. Instead, split the target: `0x6761` is twenty-six thousand four
hundred sixty-five, and `0x6c66` is twenty-seven thousand seven hundred fifty. The
first count is smaller, and the second is only one thousand two hundred eighty-five
more, so the counter moves naturally upward.

## 13 — Build a tiny printf program

The recipe is `%14$26465c%19$hn%14$1285c%20$hn`. First, a width field pumps the count
to `0x6761`. Slot nineteen contains packed `sus + 2`, so percent h n writes the high
half. Then another width adds `0x0505`. Slot twenty contains packed `sus`, so the
second percent h n writes the low half. The bytes after the recipe are not text for
humans. They are address blocks placed exactly where printf will misread them as
arguments.

## 14 — The branch opens

During the final run, do not imagine twenty-six thousand literal spaces on screen.
Imagine a counter ribbon. It reaches `0x6761`, writes at `sus + 2`, grows by one
thousand two hundred eighty-five, and writes `0x6c66` at sus. The ordinary program
then checks its variable, finds `0x67616c66`, and opens its own win branch. The flag
text here is a demo placeholder, not a claimed live flag.

## 15 — Five boring steps

The payload looks like wizard language, but the mechanism is boring. One: user input
controls the first printf argument. Two: format tokens consume argument slots. Three:
our own bytes appear in those slots. Four: we place the address of sus there. Five:
percent h n writes the counter through that address. Recipes, slots, addresses,
counts, writes.

## 16 — The one-line patch

The fix is almost insulting in how small it is: never let untrusted input become the
format. Replace `printf(buf)` with `printf("%s", buf)`. Feed it the same scary input;
the machine reads one fixed percent s socket, treats the full string as green data,
prints it literally, and leaves sus unchanged.

## 17 — Read, follow, write

When solving these, sort specifiers by what they give you. Percent p and percent x
observe values. Percent s follows a pointer to read a string, if the address is valid.
Percent n, percent h n, and percent h h n write state. Leaks help us locate. Writes
change what the program does.

## 18 — The common misunderstanding

Percent n does not write a number typed inside the format string. It copies the
number of characters printed so far. That is why the large widths exist: they are
counter fuel. Keyboard bytes become a printf recipe; the recipe creates output; the
output creates a counter; then percent h n copies the counter into memory.

## 19 — Positional selection and scanf

The dollar syntax makes this precise. Non-positional tokens walk one shelf slot after
another. `%19$hn` jumps directly to slot nineteen; `%20$hn` jumps to slot twenty.
And because `scanf("%1024s", buf)` stops at whitespace, we do not type literal
spaces. Width specifiers make printf create them for us.

## 20 — Moral

`printf` did not get hacked. It followed the recipe it was given. The bug was letting
the user write that recipe. Safe code makes data become output. Unsafe code lets data
become a recipe, interpretation become memory access, and with percent n, memory
access become memory modification. Fix it with `printf("%s", buf)`. See you in the
next one, hackers.

## 21 — Closing checklist one

Before we leave, replay the exploit as a checklist you could use on the next format
string challenge. First, read the source and find the call site. The dangerous shape
is not merely a percent sign in user input. It is user input becoming the first
argument to printf. Second, run one harmless probe. A sequence such as percent p,
dot, percent p tells you whether the program is interpreting your input or printing it
literally. Third, put an eight-byte marker in the input and scan the positional slots.
When the marker comes back as a hexadecimal value, you know where your own bytes sit
from printf's point of view.

## 22 — Closing checklist two

Fourth, identify the state you actually need to change. In this target, that state is
the global variable sus. The winning comparison asks for one precise integer, and the
byte view reveals that the value spells flag in memory. Fifth, remember that percent n
does not magically write a number typed in the payload. It copies the number of output
characters printed so far through a pointer. Width specifiers are how we steer that
counter. Positional specifiers are how we select the address. Packed bytes in the tail
of the input are how we place that address in a slot.

## 23 — Closing checklist three

For the write itself, choose a size that makes the arithmetic boring. Two halfword
writes are easier to reason about than one giant integer. Write the smaller half first,
then add only the difference before the second write. Watch the byte row after every
operation. If the little-endian bytes say f, l, a, g, the integer comparison will see
the value the branch expects.

## 24 — Closing checklist four

That method is useful because it replaces mystery with observations: inspect the
recipe, leak the shelf, find the marker, locate the target, count carefully, and write
only what the challenge asks for. And the defensive lesson remains tiny. Keep the
format string fixed. Pass untrusted input as data. When the program owns the recipe,
printf is just output again.
