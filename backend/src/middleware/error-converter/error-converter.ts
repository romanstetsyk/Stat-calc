import type { ErrorRequestHandler } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { Error as MongooseError } from 'mongoose';
import { ERROR_MESSAGES, HTTP_CODES, HttpError } from 'shared/build/index.js';

import {
  handleJoiErrors,
  handleMongooseErrors,
  handleNonInstanseOfErrors,
  handleUnknownErrors,
} from './helpers/helpers.js';

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
    next(handleNonInstanseOfErrors(err));
    return;
  }

  let status, message;
  if (err instanceof MongooseError) {
    next(handleMongooseErrors(err));
    return;
  } else if (err instanceof Joi.ValidationError) {
    next(handleJoiErrors(err));
    return;
  } else if (err instanceof jwt.JsonWebTokenError) {
    status = HTTP_CODES.UNAUTHORIZED;
    message =
      err instanceof jwt.TokenExpiredError
        ? ERROR_MESSAGES.TOKEN_EXPIRED
        : ERROR_MESSAGES.UNAUTHORIZED;
  } else {
    next(handleUnknownErrors(err));
    return;
  }

  const error = new HttpError({ status, message, cause: err });

  next(error);
};

export { errorConverter };
