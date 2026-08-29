# Motion map — foundational UAF model

| Beat | Building block | Independent composition | Causal operation | Result |
| --- | --- | --- | --- | --- |
| 00 | Memory | Numbered-cell wall | Write a value, then isolate its address | Address and value are distinct |
| 01 | Pointer | Street coordinate map | Duplicate a direction, not the mailbox | Two pointers can name one object |
| 02 | Heap object | Warehouse allocation floor | Allocate a patch and assemble two fields | `user` has a function and a name direction |
| 03 | Lifetime | Horizontal lifetime timeline | Release the object while leaving a copied direction | A pointer can outlive an object |
| 04 | Provenance | Full local source to field close-up | Scan exact source and trace `doProcess` | Challenge structure is source-backed |
| 05 | Normal dispatch | Relay machine | Menu sets a function pointer; call follows it | Indirect calls are ordinary |
| 06 | Dangling reference | Ownership ledger | `free(user)` closes ownership but an old reference remains | The mismatch is visible |
| 07 | Reuse | Eight-byte ticket sorter | Match a freed slot with a compatible request | Two stories name one storage slot |
| 08 | Reinterpretation | Byte loom and instruction theater | Write bytes, reinterpret the first field, dispatch | The stale use changes control flow |
| 09 | Repair | Ledger plus gate | Retire ownership and reject invalid use | Lifetime, ownership, and validation agree |

Each composition begins and ends within its own scene. No visual object or diagram crosses a cut; only the causal idea carries forward.
