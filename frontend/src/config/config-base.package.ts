import type { Config } from './types';

class ConfigBase implements Config {
  public API_BASE_URL: string;
  public API_PREFIX: string;
  public API_VERSION: string;
  public JWT_ACCESS_EXPIRATION_MINUTES: number;

  // env validation in vite.config.ts
  public constructor() {
    this.API_BASE_URL = import.meta.env.API_SERVER_URL;
    this.API_PREFIX = import.meta.env.API_PREFIX;
    this.API_VERSION = import.meta.env.API_VERSION;
    this.JWT_ACCESS_EXPIRATION_MINUTES =
      import.meta.env.JWT_ACCESS_EXPIRATION_MINUTES;
  }
}

export { ConfigBase };
