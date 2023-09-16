import type { ErrorRequestHandler } from 'express';
import { Error as MongooseError } from 'mongoose';

import { ERROR_MESSAGES, HTTP_CODES } from '~/constants/constants.js';
import { HttpError } from '~/exceptions/exceptions.js';
import { hasValue } from '~/helpers/helpers.js';

const errorConverter: ErrorRequestHandler = (
  err: unknown,
  _req,
  _res,
  next,
) => {
  if (err instanceof HttpError) {
    next(err);
    return;
  }

  if (!(err instanceof Error)) {
    const status = HTTP_CODES.INTERNAL_SERVER_ERROR;
    const message = ERROR_MESSAGES.UNKNOWN;
    const error = new HttpError({ status, message, cause: err });
    next(error);
    return;
  }

  let status, message;
  if (err instanceof MongooseError.CastError) {
    status = HTTP_CODES.BAD_REQUEST;
    message = ERROR_MESSAGES.BAD_REQUEST;
  } else {
    status =
      'status' in err && hasValue(HTTP_CODES, err.status)
        ? err.status
        : HTTP_CODES.INTERNAL_SERVER_ERROR;
    message = err.message;
  }

  const error = new HttpError({ status, message, cause: err });

  next(error);
};

export { errorConverter };
