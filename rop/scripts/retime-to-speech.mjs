import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fps = 24;
const baseGap = 0.55;
const chapterGap = 0.3;
const beatsPath = path.join(root, 'data', 'beats.json');
const clips = path.join(root, 'audio', 'chatterbox-clips');
const beats = JSON.parse(readFileSync(beatsPath, 'utf8'));

const wavDuration = file => {
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

let cursorFrame = 0;
let totalSpeech = 0;
const retimed = beats.map((beat, index) => {
  const speechDuration = wavDuration(path.join(clips, `${beat.id}-speech.wav`));
  const endsChapter = index === beats.length - 1 || beats[index + 1].chapter !== beat.chapter;
  const frames = Math.ceil((speechDuration + baseGap + (endsChapter ? chapterGap : 0)) * fps);
  const startFrame = cursorFrame;
  const endFrame = startFrame + frames;
  cursorFrame = endFrame;
  totalSpeech += speechDuration;
  return {
    ...beat,
    start: Number((startFrame / fps).toFixed(6)),
    end: Number((endFrame / fps).toFixed(6)),
    startFrame,
    endFrame,
    frames,
  };
});

const words = text => text.trim().split(/\s+/).filter(Boolean).length;
const manifest = retimed.map(beat => {
  const speechDuration = wavDuration(path.join(clips, `${beat.id}-speech.wav`));
  const wordCount = words(beat.narration);
  return {
    id: beat.id,
    start: beat.start,
    end: beat.end,
    duration: Number((beat.frames / fps).toFixed(6)),
    frames: beat.frames,
    speechDuration: Number(speechDuration.toFixed(3)),
    words: wordCount,
    allottedWpm: Number((wordCount / (beat.frames / fps) * 60).toFixed(1)),
    speechWpm: Number((wordCount / speechDuration * 60).toFixed(1)),
    text: beat.narration,
  };
});

const totalDuration = cursorFrame / fps;
const report = {
  fps,
  beats: retimed.length,
  frames: cursorFrame,
  duration: Number(totalDuration.toFixed(6)),
  totalSpeech: Number(totalSpeech.toFixed(3)),
  totalTransitionSpace: Number((totalDuration - totalSpeech).toFixed(3)),
  removedFromPreviousCut: Number((1195 - totalDuration).toFixed(3)),
  baseGap,
  chapterGap,
  note: 'Every beat is aligned to its actual owner-voice clip and rounded to whole 24 fps frames.',
};

writeFileSync(beatsPath, `${JSON.stringify(retimed, null, 2)}\n`);
writeFileSync(
  path.join(root, 'audio', 'narration-segments.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
writeFileSync(
  path.join(root, 'audio', 'retiming-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
