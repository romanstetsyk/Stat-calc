import Joi from 'joi';

import { AUTH_CONSTANTS, USER_VALIDATION_MESSAGE } from '../../constants.js';

const email = Joi.string()
  .trim()
  .email()
  .required()
  .max(AUTH_CONSTANTS.MAX_LOGIN_INPUT_LENGTH)
  .messages({
    'any.required': USER_VALIDATION_MESSAGE.EMAIL_REQUIRED,
    'string.empty': USER_VALIDATION_MESSAGE.EMAIL_REQUIRED,
    'string.email': USER_VALIDATION_MESSAGE.EMAIL_INVALID,
  });

export { email };
