import {mkdir, readFile, writeFile} from 'node:fs/promises';

const durations = [18, 37, 37, 46, 50, 57, 67, 53, 70, 50, 60, 73, 57, 65, 70, 68, 77, 75, 90, 85, 75, 65, 53, 27];
const script = await readFile('script.md', 'utf8');
const parts = script.split(/^##\s+/m).slice(1)
  .map((section, index) => ({
    id: String(index).padStart(2, '0'),
    duration: durations[index],
    text: section.slice(section.indexOf('\n') + 1).replaceAll('`', '').replaceAll('\n', ' ').replaceAll(/\s+/g, ' ').trim(),
  }));

if (parts.length !== durations.length) {
  throw new Error(`Expected ${durations.length} narration sections, found ${parts.length}.`);
}

const plan = parts.map(entry => ({
  ...entry,
  words: entry.text.match(/\S+/g)?.length ?? 0,
  wpm: Number(((entry.text.match(/\S+/g)?.length ?? 0) / (entry.duration / 60)).toFixed(1)),
}));
await mkdir('audio', {recursive: true});
await writeFile('audio/narration-segments.json', `${JSON.stringify(plan, null, 2)}\n`);
console.table(plan.map(({id, duration, words, wpm}) => ({id, duration, words, wpm})));
const total = plan.reduce((sum, item) => sum + item.duration, 0);
const totalWords = plan.reduce((sum, item) => sum + item.words, 0);
console.log(`TOTAL ${total}s · ${totalWords} words · ${(totalWords / (total / 60)).toFixed(1)} WPM`);
