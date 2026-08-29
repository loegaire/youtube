import {defineConfig} from 'vite';
import ffmpegModule from '@motion-canvas/ffmpeg';
import motionCanvasModule from '@motion-canvas/vite-plugin';

const motionCanvas = typeof motionCanvasModule === 'function'
  ? motionCanvasModule
  : (motionCanvasModule as {default: typeof motionCanvasModule}).default;
const ffmpeg = typeof ffmpegModule === 'function'
  ? ffmpegModule
  : (ffmpegModule as {default: typeof ffmpegModule}).default;

export default defineConfig({
  // node_modules is deliberately shared read-only with the validated sibling
  // project; Vite's mutable optimizer cache belongs in this production folder.
  cacheDir: '.vite-cache',
  plugins: [motionCanvas(), ffmpeg()],
  resolve: {
    // The repertoire is consumed directly rather than copied.  Its source sits
    // outside this package, so resolve its peer imports from this project.
    alias: {
      '@motion-canvas/2d': '/home/thinh/proj/youtube/protections/motion-canvas/node_modules/@motion-canvas/2d',
      '@motion-canvas/core': '/home/thinh/proj/youtube/protections/motion-canvas/node_modules/@motion-canvas/core',
    },
  },
  server: {
    fs: {
      allow: ['/home/thinh/proj/youtube/motion-repertoire/motion-canvas/src'],
    },
  },
  build: {
    target: 'es2022',
    rollupOptions: {output: {entryFileNames: 'project.js'}},
  },
});
