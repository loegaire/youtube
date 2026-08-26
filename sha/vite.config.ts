import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  plugins: [
    (motionCanvas as any).default ? (motionCanvas as any).default() : motionCanvas(),
    (ffmpeg as any).default ? (ffmpeg as any).default() : ffmpeg(),
  ],
});
