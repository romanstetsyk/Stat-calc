import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as dotenvInit } from 'dotenv';
import type { SpecsOutput } from 'envalid';
import { bool, cleanEnv, num, port, str, testOnly, url } from 'envalid';

import type { Config, EnvSchema } from './types.js';
import { ENVIRONMENTS, LOG_LEVEL } from './types.js';

class BaseConfig implements Config {
  private envVars;

  public ENV;
  public PORT;
  public API_PREFIX;
  public LOG;
  public MONGOOSE;
  public ENCRYPT;
  public JWT;

  public constructor() {
    this.envVars = this.loadEnv();

    this.ENV = this.envVars.NODE_ENV;
    this.PORT = this.envVars.PORT;
    this.API_PREFIX = this.envVars.API_PREFIX;

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

    this.ENCRYPT = {
      PASSWORD_SALT_ROUNDS: this.envVars.PASSWORD_SALT_ROUNDS,
    };

    this.JWT = {
      SECRET: this.envVars.JWT_SECRET,
      ACCESS_EXPIRATION_MINUTES: this.envVars.JWT_ACCESS_EXPIRATION_MINUTES,
      REFRESH_EXPIRATION_DAYS: this.envVars.JWT_REFRESH_EXPIRATION_DAYS,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private loadEnv() {
    const pathToEnv = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      path.join('..', '..', '..', '.env'),
    );
    dotenvInit({ path: pathToEnv });

    const envSpecs = {
      NODE_ENV: str({
        choices: ENVIRONMENTS,
        default: 'production',
      }),
      PORT: port({ devDefault: 3000 }),
      API_PREFIX: str({ desc: 'API Prefix', example: '/api' }),
      LOG_LEVEL: str({
        choices: LOG_LEVEL,
        default: 'info',
        devDefault: testOnly('silent'),
      }),
      LOG_TO_FILE: bool({ default: true }),
      MONGODB_URL: url({ desc: 'MongoDB connection string' }),
      PASSWORD_SALT_ROUNDS: num({ default: 10 }),
      JWT_SECRET: str({ desc: 'Secret key to sign jwt tokens' }),
      JWT_ACCESS_EXPIRATION_MINUTES: num({
        desc: 'Number of minutes after which an access token expires',
        default: 15,
      }),
      JWT_REFRESH_EXPIRATION_DAYS: num({
        desc: 'Number of days after which a refresh token expires',
        default: 15,
      }),
    } satisfies SpecsOutput<EnvSchema>;

    return cleanEnv(process.env, envSpecs);
  }
}

export { BaseConfig };
