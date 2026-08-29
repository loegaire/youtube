import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const fps = 24;
const width = 1920;
const height = 1080;
const outRoot = resolve('assets/generated/ret2libc-evidence-panels');
const clipRoot = resolve('renders/ret2libc-evidence-clips');
const renderRoot = resolve('renders');
const reviewRoot = resolve('review');
const evidenceRoot = resolve('evidence');
const cleanVideo = resolve('renders/ret2libc-evidence-route-clean.mp4');
const captionedVideo = resolve('renders/ret2libc-evidence-route-captioned.mp4');
const narration = resolve('audio/narration.wav');
const ass = resolve('assets/captions/ret2libc-evidence-route.ass');

for (const dir of [outRoot, clipRoot, renderRoot, reviewRoot]) {
  mkdirSync(dir, {recursive: true});
}

if (!existsSync(narration)) {
  throw new Error('Missing audio/narration.wav');
}
if (!existsSync(ass)) {
  throw new Error('Missing assets/captions/ret2libc-evidence-route.ass');
}

function run(command, args, label) {
  const result = spawnSync(command, args, {stdio: 'inherit'});
  if (result.status !== 0) {
    throw new Error(`${label} failed with status ${result.status}`);
  }
}

function xml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function lines(text) {
  return String(text).replace(/\r/g, '').split('\n');
}

function readEvidence(file) {
  const path = resolve(evidenceRoot, file);
  if (!existsSync(path)) {
    return [`missing evidence/${file}`];
  }
  return lines(readFileSync(path, 'utf8'));
}

function pick(file, terms = [], limit = 12) {
  const raw = readEvidence(file);
  const selected = [];
  if (raw[0]?.startsWith('$ ')) selected.push(raw[0]);
  if (terms.length === 0) {
    for (const line of raw.slice(1)) {
      if (line.trim()) selected.push(line);
      if (selected.length >= limit) break;
    }
    return [`evidence/${file}`, ...selected.slice(0, limit)];
  }
  const lowerTerms = terms.map(term => term.toLowerCase());
  raw.forEach((line, index) => {
    const lower = line.toLowerCase();
    if (lowerTerms.some(term => lower.includes(term))) {
      for (let i = Math.max(0, index - 1); i <= Math.min(raw.length - 1, index + 1); i++) {
        if (raw[i].trim() && !selected.includes(raw[i])) selected.push(raw[i]);
      }
    }
  });
  return [`evidence/${file}`, ...selected.slice(0, limit - 1)];
}

function wrapLine(line, widthChars) {
  const clean = String(line).replace(/\t/g, '  ');
  if (clean.length <= widthChars) return [clean];
  const words = clean.split(/(\s+)/);
  const out = [];
  let current = '';
  for (const word of words) {
    if ((current + word).length > widthChars && current.length > 0) {
      out.push(current.trimEnd());
      current = word.trimStart();
    } else {
      current += word;
    }
  }
  if (current.trim()) out.push(current.trimEnd());
  return out.flatMap(chunk => {
    if (chunk.length <= widthChars) return [chunk];
    const hard = [];
    for (let i = 0; i < chunk.length; i += widthChars) hard.push(chunk.slice(i, i + widthChars));
    return hard;
  });
}

function wrap(linesIn, widthChars, maxLines) {
  const out = [];
  for (const line of linesIn) {
    for (const wrapped of wrapLine(line, widthChars)) {
      out.push(wrapped);
      if (out.length >= maxLines) return out;
    }
  }
  return out;
}

function textBlock(items, widthChars, maxLines) {
  return wrap(items.filter(Boolean), widthChars, maxLines);
}

