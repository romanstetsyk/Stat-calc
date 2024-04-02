import type Joi from 'joi';
import { HTTP_CODES, HttpError } from 'shared/build/index.js';

const handleJoiErrors = (err: Joi.ValidationError): HttpError => {
  return new HttpError({
    status: HTTP_CODES.BAD_REQUEST,
    message: err.message,
    cause: err,
  });
};

export { handleJoiErrors };
