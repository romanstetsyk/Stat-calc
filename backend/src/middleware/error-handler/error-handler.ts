import type { ErrorRequestHandler } from 'express';

import type { HttpError } from '~/exceptions/exceptions.js';
import { logger } from '~/logger/logger.js';
import type { ErrorCommon } from '~/types/types.js';

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
