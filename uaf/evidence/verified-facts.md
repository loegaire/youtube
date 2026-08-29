# Verified local facts

## Artifact

```text
challenge/vuln: ELF 32-bit LSB executable, Intel i386, dynamically linked,
not stripped, with debug info

Arch: i386-32-little
RELRO: Partial RELRO
Stack: Canary found
NX: NX enabled
PIE: No PIE (0x8048000)
```

## Symbols

```text
08048446 T hahaexploitgobrrr
080485c9 T doProcess
080486af T leaveMessage
080489c2 T main
```

## Relevant compiled instructions

```text
080485e3: mov eax,DWORD PTR [eax]
080485e5: call eax

080486e3: push 0x8        ; malloc(8)
080486f3: push 0x8        ; read(..., 8)

080489f4: push 0x4        ; malloc(sizeof(user)) on i386
08048a16: call 80485c9 <doProcess>
```

## Verified local demo

```text
leaked hahaexploitgobrrr: 0x8048446
picoCTF{LOCAL_UAF_DEMO_NOT_A_REAL_FLAG}
```

This is a local educational placeholder. It is not an official challenge flag.
