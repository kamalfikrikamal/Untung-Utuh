import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import compression from 'vite-plugin-compression2';
import path from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    // Generate .gz companion files at build time so nginx can serve them via gzip_static
    compression({ algorithm: 'gzip', exclude: [/\.(br|gz)$/, /\.map$/] }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true, // Required for Docker
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '/api'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Vite 8 uses Rolldown — rolldownOptions replaces rollupOptions.
    // manualChunks object form was removed in Vite 8; using function form instead.
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor';
          if (id.includes('node_modules/react-router-dom')) return 'router';
          if (id.includes('node_modules/@tanstack/react-query')) return 'query';
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
});
