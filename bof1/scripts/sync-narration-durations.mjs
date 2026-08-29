import {readFile, writeFile} from 'node:fs/promises';
import {DURATIONS, IDS} from './narration-plan.mjs';

const file = 'src/storyboard.ts';
let source = await readFile(file, 'utf8');
for (let index = 0; index < IDS.length; index++) {
  const id = IDS[index];
  const expression = new RegExp(`(\\{id: '${id}'[^\\n]*?duration: )\\d+`);
  if (!expression.test(source)) throw new Error(`Missing storyboard duration for ${id}`);
  source = source.replace(expression, `$1${DURATIONS[index]}`);
}
await writeFile(file, source);

const markdownFile = 'STORYBOARD.md';
let markdown = await readFile(markdownFile, 'utf8');
let elapsed = 0;
for (let index = 0; index < IDS.length; index++) {
  const id = IDS[index];
  const duration = DURATIONS[index];
  const timestamp = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;
  const row = new RegExp(`^\\| [^|]+ \\| ${id} \\| ([^|]+) \\| \\d+s \\|`, 'm');
  if (!row.test(markdown)) throw new Error(`Missing storyboard table row for ${id}`);
  markdown = markdown.replace(row, `| ${timestamp} | ${id} | $1 | ${duration}s |`);
  elapsed += duration;
}
await writeFile(markdownFile, markdown);
console.log(`Synchronized ${IDS.length} storyboard and documentation durations (${elapsed} seconds).`);
