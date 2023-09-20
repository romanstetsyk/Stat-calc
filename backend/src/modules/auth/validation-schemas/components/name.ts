import Joi from 'joi';

import { AUTH_CONSTANTS, USER_VALIDATION_MESSAGE } from '../../constants.js';

const name = Joi.string()
  .trim()
  .required()
  .alphanum()
  .min(AUTH_CONSTANTS.MIN_NAME_LENGTH)
  .max(AUTH_CONSTANTS.MAX_LOGIN_INPUT_LENGTH)
  .messages({
    'any.required': USER_VALIDATION_MESSAGE.NAME_REQUIRED,
    'string.empty': USER_VALIDATION_MESSAGE.NAME_REQUIRED,
    'string.max': USER_VALIDATION_MESSAGE.MAX_LOGIN_INPUT_LENGTH_EXCEEDED,
    'string.alphanum': USER_VALIDATION_MESSAGE.NAME_ALPHANUM,
  });

export { name };
