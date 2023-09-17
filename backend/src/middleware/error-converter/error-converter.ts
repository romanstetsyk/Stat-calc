import type { ErrorRequestHandler } from 'express';
import { Error as MongooseError } from 'mongoose';

import { ERROR_MESSAGES, HTTP_CODES } from '~/common/constants/constants.js';
import { hasValue } from '~/common/helpers/helpers.js';
import { HttpError } from '~/packages/http-error/http-error.js';

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
  if (
    err instanceof MongooseError.CastError ||
    err instanceof MongooseError.ValidationError
  ) {
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
