import type Joi from 'joi';
import type { ValidationResult } from 'joi';

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

  public constructor(logger: Logger, segment: Controller['segment']) {
    this.logger = logger;
    this.segment = segment;
    this.routes = [];
  }

  protected addRoute(route: ControllerRoute): void {
    // const path = this.segment + route.path;
    // All handlers should be aded as `this.handler.bind(this)`
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { path, method, handler } = route;
    const wrappedHandler = this.wrapHandler(handler);
    this.routes.push({ path, method, handler: wrappedHandler });
    logger.info(`registered route: ${method}: ${this.segment}${path}`);
  }

  // Convert a function that accepts ApiRequest<T> to RequestHandlerWrapped
  private wrapHandler(
    handler: ControllerRoute['handler'],
  ): RequestHandlerWrapped {
    return async (req, res, next) => {
      // try..catch to catch async errors
      try {
        const { status, payload, cookies } = await handler(req);

        if (cookies) {
          for (const cookie of cookies) {
            res.cookie(...cookie);
          }
        }

        res.status(status).json(payload);
      } catch (error) {
        next(error);
      }
    };
  }

  protected validateBody<T>(schema: Joi.ObjectSchema<T>, body: T): void {
    const { error }: ValidationResult<T> = schema.validate(body);
    if (error) {
      throw new Error(error.message);
    }
  }
}

export { ControllerBase };
