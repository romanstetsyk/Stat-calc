import Joi from 'joi';

import type { SignUpRequestDTO } from './types.js';

const AUTH_CONSTANTS = {
  MIN_NAME_LENGTH: 1,
  MIN_PASSWORD_LENGTH: 8,
  MAX_LOGIN_INPUT_LENGTH: 50,
  PASSWORD_REGEXP:
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!#$%&()*+,./:;<=>?@^_{}-]).+$/,
} as const;

const USER_VALIDATION_MESSAGE = {
  NAME_REQUIRED: 'Name is required',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  EMAIL_INVALID: 'Please provide a valid email address',
  PASSWORD_INVALID:
    'Password must contain at least one uppercase letter (A-Z), one lowercase letter (a-z), one digit and one special character',
  PASSWORD_SHORT: 'Password must be at least 8 characters long',
  MAX_LOGIN_INPUT_LENGTH_EXCEEDED: `Maximum length of ${AUTH_CONSTANTS.MAX_LOGIN_INPUT_LENGTH} characters exceeded`,
} as const;

const signUpSchema = Joi.object<SignUpRequestDTO, true>({
  name: Joi.string()
    .trim()
    .required()
    .min(AUTH_CONSTANTS.MIN_NAME_LENGTH)
    .max(AUTH_CONSTANTS.MAX_LOGIN_INPUT_LENGTH)
    .messages({
      'any.required': USER_VALIDATION_MESSAGE.NAME_REQUIRED,
      'string.empty': USER_VALIDATION_MESSAGE.NAME_REQUIRED,
      'string.max': USER_VALIDATION_MESSAGE.MAX_LOGIN_INPUT_LENGTH_EXCEEDED,
    }),
  email: Joi.string()
    .trim()
    .email()
    .required()
    .max(AUTH_CONSTANTS.MAX_LOGIN_INPUT_LENGTH)
    .messages({
      'any.required': USER_VALIDATION_MESSAGE.EMAIL_REQUIRED,
      'string.empty': USER_VALIDATION_MESSAGE.EMAIL_REQUIRED,
      'string.email': USER_VALIDATION_MESSAGE.EMAIL_INVALID,
    }),
  password: Joi.string()
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
    }),
});

export { signUpSchema };
