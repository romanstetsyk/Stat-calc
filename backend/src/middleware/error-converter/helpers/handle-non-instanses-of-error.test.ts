import { ERROR_MESSAGES, HTTP_CODES } from 'shared/build/index.js';
import { describe, expect, it } from 'vitest';

import { handleNonInstanseOfErrors } from './handle-non-instanses-of-error.js';

describe('handleNonInstanseOfErrors', () => {
  const err = 'test message';

  it('should have a "cause" property to equal to original error', () => {
    const res = handleNonInstanseOfErrors(err);
    expect(res.cause).toEqual(err);
  });

  it('should return status 500, Internal Server Error', () => {
    const res = handleNonInstanseOfErrors(err);
    expect(res.status).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(res.message).toBe(ERROR_MESSAGES.UNKNOWN);
  });
});
