import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(root, 'audio', 'narration-segments.json'), 'utf8'));
const clips = path.join(root, 'audio', 'chatterbox-clips');

const probe = file => {
  const wav = readFileSync(file);
  let channels = 0;
  let sampleRate = 0;
  let bitsPerSample = 0;
  let dataSize = 0;
  for (let offset = 12; offset + 8 <= wav.length;) {
    const id = wav.toString('ascii', offset, offset + 4);
    const size = wav.readUInt32LE(offset + 4);
    if (id === 'fmt ') {
      channels = wav.readUInt16LE(offset + 10);
      sampleRate = wav.readUInt32LE(offset + 12);
      bitsPerSample = wav.readUInt16LE(offset + 22);
    }
    if (id === 'data') {
      dataSize = size;
      break;
    }
    offset += 8 + size + (size % 2);
  }
  if (!channels || !sampleRate || !bitsPerSample || !dataSize) {
    throw new Error(`Could not read WAV duration: ${file}`);
  }
  return dataSize / (sampleRate * channels * bitsPerSample / 8);
};

const stamp = seconds => {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  const milli = ms % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(milli).padStart(3, '0')}`;
};

const chunkWords = text => {
  const words = text.split(/\s+/);
  const chunks = [];
  while (words.length) {
    let size = Math.min(8, words.length);
    if (words.length - size > 0 && words.length - size < 4) {
      size -= 4 - (words.length - size);
    }
    chunks.push(words.splice(0, size).join(' '));
  }
  return chunks;
};

let cue = 1;
const srt = [];
for (const segment of manifest) {
  const speechPath = path.join(clips, `${segment.id}-speech.wav`);
  const speechDuration = probe(speechPath);
  const chunks = chunkWords(segment.text);
  const weights = chunks.map(text => text.split(/\s+/).length);
  const total = weights.reduce((sum, value) => sum + value, 0);
  let cursor = segment.start;
  for (let index = 0; index < chunks.length; index++) {
    const duration = speechDuration * weights[index] / total;
    const end = Math.min(segment.end - 0.2, cursor + duration);
    srt.push(String(cue++), `${stamp(cursor)} --> ${stamp(end)}`, chunks[index], '');
    cursor = end;
  }
}
writeFileSync(path.join(root, 'output', 'rop-captions.srt'), srt.join('\n'));
console.log(`Wrote ${cue - 1} source-correct caption cues.`);
