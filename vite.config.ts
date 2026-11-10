import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          gsap: ['gsap', 'lenis'],
          globe: ['d3-geo', 'topojson-client', 'world-atlas/land-110m.json'],
        },
      },
    },
  },
});
