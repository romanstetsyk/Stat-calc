import { describe, expect, it } from 'vitest';

import { HTTP_CODES } from '~/constants/http-codes';

import { isHttpCode } from './is-http-code';

describe('is-http-code', () => {
  it('should return true if http code is valid', () => {
    expect(isHttpCode(HTTP_CODES.OK)).toBe(true);
    expect(isHttpCode(HTTP_CODES.UNAUTHORIZED)).toBe(true);
  });

  it('should return false if http code is invalid', () => {
    const INVALID_CODE = 678;
    expect(isHttpCode(INVALID_CODE)).toBe(false);
  });
});
