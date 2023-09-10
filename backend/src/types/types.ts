import type { HttpError } from '~/exceptions/exceptions.js';

type ValueOf<T> = T[keyof T];

type ErrorCommon = {
  message: HttpError['message'];
};

export type { ErrorCommon, ValueOf };
