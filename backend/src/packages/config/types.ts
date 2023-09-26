import type { TransportTargetOptions } from 'pino';

const ENVIRONMENTS = ['development', 'production', 'test'] as const;
type ENVIRONMENTS = (typeof ENVIRONMENTS)[number];

const LOG_LEVEL = [
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace',
  'silent',
] as const;
type LOG_LEVEL = (typeof LOG_LEVEL)[number];

type EnvSchema = {
  NODE_ENV: ENVIRONMENTS;
  PORT: number;
  API_PREFIX: string;
  LOG_LEVEL: LOG_LEVEL;
  LOG_TO_FILE: boolean;
  MONGODB_URL: string;
  PASSWORD_SALT_ROUNDS: number;
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRATION_MINUTES: number;
  JWT_REFRESH_EXPIRATION_DAYS: number;
};

type Config = {
  ENV: ENVIRONMENTS;
  PORT: number;
  API_PREFIX: string;
  LOG: {
    LEVEL: LOG_LEVEL;
    LOG_TO_FILE: boolean;
    FILE_LOCATION: string;
    TARGETS: TransportTargetOptions[];
  };
  MONGOOSE: {
    URL: string;
  };
  ENCRYPT: {
    PASSWORD_SALT_ROUNDS: number;
  };
  JWT: {
    SECRET: string;
    ACCESS_EXPIRATION_MINUTES: number;
    REFRESH_EXPIRATION_DAYS: number;
  };
};

export type { Config, EnvSchema };
export { ENVIRONMENTS, LOG_LEVEL };
