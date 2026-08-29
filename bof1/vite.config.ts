import {defineConfig} from 'vite';
import ffmpegModule from '@motion-canvas/ffmpeg';
import motionCanvasModule from '@motion-canvas/vite-plugin';

// Motion Canvas 3 is published as CommonJS. Node 22 may expose the default
// export through an extra `.default` layer when Vite loads an ESM config.
const motionCanvas =
  typeof motionCanvasModule === 'function'
    ? motionCanvasModule
    : (motionCanvasModule as {default: typeof motionCanvasModule}).default;
const ffmpeg =
  typeof ffmpegModule === 'function'
    ? ffmpegModule
    : (ffmpegModule as {default: typeof ffmpegModule}).default;

export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        entryFileNames: 'project.js',
      },
    },
  },
});
