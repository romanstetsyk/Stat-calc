import React from 'react';

import { PROFILE_ROUTES } from '~/common/constants';
// import { AccountPage } from '~/modules/account/pages/account-page';
// import { DatasetsPage } from '~/modules/datasets/pages';

const AccountPage = React.lazy(
  () => import('~/modules/account/pages/account-page'),
);

const DatasetsPage = React.lazy(
  () => import('~/modules/datasets/pages/datasets-page'),
);

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
