import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/schoolhub/', // TENTO ŘÁDEK JE KLÍČOVÝ PRO GITHUB PAGES
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify("AIzaSyD3HogACWxdr08Kbz7CmFfEPA-1xCMeu4c"),
        'process.env.GEMINI_API_KEY': JSON.stringify("AIzaSyD3HogACWxdr08Kbz7CmFfEPA-1xCMeu4c")
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
