import type { ErrorRequestHandler } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { Error as MongooseError } from 'mongoose';
import {
  ERROR_MESSAGES,
  HTTP_CODES,
  HttpError,
  isHttpCode,
} from 'shared/build/index.js';

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
    status = HTTP_CODES.UNAUTHORIZED;
    message =
      err instanceof jwt.TokenExpiredError
        ? ERROR_MESSAGES.TOKEN_EXPIRED
        : ERROR_MESSAGES.UNAUTHORIZED;
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
