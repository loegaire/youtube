import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';

const fps = 24;
const frames = [367, 333, 374, 367, 358, 359, 453, 369, 342, 426];
const targetDuration = frames.reduce((sum, frameCount) => sum + frameCount, 0) / fps;
const clips = 'audio/owner-chatterbox-clips';
const output = 'audio/render-aligned-clips';
const segments = JSON.parse(readFileSync('audio/narration-segments.json', 'utf8'));
if (segments.length !== frames.length) throw new Error('Narration and scene timing counts differ.');
mkdirSync(output, {recursive: true});

function run(command, args) {
  const result = spawnSync(command, args, {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr}`);
  return result.stdout;
}

function probe(file) {
  return Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file]).trim());
}

const manifest = [];
for (let index = 0; index < segments.length; index++) {
  const segment = segments[index];
  const source = `${clips}/${segment.id}.wav`;
  if (!existsSync(source)) throw new Error(`Missing Chatterbox owner-voice clip ${source}`);
  const sourceDuration = probe(source);
  const visualDuration = frames[index] / fps;
  const tempo = sourceDuration > visualDuration ? sourceDuration / visualDuration : 1;
  if (tempo > 1.15) throw new Error(`Required tempo ${tempo.toFixed(4)} exceeds owner-voice limit for ${segment.id}`);
  const filter = sourceDuration > visualDuration
    ? `atempo=${tempo.toFixed(8)},atrim=duration=${visualDuration.toFixed(8)}`
    : `apad,atrim=duration=${visualDuration.toFixed(8)}`;
  const target = `${output}/${segment.id}.wav`;
  run('ffmpeg', ['-y', '-v', 'error', '-i', source, '-af', filter, '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', target]);
  manifest.push({
    id: segment.id,
    source: resolve(source),
    sourceDuration,
    visualFrames: frames[index],
    visualDuration,
    filter,
  });
}

const concat = manifest.map(({id}) => `file '${resolve(`${output}/${id}.wav`).replaceAll("'", "'\\''")}'`).join('\n');
writeFileSync(`${output}/concat.txt`, `${concat}\n`);
run('ffmpeg', [
  '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', `${output}/concat.txt`,
  '-af', `loudnorm=I=-18:TP=-1.5:LRA=7,apad,atrim=duration=${targetDuration.toFixed(8)}`,
  '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', 'audio/narration.wav',
]);
writeFileSync(`${output}/manifest.json`, JSON.stringify({
  engine: 'Chatterbox-Turbo owner voice clone',
  reference: '../voice.m4a',
  fps,
  targetDuration,
  frames,
  clips: manifest,
}, null, 2) + '\n');
console.log(`Created owner-voice narration aligned to ${targetDuration.toFixed(6)} seconds.`);
