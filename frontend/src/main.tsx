import { ChakraProvider } from '@chakra-ui/react';
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

import { ProtectedRoute } from '~/common/components';
import { APP_ROUTES } from '~/common/constants';
import { theme } from '~/common/theme';
import { SharedLayout } from '~/components/shared-layout';
import { queryClient } from '~/config/query-client';
import { SignInPage } from '~/modules/auth/pages/sign-in-page';
import { SignUpPage } from '~/modules/auth/pages/sign-up-page';
import { ProfilePage } from '~/modules/profile/pages/profile-page';
import { About } from '~/pages/about';

import { AccountPage } from './modules/account/pages';
import { DatasetPageWrapper, DatasetsPage } from './modules/datasets/pages';

const Application = React.lazy(
  () => import('~/modules/application/components/application'),
);
const Home = React.lazy(() => import('~/pages/home'));

const routes: RouteObject[] = [
  {
    path: APP_ROUTES.HOME,
    element: <SharedLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: APP_ROUTES.APP, element: <Application /> },
      { path: APP_ROUTES.ABOUT, element: <About /> },
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
            children: [{ index: true, element: <DatasetPageWrapper /> }],
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
        <RouterProvider router={browserRouter} />
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
