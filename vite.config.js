import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/yelp': {
          target: 'https://api.yelp.com/v3',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/yelp/, ''),
          headers: {
            Authorization: `Bearer ${env.VITE_YELP_KEY}`,
          },
        },
        '/api': {
          target: `${env.VITE_API_BASE_URL}`,
          changeOrigin: true,
        },
      },
    },
  };
});