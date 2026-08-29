import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const beats = JSON.parse(readFileSync(path.join(root, 'data', 'beats.json'), 'utf8'));
const words = text => text.trim().split(/\s+/).filter(Boolean).length;
const manifest = beats.map(beat => {
  const duration = beat.end - beat.start;
  const wordCount = words(beat.narration);
  const speechDuration = Math.min(
    duration - 0.8,
    Math.max(3, wordCount / 115 * 60 + 0.35),
  );
  return {
    id: beat.id,
    start: beat.start,
    end: beat.end,
    duration,
    speechDuration: Number(speechDuration.toFixed(3)),
    words: wordCount,
    allottedWpm: Number((wordCount / duration * 60).toFixed(1)),
    speechBudgetWpm: Number((wordCount / speechDuration * 60).toFixed(1)),
    text: beat.narration,
  };
});

mkdirSync(path.join(root, 'audio'), {recursive: true});
mkdirSync(path.join(root, 'docs'), {recursive: true});
writeFileSync(
  path.join(root, 'audio', 'narration-segments.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

const script = [
  '# Return-Oriented Programming: When the Stack Becomes a Program',
  '',
  'Challenge anchor: `picoCTF 2018 / can-you-gets-me`',
  '',
  ...beats.flatMap(beat => [
    `## ${beat.chapter} · ${Math.floor(beat.start / 60)}:${String(beat.start % 60).padStart(2, '0')}-${Math.floor(beat.end / 60)}:${String(beat.end % 60).padStart(2, '0')}`,
    '',
    `**${beat.title}**`,
    '',
    beat.narration,
    '',
  ]),
].join('\n');
writeFileSync(path.join(root, 'docs', 'SCRIPT.md'), script);

const report = {
  beats: manifest.length,
  duration: manifest.at(-1).end,
  totalWords: manifest.reduce((sum, segment) => sum + segment.words, 0),
  averageAllottedWpm: Number(
    (
      manifest.reduce((sum, segment) => sum + segment.words, 0) /
      manifest.at(-1).end *
      60
    ).toFixed(1),
  ),
  averageSpeechBudgetWpm: Number(
    (
      manifest.reduce((sum, segment) => sum + segment.words, 0) /
      manifest.reduce((sum, segment) => sum + segment.speechDuration, 0) *
      60
    ).toFixed(1),
  ),
  note: 'The supplied timecodes intentionally leave visual breathing room. Speech clips target a natural pace and are padded inside each exact beat.',
};
writeFileSync(
  path.join(root, 'audio', 'narration-budget.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
