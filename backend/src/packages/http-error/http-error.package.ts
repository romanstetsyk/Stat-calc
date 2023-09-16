import type { HTTP_CODES } from '~/common/constants/constants.js';
import type { ValueOf } from '~/common/types/types.js';

type HttpErrorConstructor = {
  status: ValueOf<typeof HTTP_CODES>;
  message: string;
  cause?: unknown;
};

class HttpError extends Error {
  public status: ValueOf<typeof HTTP_CODES>;

  public constructor({ message, cause, status }: HttpErrorConstructor) {
    super(message, { cause });
    this.status = status;
  }
}

export { HttpError };
