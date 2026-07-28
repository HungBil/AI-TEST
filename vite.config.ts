import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/AI-TEST/',
  build: {
    sourcemap: false,
    minify: 'esbuild'
  }
});
