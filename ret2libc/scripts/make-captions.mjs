import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';

const segments = JSON.parse(readFileSync('audio/narration-segments-expanded.json', 'utf8'));
mkdirSync('assets/captions', {recursive: true});

const pad = value => String(value).padStart(2, '0');
const timestamp = seconds => {
  const milliseconds = Math.round((seconds % 1) * 1000);
  const total = Math.floor(seconds);
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)},${String(milliseconds).padStart(3, '0')}`;
};

let clock = 0;
let count = 1;
const cues = [];
for (const segment of segments) {
  const words = segment.text.replace(/\s+/g, ' ').trim().split(' ');
  const weights = words.map(word => Math.max(1, word.replace(/[^\p{L}\p{N}]/gu, '').length));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = clock;
  for (let start = 0; start < words.length;) {
    const end = Math.min(words.length, start + 7);
    const text = words.slice(start, end).join(' ').replace(/([,.;:!?])\s+/g, '$1\n');
    const wordWeight = weights.slice(start, end).reduce((sum, weight) => sum + weight, 0);
    const duration = segment.duration * wordWeight / totalWeight;
    cues.push(`${count++}\n${timestamp(cursor)} --> ${timestamp(cursor + duration)}\n${text}\n`);
    cursor += duration;
    start = end;
  }
  clock += segment.duration;
}

writeFileSync('assets/captions/ret2libc-evidence-route.srt', `${cues.join('\n')}\n`);
console.log(`Wrote ${count - 1} source-correct cues over ${clock}s.`);
