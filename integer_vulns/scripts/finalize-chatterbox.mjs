import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(root, 'audio/narration-segments.json'), 'utf8'));
const clips = path.join(root, 'audio/chatterbox-clips');
const concat = path.join(clips, 'concat.txt');
mkdirSync(clips, {recursive: true});
const clipPaths = manifest.map(entry => path.join(clips, `${entry.id}.wav`));
const probeDuration = file => {
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file], {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(`Could not probe ${file}`);
  return Number.parseFloat(result.stdout.trim());
};
writeFileSync(concat, clipPaths.map(file => `file '${file}'`).join('\n') + '\n');
const duration = clipPaths.reduce((sum, file) => sum + probeDuration(file), 0);
let result = spawnSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', concat, '-af', 'loudnorm=I=-18:TP=-1.5:LRA=7', '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', path.join(root, 'audio/narration.wav')], {stdio: 'inherit'});
if (result.status !== 0) process.exit(result.status ?? 1);
result = spawnSync('ffmpeg', ['-y', '-v', 'error', '-stream_loop', '-1', '-i', '/home/thinh/proj/youtube/protections/motion-canvas/audio/music/dova-neko-loopable.wav', '-i', path.join(root, 'audio/narration.wav'), '-filter_complex', `[0:a]volume=0.075,atrim=duration=${duration}[bed];[1:a]volume=1.0[voice];[bed][voice]amix=inputs=2:duration=first:dropout_transition=2,loudnorm=I=-17:TP=-1.5:LRA=7`, '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', path.join(root, 'audio/final-mix.wav')], {stdio: 'inherit'});
if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Created audio/final-mix.wav at ${duration}s`);
