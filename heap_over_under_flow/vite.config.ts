import {defineConfig} from 'vite';
import {resolve} from 'node:path';
import ffmpegModule from '@motion-canvas/ffmpeg';
import motionCanvasModule from '@motion-canvas/vite-plugin';

const motionCanvas = typeof motionCanvasModule === 'function'
  ? motionCanvasModule
  : (motionCanvasModule as {default: typeof motionCanvasModule}).default;
const ffmpeg = typeof ffmpegModule === 'function'
  ? ffmpegModule
  : (ffmpegModule as {default: typeof ffmpegModule}).default;
const dependency = (...parts: string[]) => resolve(process.cwd(), 'node_modules', ...parts);

export default defineConfig({
  plugins: [motionCanvas(), ffmpeg()],
  cacheDir: '.vite',
  resolve: {
    alias: [
      {find: /^@motion-canvas\/2d\/lib\/jsx-runtime$/, replacement: dependency('@motion-canvas', '2d', 'lib', 'jsx-runtime.js')},
      {find: /^@motion-canvas\/2d$/, replacement: dependency('@motion-canvas', '2d', 'lib', 'index.js')},
      {find: /^@motion-canvas\/core$/, replacement: dependency('@motion-canvas', 'core', 'lib', 'index.js')},
    ],
  },
  server: {fs: {allow: ['..']}},
  build: {
    target: 'es2022',
    rollupOptions: {output: {entryFileNames: 'project.js'}},
  },
});
