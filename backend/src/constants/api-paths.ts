const API_PATHS = {
  USERS: '/users',
} as const;

const API_PATHS_USERS = {
  ROOT: '/',
  $ID: '/:id',
} as const;

export { API_PATHS, API_PATHS_USERS };
