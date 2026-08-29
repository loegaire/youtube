import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, '..');
const targetDir = resolve(projectDir, 'assets/render-slates');
const source = await readFile(resolve(projectDir, 'assets/scene-data.js'), 'utf8');
const sandbox = {window: {}};
vm.runInNewContext(source, sandbox, {filename: 'scene-data.js'});
const scenes = sandbox.window.BINARY_DEFENSES_SCENES;

const esc = value => String(value).replace(/[&<>"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'}[character]));
const wrap = (value, limit) => {
  const words = value.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > limit && line) { lines.push(line); line = word; } else line = candidate;
  }
  if (line) lines.push(line);
  return lines;
};
const textLines = (lines, x, y, options = {}) => lines.map((line, index) => `<text x="${x}" y="${y + index * (options.leading || 28)}" fill="${options.fill || '#D9E5DD'}" font-family="${options.mono ? 'JetBrains Mono, DejaVu Sans Mono, monospace' : 'Inter, DejaVu Sans, sans-serif'}" font-size="${options.size || 18}" font-weight="${options.weight || 500}">${esc(line)}</text>`).join('');
const titleLines = title => wrap(title, 31).slice(0, 2);
const modeModel = mode => {
  if (mode === 'recap') return `
    <text x="1330" y="325" fill="#A2ADA5" font-family="JetBrains Mono, monospace" font-size="17" font-weight="700">QUESTIONS → EVIDENCE</text>
    <g font-family="JetBrains Mono, monospace" font-weight="700"><rect x="1325" y="385" width="170" height="150" rx="16" fill="#142019" stroke="#2D4437" stroke-width="3"/><text x="1352" y="435" fill="#E4CF82" font-size="44">?</text><text x="1352" y="478" fill="#F1F3EE" font-size="18">CAN DATA</text><text x="1352" y="505" fill="#F1F3EE" font-size="18">EXECUTE?</text><rect x="1515" y="385" width="170" height="150" rx="16" fill="#142019" stroke="#2D4437" stroke-width="3"/><text x="1542" y="435" fill="#E4CF82" font-size="44">?</text><text x="1542" y="478" fill="#F1F3EE" font-size="18">ADDRESSES</text><text x="1542" y="505" fill="#F1F3EE" font-size="18">MOVE?</text><rect x="1325" y="560" width="360" height="85" rx="14" fill="#0A1310" stroke="#9B87B4" stroke-width="3"/><text x="1362" y="612" fill="#9B87B4" font-size="22">assumptions → proof</text></g>`;
  if (mode === 'nx') return `<text x="1330" y="325" fill="#A2ADA5" font-family="JetBrains Mono, monospace" font-size="17" font-weight="700">GNU_STACK / PROCESS PAGE</text><rect x="1325" y="380" width="430" height="270" rx="22" fill="#0A1719" stroke="#A7DDE0" stroke-width="4"/><text x="1360" y="435" fill="#F1F3EE" font-family="Inter, sans-serif" font-size="34" font-weight="800">permission is</text><text x="1360" y="476" fill="#F1F3EE" font-family="Inter, sans-serif" font-size="34" font-weight="800">a hardware decision</text><g font-family="JetBrains Mono, monospace" font-size="50" font-weight="800"><rect x="1360" y="530" width="100" height="78" fill="#142019" stroke="#2D4437" stroke-width="3"/><text x="1391" y="584" fill="#8CCB9A">R</text><rect x="1480" y="530" width="100" height="78" fill="#142019" stroke="#2D4437" stroke-width="3"/><text x="1510" y="584" fill="#8CCB9A">W</text><rect x="1600" y="530" width="100" height="78" fill="#251412" stroke="#CA6763" stroke-width="3"/><text x="1630" y="584" fill="#CA6763">E</text></g>`;
  if (mode === 'aslr' || mode === 'pie') {
    const rows = mode === 'pie' ? ['ELF TYPE · DYN', 'MAIN OFFSET · 0x1189', 'RUN BASE · 0x5594...', 'BASE + 0x1189'] : ['MAIN BINARY · 0x401186', 'LIBC · 0x7f...a5a0', 'STACK · 0x7ffd...', 'BASE + OFFSET'];
    return `<text x="1330" y="325" fill="#A2ADA5" font-family="JetBrains Mono, monospace" font-size="17" font-weight="700">RUNTIME MAP / COMPARE RUNS</text>${rows.map((row, index) => `<rect x="1325" y="${370 + index * 74}" width="420" height="58" rx="12" fill="#142019" stroke="#2D4437" stroke-width="3"/><text x="1350" y="${408 + index * 74}" fill="${['#A7DDE0','#9B87B4','#8CCB9A','#E4CF82'][index]}" font-family="JetBrains Mono, monospace" font-size="18" font-weight="700">${row}</text>`).join('')}`;
  }
  if (mode === 'relro') return `<text x="1330" y="325" fill="#A2ADA5" font-family="JetBrains Mono, monospace" font-size="17" font-weight="700">GOT / RELOCATION PAGE</text><g font-family="JetBrains Mono, monospace" font-size="18" font-weight="700"><rect x="1325" y="380" width="430" height="66" fill="#142019" stroke="#2D4437" stroke-width="3"/><text x="1350" y="421" fill="#F1F3EE">puts@GOT</text><text x="1500" y="421" fill="#F1F3EE">0x403fd8</text><text x="1660" y="421" fill="#8CCB9A">r--p</text><rect x="1325" y="465" width="430" height="66" fill="#142019" stroke="#2D4437" stroke-width="3"/><text x="1350" y="506" fill="#F1F3EE">startup binding</text><text x="1660" y="506" fill="#8CCB9A">NOW</text><rect x="1325" y="550" width="430" height="66" fill="#142019" stroke="#2D4437" stroke-width="3"/><text x="1350" y="591" fill="#F1F3EE">loader route</text><text x="1660" y="591" fill="#CA6763">late?</text></g>`;
  if (mode === 'summary') return `<text x="1330" y="325" fill="#A2ADA5" font-family="JetBrains Mono, monospace" font-size="17" font-weight="700">DEFENSE-IN-DEPTH / EVIDENCE MAP</text>${['NX · no execute page', 'CANARY · guard checked', 'ASLR · regions vary', 'PIE · randomized main', 'RELRO · locked relocation'].map((row, index) => `<line x1="1325" x2="1755" y1="${390 + index * 68}" y2="${390 + index * 68}" stroke="#2D4437" stroke-width="3"/><text x="1330" y="${431 + index * 68}" fill="#8CCB9A" font-family="JetBrains Mono, monospace" font-size="18" font-weight="800">0${index + 1}</text><text x="1400" y="${431 + index * 68}" fill="#F1F3EE" font-family="JetBrains Mono, monospace" font-size="18" font-weight="700">${row}</text>`).join('')}`;
  const isCanary = mode === 'canary';
  const rows = isCanary ? [['RETURN ADDRESS', '#9B87B4'], ['SAVED RBP', '#F1F3EE'], ['TLS GUARD COPY', '#E4CF82'], ['input crosses here', '#CA6763'], ['name[32]', '#F1F3EE']] : mode === 'source' ? [['name[32]', '#F1F3EE'], ['read(..., 128)', '#CA6763'], ['saved return path', '#9B87B4']] : [['RETURN ADDRESS', '#9B87B4'], ['SAVED RBP', '#F1F3EE'], ['bytes 32..127', '#CA6763'], ['name[32]', '#F1F3EE']];
  return `<text x="1330" y="325" fill="#A2ADA5" font-family="JetBrains Mono, monospace" font-size="17" font-weight="700">STACK MODEL / CONTROL FLOW</text>${rows.map((row, index) => `<rect x="1370" y="${370 + index * 66}" width="350" height="58" rx="8" fill="${row[1] === '#CA6763' ? '#251412' : row[1] === '#E4CF82' ? '#2D2918' : '#0B1410'}" stroke="#2D4437" stroke-width="3"/><text x="1400" y="${408 + index * 66}" fill="${row[1]}" font-family="JetBrains Mono, monospace" font-size="20" font-weight="700">${row[0]}</text>`).join('')}<path d="M1340 370V${370 + rows.length * 66 - 8}" stroke="#E4CF82" stroke-width="4"/><text x="1280" y="350" fill="#E4CF82" font-family="JetBrains Mono, monospace" font-size="17" font-weight="700">32 bytes</text>`;
};

