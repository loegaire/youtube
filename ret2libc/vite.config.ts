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
  plugins: [motionCanvas(), ffmpeg()],
  cacheDir: '.vite',
  resolve: {
    alias: {
      // Scene metadata asks Vite to dynamically load this editor plugin.  The
      // project reuses the sibling dependency store, so map the package's
      // directory entry point explicitly instead of leaving a 404 in the
      // Motion Canvas editor.
      '@motion-canvas/2d/editor': '/home/thinh/proj/youtube/ret2libc/node_modules/@motion-canvas/2d/editor/index.js',
      '@motion-canvas/2d': '/home/thinh/proj/youtube/ret2libc/node_modules/@motion-canvas/2d',
      '@motion-canvas/core': '/home/thinh/proj/youtube/ret2libc/node_modules/@motion-canvas/core',
    },
  },
  optimizeDeps: {
    include: ['@motion-canvas/2d/editor'],
  },
  server: {
    fs: {
      // The stock Motion Canvas editor requests its own stylesheet through an
      // /@fs/ URL.  Our shared dependencies live beside this project, so make
      // that exact read-only dependency path available to the local preview.
      allow: [
        '/home/thinh/proj/youtube/ret2libc',
        '/home/thinh/proj/youtube/bof1/node_modules',
      ],
    },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        entryFileNames: 'project.js',
      },
    },
  },
});
