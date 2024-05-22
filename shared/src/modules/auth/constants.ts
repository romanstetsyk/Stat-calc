const API_PATHS_AUTH = {
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  SIGN_OUT: '/sign-out',
  REFRESH: '/refresh',
  ME: '/me',
} as const;

const AUTH_SCHEMA = 'Bearer';

const USER_VALIDATION_CONSTANTS = {
  MIN_NAME_LENGTH: 1,
  MIN_PASSWORD_LENGTH: 8,
  MAX_LOGIN_INPUT_LENGTH: 50,
  PASSWORD_REGEXP:
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!#$%&()*+,./:;<=>?@^_{}-]).+$/,
} as const;

const USER_VALIDATION_MESSAGES = {
  NAME_REQUIRED: 'Name is required',
  FIRST_NAME_REQUIRED: 'First name is required',
  NAME_ALPHANUM: 'Name must only contain alpha-numeric characters',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  EMAIL_INVALID: 'Please provide a valid email address',
  PASSWORD_INVALID:
    'Password must contain at least one uppercase letter (A-Z), one lowercase letter (a-z), one digit and one special character',
  PASSWORD_SHORT: 'Password must be at least 8 characters long',
  PASSWORD_MATCH: 'Passwords do not match',
  MAX_LOGIN_INPUT_LENGTH_EXCEEDED: `Maximum length of ${USER_VALIDATION_CONSTANTS.MAX_LOGIN_INPUT_LENGTH} characters exceeded`,
} as const;

export {
  API_PATHS_AUTH,
  AUTH_SCHEMA,
  USER_VALIDATION_CONSTANTS,
  USER_VALIDATION_MESSAGES,
};
