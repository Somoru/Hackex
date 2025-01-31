import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // Ensures the base path is correct
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000, // Optional: Specify port
    open: true, // Optional: Open browser automatically
    // Add this middleware for history fallback
    middlewareMode: false,
    hmr: true, // Enable Hot Module Replacement
    historyApiFallback: true,
  },
});
