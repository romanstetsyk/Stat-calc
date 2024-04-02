import {
  ERROR_MESSAGES,
  HTTP_CODES,
  HttpError,
  isHttpCode,
} from 'shared/build/index.js';

const handleUnknownErrors = (err: Error): HttpError => {
  const status =
    'status' in err && isHttpCode(err.status)
      ? err.status
      : HTTP_CODES.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.UNKNOWN;
  const cause = err;
  return new HttpError({ status, message, cause });
};

export { handleUnknownErrors };
