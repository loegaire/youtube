import {spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(
  readFileSync(path.join(root, 'audio', 'narration-segments.json'), 'utf8'),
);
const duration = manifest.at(-1).end;
const crossfade = 3;
const musicDir = path.join(root, 'audio', 'music');
const tracks = [
  {id: 'simplicity', title: 'Simplicity', artist: 'Scott Buckley'},
  {id: 'way-to-dream', title: 'Way to Dream', artist: 'Keys of Moon'},
  {id: 'wind-of-discovery', title: 'Wind of Discovery', artist: 'Keys of Moon'},
  {id: 'distant-sky', title: 'Distant Sky', artist: 'Keys of Moon'},
];

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
  return dataSize / (sampleRate * channels * bitsPerSample / 8);
};

const paths = tracks.map(track => path.join(musicDir, `${track.id}.wav`));
const sourceDurations = paths.map(wavDuration);
const wayToDreamTrim = Math.min(sourceDurations[1] - 0.35, 119.5);
const otherTrim = (duration + crossfade * (tracks.length - 1) - wayToDreamTrim) / 3;
const trims = [otherTrim, wayToDreamTrim, otherTrim, otherTrim];
for (let index = 0; index < trims.length; index++) {
  if (trims[index] > sourceDurations[index]) {
    throw new Error(`${tracks[index].title} is too short for the planned music bed.`);
  }
}

const filters = trims.map((trim, index) => (
  `[${index}:a]atrim=0:${trim.toFixed(6)},asetpts=PTS-STARTPTS,`
  + `loudnorm=I=-23:TP=-3:LRA=9[t${index}]`
));
filters.push(
  `[t0][t1]acrossfade=d=${crossfade}:c1=tri:c2=tri[x1]`,
  `[x1][t2]acrossfade=d=${crossfade}:c1=tri:c2=tri[x2]`,
  `[x2][t3]acrossfade=d=${crossfade}:c1=tri:c2=tri,`
  + `atrim=duration=${duration},`
  + `afade=t=in:st=0:d=1.2,`
  + `afade=t=out:st=${Math.max(0, duration - 2).toFixed(6)}:d=2[music]`,
);

const bed = path.join(root, 'audio', 'music-bed.wav');
const bedResult = spawnSync('ffmpeg', [
  '-y', '-v', 'error',
  ...paths.flatMap(file => ['-i', file]),
  '-filter_complex', filters.join(';'),
  '-map', '[music]', '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', bed,
], {cwd: root, stdio: 'inherit'});
if (bedResult.status !== 0) process.exit(bedResult.status ?? 1);

const narration = path.join(root, 'audio', 'narration.wav');
const mix = path.join(root, 'audio', 'final-mix.wav');
const mixResult = spawnSync('ffmpeg', [
  '-y', '-v', 'error', '-i', narration, '-i', bed,
  '-filter_complex',
  '[1:a]highpass=f=45,lowpass=f=14500[music];'
  + '[music][0:a]sidechaincompress='
  + 'threshold=0.035:ratio=10:attack=18:release=650:makeup=1[ducked];'
  + '[0:a][ducked]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0,'
  + `alimiter=limit=0.93,apad,atrim=duration=${duration}[mix]`,
  '-map', '[mix]', '-ar', '44100', '-ac', '2', '-c:a', 'pcm_s16le', mix,
], {cwd: root, stdio: 'inherit'});
if (mixResult.status !== 0) process.exit(mixResult.status ?? 1);

const report = {
  duration,
  crossfade,
  targetMusicLufs: -23,
  ducking: {
    threshold: 0.035,
    ratio: 10,
    attackMs: 18,
    releaseMs: 650,
  },
  tracks: tracks.map((track, index) => ({
    ...track,
    sourceDuration: Number(sourceDurations[index].toFixed(3)),
    usedDuration: Number(trims[index].toFixed(3)),
  })),
  outputs: {
    musicBed: path.relative(root, bed),
    finalMix: path.relative(root, mix),
  },
};
writeFileSync(
  path.join(root, 'audio', 'music-mix-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
