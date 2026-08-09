import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

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