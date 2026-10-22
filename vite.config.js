import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import criticalCss from 'vite-plugin-critical-css';

export default defineConfig({
  plugins: [
    react(),
    criticalCss({
      dimensions: [
        { width: 390, height: 844 },
        { width: 1440, height: 900 },
      ],
      pages: ['**/*.html'],
      inline: true,
      deferStylesheets: true,
      timeout: 60000,
      logListings: true,
    }),
  ],

  assetsInclude: [
    '**/*.p7s',
    '**/*.doc',
    '**/*.docx',
    '**/*.xml',
    '**/*.pdf',
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    cssMinify: true,
    assetsInlineLimit: 4096,

    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').pop()

          // Images
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            return 'assets/images/[name]-[hash][extname]'
          }

          // Fonts
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }

          // Documents
          if (/pdf|p7s|doc|docx|xml/i.test(extType)) {
            return 'docs/[name]-[hash][extname]'
          }

          // Other assets
          return 'assets/[name]-[hash][extname]'
        },

        chunkFileNames: 'assets/js/[name]-[hash].js',

        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    sourcemap: false,
  },
})