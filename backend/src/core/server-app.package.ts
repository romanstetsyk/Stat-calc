import type { Server } from 'node:http';

import type { Express } from 'express';
import express from 'express';
import { pinoHttp } from 'pino-http';

import type { Config } from '~/config/config.js';
import { EXIT_CODES } from '~/constants/constants.js';
import type { Database } from '~/database/database.js';
import { unexpectedErrorHandler } from '~/error-handler/error-handler.js';
import type { Logger } from '~/logger/logger.js';

class AppBase {
  private config: Config;
  private logger: Logger;
  private database: Database;
  private app: Express;

  public constructor(config: Config, logger: Logger, database: Database) {
    this.config = config;
    this.logger = logger;
    this.database = database;
    this.app = express();
  }

  public async init(): Promise<Server> {
    try {
      await this.database.connect();
    } catch (error: unknown) {
      this.logger.fatal("Can't connect to the database", { error });
      unexpectedErrorHandler(EXIT_CODES.FATAL);
    }

    this.logger.info('Connected to database');

    // Autolog http requests and responses
    this.app.use(
      pinoHttp({
        customLogLevel: function (_req, res, err) {
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          if (res.statusCode < 400) {
            return 'info';
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          } else if (res.statusCode < 500) {
            return 'warn';
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          } else if (res.statusCode >= 500 || err) {
            return 'error';
          } else {
            return 'info';
          }
        },
        transport: { targets: this.config.LOG.TARGETS },
      }),
    );

    this.app.get('/health', (_req, res) => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      res.sendStatus(200);
    });

    return this.app
      .listen(this.config.PORT, () => {
        this.logger.info(`Listening to port ${this.config.PORT}`);
      })
      .on('error', (error: unknown) => {
        // Use unknown instead of Error because of keys: 'code', 'errno', etc.
        this.logger.fatal("Can't start the server", { error });
        unexpectedErrorHandler(EXIT_CODES.FATAL);
      });
  }
}

export { AppBase };
