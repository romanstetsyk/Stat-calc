import tsconfigPathsPlugin from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPathsPlugin()],
  test: {
    coverage: {
      provider: 'v8',
      all: true,
    },
  },
});
