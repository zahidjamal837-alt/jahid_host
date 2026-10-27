import { defineConfig } from 'vite';

// base './' lets the build work on any static host, including sub-paths (GitHub Pages).
export default defineConfig({
  base: './',
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: { output: { manualChunks: { maplibre: ['maplibre-gl'], gsap: ['gsap'] } } }
  }
});
