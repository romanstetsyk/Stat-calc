import Joi from 'joi';

import {
  USER_VALIDATION_CONSTANTS,
  USER_VALIDATION_MESSAGES,
} from '../../constants.js';

const name = Joi.string()
  .trim()
  .required()
  .min(USER_VALIDATION_CONSTANTS.MIN_NAME_LENGTH)
  .max(USER_VALIDATION_CONSTANTS.MAX_LOGIN_INPUT_LENGTH)
  .messages({
    'any.required': USER_VALIDATION_MESSAGES.NAME_REQUIRED,
    'string.empty': USER_VALIDATION_MESSAGES.NAME_REQUIRED,
    'string.max': USER_VALIDATION_MESSAGES.MAX_LOGIN_INPUT_LENGTH_EXCEEDED,
  });

export { name };
