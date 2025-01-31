import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      // ✅ Prevent Vite from treating `index.html` as a route
      '/index.html': '/',
    },
  },
});
