import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const clips = path.join(root, 'assets', 'audio', 'offline-clips');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets', 'narration-segments.json'), 'utf8'));
fs.mkdirSync(clips, {recursive: true});

const spoken = value => value
  .replace(/`([^`]+)`/g, '$1')
  .replace(/x86-64/gi, 'x eighty-six sixty-four')
  .replace(/GNU_STACK/g, 'GNU stack')
  .replace(/__stack_chk_fail/g, 'stack check fail')
  .replace(/fs:0x28/g, 'F S colon zero x two eight')
  .replace(/0x[0-9a-f]+/gi, 'hex address')
  .replace(/\bRELRO\b/g, 'relro')
  .replace(/\bASLR\b/g, 'A S L R')
  .replace(/\bPIE\b/g, 'P I E')
  .replace(/\bNX\b/g, 'N X');

for (const entry of manifest) {
  const base = path.join(clips, entry.id);
  const raw = `${base}-raw.wav`;
  const fitted = `${base}.wav`;
  if (!fs.existsSync(fitted)) {
    const tts = spawnSync('espeak-ng', ['-v', 'en-us', '-s', '148', '-p', '46', '-w', raw, spoken(entry.text)], {stdio: 'inherit'});
    if (tts.status !== 0) process.exit(tts.status ?? 1);
    const fit = spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', raw, '-af', `loudnorm=I=-18:TP=-1.5:LRA=7,apad,atrim=duration=${entry.duration.toFixed(3)}`, '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', fitted], {stdio: 'inherit'});
    if (fit.status !== 0) process.exit(fit.status ?? 1);
  }
}
const concat = path.join(clips, 'concat.txt');
fs.writeFileSync(concat, manifest.map(entry => `file '${path.join(clips, `${entry.id}.wav`)}'`).join('\n') + '\n');
const output = path.join(root, 'assets', 'audio', 'binary-defenses-narration.wav');
const merge = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', concat, '-af', 'loudnorm=I=-18:TP=-1.5:LRA=7,apad,atrim=duration=1768', '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', output], {stdio: 'inherit'});
if (merge.status !== 0) process.exit(merge.status ?? 1);
fs.writeFileSync(path.join(root, 'assets', 'audio', 'narration-provider.json'), JSON.stringify({provider: 'espeak-ng', reason: 'Local owner-voice model refused new batches because the host had under 3 GiB available RAM; no third-party service was used.', duration: 1768}, null, 2) + '\n');
console.log(`Created ${output}`);
