import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const segments = JSON.parse(readFileSync('audio/narration-segments.json', 'utf8'));
mkdirSync('audio/offline-full', {recursive: true});
writeFileSync('audio/offline-full/concat.txt', segments.map(({id}) => `file '${resolve(`audio/offline-clips/${id}.wav`).replaceAll("'", "'\\''")}'`).join('\n') + '\n');
const total = segments.reduce((sum, segment) => sum + segment.duration, 0);
const result = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', 'audio/offline-full/concat.txt', '-af', `loudnorm=I=-18:TP=-1.5:LRA=7,apad,atrim=duration=${total.toFixed(3)}`, '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', 'audio/narration.wav'], {stdio: 'inherit'});
if (result.status !== 0) process.exit(result.status ?? 1);
writeFileSync('audio/offline-full/manifest.json', JSON.stringify(segments, null, 2) + '\n');
console.log(`Created fallback narration (${total.toFixed(3)}s).`);
