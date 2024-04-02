import { ERROR_MESSAGES, HTTP_CODES } from 'shared/build/index.js';
import { describe, expect, it } from 'vitest';

import { handleUnknownErrors } from './handle-unknown-errors.js';

class MyCustomError extends Error {
  public status: number;

  public constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

describe('handleUnknownErrors', () => {
  const message = 'test message';

  it('should have a "cause" property to equal to original error', () => {
    const err = new Error(message);
    const res = handleUnknownErrors(err);
    expect(res.cause).toEqual(err);
  });

  it('should return 500 if no "status" in Error', () => {
    const err = new Error(message);
    const res = handleUnknownErrors(err);
    expect(res.status).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(res.message).toBe(message);
  });

  it('should return a message from error if it is not empty', () => {
    const err = new Error(message);
    const res = handleUnknownErrors(err);
    expect(res.message).toBe(message);
  });

  it('should return a message from error if it is not empty', () => {
    // eslint-disable-next-line unicorn/error-message
    const err = new Error();
    const res = handleUnknownErrors(err);
    expect(res.message).toBe(ERROR_MESSAGES.UNKNOWN);
  });

  it('should return status from Error if it is valid', () => {
    const err = new MyCustomError(HTTP_CODES.UNAUTHORIZED, message);
    const res = handleUnknownErrors(err);
    expect(res.status).toBe(HTTP_CODES.UNAUTHORIZED);
  });

  it('should return 500 if status in Error is invalid', () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const err = new MyCustomError(2054, message);
    const res = handleUnknownErrors(err);
    expect(res.status).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
  });
});
