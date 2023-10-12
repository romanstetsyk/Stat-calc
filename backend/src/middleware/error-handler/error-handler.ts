import type { ErrorCommon, HttpError } from '@shared/build/esm/index.js';
import type { ErrorRequestHandler } from 'express';

import { logger } from '~/packages/logger/logger.js';

const errorHandler: ErrorRequestHandler = (
  err: HttpError,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next,
): void => {
  const { message, status, cause } = err;

  logger.error(message, { cause, req: req.path });

  const response: ErrorCommon = {
    message,
  };

  res.status(status).json(response);
};

export { errorHandler };
