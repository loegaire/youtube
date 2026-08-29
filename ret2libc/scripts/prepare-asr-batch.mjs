import {existsSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const segments = JSON.parse(readFileSync('audio/narration-segments-expanded.json', 'utf8'));
const source = path.resolve('audio/chatterbox-clips-safe');
const output = path.resolve('audio/asr');
mkdirSync(output, {recursive: true});

for (const segment of segments) {
  const sourceClip = path.join(source, `${segment.id}-raw.wav`);
  const destination = path.join(output, `${segment.id}-speech.wav`);
  if (!existsSync(sourceClip)) throw new Error(`Missing raw narration: ${sourceClip}`);
  rmSync(destination, {force: true});
  symlinkSync(sourceClip, destination);
}

const batch = segments.map(segment => ({
  id: segment.id,
  sourceText: segment.text,
}));
writeFileSync(path.join(output, 'full-batch.json'), `${JSON.stringify(batch, null, 2)}\n`);
console.log(`Prepared ${batch.length} raw owner-voice clips for ASR.`);
