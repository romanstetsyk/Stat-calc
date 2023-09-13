import type { Logger } from '~/logger/logger.js';
import { logger } from '~/logger/logger.js';
import type {
  Controller,
  ControllerRoute,
  RequestHandlerWrapped,
  ServerRoute,
} from '~/types/types.js';

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
        const { status, payload } = await handler(req);
        res.status(status).json(payload);
      } catch (error) {
        next(error);
      }
    };
  }
}

export { ControllerBase };
