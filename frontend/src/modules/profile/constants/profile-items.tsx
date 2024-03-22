import { PROFILE_ROUTES } from '~/common/constants';
import { AccountPage } from '~/modules/account/pages';
import { DatasetsPage } from '~/modules/datasets/pages';

const PROFILE_ITEMS = [
  {
    path: PROFILE_ROUTES.DATASETS,
    label: 'Datasets',
    tabContent: <DatasetsPage />,
  },
  {
    path: PROFILE_ROUTES.ACCOUNT,
    label: 'Account',
    tabContent: <AccountPage />,
  },
] as const;

export { PROFILE_ITEMS };
