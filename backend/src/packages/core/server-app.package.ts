import * as fs from 'node:fs';
import type { Server } from 'node:http';
import * as path from 'node:path';
import * as nodeUrl from 'node:url';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Express } from 'express';
import express from 'express';

import { EXIT_CODES } from '~/common/constants/constants.js';
import {
  errorConverter,
  errorHandler,
  httpLogger,
  notFoundHandler,
} from '~/middleware/middleware.js';
import type { Config } from '~/packages/config/config.js';
import type {
  Controller,
  ServerApi,
} from '~/packages/controller/controller.js';
import type { Database } from '~/packages/database/database.js';
import type { Logger } from '~/packages/logger/logger.js';
import { unexpectedErrorHandler } from '~/packages/unexpected-error-handler/unexpected-error-handler.js';

class AppBase {
  private config: Config;
  private logger: Logger;
  private database: Database;
  private apis: ServerApi[];

  private app: Express;

  public constructor(
    config: Config,
    logger: Logger,
    database: Database,
    apis: ServerApi[],
  ) {
    this.config = config;
    this.logger = logger;
    this.database = database;
    this.apis = apis;

    this.app = express();
  }

  private initRoutes(): void {
    for (const api of this.apis) {
      this.initApi(api);
    }
  }

  private initApi(api: ServerApi): void {
    for (const controller of api.controllers) {
      const segment = [
        this.config.API_PREFIX,
        api.version,
        controller.segment,
      ].join('');
      this.initController(controller, segment);
    }
  }

  private initController(controller: Controller, segment: string): void {
    const expressRouter = express.Router();
    for (const route of controller.routes) {
      expressRouter[route.method](route.path, route.handler);
      this.app.use(segment, expressRouter);
    }
  }

  public async init(): Promise<Server> {
    try {
      await this.database.connect();
    } catch (error: unknown) {
      this.logger.fatal("Can't connect to the database", { error });
      unexpectedErrorHandler(EXIT_CODES.FATAL);
    }

    this.logger.info('Connected to database');

    // Render React as View
    const frontendDir = path.resolve(
      path.dirname(nodeUrl.fileURLToPath(import.meta.url)),
      path.join('..', '..', '..', '..', 'build', 'frontend'),
    );
    this.app.use(express.static(frontendDir));

    // enable cors
    this.app.use(cors());
    // Parse and sign cookies
    this.app.use(cookieParser(this.config.JWT.SECRET));
    // Autolog http requests and responses
    this.app.use(httpLogger);
    // parse request json body
    this.app.use(express.json());

    this.initRoutes();

    this.app.get('/health', (_req, res) => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      res.sendStatus(200);
    });

    const index = path.join(frontendDir, 'index.html');
    if (fs.existsSync(index)) {
      this.app.use((_req, res) => {
        res.sendFile(index);
      });
    } else {
      this.app.use(notFoundHandler);
    }

    this.app.use(errorConverter, errorHandler);

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
