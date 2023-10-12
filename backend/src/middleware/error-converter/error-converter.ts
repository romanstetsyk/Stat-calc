import {
  ERROR_MESSAGES,
  HTTP_CODES,
  HttpError,
  isHttpCode,
} from '@shared/build/esm/index.js';
import type { ErrorRequestHandler } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { Error as MongooseError } from 'mongoose';

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
  } else if (err instanceof Joi.ValidationError) {
    status = HTTP_CODES.BAD_REQUEST;
    message = err.message;
  } else if (err instanceof jwt.JsonWebTokenError) {
    status = HTTP_CODES.FORBIDDEN;
    message =
      err.name === 'TokenExpiredError'
        ? ERROR_MESSAGES.TOKEN_EXPIRED
        : err.message;
  } else {
    status =
      'status' in err && isHttpCode(err.status)
        ? err.status
        : HTTP_CODES.INTERNAL_SERVER_ERROR;
    message = err.message;
  }

  const error = new HttpError({ status, message, cause: err });

  next(error);
};

export { errorConverter };
