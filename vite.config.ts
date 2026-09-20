import { defineConfig } from 'vite';

export default defineConfig({
  base: '/libraryManagement/',
  server: {
    port: 9000,
  },
  build: {
    outDir: 'dist',
  },
});
