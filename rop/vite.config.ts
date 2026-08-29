import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';
import ffmpeg from '@motion-canvas/ffmpeg';

export default defineConfig({
  cacheDir: './.vite-cache',
  plugins: [
    motionCanvas({
      project: './src/project.ts',
      output: './output',
    }),
    ffmpeg(),
  ],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        entryFileNames: 'project.js',
      },
    },
  },
});
