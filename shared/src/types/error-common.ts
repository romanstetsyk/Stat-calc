import type { HttpError } from '~/frameworks/http-error/http-error.js';

type ErrorCommon = {
  message: HttpError['message'];
};

export type { ErrorCommon };
