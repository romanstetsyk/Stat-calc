import { HTTP_CODES, HttpError } from 'shared/build/index.js';
import { describe, expect, it, vi } from 'vitest';

import { mockNext, mockReq, mockRes } from '#/test/helpers/express-mock.js';

import { errorConverter } from './error-converter.js';

describe('error converter', () => {
  it('should call next() with error if it is an instance of HttpError', () => {
    const req = mockReq();
    const res = mockRes();
    const next = mockNext();
    const error = new HttpError({
      message: 'error message',
      status: HTTP_CODES.INTERNAL_SERVER_ERROR,
    });
    errorConverter(error, req, res, next);
    expect(next).toBeCalled();
    const [[functionArg]] = next.mock.calls; // Argument of the first call
    // A deep equality will not be performed for Error objects: https://vitest.dev/api/expect.html#toequal
    expect(functionArg.message).toBe(error.message);
    expect(functionArg.status).toBe(error.status);
  });

  it('should call next() with status 500 and message from error if error is instance of Error', () => {
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();
    const message = 'oops!';
    const error = new Error(message);
    errorConverter(error, req, res, next);
    const httpError = new HttpError({
      message: error.message,
      cause: error.cause,
      status: HTTP_CODES.INTERNAL_SERVER_ERROR,
    });
    expect(next).toBeCalled();
    const [[functionArg]] = next.mock.calls;
    expect(functionArg.message).toBe(httpError.message);
    expect(functionArg.status).toBe(httpError.status);
  });

  it('should call next() with 500: Internal Server Error if arg is not instance of Error', () => {
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();
    const error = 'oh snap!';
    errorConverter(error, req, res, next);
    expect(next).toBeCalled();
    const [[functionArg]] = next.mock.calls;
    expect(functionArg.message).toBe('Internal Server Error');
    expect(functionArg.status).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(functionArg.cause).toBe(error);
  });
});
