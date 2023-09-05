import type { HTTP_CODES } from '~/constants/constants.js';
import type { ValueOf } from '~/types/types.js';

type HttpErrorConstructor = {
  message: string;
  cause?: unknown;
  status: ValueOf<typeof HTTP_CODES>;
};

class HttpError extends Error {
  public status: ValueOf<typeof HTTP_CODES>;

  public constructor({ message, cause, status }: HttpErrorConstructor) {
    super(message, { cause });
    this.status = status;
  }
}

export { HttpError };
