import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Fix lodash ESM compatibility - redirect to lodash-es
      'lodash': 'lodash-es',
      // Fix react-is compatibility for recharts
      'react-is': path.resolve(__dirname, 'node_modules/react-is')
    }
  },
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate heavy libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'react-hot-toast'],
          'vendor-charts': ['recharts'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-utils': ['date-fns', 'axios', 'zustand', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'zustand',
      'lucide-react',
      'framer-motion',
      'date-fns',
      'clsx',
      'tailwind-merge',
      'lodash-es',
      'recharts',
      'react-is',
    ],
    // Exclude heavy libraries from pre-bundling
    exclude: ['jspdf'],
  },
  server: {
    fs: {
      strict: false
    },
    // Enable faster HMR
    hmr: {
      overlay: true,
    },
  },
  // Enable caching
  cacheDir: 'node_modules/.vite',
  // Faster esbuild
  esbuild: {
    target: 'esnext',
    legalComments: 'none',
  },
})
