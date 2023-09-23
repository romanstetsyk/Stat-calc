import tsconfigPathsPlugin from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPathsPlugin()],
  test: {
    globals: false,
    clearMocks: true,
    environment: 'jsdom',
  },
});
