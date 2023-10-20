import { ERROR_MESSAGES, HTTP_CODES, HttpError } from 'shared/build/index.js';

import type { RequestHandlerWrapped } from '~/packages/controller/controller.js';

const notFoundHandler: RequestHandlerWrapped = (_req, _res, next) => {
  const error = new HttpError({
    status: HTTP_CODES.NOT_FOUND,
    message: ERROR_MESSAGES.NOT_FOUND,
  });
  next(error);
};

export { notFoundHandler };
