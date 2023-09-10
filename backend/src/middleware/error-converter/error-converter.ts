import type { ErrorRequestHandler } from 'express';

import { HTTP_CODES } from '~/constants/constants.js';
import { HttpError } from '~/exceptions/exceptions.js';

const errorConverter: ErrorRequestHandler = (
  err: unknown,
  _req,
  _res,
  next,
) => {
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
    next(error);
  }
};

export { errorConverter };
