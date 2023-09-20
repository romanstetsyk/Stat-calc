import Joi from 'joi';

import { AUTH_CONSTANTS, USER_VALIDATION_MESSAGE } from '../../constants.js';

const password = Joi.string()
  .trim()
  .required()
  .min(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH)
  .max(AUTH_CONSTANTS.MAX_LOGIN_INPUT_LENGTH)
  .regex(AUTH_CONSTANTS.PASSWORD_REGEXP)
  .messages({
    'any.required': USER_VALIDATION_MESSAGE.PASSWORD_REQUIRED,
    'string.empty': USER_VALIDATION_MESSAGE.PASSWORD_REQUIRED,
    'string.min': USER_VALIDATION_MESSAGE.PASSWORD_SHORT,
    'string.pattern.base': USER_VALIDATION_MESSAGE.PASSWORD_INVALID,
    'string.max': USER_VALIDATION_MESSAGE.MAX_LOGIN_INPUT_LENGTH_EXCEEDED,
  });

export { password };
