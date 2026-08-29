import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

export const IDS = [
  '00a','00b','00c','01a','01b','01c','01d','02a','02b','02c','02d',
  '03a','03b','03c','03d','04a','04b','04c','04d','05a','05b','05c','05d',
  '06a','06b','06c','06d','06e','07a','07b','07c','07d','08a','08b','08c',
  '08d','09a','09b','09c','09d','10a','10b','10c',
];

// Keep the 9:48 total while assigning time according to narration density.
// Chapter totals: 44, 52, 62, 49, 64, 49, 63, 60, 54, 45, 46 seconds.
export const DURATIONS = [
  15,14,15, 13,13,13,13, 15,15,16,16, 12,12,12,13, 16,16,16,16,
  12,13,12,12, 12,12,13,13,13, 15,15,15,15, 13,13,14,14,
  11,11,11,12, 15,15,16,
];

const SCENES_PER_CHAPTER = [3,4,4,4,4,4,5,4,4,4,3];

function words(text) {
  return text.match(/\S+/gu) ?? [];
}

function boundaryPenalty(token) {
  if (/[.!?][”'`)]?$/u.test(token)) return 0;
  if (/[;:][”'`)]?$/u.test(token)) return 1;
  if (/,[”'`)]?$/u.test(token)) return 1.75;
  // A natural breath is preferable, but a balanced phrase split is safer
  // than forcing an entire long sentence through a short scene.
  return 3.5;
}

function splitByDuration(text, durations) {
  const tokens = words(text);
  const totalDuration = durations.reduce((sum, value) => sum + value, 0);
  const boundaries = [];
  let previous = 0;
  let elapsed = 0;

  for (let index = 0; index < durations.length - 1; index++) {
    elapsed += durations[index];
    const desired = tokens.length * elapsed / totalDuration;
    const remainingSegments = durations.length - index - 1;
    const min = previous + 6;
    const max = tokens.length - remainingSegments * 6;
    let best = Math.max(min, Math.min(max, Math.round(desired)));
    let bestScore = Number.POSITIVE_INFINITY;

    for (let position = min; position <= max; position++) {
      const distance = Math.abs(position - desired);
      const score = distance + boundaryPenalty(tokens[position - 1]);
      if (score < bestScore) {
        best = position;
        bestScore = score;
      }
    }
    boundaries.push(best);
    previous = best;
  }

  const chunks = [];
  let start = 0;
  for (const end of [...boundaries, tokens.length]) {
    chunks.push(tokens.slice(start, end).join(' '));
    start = end;
  }
  return chunks;
}

export async function buildNarrationPlan({write = true} = {}) {
  const markdown = await readFile('script.md', 'utf8');
  const chapterBodies = markdown.split(/^##\s+/m).slice(1)
    .map(section => section.match(/### Narration\s*\n([\s\S]*?)(?=\n---|\s*$)/)?.[1]?.trim())
    .filter(Boolean)
    .map(text => text.replaceAll('[OFFSET]', '44').replaceAll('[WIN_ADDR]', '0x080491f6'));

  if (chapterBodies.length !== SCENES_PER_CHAPTER.length) {
    throw new Error(`Expected ${SCENES_PER_CHAPTER.length} narration chapters, found ${chapterBodies.length}`);
  }
  if (IDS.length !== DURATIONS.length) throw new Error('Narration IDs and durations differ in length.');

  const texts = [];
  let durationOffset = 0;
  for (let chapter = 0; chapter < chapterBodies.length; chapter++) {
    const count = SCENES_PER_CHAPTER[chapter];
    texts.push(...splitByDuration(chapterBodies[chapter], DURATIONS.slice(durationOffset, durationOffset + count)));
    durationOffset += count;
  }

  const segments = IDS.map((id, index) => {
    const count = words(texts[index]).length;
    const duration = DURATIONS[index];
    return {id, duration, words: count, wpm: Number((count / (duration / 60)).toFixed(1)), text: texts[index]};
  });
  const failed = segments.filter(segment => segment.wpm > 170);
  if (failed.length) {
    throw new Error(`Narration plan exceeds 170 WPM: ${failed.map(({id, wpm}) => `${id}=${wpm}`).join(', ')}`);
  }

  if (write) {
    await writeFile(path.resolve('audio/narration-segments.json'), `${JSON.stringify(segments, null, 2)}\n`);
  }
  return segments;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const segments = await buildNarrationPlan();
  console.log('id\tduration_s\twords\twpm');
  for (const segment of segments) console.log(`${segment.id}\t${segment.duration}\t${segment.words}\t${segment.wpm}`);
  const totalWords = segments.reduce((sum, segment) => sum + segment.words, 0);
  const totalDuration = segments.reduce((sum, segment) => sum + segment.duration, 0);
  console.log(`TOTAL\t${totalDuration}\t${totalWords}\t${(totalWords / (totalDuration / 60)).toFixed(1)}`);
}
