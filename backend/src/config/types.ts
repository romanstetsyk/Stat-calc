const Environments = ['development', 'production', 'test'] as const;
type Environments = (typeof Environments)[number];

const LOG_LEVEL = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const;
type LOG_LEVEL = (typeof LOG_LEVEL)[number];

type EnvSchema = {
  NODE_ENV: Environments;
  PORT: number;
  LOG_LEVEL: LOG_LEVEL;
  LOG_TO_FILE: boolean;
  MONGODB_URL: string;
};

type ConfigSchema = {
  ENV: Environments;
  PORT: number;
  LOG: {
    LEVEL: LOG_LEVEL;
    FILE: boolean;
  };
  MONGOOSE: {
    URL: string;
  };
};

export type { ConfigSchema, EnvSchema };
export { Environments, LOG_LEVEL };
