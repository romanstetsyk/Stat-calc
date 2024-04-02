import { Error as MongooseError } from 'mongoose';
import { ERROR_MESSAGES, HTTP_CODES, HttpError } from 'shared/build/index.js';

import { INTERNAL_ERROR_MESSAGES } from '~/common/constants/constants.js';

const handleMongooseErrors = (err: MongooseError): HttpError => {
  if (err instanceof MongooseError.CastError) {
    return new HttpError({
      status: HTTP_CODES.BAD_REQUEST,
      message: ERROR_MESSAGES.BAD_REQUEST,
      cause: err,
    });
  }

  if (err instanceof MongooseError.ValidationError) {
    return new HttpError({
      status: HTTP_CODES.BAD_REQUEST,
      message: ERROR_MESSAGES.BAD_REQUEST,
      cause: err,
    });
  }

  if (err.message === INTERNAL_ERROR_MESSAGES.INVALID_UUID) {
    return new HttpError({
      status: HTTP_CODES.NOT_FOUND,
      message: ERROR_MESSAGES.NOT_FOUND,
      cause: err,
    });
  }

  return new HttpError({
    status: HTTP_CODES.INTERNAL_SERVER_ERROR,
    message: ERROR_MESSAGES.UNKNOWN,
    cause: err,
  });
};

export { handleMongooseErrors };
