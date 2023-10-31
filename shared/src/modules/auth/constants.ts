const API_PATHS_AUTH = {
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  SIGN_OUT: '/sign-out',
  REFRESH: '/refresh',
  ME: '/me',
} as const;

const AUTH_SCHEMA = 'Bearer';

export { API_PATHS_AUTH, AUTH_SCHEMA };
