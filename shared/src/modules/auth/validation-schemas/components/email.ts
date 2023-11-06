import Joi from 'joi';

import {
  USER_VALIDATION_CONSTANTS,
  USER_VALIDATION_MESSAGES,
} from '../../constants.js';

const email = Joi.string()
  .trim()
  .email({ tlds: false })
  .required()
  .max(USER_VALIDATION_CONSTANTS.MAX_LOGIN_INPUT_LENGTH)
  .messages({
    'any.required': USER_VALIDATION_MESSAGES.EMAIL_REQUIRED,
    'string.empty': USER_VALIDATION_MESSAGES.EMAIL_REQUIRED,
    'string.email': USER_VALIDATION_MESSAGES.EMAIL_INVALID,
  });

export { email };
