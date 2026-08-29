import {existsSync, mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const frames = 'output/project/%06d.png';
const duration = '156.166667';
if (!existsSync('output/project/000000.png')) throw new Error('No Motion Canvas frames found.');
if (!existsSync('audio/narration-render-aligned.wav')) throw new Error('No render-aligned owner narration WAV found.');
mkdirSync('renders', {recursive: true});

const clean = spawnSync('ffmpeg', [
  '-y', '-hide_banner', '-loglevel', 'warning', '-framerate', '24', '-start_number', '0', '-i', frames,
  '-stream_loop', '-1', '-i', 'assets/music/dova-7674-kamikakushi-loop.mp3', '-i', 'audio/narration-render-aligned.wav',
  '-filter_complex', `[1:a]volume=0.045,afade=t=in:st=0:d=1.5,afade=t=out:st=${(Number(duration) - 1.5).toFixed(3)}:d=1.5[music];[2:a]volume=1.0[narration];[music][narration]amix=inputs=2:duration=first:normalize=0[audio]`,
  '-map', '0:v:0', '-map', '[audio]', '-t', duration,
  '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', '-threads', '1',
  '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', 'renders/uaf-foundations-owner-voice-clean.mp4',
], {stdio: 'inherit'});
if (clean.status !== 0) process.exit(clean.status ?? 1);

const captioned = spawnSync('ffmpeg', [
  '-y', '-hide_banner', '-loglevel', 'warning', '-i', 'renders/uaf-foundations-owner-voice-clean.mp4',
  '-vf', 'ass=assets/captions/uaf-foundations-owner-voice.ass', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', '-threads', '1',
  '-c:a', 'copy', '-movflags', '+faststart', 'renders/uaf-foundations-owner-voice-captioned.mp4',
], {stdio: 'inherit'});
if (captioned.status !== 0) process.exit(captioned.status ?? 1);
console.log('Created clean and captioned masters.');
