import { Flex, Progress } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { lazy, Suspense } from 'react';

const FeatureMenu = lazy(() => import('../components/feature-menu'));
const SplitPanes = lazy(() => import('../components/split-panes'));

const ApplicationPage = (): JSX.Element => {
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

// eslint-disable-next-line import/no-default-export
export default ApplicationPage;