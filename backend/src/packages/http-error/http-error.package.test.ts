import { describe, expect, it } from 'vitest';

import { HTTP_CODES } from '~/common/constants/status-codes.js';

import { HttpError } from './http-error.package.js';

describe('HttpError', () => {
  it('should return a custom error with message: "test"', () => {
    const res = new HttpError({ message: 'test', status: HTTP_CODES.OK });
    expect(res).toBeInstanceOf(HttpError);
    expect(res.status).toBe(HTTP_CODES.OK);
    expect(res.message).toBe('test');
  });
});
