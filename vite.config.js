// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/upload': 'http://localhost:5000',
      '/products': 'http://localhost:5000',
    },
  },
});