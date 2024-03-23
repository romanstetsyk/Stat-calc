import type { IncomingHttpHeaders } from 'node:http';

import type { CookieOptions } from 'express';
import type Joi from 'joi';
import type { ValidationResult } from 'joi';
import {
  AUTH_SCHEMA,
  ERROR_MESSAGES,
  HTTP_CODES,
  HTTP_HEADERS,
  HttpError,
} from 'shared/build/index.js';

import type { Logger } from '~/packages/logger/logger.js';

import type {
  Controller,
  ControllerRoute,
  RequestHandlerWrapped,
  ServerRoute,
} from './types.js';

type ControllerBaseConstructor = {
  segment: Controller['segment'];
  logger: Logger;
};

abstract class ControllerBase implements Controller {
  public logger: Logger;
  public segment: Controller['segment'];
  public routes: ServerRoute[];

  public constructor({ segment, logger }: ControllerBaseConstructor) {
    this.logger = logger;
    this.segment = segment;
    this.routes = [];
  }

  protected addRoute(route: ControllerRoute): void {
    // const path = this.segment + route.path;
    // All handlers should be aded as `this.handler.bind(this)`
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { path, method, handler, plugins = [] } = route;
    const wrappedHandler = this.wrapHandler(handler);
    this.routes.push({ path, method, plugins, handler: wrappedHandler });
    this.logger.info(`Registered route: ${method}: ${this.segment}${path}`);
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
    const { error }: ValidationResult<T> = schema.validate(body, {
      errors: { wrap: { label: false } },
    });
    if (error) {
      throw error;
    }
  }

  protected getTokenFromHeaders(headers: IncomingHttpHeaders): string {
    const AUTH_HEADER = HTTP_HEADERS.AUTHORIZATION;

    const error = new HttpError({
      status: HTTP_CODES.UNAUTHORIZED,
      message: ERROR_MESSAGES.MISSING_TOKEN,
    });

    if (!headers[AUTH_HEADER]) {
      throw error;
    }

    const [schema, token] = headers.authorization.split(' ');
    if (schema.toLowerCase() !== AUTH_SCHEMA.toLowerCase()) {
      throw error;
    }

    if (!token) {
      throw error;
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

export type { ControllerBaseConstructor };
export { ControllerBase };
