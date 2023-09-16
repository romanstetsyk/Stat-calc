import mongoose from 'mongoose';

import type { Config } from '~/packages/config/config.js';
import type { Logger } from '~/packages/logger/logger.js';

import type { Database } from './types.js';

class BaseDatabase implements Database {
  private config: Config;
  private logger: Logger;

  public constructor(config: Config, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  public async connect(): Promise<void> {
    this.logger.info('Connecting to database...');

    const { URL } = this.config.MONGOOSE;
    await mongoose.connect(URL);
  }
}

export { BaseDatabase };
