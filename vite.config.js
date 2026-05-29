import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        const warningId = String(warning.id || '');
        const isDependencyClientDirective =
          warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message?.includes('use client') &&
          warningId.includes('node_modules');

        if (isDependencyClientDirective) {
          return;
        }

        warn(warning);
      },
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('react-router')) return 'router'
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('@radix-ui')) return 'radix'
          if (id.includes('canvas-confetti')) return 'confetti'
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
    chunkSizeWarningLimit: 2000,
  },
})
