import Joi from 'joi';
import { HTTP_CODES } from 'shared/build/index.js';
import { describe, expect, it } from 'vitest';

import { handleJoiErrors } from './handle-joi-errors.js';

describe('handleJoiErrors', () => {
  const { error } = Joi.number().validate('not a number');
  if (!error) {
    throw new Error('Error object not created');
  }

  it('should return Bad Request', () => {
    const res = handleJoiErrors(error);
    expect(res.status).toBe(HTTP_CODES.BAD_REQUEST);
  });

  it('should have a "cause" property to equal to original error', () => {
    const res = handleJoiErrors(error);
    expect(res.cause).toEqual(error);
  });
});
