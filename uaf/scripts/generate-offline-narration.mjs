import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const segments = JSON.parse(readFileSync('audio/narration-segments.json', 'utf8'));
const output = 'audio/offline-clips';
mkdirSync(output, {recursive: true});
const probe = file => {
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file], {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(`Cannot inspect ${file}`);
  return Number(result.stdout.trim());
};
const receipts = [];
for (const segment of segments) {
  const raw = `${output}/${segment.id}-raw.wav`;
  const fitted = `${output}/${segment.id}.wav`;
  const speech = spawnSync('espeak-ng', ['-v', 'en-us', '-s', '185', '-p', '43', '-w', raw, segment.text], {encoding: 'utf8'});
  if (speech.status !== 0) throw new Error(speech.stderr || `Speech synthesis failed for ${segment.id}`);
  const rawDuration = probe(raw);
  const tempo = rawDuration > segment.duration ? rawDuration / segment.duration : 1;
  const filter = [tempo > 1.001 ? `atempo=${tempo.toFixed(6)}` : '', 'loudnorm=I=-18:TP=-1.5:LRA=7', 'apad', `atrim=duration=${segment.duration.toFixed(3)}`].filter(Boolean).join(',');
  const fit = spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', raw, '-af', filter, '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', fitted], {encoding: 'utf8'});
  if (fit.status !== 0) throw new Error(fit.stderr || `Audio fitting failed for ${segment.id}`);
  receipts.push({id: segment.id, targetDuration: segment.duration, rawDuration: Number(rawDuration.toFixed(3)), tempo: Number(tempo.toFixed(3))});
}
writeFileSync(`${output}/receipt.json`, JSON.stringify({engine: 'espeak-ng offline fallback', status: 'rejected after owner-voice clone became available', clips: receipts}, null, 2) + '\n');
console.log(JSON.stringify(receipts, null, 2));
