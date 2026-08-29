import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const segments = JSON.parse(readFileSync('audio/narration-segments.json', 'utf8'));
const clips = 'audio/owner-chatterbox-clips';
const missing = segments.filter(({id}) => !existsSync(`${clips}/${id}.wav`)).map(({id}) => id);
if (missing.length) throw new Error(`Owner-voice clips missing: ${missing.join(', ')}`);
mkdirSync('audio/owner-chatterbox-full', {recursive: true});
const list = segments.map(({id}) => `file '${resolve(`${clips}/${id}.wav`).replaceAll("'", "'\\''")}'`).join('\n');
writeFileSync('audio/owner-chatterbox-full/concat.txt', `${list}\n`);
const duration = segments.reduce((sum, segment) => sum + segment.duration, 0);
const result = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', 'audio/owner-chatterbox-full/concat.txt', '-af', `loudnorm=I=-18:TP=-1.5:LRA=7,apad,atrim=duration=${duration.toFixed(3)}`, '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', 'audio/narration.wav'], {stdio: 'inherit'});
if (result.status !== 0) process.exit(result.status ?? 1);
writeFileSync('audio/owner-chatterbox-full/manifest.json', JSON.stringify({engine: 'Chatterbox-Turbo owner voice clone', reference: '../voice.m4a', duration, segments}, null, 2) + '\n');
console.log(`Created owner-voice narration (${duration.toFixed(3)}s).`);
