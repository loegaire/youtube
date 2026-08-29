import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';

const segments = JSON.parse(readFileSync('audio/narration-segments.json', 'utf8'));
mkdirSync('assets/captions', {recursive: true});
const pad = n => String(n).padStart(2, '0');
const timestamp = seconds => {
  const whole = Math.floor(seconds);
  const ms = Math.round((seconds - whole) * 1000);
  return `${pad(Math.floor(whole / 3600))}:${pad(Math.floor(whole / 60) % 60)}:${pad(whole % 60)},${String(ms).padStart(3, '0')}`;
};
let startTime = 0;
let cue = 1;
const output = [];
for (const segment of segments) {
  const words = segment.text.split(/\s+/).filter(Boolean);
  const weights = words.map(word => Math.max(1, word.replace(/[^\p{L}\p{N}]/gu, '').length));
  const total = weights.reduce((sum, value) => sum + value, 0);
  let clock = startTime;
  for (let i = 0; i < words.length;) {
    const end = Math.min(words.length, i + 7);
    const phrase = words.slice(i, end).join(' ').replace(/([,.;:!?])\s+/g, '$1\n');
    const weight = weights.slice(i, end).reduce((sum, value) => sum + value, 0);
    const duration = segment.duration * weight / total;
    output.push(`${cue++}\n${timestamp(clock)} --> ${timestamp(clock + duration)}\n${phrase}\n`);
    clock += duration;
    i = end;
  }
  startTime += segment.duration;
}
writeFileSync('assets/captions/uaf-freed-not-gone.srt', `${output.join('\n')}\n`);
console.log(`Wrote ${cue - 1} captions across ${startTime.toFixed(3)}s.`);
