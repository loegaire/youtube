import {mkdirSync, existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

const frames = 'output/project/%06d.png';
if (!existsSync('output/project/000000.png')) throw new Error('Motion Canvas frames are missing; render the project before encoding.');
if (!existsSync('audio/narration.wav')) throw new Error('Narration WAV is missing.');
mkdirSync('renders', {recursive: true});
const result = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'warning', '-framerate', '24', '-start_number', '0', '-i', frames, '-i', 'audio/narration.wav', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-threads', '2', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', 'renders/ret2libc-evidence-route-clean.mp4'], {stdio: 'inherit'});
if (result.status !== 0) process.exit(result.status ?? 1);
