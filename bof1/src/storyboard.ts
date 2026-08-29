export type SceneKind =
  | 'terminal'
  | 'machine'
  | 'memory'
  | 'program'
  | 'stack'
  | 'code'
  | 'overflow'
  | 'analysis'
  | 'payload'
  | 'return'
  | 'recap';

export type AccentName = 'green' | 'mint' | 'amber' | 'coral' | 'neutral';

export interface StoryScene {
  id: string;
  chapter: string;
  title: string;
  duration: number;
  kind: SceneKind;
  variation: string;
  accent: AccentName;
  headline: string;
  detail: string;
  code?: string[];
  values?: string[];
  camera?: 'wide' | 'push' | 'pan-left' | 'pan-right' | 'tilt';
}

export const STORY: StoryScene[] = [
  {id: '00a', chapter: '00 · THE QUESTION', title: 'A harmless prompt', duration: 15, kind: 'terminal', variation: 'prompt', accent: 'green', headline: 'Please enter your string:', detail: 'hello', camera: 'push'},
  {id: '00b', chapter: '00 · THE QUESTION', title: 'When the input keeps going', duration: 14, kind: 'terminal', variation: 'long-input', accent: 'coral', headline: 'ordinary text', detail: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', camera: 'pan-left'},
  {id: '00c', chapter: '00 · THE QUESTION', title: 'One trusted number changes', duration: 15, kind: 'terminal', variation: 'redirect', accent: 'amber', headline: 'saved return address', detail: '0x080491f6', values: ['main', 'vuln', 'win'], camera: 'pan-right'},

  {id: '01a', chapter: '01 · A TINY MACHINE', title: 'Begin with a strip of cells', duration: 13, kind: 'machine', variation: 'birth', accent: 'green', headline: '0  1  1  0  0  1', detail: 'a reader rests over one cell', camera: 'wide'},
  {id: '01b', chapter: '01 · A TINY MACHINE', title: 'Read one symbol', duration: 13, kind: 'machine', variation: 'read', accent: 'mint', headline: 'STATE A  +  READ 0', detail: 'choose exactly one rule', values: ['READ', 'MATCH', 'RULE 04'], camera: 'push'},
  {id: '01c', chapter: '01 · A TINY MACHINE', title: 'Write, move, change state', duration: 13, kind: 'machine', variation: 'update', accent: 'amber', headline: '0 → 1', detail: 'head +1  ·  state A → B', values: ['WRITE 1', 'MOVE RIGHT', 'ENTER B'], camera: 'pan-right'},
  {id: '01d', chapter: '01 · A TINY MACHINE', title: 'Computation is precise state change', duration: 13, kind: 'machine', variation: 'repeat', accent: 'green', headline: 'read → rule → change', detail: 'meaning is not required', camera: 'tilt'},

  {id: '02a', chapter: '02 · THE MENTAL COMPUTER', title: 'Give every byte an address', duration: 15, kind: 'memory', variation: 'addresses', accent: 'amber', headline: '0x1000  0x1001  0x1002  0x1003', detail: 'direct access replaces walking cell by cell', camera: 'push'},
  {id: '02b', chapter: '02 · THE MENTAL COMPUTER', title: 'Separate storage from action', duration: 15, kind: 'memory', variation: 'cpu-split', accent: 'mint', headline: 'MEMORY  ↔  CPU', detail: 'reads and writes cross the bus', values: ['MEMORY', 'CPU', 'BUS'], camera: 'pan-right'},
  {id: '02c', chapter: '02 · THE MENTAL COMPUTER', title: 'Keep the next instruction address', duration: 16, kind: 'memory', variation: 'ip', accent: 'amber', headline: 'instruction pointer', detail: '0x1002', values: ['REGISTERS', 'ARITHMETIC / LOGIC', 'INSTRUCTION POINTER'], camera: 'push'},
  {id: '02d', chapter: '02 · THE MENTAL COMPUTER', title: 'Fetch, execute, choose again', duration: 16, kind: 'memory', variation: 'fetch-loop', accent: 'mint', headline: 'FETCH → EXECUTE → NEXT ADDRESS', detail: 'the pointer advances through memory', camera: 'pan-left'},

  {id: '03a', chapter: '03 · A RUNNING PROGRAM', title: 'Source code states an intention', duration: 12, kind: 'program', variation: 'source', accent: 'green', headline: 'x = x + 1;', detail: 'written for humans', camera: 'push'},
  {id: '03b', chapter: '03 · A RUNNING PROGRAM', title: 'The compiler makes instructions', duration: 12, kind: 'program', variation: 'compile', accent: 'mint', headline: 'source → assembly', detail: 'one intention becomes several operations', code: ['mov eax, [x]', 'add eax, 1', 'mov [x], eax'], camera: 'pan-right'},
  {id: '03c', chapter: '03 · A RUNNING PROGRAM', title: 'Instructions become bytes', duration: 12, kind: 'program', variation: 'bytes', accent: 'amber', headline: 'A1 00 10 40 00', detail: '83 C0 01  ·  A3 00 10 40 00', values: ['A1', '00', '10', '40', '83', 'C0', '01'], camera: 'push'},
  {id: '03d', chapter: '03 · A RUNNING PROGRAM', title: 'Code plus changing machine state', duration: 13, kind: 'program', variation: 'execute', accent: 'green', headline: 'register: 4 → 5', detail: 'memory[x]: 4 → 5', values: ['LOAD', 'ADD', 'STORE'], camera: 'tilt'},

  {id: '04a', chapter: '04 · FUNCTION CALLS', title: 'One address space, several conventions', duration: 16, kind: 'stack', variation: 'regions', accent: 'neutral', headline: 'STACK · HEAP · GLOBALS · CODE', detail: 'all of it is addressed memory', camera: 'wide'},
  {id: '04b', chapter: '04 · FUNCTION CALLS', title: 'The heap is not today’s target', duration: 16, kind: 'stack', variation: 'heap', accent: 'green', headline: 'malloc(64)', detail: '64 bytes appear, then leave focus', camera: 'pan-left'},
  {id: '04c', chapter: '04 · FUNCTION CALLS', title: 'call saves a way back', duration: 16, kind: 'stack', variation: 'call', accent: 'amber', headline: 'call vuln', detail: 'push address after the call', values: ['main frame', 'saved return address', 'vuln frame'], camera: 'push'},
  {id: '04d', chapter: '04 · FUNCTION CALLS', title: 'ret restores that address', duration: 16, kind: 'stack', variation: 'ret', accent: 'amber', headline: 'stack → instruction pointer', detail: 'normally execution returns to main', camera: 'pan-right'},

  {id: '05a', chapter: '05 · READ THE PROGRAM', title: 'main prepares and calls vuln', duration: 12, kind: 'code', variation: 'main', accent: 'green', headline: 'puts(prompt);  vuln();', detail: 'setup lines fade out', code: ['setvbuf(stdout, NULL, _IONBF, 0);', 'setresgid(gid, gid, gid);', 'puts("Please enter your string:");', 'vuln();', 'return 0;'], camera: 'push'},
  {id: '05b', chapter: '05 · READ THE PROGRAM', title: 'vuln owns a 32-byte array', duration: 13, kind: 'code', variation: 'vuln', accent: 'coral', headline: 'char buf[32];', detail: 'gets receives an address, not a capacity', code: ['void vuln() {', '  char buf[32];', '  gets(buf);', '  get_return_address();', '}'], camera: 'pan-right'},
  {id: '05c', chapter: '05 · READ THE PROGRAM', title: 'The helper exposes saved control data', duration: 12, kind: 'code', variation: 'helper', accent: 'amber', headline: 'get_return_address()', detail: 'a window, not the vulnerability', values: ['buf', 'saved frame state', 'return address'], camera: 'push'},
  {id: '05d', chapter: '05 · READ THE PROGRAM', title: 'win already contains the prize', duration: 12, kind: 'code', variation: 'win', accent: 'amber', headline: 'fopen → fgets → printf', detail: 'normal execution has no arrow to win', code: ['FILE *f = fopen("flag.txt", "r");', 'fgets(buf, 64, f);', 'printf(buf);'], camera: 'wide'},

  {id: '06a', chapter: '06 · THE OVERFLOW', title: 'gets knows only the starting address', duration: 12, kind: 'overflow', variation: 'signature', accent: 'coral', headline: 'gets(buf);', detail: 'capacity argument: none', values: ['buf begins here', '32 is absent'], camera: 'push'},
  {id: '06b', chapter: '06 · THE OVERFLOW', title: 'A bounded copy stops at 32', duration: 12, kind: 'overflow', variation: 'bounded', accent: 'green', headline: 'H  E  L  L  O', detail: 'counter closes the barrier at byte 32', camera: 'pan-right'},
  {id: '06c', chapter: '06 · THE OVERFLOW', title: 'Byte 33 still has a valid address', duration: 13, kind: 'overflow', variation: 'cross', accent: 'coral', headline: '32 fit  ·  33 crosses', detail: 'the write continues into adjacent memory', camera: 'push'},
  {id: '06d', chapter: '06 · THE OVERFLOW', title: 'The input walks across saved state', duration: 13, kind: 'overflow', variation: 'metadata', accent: 'coral', headline: 'padding → saved registers → frame pointer', detail: 'exact layout comes from the binary', camera: 'pan-right'},
  {id: '06e', chapter: '06 · THE OVERFLOW', title: 'ret stays intact; its input changes', duration: 13, kind: 'overflow', variation: 'return-tile', accent: 'coral', headline: 'saved return address', detail: 'trusted instruction · corrupted data', values: ['RET instruction', 'address consumed by RET'], camera: 'push'},

  {id: '07a', chapter: '07 · ASK THE BINARY', title: 'Interrogate the compiled file', duration: 15, kind: 'analysis', variation: 'properties', accent: 'green', headline: 'file · checksec · gdb', detail: '32-bit · NX enabled · no canary · no PIE', code: ['$ file ./chal', '$ checksec --file=./chal', '$ gdb ./chal'], camera: 'pan-left'},
  {id: '07b', chapter: '07 · ASK THE BINARY', title: 'Disassembly reveals the real frame', duration: 15, kind: 'analysis', variation: 'disassembly', accent: 'mint', headline: 'sub esp, 0x24', detail: 'leave · ret', code: ['push ebp', 'mov ebp, esp', 'sub esp, 0x24', 'lea eax, [ebp-0x28] ; buf', 'call gets', 'leave', 'ret'], camera: 'push'},
  {id: '07c', chapter: '07 · ASK THE BINARY', title: 'A cyclic pattern labels every position', duration: 15, kind: 'analysis', variation: 'cyclic', accent: 'coral', headline: 'aaaabaaacaaadaaaeaaaf…', detail: 'each small window is distinctive', camera: 'pan-right'},
  {id: '07d', chapter: '07 · ASK THE BINARY', title: 'The crash tells us the distance', duration: 15, kind: 'analysis', variation: 'offset', accent: 'amber', headline: 'EIP = 0x6161616c', detail: 'offset = 44 bytes', values: ['pattern search', '44'], camera: 'pan-right'},

  {id: '08a', chapter: '08 · BUILD THE PAYLOAD', title: 'Find the existing win symbol', duration: 13, kind: 'payload', variation: 'symbol', accent: 'amber', headline: 'win = 0x080491f6', detail: 'an address already inside the binary', camera: 'push'},
  {id: '08b', chapter: '08 · BUILD THE PAYLOAD', title: 'Padding carries us to the slot', duration: 13, kind: 'payload', variation: 'padding', accent: 'green', headline: 'A × 44', detail: 'offset zero → saved return address', values: ['0', '44'], camera: 'pan-right'},
  {id: '08c', chapter: '08 · BUILD THE PAYLOAD', title: 'Little-endian reverses byte order', duration: 14, kind: 'payload', variation: 'endian', accent: 'mint', headline: '0x080491f6', detail: 'f6  91  04  08', values: ['08', '04', '91', 'f6'], camera: 'push'},
  {id: '08d', chapter: '08 · BUILD THE PAYLOAD', title: 'Encode an address, not new code', duration: 14, kind: 'payload', variation: 'exploit', accent: 'green', headline: 'b"A" * 44 + p32(win)', detail: 'ordinary bytes redirect existing execution', code: ['elf = ELF("./chal")', 'offset = 44', 'payload = b"A" * offset + p32(elf.sym.win)'], camera: 'tilt'},

  {id: '09a', chapter: '09 · THE RETURN', title: 'Replay the write at full speed', duration: 11, kind: 'return', variation: 'replay', accent: 'coral', headline: '44 bytes + 4 address bytes', detail: 'the original return address disappears', camera: 'pan-left'},
  {id: '09b', chapter: '09 · THE RETURN', title: 'The program announces its trust', duration: 11, kind: 'return', variation: 'diagnostic', accent: 'amber', headline: 'Jumping to 0x080491f6', detail: 'the corrupted value looks ordinary to the CPU', camera: 'push'},
  {id: '09c', chapter: '09 · THE RETURN', title: 'ret installs the corrupted address', duration: 11, kind: 'return', variation: 'redirect', accent: 'coral', headline: 'stack → EIP', detail: '0x080491f6', values: ['leave', 'ret', 'instruction pointer'], camera: 'pan-right'},
  {id: '09d', chapter: '09 · THE RETURN', title: 'Execution lands inside win', duration: 12, kind: 'return', variation: 'flag', accent: 'green', headline: 'fopen → fgets → printf', detail: 'picoCTF{••••••••••}', camera: 'push'},

  {id: '10a', chapter: '10 · DATA BECAME CONTROL', title: 'Four surviving objects explain it', duration: 15, kind: 'recap', variation: 'objects', accent: 'neutral', headline: 'buffer → write → address → pointer', detail: 'each object returns from an earlier scene', camera: 'wide'},
  {id: '10b', chapter: '10 · DATA BECAME CONTROL', title: 'Our text never became code', duration: 15, kind: 'recap', variation: 'statement', accent: 'amber', headline: 'data occupied an address slot', detail: 'representation + location changed control', camera: 'push'},
  {id: '10c', chapter: '10 · DATA BECAME CONTROL', title: 'The same computer opens new doors', duration: 16, kind: 'recap', variation: 'future', accent: 'green', headline: 'FORMAT STRINGS · ROP · HEAP', detail: 'one overwritten address reveals a whole family of ideas', camera: 'wide'},
];

export const STORY_BY_ID = new Map(STORY.map(scene => [scene.id, scene]));

export const TOTAL_DURATION = STORY.reduce((sum, scene) => sum + scene.duration, 0);
