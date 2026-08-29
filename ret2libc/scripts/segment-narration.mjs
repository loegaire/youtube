import {readFileSync, writeFileSync} from 'node:fs';

const source = JSON.parse(readFileSync('audio/narration-segments.json', 'utf8'));
const maxWords = 42;
const expanded = [];

for (const chapter of source) {
  const sentences = chapter.text.split(/(?<=[.!?])\s+/)
    .flatMap(sentence => sentence.trim().split(/(?<=[,;:])\s+/))
    .map(sentence => sentence.trim())
    .filter(Boolean);
  const groups = [];
  let group = [];
  let words = 0;
  for (const sentence of sentences) {
    const sentenceWords = sentence.split(/\s+/).length;
    if (group.length && words + sentenceWords > maxWords) {
      groups.push(group.join(' '));
      group = [];
      words = 0;
    }
    group.push(sentence);
    words += sentenceWords;
  }
  if (group.length) groups.push(group.join(' '));
  const totalWords = groups.reduce((sum, text) => sum + text.split(/\s+/).length, 0);
  groups.forEach((text, index) => {
    const id = `${chapter.id}${String.fromCharCode(97 + index)}`;
    const duration = Number((chapter.duration * text.split(/\s+/).length / totalWords).toFixed(3));
    expanded.push({id, duration, text, chapter: chapter.id});
  });
}

writeFileSync('audio/narration-segments-expanded.json', JSON.stringify(expanded, null, 2) + '\n');
console.log(`Wrote ${expanded.length} sentence-bounded clips for ${expanded.reduce((sum, entry) => sum + entry.duration, 0).toFixed(3)} seconds.`);
