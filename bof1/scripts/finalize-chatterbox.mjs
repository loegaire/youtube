import {spawnSync} from 'node:child_process';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const clips = path.join(root, 'audio', 'chatterbox-clips');
const manifest = JSON.parse(readFileSync(path.join(root, 'audio', 'narration-segments.json'), 'utf8'));
const concatFile = path.join(clips, 'concat.txt');
const output = path.join(root, 'audio', 'narration.wav');
const fullQa = path.join(root, 'audio', 'chatterbox-full');
mkdirSync(fullQa, {recursive: true});

writeFileSync(concatFile, manifest.map(entry => `file '${path.join(clips, `${entry.id}.wav`).replaceAll("'", "'\\''")}'`).join('\n') + '\n');
const result = spawnSync('ffmpeg', [
  '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', concatFile,
  '-af', 'loudnorm=I=-18:TP=-1.5:LRA=7,apad,atrim=duration=588',
  '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', output,
], {cwd: root, stdio: 'inherit'});
if (result.status !== 0) process.exit(result.status ?? 1);
writeFileSync(path.join(fullQa, 'manifest.json'), JSON.stringify([{
  id: 'narration',
  text: manifest.map(entry => entry.text).join(' '),
}], null, 2) + '\n');
console.log(`Created ${output}`);
