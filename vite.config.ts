import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // This is crucial for Netlify Drag-and-Drop to find your CSS/JS files
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});