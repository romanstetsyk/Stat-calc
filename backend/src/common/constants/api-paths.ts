const API_PATHS = {
  USERS: '/users',
  AUTH: '/auth',
} as const;

const API_PATHS_USERS = {
  ROOT: '/',
  $ID: '/:id',
} as const;

const API_PATHS_AUTH = {
  SIGN_UP: '/sign-up',
  SIGN_IN: '/sign-in',
  REFRESH: '/refresh',
  ME: '/me',
} as const;

export { API_PATHS, API_PATHS_AUTH, API_PATHS_USERS };
