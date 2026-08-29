import {defineConfig} from 'vite';

export default defineConfig({
  root: 'preview',
  base: './',
  build: {target: 'es2022', outDir: '../audit-dist', emptyOutDir: true},
});
