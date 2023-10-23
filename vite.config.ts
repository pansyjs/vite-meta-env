import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const envPrefix = ['VITE_', 'S_'];

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, envPrefix);

  return {
    envPrefix,
    plugins: [
      react()
    ],
    server: {
      open: true,
      host: true,
      proxy: {
        '/api': {
          target: env.ZT_API_HOST,
          rewrite: (path) => path.replace(/^\/api/, '/api/'),
          changeOrigin: true,
        },
      },
    },
  }
})
