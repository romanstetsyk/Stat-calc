import type { ErrorCommon } from '@shared/build/esm/index.js';
import { HTTP_CODES, HttpError } from '@shared/build/esm/index.js';
import { describe, expect, it } from 'vitest';

import { mockNext, mockReq, mockRes } from '#/test/helpers/express-mock.js';

import { errorHandler } from './error-handler.js';

describe('error handler', () => {
  it('should respond with status and json of predefined format', () => {
    const req = mockReq();
    const res = mockRes();
    const next = mockNext();
    const error = new HttpError({
      message: 'something went wrong',
      status: HTTP_CODES.BAD_REQUEST,
    });
    errorHandler(error, req, res, next);
    expect(next).not.toBeCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(res.status).toBeCalledWith(error.status);
    expect(res.json).toBeCalledWith({
      message: error.message,
    } satisfies ErrorCommon);
  });
});
