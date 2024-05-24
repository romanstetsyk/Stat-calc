import { Flex, Progress } from '@chakra-ui/react';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Footer, Header } from '~/common/components';
import { APP_ROUTES } from '~/common/constants';

const SharedLayout = (): JSX.Element => {
  const location = useLocation();

  return (
    <Flex direction='column' height='100vh'>
      <Header />
      <Suspense
        fallback={
          <Progress
            size='xs'
            isIndeterminate
            colorScheme='progressColorScheme'
          />
        }
      >
        <Outlet />
      </Suspense>
      {location.pathname !== APP_ROUTES.APP && <Footer />}
    </Flex>
  );
};

export { SharedLayout };
