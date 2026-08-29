export type BeatKind =
  | 'hook' | 'evidence' | 'source' | 'odometer' | 'wheel' | 'trigger'
  | 'dominoes' | 'mismatch' | 'signedness' | 'addition' | 'underflow'
  | 'truncation' | 'bounds' | 'conversion' | 'allocation' | 'heap'
  | 'index' | 'pointer' | 'architecture' | 'disasm' | 'fix' | 'checklist' | 'outro';

export type Beat = {
  id: string;
  chapter: string;
  title: string;
  duration: number;
  kind: BeatKind;
  captions: string[];
};

export const beats: Beat[] = [
  {id: '00-hook', chapter: 'flag_shop', title: 'The shop that pays you', duration: 28, kind: 'hook', captions: ['balance: 1100', 'real flag: 100000', 'not enough funds', 'a number crossed its wall']},
  {id: '01-evidence', chapter: 'provenance', title: 'How did we get here?', duration: 57, kind: 'evidence', captions: ['source code', 'local reconstruction', 'compiled program', 'observed behavior', 'every close-up comes from evidence']},
  {id: '02-source', chapter: 'source path', title: 'The innocent code path', duration: 80, kind: 'source', captions: ['number_flags starts at zero', 'scanf reads an int', 'positive quantity enters', '900 times quantity', 'compare with balance', 'subtract total cost']},
  {id: '03-odometer', chapter: 'mental model', title: 'A number line with a wall', duration: 70, kind: 'odometer', captions: ['900', '1800', '2700', 'school arithmetic keeps going', 'a fixed-width int does not']},
  {id: '04-wheel', chapter: 'representation', title: 'The integer wheel', duration: 85, kind: 'wheel', captions: ['32 bits', '0x7ffffffe', '0x7fffffff  INT_MAX', 'add one', '0x80000000', 'same bits, signed negative']},
  {id: '05-trigger', chapter: 'flag_shop', title: 'Multiplication overflow', duration: 95, kind: 'trigger', captions: ['900 × 3,000,000', 'mathematical result: 2,700,000,000', 'low 32 bits: 0xA0EEBB00', 'signed read: -1,594,967,296', 'subtracting a negative adds money']},
  {id: '06-dominoes', chapter: 'exploit chain', title: 'A consequence, not a magic input', duration: 75, kind: 'dominoes', captions: ['positive input', 'multiply wraps', 'negative cost', 'wrong comparison', 'balance rises', 'real flag gate opens']},
  {id: '07-mismatch', chapter: 'bug class', title: 'The actual bug class', duration: 70, kind: 'mismatch', captions: ['mathematical receipt', 'machine representation', 'the bridge checks the wrong world', 'representation mismatch']},
  {id: '08-signedness', chapter: 'signedness', title: 'Same bits, different story', duration: 60, kind: 'signedness', captions: ['0xffffffff', 'signed int: -1', 'unsigned int: 4294967295', 'the bits did not change', 'the reader changed']},
  {id: '09-addition', chapter: 'addition', title: 'picoCTF two-sum cameo', duration: 65, kind: 'addition', captions: ['2147483647', 'plus one', 'mathematical sum: 2147483648', 'signed view: -2147483648', 'same primitive, new operation']},
  {id: '10-underflow', chapter: 'underflow', title: 'Crossing the floor', duration: 70, kind: 'underflow', captions: ['unsigned int', 'zero minus one', 'UINT_MAX', 'copy length', 'loop bound', 'array index']},
  {id: '11-truncation', chapter: 'truncation', title: 'When high bits disappear', duration: 75, kind: 'truncation', captions: ['32-bit input', 'short: 16 bits', 'upper bits are cut away', '0xffff', 'signed short: -1', 'maximum-only check passes']},
  {id: '12-bounds', chapter: 'bounds', title: 'A check needs two walls', duration: 85, kind: 'bounds', captions: ['max wall only', 'negative values walk left', 'memory before the buffer', 'minimum wall', '0 <= x && x <= max']},
  {id: '13-conversion', chapter: 'conversion', title: 'Negative length, huge copy', duration: 95, kind: 'conversion', captions: ['reconstructed lab', 'len = -1', 'len <= 512 passes', 'size_t conversion', 'huge unsigned size', 'copy crosses the buffer']},
  {id: '14-allocation', chapter: 'allocation', title: 'The heap version of flag_shop', duration: 110, kind: 'allocation', captions: ['900 × number_flags', 'sizeof(T) × count', 'wrapped allocation size', 'small heap chunk', 'loop still trusts count', 'writes spill next door']},
  {id: '15-heap', chapter: 'consequence', title: 'Integer overflow into heap overflow', duration: 85, kind: 'heap', captions: ['input count', 'multiply', 'wrap', 'small malloc', 'large write', 'heap overflow']},
  {id: '16-index', chapter: 'index arithmetic', title: 'Index wraparound', duration: 75, kind: 'index', captions: ['index near the end', 'length crosses the edge', 'index + length wraps', 'guard sees a small sum', 'original range is out of bounds']},
  {id: '17-pointer', chapter: 'pointer arithmetic', title: 'An offset is a future address', duration: 75, kind: 'pointer', captions: ['base address', 'offset route', 'route crosses the map edge', 'final pin looks safe', 'validate before addition']},
  {id: '18-architecture', chapter: 'data models', title: 'Width changes across targets', duration: 90, kind: 'architecture', captions: ['int stays 32 bits', 'LP64: long and pointers are 64', 'LLP64: long is 32, pointer is 64', 'size_t into int', 'high bits are lost']},
  {id: '19-disasm', chapter: 'machine evidence', title: 'What the CPU actually sees', duration: 105, kind: 'disasm', captions: ['store.c line 39', '0x40062d', 'imul eax, eax, 0x384', 'eax holds low 32 bits', 'local UBSan build unavailable', 'checked arithmetic catches the operation first']},
  {id: '20-fix', chapter: 'defense', title: 'Check before arithmetic', duration: 110, kind: 'fix', captions: ['positive quantity', 'INT_MAX / 900', 'reject before multiply', 'checked multiplication', 'input range gate', 'affordability gate']},
  {id: '21-checklist', chapter: 'audit', title: 'Integers that become decisions', duration: 70, kind: 'checklist', captions: ['sizes and lengths', 'counts and indexes', 'offsets and allocation sizes', 'loop bounds and pointers', 'check before arithmetic', 'check value equals used value']},
  {id: '22-outro', chapter: 'final rule', title: 'Numbers are boundaries', duration: 55, kind: 'outro', captions: ['price', 'length', 'allocation size', 'index', 'pointer offset', 'integer bugs: numbers are boundaries']},
];
