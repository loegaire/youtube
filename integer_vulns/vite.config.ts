import {defineConfig} from 'vite';
import ffmpegModule from '@motion-canvas/ffmpeg';
import motionCanvasModule from '@motion-canvas/vite-plugin';

const motionCanvas =
  typeof motionCanvasModule === 'function'
    ? motionCanvasModule
    : (motionCanvasModule as {default: typeof motionCanvasModule}).default;
const ffmpeg =
  typeof ffmpegModule === 'function'
    ? ffmpegModule
    : (ffmpegModule as {default: typeof ffmpegModule}).default;

export default defineConfig({
  cacheDir: '.vite',
  plugins: [motionCanvas(), ffmpeg()],
  build: {
    target: 'es2022',
    rollupOptions: {output: {entryFileNames: 'project.js'}},
  },
});
