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
  LOG_LEVEL: LOG_LEVEL;
  LOG_TO_FILE: boolean;
  MONGODB_URL: string;
};

type Config = {
  ENV: ENVIRONMENTS;
  PORT: number;
  LOG: {
    LEVEL: LOG_LEVEL;
    LOG_TO_FILE: boolean;
    FILE_LOCATION: string;
    TARGETS: TransportTargetOptions[];
  };
  MONGOOSE: {
    URL: string;
  };
};

export type { Config, EnvSchema };
export { ENVIRONMENTS, LOG_LEVEL };
