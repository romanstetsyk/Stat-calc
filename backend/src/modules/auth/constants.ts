const AUTH_CONSTANTS = {
  MIN_NAME_LENGTH: 1,
  MIN_PASSWORD_LENGTH: 8,
  MAX_LOGIN_INPUT_LENGTH: 50,
  PASSWORD_REGEXP:
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!#$%&()*+,./:;<=>?@^_{}-]).+$/,
} as const;

const USER_VALIDATION_MESSAGE = {
  NAME_REQUIRED: 'Name is required',
  NAME_ALPHANUM: 'Name must only contain alpha-numeric characters',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  EMAIL_INVALID: 'Please provide a valid email address',
  PASSWORD_INVALID:
    'Password must contain at least one uppercase letter (A-Z), one lowercase letter (a-z), one digit and one special character',
  PASSWORD_SHORT: 'Password must be at least 8 characters long',
  MAX_LOGIN_INPUT_LENGTH_EXCEEDED: `Maximum length of ${AUTH_CONSTANTS.MAX_LOGIN_INPUT_LENGTH} characters exceeded`,
} as const;

export { AUTH_CONSTANTS, USER_VALIDATION_MESSAGE };
