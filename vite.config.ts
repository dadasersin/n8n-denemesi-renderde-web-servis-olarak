
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  build: {
    // Render'ın hata verdiği 'build' klasörü sorununu çözmek için çıktı klasörünü build yapıyoruz
    outDir: 'build',
    emptyOutDir: true
  }
});
