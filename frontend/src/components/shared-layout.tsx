import { Flex, Progress } from '@chakra-ui/react';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { NavBar } from '~/components/nav-bar';

const SharedLayout = (): JSX.Element => {
  return (
    <Flex direction='column'>
      <NavBar />
      <Suspense fallback={<Progress size='xs' isIndeterminate />}>
        <Outlet />
      </Suspense>
    </Flex>
  );
};

export { SharedLayout };
