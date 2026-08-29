import {spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const input = path.join(root, 'output', 'picoctf-buffer-overflow-1-final.mp4');
const output = path.join(root, 'output', 'picoctf-buffer-overflow-1-replacement.mp4');
const reportPath = path.join(root, 'output', 'transition-gap-report.json');
const segments = JSON.parse(readFileSync(path.join(root, 'audio', 'narration-segments.json'), 'utf8'));
// The generated clips were padded before concatenation.  Compress only pauses
// long enough to read as an inter-scene hold; keep a natural 120 ms breath.
const keepGap = 0.12;
const minimumGap = 0.75;

const probe = spawnSync('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', input,
], {encoding: 'utf8'});
if (probe.status !== 0) throw new Error(probe.stderr || 'ffprobe failed');
const sourceDuration = Number(probe.stdout.trim());

const detect = spawnSync('ffmpeg', [
  '-hide_banner', '-i', input,
  '-af', 'silencedetect=noise=-42dB:d=0.05',
  '-vn', '-f', 'null', '-',
], {encoding: 'utf8', maxBuffer: 16 * 1024 * 1024});
const detectionLog = `${detect.stdout}\n${detect.stderr}`;
const events = [...detectionLog.matchAll(/silence_(start|end):\s*([0-9.]+)/g)]
  .map(match => ({type: match[1], time: Number(match[2])}));
const silences = [];
let pendingStart = null;
for (const event of events) {
  if (event.type === 'start') pendingStart = event.time;
  if (event.type === 'end' && pendingStart !== null) {
    silences.push({start: pendingStart, end: event.time});
    pendingStart = null;
  }
}
if (pendingStart !== null) silences.push({start: pendingStart, end: sourceDuration});

let cursor = 0;
const boundaries = segments.slice(0, -1).map(segment => {
  cursor += segment.duration;
  return {after: segment.id, at: cursor};
});

const cuts = silences.filter(silence => silence.end - silence.start >= minimumGap).map(silence => {
  const midpoint = (silence.start + silence.end) / 2;
  const boundary = boundaries.toSorted((a, b) => Math.abs(a.at - midpoint) - Math.abs(b.at - midpoint))[0];
  const removable = silence.end - silence.start - keepGap;
  const left = keepGap / 2;
  return {
    nearestBoundary: boundary,
    boundaryDistance: Math.abs(boundary.at - midpoint),
    status: 'cut',
    silence,
    start: silence.start + left,
    end: silence.end - left,
    removed: removable,
  };
});

const actualCuts = cuts;
const keep = [];
let keepStart = 0;
for (const cut of actualCuts) {
  keep.push({start: keepStart, end: cut.start});
  keepStart = cut.end;
}
keep.push({start: keepStart, end: sourceDuration});

const removedRanges = actualCuts
  .map(cut => `between(t,${cut.start.toFixed(6)},${cut.end.toFixed(6)})`)
  .join('+');
const filters = [
  `[0:v]select='not(${removedRanges})',setpts=N/(30*TB)[v]`,
  `[0:a]aselect='not(${removedRanges})',asetpts=N/SR/TB[a]`,
];

const removedSeconds = actualCuts.reduce((sum, cut) => sum + cut.removed, 0);
const report = {
  source: path.relative(root, input),
  output: path.relative(root, output),
  sourceDuration,
  keepGap,
  minimumGap,
  boundaryCount: boundaries.length,
  cutCount: actualCuts.length,
  removedSeconds,
  expectedDuration: sourceDuration - removedSeconds,
  cuts,
};
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  boundaryCount: report.boundaryCount,
  cutCount: report.cutCount,
  removedSeconds: Number(removedSeconds.toFixed(3)),
  expectedDuration: Number(report.expectedDuration.toFixed(3)),
  longestRemainingSilence: Number(Math.max(keepGap, ...silences.filter(silence => silence.end - silence.start < minimumGap).map(silence => silence.end - silence.start)).toFixed(3)),
}, null, 2));

if (!process.argv.includes('--render')) process.exit(0);

const render = spawnSync('nice', [
  '-n', '10', 'ffmpeg', '-y', '-hide_banner', '-loglevel', 'warning', '-stats',
  '-i', input,
  '-filter_complex', filters.join(';'),
  '-map', '[v]', '-map', '[a]',
  '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-threads', '2',
  '-c:a', 'aac', '-b:a', '192k',
  '-movflags', '+faststart', output,
], {stdio: 'inherit'});
if (render.status !== 0) process.exit(render.status ?? 1);
