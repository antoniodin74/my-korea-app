import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Questo espone il server alla tua rete locale
    port: 5173  // Assicurati che sia la porta corretta
  }
})
