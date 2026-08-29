import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const audio = path.join(root, 'audio');
const clips = path.join(audio, 'chatterbox-clips');
const manifest = JSON.parse(readFileSync(path.join(audio, 'narration-segments.json'), 'utf8'));
const targetSeconds = manifest.reduce((sum, segment) => sum + segment.duration, 0);
const missing = manifest.filter(({id}) => !existsSync(path.join(clips, `${id}.wav`))).map(({id}) => id);
if (missing.length) throw new Error(`Missing fitted narration clips: ${missing.join(', ')}`);

const concat = path.join(clips, 'concat.txt');
const output = path.join(audio, 'narration.wav');
const qa = path.join(audio, 'chatterbox-full');
mkdirSync(qa, {recursive: true});
writeFileSync(concat, manifest.map(({id}) => `file '${path.join(clips, `${id}.wav`).replaceAll("'", "'\\''")}'`).join('\n') + '\n');

const encode = spawnSync('ffmpeg', [
  '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', concat,
  '-af', `loudnorm=I=-18:TP=-1.5:LRA=7,apad,atrim=duration=${targetSeconds}`,
  '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', output,
], {stdio: 'inherit'});
if (encode.status !== 0) process.exit(encode.status ?? 1);

const probe = spawnSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', output,
], {encoding: 'utf8'});
if (probe.status !== 0) process.exit(probe.status ?? 1);
const duration = Number(probe.stdout.trim());
if (Math.abs(duration - targetSeconds) > 0.08) throw new Error(`Narration duration ${duration}s, expected ${targetSeconds}s.`);

const sha256 = createHash('sha256').update(readFileSync(output)).digest('hex');
writeFileSync(path.join(qa, 'summary.json'), `${JSON.stringify({
  source: 'local Chatterbox-Turbo owner-voice clone',
  clipCount: manifest.length,
  durationSeconds: duration,
  sampleRate: 44100,
  channels: 2,
  sha256,
}, null, 2)}\n`);
console.log(`Created ${output} (${duration.toFixed(3)}s)`);
