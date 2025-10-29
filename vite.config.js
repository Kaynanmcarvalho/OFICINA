import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['axios', 'jspdf', 'browser-image-compression'],
    force: false
  },
  server: {
    fs: {
      strict: false
    }
  }
})
