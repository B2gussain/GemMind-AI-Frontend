import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  port:import.meta.PORT||process.env.PORT||5173,
  plugins: [react()],
})
