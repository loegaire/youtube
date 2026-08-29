#!/usr/bin/env node
/* Source-correct captions: spoken substitutions improve TTS pronunciation, but
 * captions preserve the script's technical spelling (NX, ASLR, GOT, etc.). */
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(path.join(root, 'audio/narration-segments.json'), 'utf8'));
const timing = JSON.parse(readFileSync(path.join(root, 'data/timing.json'), 'utf8'));
const byId = new Map(timing.clips.map(row => [row.id, row]));
const srt = path.join(root, 'captions', 'binary-defenses.srt');
const ass = path.join(root, 'captions', 'binary-defenses.ass');
mkdirSync(path.dirname(srt), {recursive: true});

const stamp = seconds => {
  const millis = Math.max(0, Math.round(seconds * 1000));
  const h = Math.floor(millis / 3600000);
  const m = Math.floor((millis % 3600000) / 60000);
  const s = Math.floor((millis % 60000) / 1000);
  const ms = millis % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
};
const chunks = text => {
  const words = text.replace(/[“”]/g, '"').split(/\s+/).filter(Boolean);
  const result = [];
  let current = [];
  for (const word of words) {
    current.push(word);
    if (current.length >= 8 || (current.length >= 4 && /[,.!?;:]$/.test(word))) {
      result.push(current); current = [];
    }
  }
  if (current.length) result.push(current);
  return result;
};
let cue = 1;
const output = [];
for (const entry of manifest) {
  const row = byId.get(entry.id);
  if (!row) throw new Error(`Missing final timing for ${entry.id}`);
  const pieces = chunks(entry.text);
  const weights = pieces.map(piece => piece.join(' ').replace(/[^\w]/g, '').length || 1);
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = row.start;
  pieces.forEach((piece, index) => {
    const final = index === pieces.length - 1;
    const end = final ? row.end : cursor + row.duration * weights[index] / total;
    output.push(`${cue++}\n${stamp(cursor)} --> ${stamp(end)}\n${piece.join(' ')}\n`);
    cursor = end;
  });
}
writeFileSync(srt, output.join('\n'));
console.log(`Wrote ${cue - 1} caption cues to ${srt}`);
console.log(`Convert with: python3 /home/thinh/.codex/skills/thinh-youtube-house-style/scripts/srt_to_house_ass.py ${srt} ${ass} --no-prompt`);
