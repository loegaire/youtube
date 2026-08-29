import {mkdirSync, writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

mkdirSync('review', {recursive: true});
const files = ['renders/uaf-foundations-owner-voice-clean.mp4', 'renders/uaf-foundations-owner-voice-captioned.mp4'];
const receipts = [];
for (const file of files) {
  const probe = spawnSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], {encoding: 'utf8'});
  if (probe.status !== 0) throw new Error(probe.stderr || `ffprobe failed for ${file}`);
  const decode = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'null', '-'], {encoding: 'utf8'});
  if (decode.status !== 0) throw new Error(decode.stderr || `decode failed for ${file}`);
  receipts.push({file, probe: JSON.parse(probe.stdout), decode: 'passed'});
}
writeFileSync('review/media-verification.json', JSON.stringify(receipts, null, 2) + '\n');
console.log('Video decode and stream verification passed.');
