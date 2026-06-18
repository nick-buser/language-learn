import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev proxy: with VITE_API_URL='' (same-origin), `npm run dev` forwards the
// API paths to a local backend on :8000, so the dev SPA and a local uvicorn
// behave like the same-origin container without CORS. Unset VITE_API_URL and
// the SPA uses local data and never calls these.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1': 'http://localhost:8000',
      '/healthz': 'http://localhost:8000',
      '/readyz': 'http://localhost:8000',
    },
  },
})
