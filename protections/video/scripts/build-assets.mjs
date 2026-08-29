import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const scriptPath = path.resolve(root, '..', 'binary-defenses-video-script-v2.md');
const lab = path.join(root, 'binary-defenses-lab', 'evidence', 'raw');
const assets = path.join(root, 'assets');
const captions = path.join(assets, 'captions');
fs.mkdirSync(captions, {recursive: true});

const source = fs.readFileSync(scriptPath, 'utf8');
const toSeconds = value => {
  const [minutes, seconds] = value.split(':').map(Number);
  return minutes * 60 + seconds;
};
const compact = value => value.replace(/\s+/g, ' ').replace(/[“”]/g, '"').trim();
const modeFor = number => {
  if (number <= 3) return 'recap';
  if (number <= 8) return 'source';
  if (number <= 10) return 'stack';
  if (number <= 16) return 'nx';
  if (number <= 25) return 'canary';
  if (number <= 33) return 'aslr';
  if (number <= 38) return 'pie';
  if (number <= 47) return 'relro';
  return 'summary';
};
const evidenceFor = number => {
  if (number === 4) return '01-file-tree.txt';
  if (number === 5) return '00-environment.txt';
  if (number === 6) return '02-complete-sources.txt';
  if (number === 7) return '03-build.stderr.txt';
  if (number === 8) return '04-built-artifacts.txt';
  if (number <= 10) return '20-vuln-plain-greet-disassembly.txt';
  if (number <= 13) return number === 11 ? '02-complete-sources.txt' : number === 12 ? '10-exec-probe-nx-program-headers.txt' : '11-nx-runtime.txt';
  if (number <= 16) return '10-exec-probe-rwx-program-headers.txt';
  if (number <= 25) return number === 18 ? '19-canary-guard-and-frame-copy.txt' : number >= 24 ? '21-canary-runtime.txt' : '20-vuln-canary-greet-disassembly.txt';
  if (number <= 33) return number === 28 ? '32-process-maps.txt' : number === 31 ? '33-libc-puts-offset.txt' : '30-aslr-runtime-addresses.txt';
  if (number <= 38) return '31-pie-headers-and-symbols.txt';
  if (number <= 42) return number === 42 ? '42-relro-full-ld-debug.stderr.txt' : '40-relro-full-elf-context.txt';
  if (number <= 47) return number === 43 ? '42-relro-partial-ld-debug.stderr.txt' : number === 44 ? '42-relro-full-ld-debug.stderr.txt' : '41-relro-runtime-pages.txt';
  return '41-relro-runtime-pages.txt';
};

const scenePattern = /^### Scene (\d+) — ([^\n]+)\n\n\*\*\((\d{2}:\d{2})–(\d{2}:\d{2}) — Dialogue:\*\*\s+“([\s\S]*?)”\s+\*\*— Animation:/gm;
const scenes = [];
for (const match of source.matchAll(scenePattern)) {
  const number = Number(match[1]);
  const evidenceFile = evidenceFor(number);
  const evidence = fs.readFileSync(path.join(lab, evidenceFile), 'utf8');
  scenes.push({
    number,
    title: compact(match[2]),
    start: toSeconds(match[3]),
    end: toSeconds(match[4]),
    duration: toSeconds(match[4]) - toSeconds(match[3]),
    dialogue: compact(match[5]),
    mode: modeFor(number),
    evidenceFile,
    evidence,
  });
}
if (scenes.length !== 53) throw new Error(`Expected 53 scripted scenes; found ${scenes.length}`);

const srtTime = value => {
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = Math.floor(value % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},000`;
};
const cues = [];
let cue = 1;
for (const scene of scenes) {
  const words = scene.dialogue.split(/\s+/);
  const groups = [];
  for (let index = 0; index < words.length; index += 8) groups.push(words.slice(index, index + 8).join(' '));
  groups.forEach((text, index) => {
    const start = scene.start + (scene.duration * index) / groups.length;
    const end = scene.start + (scene.duration * (index + 1)) / groups.length;
    cues.push(`${cue++}\n${srtTime(start)} --> ${srtTime(end)}\n${text}\n`);
  });
}
fs.writeFileSync(path.join(assets, 'scene-data.js'), `window.BINARY_DEFENSES_SCENES = ${JSON.stringify(scenes)};\n`);
fs.writeFileSync(path.join(assets, 'narration-segments.json'), `${JSON.stringify(scenes.map(scene => ({id: `scene-${String(scene.number).padStart(2, '0')}`, duration: scene.duration, text: scene.dialogue})), null, 2)}\n`);
fs.writeFileSync(path.join(captions, 'binary-defenses.srt'), cues.join('\n'));
console.log(`Built scene data, narration timing, and ${cue - 1} caption cues from ${scenes.length} scripted scenes.`);
