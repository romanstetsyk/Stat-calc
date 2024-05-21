import { ChakraProvider, Progress } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import type { RouteObject } from 'react-router-dom';
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from 'react-router-dom';

import { APP_ROUTES } from '~/common/constants';
import { theme } from '~/common/theme';
import { queryClient } from '~/config';

const ProtectedRoute = React.lazy(() =>
  import('~/common/components/protected-route').then((module) => ({
    default: module.ProtectedRoute,
  })),
);

const SharedLayout = React.lazy(() =>
  import('~/common/components/shared-layout').then((module) => ({
    default: module.SharedLayout,
  })),
);

const AccountPage = React.lazy(
  () => import('~/modules/account/pages/account-page'),
);

const ApplicationPage = React.lazy(
  () => import('~/modules/application/pages/application-page'),
);

const SignInPage = React.lazy(
  () => import('~/modules/auth/pages/sign-in-page'),
);

const SignUpPage = React.lazy(
  () => import('~/modules/auth/pages/sign-up-page'),
);

const DatasetWrapperPage = React.lazy(
  () => import('~/modules/datasets/pages/dataset-wrapper-page'),
);

const DatasetsPage = React.lazy(
  () => import('~/modules/datasets/pages/datasets-page'),
);

const ProfilePage = React.lazy(
  () => import('~/modules/profile/pages/profile-page'),
);

const HomePage = React.lazy(() => import('~/modules/pages/home-page'));

const routes: RouteObject[] = [
  {
    path: APP_ROUTES.HOME,
    element: <SharedLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: APP_ROUTES.APP, element: <ApplicationPage /> },
      { path: APP_ROUTES.SIGN_UP, element: <SignUpPage /> },
      { path: APP_ROUTES.SIGN_IN, element: <SignInPage /> },

      // All protected routes
      {
        path: APP_ROUTES.PROFILE,
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: APP_ROUTES.PROFILE,
            element: <ProfilePage />,
            children: [
              { index: true, loader: () => redirect(APP_ROUTES.DATASETS) },
              { path: APP_ROUTES.DATASETS, element: <DatasetsPage /> },
              { path: APP_ROUTES.ACCOUNT, element: <AccountPage /> },
            ],
          },

          {
            path: APP_ROUTES.DATASET,
            children: [{ index: true, element: <DatasetWrapperPage /> }],
          },
        ],
      },

      { path: APP_ROUTES.OTHER, element: <div>not found</div> },
    ],
  },
];

const browserRouter = createBrowserRouter(routes);

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <React.Suspense fallback={<Progress size='xs' isIndeterminate />}>
          <RouterProvider router={browserRouter} />
        </React.Suspense>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
