import type { ErrorRequestHandler } from 'express';

import { HTTP_CODES } from '~/constants/status-codes.js';
import { HttpError } from '~/exceptions/http-error.js';
import { logger } from '~/logger/logger.js';

const errorConverter: ErrorRequestHandler = (
  err: unknown,
  _req,
  _res,
  next,
) => {
  _req;
  let error = err;
  if (error instanceof HttpError) {
    next(error);
  } else if (error instanceof Error) {
    const status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    const { message, cause } = error;
    error = new HttpError({ status, message, cause });
    next(error);
  } else {
    const status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    const message = 'Internal Server Error';
    const cause = err;
    error = new HttpError({ status, message, cause });
  }
};

type ErrorCommon = {
  message: HttpError['message'];
};

const errorHandler: ErrorRequestHandler = (
  err: HttpError,
  _req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next,
): void => {
  const { message, status, cause } = err;

  logger.error(message, { cause });

  const response: ErrorCommon = {
    message,
  };

  res.status(status).json(response);
};

const f = (): null => null;

export { errorConverter, errorHandler, f };
