import type { Config } from './types';

class ConfigBase implements Config {
  public API_BASE_URL: string;
  public API_PREFIX: string;
  public API_VERSION: string;
  public VITE_JWT_ACCESS_EXPIRATION_MINUTES: number;

  // env validation in vite.config.ts
  public constructor() {
    this.API_BASE_URL = import.meta.env.VITE_PROXY_SERVER_URL;
    this.API_PREFIX = import.meta.env.VITE_API_PREFIX;
    this.API_VERSION = import.meta.env.VITE_API_VERSION;
    this.VITE_JWT_ACCESS_EXPIRATION_MINUTES =
      import.meta.env.VITE_JWT_ACCESS_EXPIRATION_MINUTES;
  }
}

export { ConfigBase };
