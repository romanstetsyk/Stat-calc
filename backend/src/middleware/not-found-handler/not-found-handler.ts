import { ERROR_MESSAGES } from '~/common/constants/error-messages.js';
import { HTTP_CODES } from '~/common/constants/status-codes.js';
import type { RequestHandlerWrapped } from '~/packages/controller/controller.js';
import { HttpError } from '~/packages/http-error/http-error.package.js';

const notFoundHandler: RequestHandlerWrapped = (_req, _res, next) => {
  const error = new HttpError({
    status: HTTP_CODES.NOT_FOUND,
    message: ERROR_MESSAGES.NOT_FOUND,
  });
  next(error);
};

export { notFoundHandler };
