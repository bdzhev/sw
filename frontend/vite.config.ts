import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    // visualizer({
    //   filename: 'stats.html',
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          switch (true) {
            case id.includes('ogl'):
              return 'ogl';
            case id.includes('gsap'):
              return 'gsap';
            case id.includes('zod'):
              return 'zod';
            case id.includes('tanstack'):
              return 'tanstack';
            case id.includes('supabase'):
              return 'supabase';
            case id.includes('node_modules'):
              return 'vendor';
          }
        },
      },
    },
  },
});
