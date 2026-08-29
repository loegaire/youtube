# UAF — Dialogue and animation script

**Target:** 2:46.458, 16:9, 24 fps.  
**Challenge:** PicoCTF 2021 “Unsubscriptions Are Free,” using a source-matched local teaching rebuild. The only flag ever pictured is an explicit local placeholder.

| Time | Dialogue | Independent scene animation |
| --- | --- | --- |
| 00:00–00:17 | “Hello again, hackers. Before we name the bug, picture a program’s memory as a wall of numbered spaces. A value can live in one space. The number written on its door is an address. Everything else in this story follows from that.” | A wall of numbered memory cells behaves like a coordinate grid: one cell receives a value, its address lights up, then the cell and address separate into two concepts. |
| 00:17–00:32 | “An address is not the value. It is a direction: go to this location. A pointer is just a variable holding that direction. Copy the pointer, and you have copied the direction, not duplicated the thing it reaches.” | A street-map diagram isolates one coordinate. Two distinct arrows write the same address onto separate notes; both route to one distant mailbox without duplicating it. |
| 00:32–00:50 | “On the heap, programs ask for a fresh patch of storage, then build an object inside it. This challenge calls that object user. It contains two directions: one to a function, and one to a name.” | A warehouse floor opens a requested patch. A `user` shape assembles from two field slots, then sends its two different address vectors outward. |
| 00:50–01:06 | “Some objects have a lifetime: they are created, used, and eventually released. Free says the program has finished with that storage. It does not magically erase every copied pointer elsewhere. Those directions can outlive the object they meant to reach.” | A timeline grows from `created` to `used` to `released`. The object disappears at release while a separate direction-card remains, visibly detached from its former destination. |
| 01:06–01:22 | “Now we earn the real challenge. The local source defines cmd with a function pointer named whatToDo followed by a username pointer. The program’s menu chooses whatToDo, then doProcess calls whichever function address sits in the first field.” | Actual local source is scanned from the complete `cmd` definition into a measured field close-up. A menu selector moves only the first field, then a real `doProcess` line is traced. |
| 01:22–01:39 | “That indirect call is ordinary behavior. Pick Subscribe, and the first field holds s. doProcess reads that field, then calls s. The surprise is not the instruction. The surprise is allowing the same memory to later mean something else.” | A calm relay machine sends the selection through `whatToDo` to `s()`. The active route is then frozen as the cell’s label starts to change. |
| 01:39–01:57 | “Delete is the lifetime mistake. It runs free on user, but user is not cleared. The main loop keeps the old direction. The program has released the storage, yet still believes that old address names a live command object.” | A tall ownership ledger marks the `user` record released. A nearby reference ribbon is deliberately not removed and tries to pass a validity gate. |
| 01:57–02:13 | “Later, Leave a message asks for eight bytes. The allocator is allowed to reuse compatible freed storage. If it returns the old user space, the message and the stale user pointer describe the same bytes from two different stories.” | A ticket sorter matches the released eight-byte slot to a new eight-byte message request. A single serial number appears under both labels without transporting any prior scene object. |
| 02:13–02:30 | “Writing the message changes bytes the old pointer reads as a command. Four bytes become the function destination. The next four fill the second field. When doProcess runs again, stale data sends control to the challenge function.” | A byte loom writes eight cells in two groups. A split lens shows one group as message data and, simultaneously, as the old struct’s first field; an instruction theater routes to the local challenge function. |
| 02:30–02:46 | “That is use-after-free: use happens after the object’s lifetime ends. The repair is architectural: retire every owner after free, use clear lifetime rules, and validate before indirect use. Make addresses and ownership tell the same story.” | An ownership ledger closes entries after release, then a gate rejects an invalid dispatch. The scene resolves into a three-part invariant: lifetime, ownership, validation. |

## Spoken voice contract

- Exact first words: “Hello again, hackers.”
- Voice reference: parent-directory `../voice.m4a`, conditionally cloned by local Chatterbox-Turbo.
- The `espeak-ng` fallback is rejected and must not be used in the replacement master.
- Target delivery: natural owner-voice cadence with no tempo multiplier outside 0.94–1.08.

## Exact technical anchors

- `cmd` begins with `whatToDo` and `username` in `challenge/vuln.c` lines 12–15.
- `doProcess` executes the first field in lines 58–60 and compiles to `mov eax, [eax]` followed by `call eax`.
- `i()` frees `user` at line 88 without clearing it.
- `leaveMessage()` requests and reads eight bytes at lines 75–80.
- `main()` calls `doProcess(user)` after each menu action at lines 141–149.
