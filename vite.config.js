import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Bind to 0.0.0.0 to make it accessible externally
    port: process.env.PORT || 5173,  // Use Render's provided PORT or fallback to 5173 for local dev
  },
  plugins: [react()],
})
