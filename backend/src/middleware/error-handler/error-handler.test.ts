import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import { HTTP_CODES } from '~/constants/constants.js';
import { HttpError } from '~/exceptions/exceptions.js';
import type { ErrorCommon } from '~/types/types.js';

import { errorHandler } from './error-handler.js';

const mockReq = (req?: Record<string, unknown>): Request => {
  return { ...req } as unknown as Request;
};

const mockRes = (res?: Record<string, unknown>): Response => {
  const response = { ...res } as unknown as Response;
  response.status = vi.fn().mockReturnThis();
  response.json = vi.fn().mockReturnThis();
  return response;
};

describe('error handler', () => {
  it('should respond with status and json of predefined format', () => {
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();
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