function timestamp(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const scenes = [
  {
    duration: 14,
    title: 'Cold Open: The Echo Server Eats Text',
    message: ['Harmless echo behavior turns into a stack story.', 'The payload is text first, then a route made of return addresses.'],
    facts: ['animation-only opening', 'case-flip echo model', 'stack frame underneath'],
    evidence: ['No terminal proof yet: visual hook only.'],
  },
  {
    duration: 14,
    title: 'Title: Leak, Calculate, Return',
    message: ['This is ret2libc against a real binary.', 'Not shellcode, and not guessed addresses.'],
    facts: ['leak libc', 'calculate base', 'return to system'],
    evidence: ['Concept promise: facts unlock only from evidence panels.'],
  },
  {
    duration: 27,
    title: 'Challenge Files First',
    message: ['The workspace gives a binary, a libc, and a Makefile fragment.', 'Every later clean card traces back to these files.'],
    facts: ['vuln: ELF64 executable, not stripped', 'libc.so.6: ELF64 shared object, stripped', 'Makefile.share: build context'],
    evidence: [...pick('00_ls.txt', ['Makefile.share', 'libc.so.6', 'vuln'], 8), ...pick('02_file.txt', ['ELF', 'not stripped', 'shared object'], 8)],
  },
  {
    duration: 23,
    title: 'Makefile Is Context, Not Source',
    message: ['The Makefile suggests non-PIE, rpath, and 64-bit mode.', 'It does not provide the original C source.'],
    facts: ['-no-pie', '-rpath=./', '-m64', 'source-looking views are reconstructed from disassembly'],
    evidence: pick('01_makefile.txt', ['-no-pie', 'rpath', '-m64'], 14),
  },
  {
    duration: 37,
    title: 'Protections From Real Metadata',
    message: ['readelf proves the hardening state.', 'No PIE, NX enabled, no canary, partial RELRO, RUNPATH ./.'],
    facts: ['NO PIE <- Type: EXEC', 'NX <- GNU_STACK RW, no E', 'NO CANARY <- no __stack_chk_fail', 'PARTIAL RELRO <- GNU_RELRO, no BIND_NOW'],
    evidence: [
      ...pick('03_readelf_header.txt', ['Type:'], 4),
      ...pick('04_program_headers.txt', ['GNU_STACK', 'GNU_RELRO'], 6),
      ...pick('05_dynamic.txt', ['RUNPATH', 'BIND_NOW'], 5),
      ...pick('19_canary_check.txt', ['no __stack_chk_fail'], 3),
    ],
  },
  {
    duration: 27,
    title: 'NX Changes The Attack Shape',
    message: ['The stack can hold bytes, but not executable instructions.', 'The exploit becomes a route through already-loaded code.'],
    facts: ['shellcode payload blocked', 'ret2libc payload stays viable', 'RIP walks address blocks'],
    evidence: pick('04_program_headers.txt', ['GNU_STACK'], 8),
  },
  {
    duration: 50,
    title: 'Symbols Point At do_stuff',
    message: ['The binary is not stripped, so the symbol table gives names.', 'do_stuff is where input, echo, and return control meet.'],
    facts: ['convert_case = 0x400677', 'do_stuff = 0x4006d8', 'main = 0x400771'],
    evidence: pick('06_symbols.txt', ['convert_case', 'do_stuff', ' main'], 12),
  },
  {
    duration: 53,
    title: 'do_stuff Before The Bug',
    message: ['The whole vulnerable function is evidence first.', 'The stack frame, scanf calls, loop, puts, leave, and ret build the model.'],
    facts: ['sub rsp,0x90', 'buffer reference: rbp-0x80', 'loop and puts live in do_stuff', 'leave; ret closes the frame'],
    evidence: pick('10_disasm_do_stuff.txt', ['<do_stuff>', 'sub', 'scanf', 'convert_case', 'puts', 'leave', 'ret'], 20),
  },
  {
    duration: 37,
    title: 'The Bug Is "%[^\\n]"',
    message: ['The dangerous format string lives in .rodata.', 'It scans until newline with no width limit.'],
    facts: ['0x400934 -> "%[^\\n]"', '0x40093a -> "%c"', 'unbounded scanf'],
    evidence: [...pick('08_rodata.txt', ['400930', '255b5e0a', '5d002563'], 8), ...pick('10_disasm_do_stuff.txt', ['400934', '40093a'], 8)],
  },
  {
    duration: 53,
    title: 'Stack Frame Reconstruction',
    message: ['Input starts at rbp-0x80.', 'Saved RIP is 128 bytes to saved rbp plus 8 more bytes.'],
    facts: ['buffer start -> saved rbp = 0x80 = 128', 'saved rbp -> saved rip = 8', 'OFFSET = 136'],
    evidence: pick('10_disasm_do_stuff.txt', ['rbp-0x80', 'leave', 'ret'], 12),
  },
  {
    duration: 53,
    title: 'The Echo Mutates The First 100 Bytes',
    message: ['convert_case changes bytes before the return address.', 'The ROP chain starts after byte 136, outside the mutation zone.'],
    facts: ['indices 0-99 mutate', 'indices 100-135 are padding', 'indices 136+ are ROP chain'],
    evidence: [...pick('11_disasm_convert_case.txt', ['cmp', 'sub', 'add'], 12), ...pick('10_disasm_do_stuff.txt', ['0x63', '400728'], 8)],
  },
  {
    duration: 42,
    title: 'The Trailing d Is Not The Leak',
    message: ['The loop counter is inside the overflowed region.', 'After counting to 100, 0x64 appears as ASCII d.'],
    facts: ['rbp-0x8 loop counter', 'final value = 0x64', '0x64 -> d', 'visible echo artifact only'],
    evidence: pick('10_disasm_do_stuff.txt', ['rbp-0x8', '0x63', '400760'], 16),
  },
  {
    duration: 58,
    title: 'PLT And GOT Give The Leak Target',
    message: ['ASLR falls once we leak one real libc address from this run.', 'Call puts@plt with puts@got as the argument.'],
    facts: ['puts@plt = 0x400540', 'puts@got = 0x601018', 'puts prints *puts@got'],
    evidence: [...pick('07_relocations.txt', ['601018', 'puts'], 10), ...pick('13_plt.txt', ['<puts@plt>', '601018'], 12)],
  },
  {
    duration: 52,
    title: 'Hidden Mid-Instruction pop rdi; ret',
    message: ['x86-64 passes the first argument in RDI.', 'Starting one byte into 41 5f c3 reveals pop rdi; ret.'],
    facts: ['context bytes: 41 5f c3', 'shifted decode: 0x400913', 'POP_RDI = 0x400913'],
    evidence: [...pick('14_csu_gadget_context.txt', ['400912', '400914'], 12), ...pick('15_pop_rdi_mid_instruction.txt', ['400913', 'pop', 'ret'], 8)],
  },
  {
    duration: 42,
    title: 'The Alignment ret Shim',
    message: ['The ret at 0x40052e shifts the stack by one address width.', 'It is used in stage two for libc stack alignment.'],
    facts: ['RET = 0x40052e', 'from _init context', 'used only in stage two'],
    evidence: pick('16_ret_shim.txt', ['40052e', 'ret'], 10),
  },
  {
    duration: 53,
    title: 'Stage One Payload',
    message: ['Every block has provenance.', 'The first chain leaks puts and returns to do_stuff for a second input.'],
    facts: ['"A" * 136', '0x400913 pop rdi; ret', '0x601018 puts@got', '0x400540 puts@plt', '0x4006d8 do_stuff'],
    evidence: ['payload1 = flat(', '  b"A" * 136,', '  0x400913,  # pop rdi ; ret', '  0x601018,  # puts@got', '  0x400540,  # puts@plt', '  0x4006d8,  # do_stuff again', ')'],
  },
  {
    duration: 55,
    title: 'The Leak Is Raw Bytes',
    message: ['A real leak is not a pretty address.', 'It is raw bytes printed by puts, then parsed little-endian.'],
    facts: ['payload1 -> puts@plt(puts@got)', 'stdout leak -> leaked_puts', 'matching runtime required for final transcript'],
    evidence: ['runtime honesty gate:', 'remote or matching ld-linux required', 'no fabricated shell or leak transcript is shown'],
  },
  {
    duration: 48,
    title: 'Provided libc Offsets',
    message: ['The challenge libc gives the offsets.', 'Nothing here is guessed.'],
    facts: ['LIBC_PUTS = 0x80a30', 'LIBC_SYSTEM = 0x4f4e0', 'LIBC_BINSH = 0x1b40fa'],
    evidence: [...pick('17_libc_symbols.txt', ['puts', 'system'], 10), ...pick('18_libc_binsh.txt', ['/bin/sh'], 4)],
  },
  {
    duration: 47,
    title: 'Rebuild libc Runtime Map',
    message: ['ASLR moves libc, but internal distances stay fixed.', 'One leaked puts address slides the whole map into place.'],
    facts: ['libc_base = leaked_puts - 0x80a30', 'system = libc_base + 0x4f4e0', 'binsh = libc_base + 0x1b40fa'],
    evidence: ['evidence wires:', 'leaked_puts <- stage-one stdout', 'offsets <- evidence/17_libc_symbols.txt', 'binsh <- evidence/18_libc_binsh.txt'],
  },
  {
    duration: 53,
    title: 'Stage Two Payload',
    message: ['The second overflow becomes a function call.', 'pop rdi loads /bin/sh, then system runs from libc.'],
    facts: ['"B" * 136', '0x40052e ret alignment shim', '0x400913 pop rdi; ret', 'libc_base + 0x1b40fa', 'libc_base + 0x4f4e0'],
    evidence: ['payload2 = flat(', '  b"B" * 136,', '  0x40052e,', '  0x400913,', '  libc_base + 0x1b40fa,', '  libc_base + 0x4f4e0,', ')'],
  },
  {
    duration: 44,
    title: 'Why The ret Is Not Decorative',
    message: ['The extra ret consumes 8 bytes.', 'That flips the stack alignment gate before entering libc.'],
    facts: ['without ret: alignment can be wrong', 'with ret: RSP shifts by 8', 'ABI-based reconstruction'],
    evidence: [...pick('16_ret_shim.txt', ['40052e', 'ret'], 8), 'No fake crash/shell transcript is used.'],
  },
  {
    duration: 53,
    title: 'Final Run: Runtime Honesty Gate',
    message: ['The local run hits a loader assertion.', 'So the video marks final shell proof as pending instead of fabricating it.'],
    facts: ['provided libc requires matching ld-linux', 'remote or matching runtime needed', 'runtime_exit = 127'],
    evidence: pick('20_runtime_constraint.txt', ['Inconsistency', 'Assertion', 'runtime_exit'], 12),
  },
  {
    duration: 70,
    title: 'Full Traced Exploit Map',
    message: ['The chain is evidence flow, not magic.', 'Every clean fragment descends from raw command output.'],
    facts: ['files -> protections -> symbols -> disassembly', '.rodata -> overflow -> offset 136', 'PLT/GOT -> leak', 'gadget -> RDI', 'libc offsets -> system("/bin/sh")'],
    evidence: ['command breadcrumbs:', 'readelf -h / -l / -d / -s / -r', 'objdump -s .rodata', 'objdump -d -M intel', 'strings -a -t x libc.so.6'],
  },
  {
    duration: 75,
    title: 'Challenge-Specific Pitfalls',
    message: ['Generic ret2libc diagrams miss these traps.', 'This binary has mutation, a visible loop-counter artifact, a shifted gadget, and a loader constraint.'],
    facts: ['AaAaAa: first 100 bytes mutate', 'trailing d: loop counter 0x64', '0x400913: mid-instruction gadget', 'local libc: matching loader required'],
    evidence: ['pitfall sources:', 'evidence/10_disasm_do_stuff.txt', 'evidence/11_disasm_convert_case.txt', 'evidence/15_pop_rdi_mid_instruction.txt', 'evidence/05_dynamic.txt'],
  },
  {
    duration: 45,
    title: 'Ret2libc Lesson',
    message: ['Do not memorize the payload.', 'Memorize the evidence route.'],
    facts: ['find overflow', 'measure RIP control', 'set first argument', 'leak known libc function', 'subtract offset', 'return into trusted code'],
    evidence: ['compressed route:', 'overflow -> control RIP -> pop rdi ; ret', 'puts(puts@got) -> leaked puts', 'libc base -> system("/bin/sh")'],
  },
  {
    duration: 35,
    title: 'Outro: A Path Through Existing Code',
    message: ['The stack never became executable.', 'The payload became a path: leak libc, calculate base, return to system.'],
    facts: ['leaked_puts - puts_offset = libc_base', 'libc_base + system_offset = system', 'libc_base + binsh_offset = "/bin/sh"'],
    evidence: ['every clean fragment came from raw evidence'],
  },
];

function makeSvg(scene, index, startTime) {
  const terminal = textBlock(scene.evidence, 62, 23);
  const facts = textBlock(scene.facts, 36, 13);
  const message = textBlock(scene.message, 34, 8);
  const tinyGrid = Array.from({length: 20}, (_, i) => {
    const y = 100 + i * 46;
    return `<line x1="52" y1="${y}" x2="1868" y2="${y}" stroke="#0d1d17" stroke-width="1"/>`;
  }).join('\n');

  const drawLines = (items, x, y, size, fill, lineHeight, maxChars = 999) => items.map((item, i) => {
    const line = item.length > maxChars ? `${item.slice(0, maxChars - 3)}...` : item;
    return `<text x="${x}" y="${y + i * lineHeight}" fill="${fill}" font-family="JetBrains Mono, Fira Code, DejaVu Sans Mono, monospace" font-size="${size}">${xml(line)}</text>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#040806"/>
  <rect x="32" y="32" width="1856" height="1016" rx="8" fill="#06100c" stroke="#244636" stroke-width="2"/>
  ${tinyGrid}
  <rect x="70" y="66" width="1780" height="78" rx="6" fill="#071b13" stroke="#2d5946" stroke-width="1.5"/>
  <text x="1510" y="113" fill="#ffd36e" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="25">scene ${String(index + 1).padStart(2, '0')} | ${timestamp(startTime)}</text>
  <text x="96" y="168" fill="#7d9d8d" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="18">ret2libc: the echo server that leaks its own library</text>

  <rect x="70" y="198" width="650" height="350" rx="6" fill="#07130f" stroke="#224333" stroke-width="1.5"/>
  ${drawLines(message, 96, 252, 30, '#d8fbe8', 42, 58)}

  <rect x="70" y="578" width="650" height="312" rx="6" fill="#091811" stroke="#224333" stroke-width="1.5"/>
  <text x="96" y="621" fill="#ffd36e" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="18" font-weight="700">facts</text>
  ${drawLines(facts.map(item => `> ${item}`), 96, 662, 25, '#e5f7ea', 36, 44)}

  <rect x="760" y="198" width="1090" height="692" rx="6" fill="#020503" stroke="#2d5946" stroke-width="1.5"/>
  <rect x="760" y="198" width="1090" height="46" rx="6" fill="#0a2117"/>
  <circle cx="790" cy="221" r="7" fill="#ff6f5f"/>
  <circle cx="815" cy="221" r="7" fill="#ffd36e"/>
  <circle cx="840" cy="221" r="7" fill="#7fffd4"/>
  <text x="878" y="229" fill="#7fffd4" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="19">raw evidence / provenance breadcrumb</text>
  ${drawLines(terminal, 790, 286, 22, '#cdebd9', 27, 70)}
</svg>
`;
}

let start = 0;
const metadata = [];
const listPath = resolve('renders/ret2libc-evidence-clips.txt');
let concatList = '';

for (let index = 0; index < scenes.length; index++) {
  const scene = scenes[index];
  const svgPath = resolve(outRoot, `${String(index).padStart(2, '0')}.svg`);
  const pngPath = resolve(outRoot, `${String(index).padStart(2, '0')}.png`);
  const clipPath = resolve(clipRoot, `${String(index).padStart(2, '0')}.mp4`);
  writeFileSync(svgPath, makeSvg(scene, index, start), 'utf8');
  run('magick', [svgPath, pngPath], `rasterize scene ${index}`);

  const frames = Math.round(scene.duration * fps);
  const drift = index % 2 === 0 ? 1 : -1;
  const vf = [
    'scale=1920:1080',
    `zoompan=z='min(zoom+0.00028,1.055)':x='iw/2-(iw/zoom/2)+${drift}*sin(on/42)*18':y='ih/2-(ih/zoom/2)+cos(on/51)*12':d=1:s=1920x1080:fps=${fps}`,
    `drawbox=x='mod(t*80,1920)-220':y=160:w=220:h=4:color=0xff9b50@0.42:t=fill`,
    `drawbox=x=72:y='198+mod(t*48,350)':w=4:h=110:color=0x7fffd4@0.38:t=fill`,
    'format=yuv420p',
  ].join(',');
  run('ffmpeg', [
    '-y',
    '-hide_banner',
    '-loglevel',
    'warning',
    '-framerate',
    String(fps),
    '-loop',
    '1',
    '-i',
    pngPath,
    '-vf',
    vf,
    '-frames:v',
    String(frames),
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    'ultrafast',
    '-crf',
    '20',
    '-pix_fmt',
    'yuv420p',
    clipPath,
  ], `encode scene ${index}`);
  concatList += `file '${clipPath.replaceAll("'", "'\\''")}'\n`;
  metadata.push({
    index,
    title: scene.title,
    start,
    duration: scene.duration,
    svg: svgPath,
    png: pngPath,
    evidence: scene.evidence.filter(line => /^evidence\//.test(line)),
    note: 'Symbolic generated panel built from real evidence snippets. Not terminal fabrication.',
  });
  start += scene.duration;
}

writeFileSync(listPath, concatList, 'utf8');
writeFileSync(resolve(outRoot, 'metadata.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  size: {width, height},
  fps,
  totalDuration: start,
  style: 'near-black terminal UI with mint highlights, orange control flow, pale yellow addresses',
  honesty: 'Runtime shell transcript is not fabricated; the local loader assertion is shown from evidence/20_runtime_constraint.txt.',
  panels: metadata,
}, null, 2), 'utf8');

run('ffmpeg', [
  '-y',
  '-hide_banner',
  '-loglevel',
  'warning',
  '-f',
  'concat',
  '-safe',
  '0',
  '-i',
  listPath,
  '-i',
  narration,
  '-c:v',
  'copy',
  '-c:a',
  'aac',
  '-b:a',
  '192k',
  '-shortest',
  '-movflags',
  '+faststart',
  cleanVideo,
], 'mux clean video');

run('ffmpeg', [
  '-y',
  '-hide_banner',
  '-loglevel',
  'warning',
  '-i',
  cleanVideo,
  '-vf',
  `ass=${ass}`,
  '-c:v',
  'libx264',
  '-preset',
  'veryfast',
  '-crf',
  '18',
  '-pix_fmt',
  'yuv420p',
  '-c:a',
  'copy',
  '-movflags',
  '+faststart',
  captionedVideo,
], 'burn captions');

run('ffmpeg', [
  '-y',
  '-v',
  'error',
  '-i',
  captionedVideo,
  '-vf',
  'fps=1/85,scale=480:270,tile=4x4',
  '-frames:v',
  '1',
  resolve(reviewRoot, 'fast-master-contact-sheet.png'),
], 'contact sheet');

console.log(`Built ${captionedVideo}`);
