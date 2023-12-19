import { Flex, Progress } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { lazy, Suspense } from 'react';

const FeatureMenu = lazy(() => import('../feature-menu'));
const SplitPanes = lazy(() => import('../split-panes'));

// Should be default export to use with dynamic import
const Application = (): JSX.Element => {
  return (
    <>
      <Global styles={{ body: { overscrollBehaviorX: 'contain' } }} />
      <Flex as='main' direction='column' flexGrow={1} minHeight='100%'>
        <Suspense fallback={<Progress size='xs' isIndeterminate />}>
          <FeatureMenu />
        </Suspense>
        <Suspense fallback={<Progress size='xs' isIndeterminate />}>
          <SplitPanes />
        </Suspense>
      </Flex>
    </>
  );
};

export { Application };
