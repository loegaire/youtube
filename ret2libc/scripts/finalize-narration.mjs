import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const segments = JSON.parse(readFileSync('audio/narration-segments-expanded.json', 'utf8'));
const clips = 'audio/chatterbox-clips-safe';
const missing = segments.filter(segment => !existsSync(path.join(clips, `${segment.id}.wav`))).map(segment => segment.id);
if (missing.length) throw new Error(`Refusing to finalize incomplete narration; missing clips: ${missing.join(', ')}`);
mkdirSync('audio/chatterbox-full', {recursive: true});
const concat = path.join(clips, 'concat.txt');
writeFileSync(concat, segments.map(segment => `file '${path.resolve(clips, `${segment.id}.wav`).replaceAll("'", "'\\\\''")}'`).join('\n') + '\n');
const duration = segments.reduce((sum, segment) => sum + segment.duration, 0);
const result = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', concat, '-af', `loudnorm=I=-18:TP=-1.5:LRA=7,apad,atrim=duration=${duration}`, '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', 'audio/narration.wav'], {stdio: 'inherit'});
if (result.status !== 0) process.exit(result.status ?? 1);
writeFileSync('audio/chatterbox-full/manifest.json', JSON.stringify(segments, null, 2) + '\n');
console.log(`Created audio/narration.wav (${duration}s)`);
