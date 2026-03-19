import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes('src/pages')) return 'pages'
          if (id.includes('src/components')) return 'components'
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
