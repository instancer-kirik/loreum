import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'lucide-react': resolve(__dirname, 'src/components/icons'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});