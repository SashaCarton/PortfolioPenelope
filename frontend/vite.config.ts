// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,           // accepte toutes les IP
    // autoriser explicitement l'hôte API (inclut variantes avec port et sous-domaine)
    allowedHosts: [
      'api.penelopeletienne.ovh',
      'api.penelopeletienne.ovh:443',
      'api.penelopeletienne.ovh:80',
      '.penelopeletienne.ovh'
    ],
    // optionnel mais pratique : proxy /api → API (évite CORS en dev)
    proxy: {
      '/api': {
        target: 'https://api.penelopeletienne.ovh',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  },
  preview: {
    host: true            // obligatoire si tu fais vite preview dans Docker
  }
})
