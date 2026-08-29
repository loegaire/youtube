import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(root, 'audio/narration-segments.json'), 'utf8'));
const plan = JSON.parse(readFileSync(path.join(root, 'review/dialog-frames/plan.json'), 'utf8'));
const probeDuration = file => {
  const result = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', file], {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(`Could not probe ${file}`);
  return Number.parseFloat(result.stdout.trim());
};
const formatSrtTime = seconds => {
  const milliseconds = Math.round(seconds * 1000);
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  const secs = Math.floor((milliseconds % 60_000) / 1000);
  const ms = milliseconds % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
};

const concat = ['ffconcat version 1.0'];
const captions = [];
const timing = [];
let start = 0;
for (const entry of manifest) {
  const clip = path.join(root, 'audio/chatterbox-clips', `${entry.id}.wav`);
  const sceneDuration = probeDuration(clip);
  const frames = plan.filter(item => item.id === entry.id);
  if (!frames.length) throw new Error(`No dialog frames for ${entry.id}`);
  const totalWords = frames.reduce((sum, item) => sum + item.words, 0);
  for (const frame of frames) {
    const duration = sceneDuration * frame.words / totalWords;
    const file = `../review/dialog-frames/${frame.file}`;
    concat.push(`file '${file}'`, `duration ${duration.toFixed(6)}`);
    captions.push(`${captions.length + 1}\n${formatSrtTime(start)} --> ${formatSrtTime(start + duration)}\n${frame.text}\n`);
    timing.push({id: entry.id, file: frame.file, start, duration, text: frame.text});
    start += duration;
  }
}
const last = timing.at(-1);
concat.push(`file '../review/dialog-frames/${last.file}'`);
mkdirSync(path.join(root, 'assets/captions'), {recursive: true});
writeFileSync(path.join(root, 'assets/dialog-master.ffconcat'), `${concat.join('\n')}\n`);
writeFileSync(path.join(root, 'assets/captions/integer-bugs-final.srt'), `${captions.join('\n')}`);
writeFileSync(path.join(root, 'review/dialog-frames/timing.json'), `${JSON.stringify({duration: start, timing}, null, 2)}\n`);
console.log(`Prepared ${timing.length} visual states for ${start.toFixed(2)} seconds of owner-voice narration.`);
