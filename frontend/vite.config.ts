import react from '@vitejs/plugin-react';
import { cleanEnv, num, str, url } from 'envalid';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPathsPlugin from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const envSpecs = {
    VITE_PROXY_SERVER_URL: url({ desc: 'Backend URL' }),
    VITE_API_PREFIX: str({ desc: 'API Prefix', example: '/api' }),
    VITE_API_VERSION: str({ desc: 'API Version', example: '/v1' }),
    VITE_JWT_ACCESS_EXPIRATION_MINUTES: num({
      desc: 'Number of minutes after which an access token expires',
      default: 15,
    }),
  };

  cleanEnv(env, envSpecs);

  return {
    build: {
      outDir: 'build',
    },
    plugins: [tsconfigPathsPlugin(), react()],
  };
});
