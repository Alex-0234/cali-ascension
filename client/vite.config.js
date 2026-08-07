import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // The API is served from the same origin as the app (see vercel.json rewrites)
  // so the auth cookie stays first-party. Mirror that locally.
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      // Never let the SPA navigation fallback swallow API requests.
      navigateFallbackDenylist: [/^\/api/],
    },
    manifest: {
      name: 'Calistenics Ascension',
      short_name: 'Cali Ascension',
      description: 'An RPG-like calisthenics workout tracker',
      theme_color: '#16161a',
      background_color: '#0a0a0a',
      display: 'standalone',
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  })],
})