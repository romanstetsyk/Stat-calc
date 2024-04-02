import { ERROR_MESSAGES, HTTP_CODES, HttpError } from 'shared/build/index.js';

type NonInstanseOfError<T> = T extends Error ? never : T;

const handleNonInstanseOfErrors = <T>(
  err: NonInstanseOfError<T>,
): HttpError => {
  return new HttpError({
    status: HTTP_CODES.INTERNAL_SERVER_ERROR,
    message: ERROR_MESSAGES.UNKNOWN,
    cause: err,
  });
};

export { handleNonInstanseOfErrors };
