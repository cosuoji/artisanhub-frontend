import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Artisan Directory',
        short_name: 'Artisans',
        description: 'Find trusted artisans near you',
        theme_color: '#1E3A8A',
        background_color: '#F5F5F5',
        workbox: {
    navigateFallback: 'offline.html',
    // runtimeCaching: [
    //       {
    //         // Match all /api/artisans and /api/artisans/:id routes
    //         urlPattern: /^https:\/\/your-api-domain\.com\/api\/artisans(\/.*)?$/,
    //         handler: 'NetworkFirst',
    //         options: {
    //           cacheName: 'artisans-api-cache',
    //           expiration: {
    //             maxEntries: 100,
    //             maxAgeSeconds: 60 * 60 * 24, // 1 day
    //           },
    //           networkTimeoutSeconds: 5,
    //         },
    //       },
    //     ],
      },
        display: 'standalone',
        icons: [
          {
            src: 'web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'web-app-manifest-192x192.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  build: {
    outDir: 'dist',
  },
});
