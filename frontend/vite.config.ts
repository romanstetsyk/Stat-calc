import react from '@vitejs/plugin-react';
import { cleanEnv, num, str, url } from 'envalid';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPathsPlugin from 'vite-tsconfig-paths';

const envPrefix = ['JWT_', 'API_'];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), envPrefix);

  const envSpecs = {
    API_SERVER_URL: url({ desc: 'Backend URL' }),
    API_PREFIX: str({ desc: 'API Prefix', example: '/api' }),
    API_VERSION: str({ desc: 'API Version', example: '/v1' }),
    JWT_ACCESS_EXPIRATION_MINUTES: num({
      desc: 'Number of minutes after which an access token expires',
      default: 15,
    }),
  };

  cleanEnv(env, envSpecs);

  return {
    envPrefix,
    build: {
      outDir: 'build',
    },
    plugins: [tsconfigPathsPlugin(), react()],
  };
});
