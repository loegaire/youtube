import {defineConfig} from 'vite';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@motion-canvas/2d/lib',
  },
  build: {
    outDir: 'static-dist',
    emptyOutDir: true,
    lib: {
      entry: 'preview/static-renderer-entry.ts',
      formats: ['iife'],
      name: 'UafStaticRenderer',
      fileName: () => 'uaf-static-renderer.js',
    },
    target: 'es2022',
  },
});
