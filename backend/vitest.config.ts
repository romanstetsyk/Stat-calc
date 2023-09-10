import { defineConfig, mergeConfig } from 'vitest/config';

import configShared from '../vitest.config.js';

export default mergeConfig(
  configShared,
  defineConfig({
    test: {
      globals: false,
      clearMocks: true,
      environment: 'node',
    },
  }),
);
