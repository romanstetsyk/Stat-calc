import './index.css';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { APP_ROUTES } from '~/common/constants';
import { SharedLayout } from '~/components/shared-layout';
import { queryClient } from '~/config/query-client';
import { SessionProvider } from '~/contexts/session-context';
import { SignInPage } from '~/modules/auth/pages/sign-in-page';
import { SignUpPage } from '~/modules/auth/pages/sign-up-page';
import { About } from '~/pages/about';

const Application = React.lazy(() => import('~/pages/application'));
const Home = React.lazy(() => import('~/pages/home'));

const routes: RouteObject[] = [
  {
    path: APP_ROUTES.HOME,
    element: <SharedLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: APP_ROUTES.APP,
        element: <Application />,
      },
      {
        path: APP_ROUTES.ABOUT,
        element: <About />,
      },
      {
        path: APP_ROUTES.SIGN_UP,
        element: <SignUpPage />,
      },
      {
        path: APP_ROUTES.SIGN_IN,
        element: <SignInPage />,
      },
      {
        path: APP_ROUTES.OTHER,
        element: <div>not found</div>,
      },
    ],
  },
];

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <SessionProvider>
          <RouterProvider router={createBrowserRouter(routes)} />
        </SessionProvider>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
