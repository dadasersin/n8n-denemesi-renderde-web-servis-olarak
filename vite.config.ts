
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Render'daki API_KEY'i global process.env'e enjekte eder
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: false
  }
});
