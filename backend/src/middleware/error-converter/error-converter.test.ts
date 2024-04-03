import Joi from 'joi';
import { Error as MongooseError } from 'mongoose';
import { HTTP_CODES, HttpError } from 'shared/build/index.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mockNext, mockReq, mockRes } from '#/test/helpers/express-mock.js';

import { errorConverter } from './error-converter.js';
import * as handleJoiErrorsModule from './helpers/handle-joi-errors.js';
import * as handleMongooseErrorsModule from './helpers/handle-mongoose-errors.js';
import * as handleNonInstansesOfErrorModule from './helpers/handle-non-instanses-of-error.js';
import * as handleUnknownErrorsModule from './helpers/handle-unknown-errors.js';

describe('error converter', () => {
  const req = mockReq();
  const res = mockRes();
  const next = mockNext();
  const handleUnknownErrors = vi.spyOn(
    handleUnknownErrorsModule,
    'handleUnknownErrors',
  );
  const handleNonInstanseOfErrors = vi.spyOn(
    handleNonInstansesOfErrorModule,
    'handleNonInstanseOfErrors',
  );
  const handleMongooseErrors = vi.spyOn(
    handleMongooseErrorsModule,
    'handleMongooseErrors',
  );
  const handleJoiErrors = vi.spyOn(handleJoiErrorsModule, 'handleJoiErrors');

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call next() with error if it is an instance of HttpError', () => {
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
    expect(functionArg).toBeInstanceOf(HttpError);
  });

  it('should handle unkonwn errors', () => {
    const message = 'oops!';
    const error = new Error(message);
    errorConverter(error, req, res, next);
    expect(handleUnknownErrors).toHaveBeenCalled();
    expect(next).toBeCalled();
    const [[functionArg]] = next.mock.calls;
    expect(functionArg).toBeInstanceOf(HttpError);
  });

  it('should handle errors that are not instances of Error', () => {
    const error = 'oh snap!';
    errorConverter(error, req, res, next);
    expect(handleNonInstanseOfErrors).toHaveBeenCalled();
    expect(next).toBeCalled();
    const [[functionArg]] = next.mock.calls;
    expect(functionArg).toBeInstanceOf(HttpError);
  });

  it('should Mongoose errors', () => {
    const error = new MongooseError('random error message');
    errorConverter(error, req, res, next);
    expect(handleMongooseErrors).toHaveBeenCalled();
    expect(next).toBeCalled();
    const [[functionArg]] = next.mock.calls;
    expect(functionArg).toBeInstanceOf(HttpError);
  });

  it('should Joi.ValidationError errors', () => {
    const { error } = Joi.number().validate('not a number');
    if (!error) {
      throw new Error('Error object not created');
    }
    errorConverter(error, req, res, next);
    expect(handleJoiErrors).toHaveBeenCalled();
    expect(next).toBeCalled();
    const [[functionArg]] = next.mock.calls;
    expect(functionArg).toBeInstanceOf(HttpError);
  });
});
