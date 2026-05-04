import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    // Keep framework chunks cacheable while avoiding one huge vendor bundle.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('react-router')) return 'router'
          if (id.includes('lucide-react')) return 'icons'
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-core'
          }
          return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
})
