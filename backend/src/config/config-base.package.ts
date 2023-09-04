import { config as dotenvInit } from 'dotenv';
import { bool, cleanEnv, port, str, url } from 'envalid';

import type { Config, EnvSchema } from './types.js';
import { ENVIRONMENTS, LOG_LEVEL } from './types.js';

class BaseConfig implements Config {
  private envVars;

  public ENV;
  public PORT;
  public LOG;
  public MONGOOSE;

  public constructor() {
    dotenvInit();
    this.envVars = this.loadEnv();

    this.ENV = this.envVars.NODE_ENV;
    this.PORT = this.envVars.PORT;
    this.LOG = {
      LEVEL: this.envVars.LOG_LEVEL,
      FILE: this.envVars.LOG_TO_FILE,
    };
    this.MONGOOSE = {
      URL: this.envVars.MONGODB_URL,
    };
  }

  private loadEnv(): ReturnType<typeof cleanEnv<EnvSchema>> {
    return cleanEnv(process.env, {
      NODE_ENV: str({
        choices: ENVIRONMENTS,
        default: 'production',
      }),
      PORT: port({ devDefault: 3000 }),
      LOG_LEVEL: str({
        choices: LOG_LEVEL,
        default: 'info',
      }),
      LOG_TO_FILE: bool({ default: true }),
      MONGODB_URL: url({ desc: 'MongoDB connection string' }),
    });
  }
}

export { BaseConfig };
