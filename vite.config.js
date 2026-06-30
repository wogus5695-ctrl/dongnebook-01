import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        hub: resolve(__dirname, 'hub.html'),
        landing: resolve(__dirname, 'landing.html'),
        guide: resolve(__dirname, 'guide.html'),
        apply: resolve(__dirname, 'apply.html'),
        policy: resolve(__dirname, 'policy.html'),
      }
    }
  }
});
