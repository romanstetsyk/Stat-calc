const ERROR_MESSAGES = {
  NOT_FOUND: 'Not found.',
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  UNKNOWN: 'Internal Server Error',
  USER_ALREADY_EXIST: 'User already exists',
  USER_ALREADY_AUTHENTICATED: 'Already authenticated',
  DUPLICATE_KEY: 'Duplicate key error',
  USER_NOT_FOUND: 'User not found',
  PASSWORD_INCORRECT: 'Incorrect password',
  WRONG_CREDENTIALS: "That username or password didn't work",
  MISSING_TOKEN: 'The token is missing in the request',
  TOKEN_EXPIRED: 'JWT token expired',
  MISSING_EXP_CLAIM: "Token doesn't contain the `exp` claim",
} as const;

export { ERROR_MESSAGES };
