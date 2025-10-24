import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Optimize bundle size
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },

    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk - React and React DOM
          'react-vendor': ['react', 'react-dom'],

          // Router chunk
          'react-router': ['react-router-dom'],

          // Firebase chunk (large library)
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/database'],

          // Stripe chunk (if used)
          'stripe': ['@stripe/stripe-js']
        }
      }
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // 1MB warning limit

    // CSS code splitting
    cssCodeSplit: true
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/auth', 'firebase/firestore']
  }
})
