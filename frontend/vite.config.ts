import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPathsPlugin from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [tsconfigPathsPlugin(), react()],
});
