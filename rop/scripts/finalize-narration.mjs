import {spawnSync} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const clips = path.join(root, 'audio', 'chatterbox-clips');
const retimed = path.join(root, 'audio', 'retimed-clips');
const manifest = JSON.parse(readFileSync(path.join(root, 'audio', 'narration-segments.json'), 'utf8'));
const concatFile = path.join(retimed, 'concat.txt');
const output = path.join(root, 'audio', 'narration.wav');
mkdirSync(retimed, {recursive: true});

for (const entry of manifest) {
  const source = path.join(clips, `${entry.id}-speech.wav`);
  const target = path.join(retimed, `${entry.id}.wav`);
  const clip = spawnSync('ffmpeg', [
    '-y', '-v', 'error', '-i', source,
    '-af', `apad,atrim=duration=${entry.duration}`,
    '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', target,
  ], {cwd: root, stdio: 'inherit'});
  if (clip.status !== 0) process.exit(clip.status ?? 1);
}

writeFileSync(
  concatFile,
  manifest
    .map(entry => `file '${path.join(retimed, `${entry.id}.wav`).replaceAll("'", "'\\''")}'`)
    .join('\n') + '\n',
);
const duration = manifest.at(-1).end;
const result = spawnSync('ffmpeg', [
  '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', concatFile,
  '-af', `loudnorm=I=-18:TP=-1.5:LRA=7,apad,atrim=duration=${duration}`,
  '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', output,
], {cwd: root, stdio: 'inherit'});
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Created ${output} (${duration.toFixed(3)} seconds)`);
