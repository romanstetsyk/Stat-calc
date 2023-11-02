import { Flex, Progress } from '@chakra-ui/react';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '~/common/components';

const SharedLayout = (): JSX.Element => {
  return (
    <Flex direction='column'>
      <Header />
      <Suspense fallback={<Progress size='xs' isIndeterminate />}>
        <Outlet />
      </Suspense>
    </Flex>
  );
};

export { SharedLayout };
