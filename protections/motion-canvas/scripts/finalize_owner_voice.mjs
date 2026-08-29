#!/usr/bin/env node
/* Concatenate natural-duration owner clips with no padding or tempo coercion. */
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(path.join(root, 'audio/narration-segments.json'), 'utf8'));
const clips = path.join(root, 'audio/owner-clips');
const audio = path.join(root, 'audio');
const data = path.join(root, 'data');
const list = path.join(audio, '.owner-clips.concat.txt');
const output = path.join(audio, 'narration.wav');
mkdirSync(data, {recursive: true});

const probe = file => {
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file], {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(result.stderr || `ffprobe failed for ${file}`);
  return Number(result.stdout.trim());
};
const rows = [];
let cursor = 0;
for (const entry of manifest) {
  const file = path.join(clips, `${entry.id}-speech.wav`);
  if (!existsSync(file)) throw new Error(`Owner voice release block: missing ${file}`);
  const duration = probe(file);
  rows.push({id: entry.id, start: Number(cursor.toFixed(3)), end: Number((cursor + duration).toFixed(3)), duration: Number(duration.toFixed(3))});
  cursor += duration;
}
writeFileSync(list, rows.map(row => `file '${path.join(clips, `${row.id}-speech.wav`).replaceAll("'", "'\\\\''")}'`).join('\n') + '\n');
const joined = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c:a', 'pcm_s16le', '-ar', '44100', '-ac', '2', output], {stdio: 'inherit'});
if (joined.status !== 0) process.exit(joined.status ?? 1);
writeFileSync(path.join(data, 'timing.json'), JSON.stringify({duration: Number(cursor.toFixed(3)), clips: rows}, null, 2) + '\n');
console.log(JSON.stringify({output, clips: rows.length, duration: Number(cursor.toFixed(3))}, null, 2));
