
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from "lovable-tagger"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Using standard React plugin options
      jsxRuntime: 'automatic',
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  server: {
    port: 8080,
    host: "::",
    hmr: {
      // Improve hot module replacement
      overlay: false,
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            '@/components/ui/button',
            '@/components/ui/card', 
            '@/components/ui/input'
          ],
          // Add more chunks for better code splitting
          'layout': [
            '@/components/Layout/Layout',
            '@/components/Layout/Navbar',
            '@/components/Layout/Footer',
          ]
        }
      }
    },
    // Minimize size, improve loading speed
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  // Improve CSS loading
  css: {
    devSourcemap: false,
  },
}))
