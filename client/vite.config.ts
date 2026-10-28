import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Export the Vite configuration object
export default defineConfig({
  // Register required plugins for React and Tailwind CSS
  plugins: [react(), tailwindcss()],
  
  // Configure the development server settings
  server: {
    // Explicitly bind to 127.0.0.1 (IPv4) instead of localhost 
    // to ensure exact matching with the Spotify OAuth redirect URI
    host: '127.0.0.1',
    port: 5173
  }
})