await mkdir(targetDir, {recursive: true});
for (const scene of scenes) {
  const evidenceLines = scene.evidence.split('\n').filter(Boolean).slice(0, 20).map(line => line.length > 78 ? `${line.slice(0, 75)}…` : line);
  const [firstTitle, secondTitle] = titleLines(scene.title);
  const dialogueLines = wrap(scene.dialogue, 36).slice(0, 7);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs><pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#21352A" stroke-width="1"/></pattern><clipPath id="evidence-clip"><rect x="100" y="314" width="796" height="560" rx="0"/></clipPath></defs>
  <rect width="1920" height="1080" fill="#050B08"/><rect width="1920" height="1080" fill="url(#grid)" opacity=".34"/>
  <text x="98" y="88" fill="#8CCB9A" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="22" font-weight="700" letter-spacing="3">${esc(scene.number <= 3 ? '00 · HOW DID WE GET HERE?' : scene.number <= 8 ? '01 · THE EVIDENCE LAB' : scene.number <= 10 ? '02 · BASELINE' : scene.number <= 16 ? '03 · NX' : scene.number <= 25 ? '04 · STACK CANARIES' : scene.number <= 33 ? '05 · ASLR' : scene.number <= 38 ? '06 · PIE' : scene.number <= 47 ? '07 · RELRO' : '08 · DEFENSE IN DEPTH')}</text>
  <text x="1270" y="88" fill="#A2ADA5" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="19" font-weight="700" letter-spacing="2">BINARY DEFENSES / LINUX x86-64</text>
  <text x="98" y="164" fill="#E4CF82" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="31" font-weight="700">${String(scene.number).padStart(2, '0')}</text>
  ${textLines([firstTitle, secondTitle].filter(Boolean), 160, 164, {fill:'#F1F3EE', size:63, weight:800, leading:68})}
  <rect x="98" y="255" width="800" height="620" rx="20" fill="#0D1510" stroke="#2D4437" stroke-width="3"/>
  <circle cx="128" cy="282" r="7" fill="#CA6763"/><circle cx="150" cy="282" r="7" fill="#E4CF82"/><circle cx="172" cy="282" r="7" fill="#8CCB9A"/>
  <text x="204" y="290" fill="#8CCB9A" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="17" font-weight="700">${esc(scene.evidenceFile)}</text><line x1="98" x2="898" y1="315" y2="315" stroke="#2D4437" stroke-width="3"/>
  <g clip-path="url(#evidence-clip)">${textLines(evidenceLines, 128, 352, {mono:true, size:15, leading:24})}</g>
  <rect x="98" y="496" width="800" height="3" fill="#E4CF82" opacity=".9"/><rect x="98" y="493" width="800" height="9" fill="#050B08" opacity=".35"/>
  <line x1="940" x2="940" y1="274" y2="864" stroke="#2D4437" stroke-width="3"/>
  <text x="966" y="305" fill="#A2ADA5" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="16" font-weight="700" letter-spacing="2">ESTABLISH → OPERATE → CONSEQUENCE</text>
  <text x="966" y="358" fill="#F1F3EE" font-family="Inter, DejaVu Sans, sans-serif" font-size="39" font-weight="800">${esc(scene.mode.toUpperCase())}</text>
  ${textLines(dialogueLines, 966, 404, {fill:'#A2ADA5', size:19, leading:28})}
  <rect x="966" y="670" width="294" height="70" rx="12" fill="#0A1310" stroke="#2D4437" stroke-width="3"/><text x="988" y="714" fill="#A7DDE0" font-family="JetBrains Mono, monospace" font-size="16" font-weight="700">${esc(scene.evidenceFile.slice(0, 28))}</text>
  ${modeModel(scene.mode)}
  <rect x="98" y="950" width="1250" height="70" fill="#050B08" stroke="#2D4437" stroke-width="2"/><text x="120" y="994" fill="#A7DDE0" font-family="JetBrains Mono, monospace" font-size="17" font-weight="700">LAB › binary-defenses-lab › ${esc(scene.evidenceFile)} › scene ${scene.number}</text>
  <rect x="1410" y="950" width="412" height="70" fill="#050B08" stroke="#8CCB9A" stroke-width="3"/><text x="1430" y="980" fill="#8CCB9A" font-family="JetBrains Mono, monospace" font-size="14" font-weight="700">${scene.number <= 3 ? 'RECONSTRUCTION — SERIES RECAP' : scene.number >= 48 ? 'DERIVED SUMMARY — TRACEABLE' : 'REAL OUTPUT / EVIDENCE-DERIVED'}</text><text x="1430" y="1004" fill="#8CCB9A" font-family="JetBrains Mono, monospace" font-size="14" font-weight="700">LABELED VISUAL EXPLANATION</text>
</svg>`;
  const name = `scene-${String(scene.number).padStart(2, '0')}.svg`;
  await writeFile(resolve(targetDir, name), svg);
}

console.log(`Generated ${scenes.length} evidence slates in ${targetDir}`);
