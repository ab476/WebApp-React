import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Use global testing functions like `describe`, `it`
    environment: 'jsdom', // Simulate the browser environment
    setupFiles: './src/test/setup.ts', // Optional: Add setup file for global imports
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
