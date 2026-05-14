import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
    tailwindcss(),
    sentryVitePlugin({
      org: '여러분의-sentry-조직명',
      project: '여러분의-sentry-프로젝트명',
      // SENTRY_AUTH_TOKEN은 절대 코드에 하드코딩하지 말고 환경 변수로 주입하세요.
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,

      manifest: {
        name: 'WithFestival',
        short_name: 'WithFestival',
        description: 'with festival web-app',
        theme_color: '#ffffff',
        lang: 'ko',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        scope: '/',
        id: '/',
        prefer_related_applications: false,

        icons: [
          {
            src: '/icons/android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/icons/android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/icons/android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/icons/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/icons/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],

  build: {
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
      },
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://15.135.171.37:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws': {
        target: 'http://15.135.171.37:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws/, ''),
      },
    },
  },
});
