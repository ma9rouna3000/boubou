import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/boubou/', // Add this exact line
  build: {
    outDir: 'dist',
  }
})