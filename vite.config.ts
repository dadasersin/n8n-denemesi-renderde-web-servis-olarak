
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Render'daki environment variable'ı koda güvenli bir şekilde enjekte eder
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  }
});
