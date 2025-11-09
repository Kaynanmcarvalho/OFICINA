import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: [
      'axios', 
      'jspdf', 
      'browser-image-compression',
      'lucide-react',
      'react-icons',
      'react-icons/fa',
      'react-icons/fi',
      'react-icons/hi',
      'react-icons/md',
      'framer-motion'
    ],
    force: true
  },
  server: {
    fs: {
      strict: false
    }
  }
})
