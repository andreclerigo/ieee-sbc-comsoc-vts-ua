import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/vtools-events': {
        target: 'https://events.vtools.ieee.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vtools-events/, '/RST/events/api/public/v7/events/list')
      },
      '/api/vtools-meetings': {
        target: 'https://events.vtools.ieee.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vtools-meetings/, '/meetings/R80045/-0/365')
      }
    }
  }
});
