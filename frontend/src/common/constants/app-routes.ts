import { AUTH_ROUTES } from './auth-routes';
import { PROFILE_ROUTES } from './profile-routes';

const APP_ROUTES = {
  HOME: '/',
  APP: '/app',
  ABOUT: '/about',
  ...AUTH_ROUTES,
  ...PROFILE_ROUTES,
  OTHER: '*',
} as const;

export { APP_ROUTES };
