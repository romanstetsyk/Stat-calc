import { PROFILE_ROUTES } from './profile-routes';

const APP_ROUTES = {
  HOME: '/',
  APP: '/app',
  ABOUT: '/about',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  ...PROFILE_ROUTES,
  OTHER: '*',
} as const;

export { APP_ROUTES };
