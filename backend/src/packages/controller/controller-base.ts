import type { IncomingHttpHeaders } from 'node:http';

import type { CookieOptions } from 'express';
import type Joi from 'joi';
import type { ValidationResult } from 'joi';
import { AUTH_SCHEMA, HTTP_HEADERS } from 'shared/build/index.js';

import type { Config } from '~/packages/config/config.js';
import type { Logger } from '~/packages/logger/logger.js';
import { logger } from '~/packages/logger/logger.js';

import type {
  Controller,
  ControllerRoute,
  RequestHandlerWrapped,
  ServerRoute,
} from './types.js';

abstract class ControllerBase implements Controller {
  public logger: Logger;
  public segment: Controller['segment'];
  public routes: ServerRoute[];
  protected config: Config;

  public constructor(
    logger: Logger,
    segment: Controller['segment'],
    config: Config,
  ) {
    this.logger = logger;
    this.segment = segment;
    this.routes = [];
    this.config = config;
  }

  protected addRoute(route: ControllerRoute): void {
    // const path = this.segment + route.path;
    // All handlers should be aded as `this.handler.bind(this)`
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { path, method, handler, plugins = [] } = route;
    const wrappedHandler = this.wrapHandler(handler);
    this.routes.push({ path, method, plugins, handler: wrappedHandler });
    logger.info(`registered route: ${method}: ${this.segment}${path}`);
  }

  // Convert a function that accepts ApiRequest<T> to RequestHandlerWrapped
  private wrapHandler(
    handler: ControllerRoute['handler'],
  ): RequestHandlerWrapped {
    return async (req, res, next) => {
      // try..catch to catch async errors
      try {
        const { status, payload, cookies, clearCookies } = await handler(req);

        if (cookies) {
          for (const cookie of cookies) {
            res.cookie(...cookie);
          }
        }

        if (clearCookies) {
          for (const cookie of clearCookies) {
            res.clearCookie(...cookie);
          }
        }

        payload ? res.status(status).json(payload) : res.sendStatus(status);
      } catch (error) {
        next(error);
      }
    };
  }

  protected validateBody<T>(schema: Joi.ObjectSchema<T>, body: T): void {
    const { error }: ValidationResult<T> = schema.validate(body);
    if (error) {
      throw error;
    }
  }

  protected getTokenFromHeaders(headers: IncomingHttpHeaders): string | null {
    const AUTH_HEADER = HTTP_HEADERS.AUTHORIZATION;

    if (!headers[AUTH_HEADER]) {
      return null;
    }

    const [schema, token] = headers.authorization.split(' ');
    if (schema.toLowerCase() !== AUTH_SCHEMA.toLowerCase()) {
      return null;
    }

    if (!token) {
      return null;
    }

    return token;
  }

  protected defaultCookieOptions(): CookieOptions {
    return {
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      signed: true,
      path: '/',
    };
  }
}

export { ControllerBase };
