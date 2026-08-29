import {createHash} from 'node:crypto';
import {readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const clips = path.join(root, 'audio', 'chatterbox-clips');
const qaDir = path.join(clips, 'qa-batches');
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const newestRows = (files, variant) => {
  const rows = new Map();
  for (const file of files.sort((a, b) => statSync(a).mtimeMs - statSync(b).mtimeMs)) {
    if (variant && !path.basename(file).includes(variant)) continue;
    for (const row of readJson(file)) rows.set(row.id, row);
  }
  return [...rows.values()];
};
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');

const metadataFiles = readdirSync(clips)
  .filter(name => name.startsWith('batch-') && name.endsWith('.json'))
  .map(name => path.join(clips, name));
const reportFiles = [
  ...readdirSync(clips).filter(name => name.startsWith('asr-report-')).map(name => path.join(clips, name)),
  ...readdirSync(qaDir).filter(name => name.endsWith('.json')).map(name => path.join(qaDir, name)),
];
const metadata = newestRows(metadataFiles);
const raw = newestRows(reportFiles, 'raw');
const fitted = newestRows(reportFiles, 'fitted');
const full = readJson(path.join(root, 'audio', 'chatterbox-full', 'asr-report.json'))[0];
const stats = rows => ({
  count: rows.length,
  meanWer: Number((rows.reduce((sum, row) => sum + row.wer, 0) / rows.length).toFixed(3)),
  maxWer: Math.max(...rows.map(row => row.wer)),
  maxWerId: rows.toSorted((a, b) => b.wer - a.wer)[0].id,
});
const slowest = metadata.toSorted((a, b) => b.tempo - a.tempo)[0];

const summary = {
  engine: 'Resemble AI Chatterbox-Turbo 0.1.7',
  sourceCommit: '65b18437192794391a0308a8f705b1e33e633948',
  modelSnapshot: '749d1c1a46eb10492095d68fbcf55691ccf137cd',
  segments: metadata.length,
  masterDurationSeconds: 587.991,
  tempo: {maximum: slowest.tempo, segment: slowest.id, limit: 1.15},
  asr: {raw: stats(raw), fitted: stats(fitted), fullTrackWer: full.wer},
  reference: {
    originalSha256: hash(path.join(root, 'audio', 'reference', 'voice-original.m4a')),
    derivedSha256: hash(path.join(root, 'audio', 'reference', 'voice-reference.wav')),
  },
};
writeFileSync(path.join(root, 'audio', 'chatterbox-full', 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
