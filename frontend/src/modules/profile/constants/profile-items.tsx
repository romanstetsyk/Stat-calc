import { PROFILE_ROUTES } from './profile-routes';

const PROFILE_ITEMS = [
  {
    path: PROFILE_ROUTES.DATASETS,
    label: 'Datasets',
    tabContent: <div>datasets</div>,
  },
  {
    path: PROFILE_ROUTES.ACCOUNT,
    label: 'Account',
    tabContent: <div>account</div>,
  },
] as const;

export { PROFILE_ITEMS };
