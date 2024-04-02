import { Error as MongooseError } from 'mongoose';
import { ERROR_MESSAGES, HTTP_CODES, HttpError } from 'shared/build/index.js';
import { describe, expect, it } from 'vitest';

import { INTERNAL_ERROR_MESSAGES } from '~/common/constants/constants.js';

import { handleMongooseErrors } from './handle-mongoose-errors.js';

describe('handleMongooseErrors', () => {
  it('should have a "cause" property to equal to original error', () => {
    const err = new MongooseError.CastError('type', '42', 'path');
    const res = handleMongooseErrors(err);
    expect(res.cause).toEqual(err);
  });

  it('should return Bad Request if error is MongooseError.CastError', () => {
    const err = new MongooseError.CastError('type', '42', 'path');
    const res = handleMongooseErrors(err);
    expect(res).toBeInstanceOf(HttpError);
    expect(res.status).toBe(HTTP_CODES.BAD_REQUEST);
    expect(res.message).toBe(ERROR_MESSAGES.BAD_REQUEST);
  });

  it('should return Bad Request if error is MongooseError.ValidationError', () => {
    const err = new MongooseError.ValidationError();
    const res = handleMongooseErrors(err);
    expect(res).toBeInstanceOf(HttpError);
    expect(res.status).toBe(HTTP_CODES.BAD_REQUEST);
    expect(res.message).toBe(ERROR_MESSAGES.BAD_REQUEST);
  });

  it(`should return Not Found if internal message is ${INTERNAL_ERROR_MESSAGES.INVALID_UUID}`, () => {
    const err = new MongooseError(INTERNAL_ERROR_MESSAGES.INVALID_UUID);
    const res = handleMongooseErrors(err);
    expect(res).toBeInstanceOf(HttpError);
    expect(res.status).toBe(HTTP_CODES.NOT_FOUND);
    expect(res.message).toBe(ERROR_MESSAGES.NOT_FOUND);
  });

  it('should return Internal Server Error for any other error', () => {
    const err = new MongooseError('random error message');
    const res = handleMongooseErrors(err);
    expect(res).toBeInstanceOf(HttpError);
    expect(res.status).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(res.message).toBe(ERROR_MESSAGES.UNKNOWN);
  });
});
