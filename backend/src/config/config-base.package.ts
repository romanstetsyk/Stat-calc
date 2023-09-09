import * as path from 'node:path';
import * as nodeUrl from 'node:url';

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
    this.envVars = this.loadEnv();

    this.ENV = this.envVars.NODE_ENV;
    this.PORT = this.envVars.PORT;

    this.LOG = {
      LEVEL: this.envVars.LOG_LEVEL,
      LOG_TO_FILE: this.envVars.LOG_TO_FILE,
      FILE_LOCATION: '',
      TARGETS: [
        {
          level: this.envVars.LOG_LEVEL,
          target: 'pino/file', // prints json to console if no destination in options
          options: {},
        },
      ],
    };

    if (this.envVars.LOG_TO_FILE) {
      const fileLocation = path.join(
        'logs',
        `logs-${this.envVars.NODE_ENV}-${this.envVars.LOG_LEVEL}.log`,
      );

      this.LOG.FILE_LOCATION = fileLocation;

      this.LOG.TARGETS.push({
        level: this.envVars.LOG_LEVEL,
        target: 'pino/file',
        options: { destination: fileLocation, mkdir: true },
      });
    }

    this.MONGOOSE = {
      URL: this.envVars.MONGODB_URL,
    };
  }

  private loadEnv(): ReturnType<typeof cleanEnv<EnvSchema>> {
    const pathToEnv = path.resolve(
      path.dirname(nodeUrl.fileURLToPath(import.meta.url)),
      path.join('..', '..', '.env'),
    );
    dotenvInit({ path: pathToEnv });

    const envSpecs: Parameters<typeof cleanEnv<EnvSchema>>[1] = {
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
    };

    return cleanEnv(process.env, envSpecs);
  }
}

export { BaseConfig };
