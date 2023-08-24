import { Flex } from '@chakra-ui/react';
import { lazy, Suspense } from 'react';

// import { SplitPanes } from "~/layout/SplitPanes";

const StatMenu = lazy(() => import('~/layout/stat-menu'));
const SplitPanes = lazy(() => import('~/layout/split-panes'));

// Should be default export to use with dynamic import
const Application = (): JSX.Element => {
  return (
    <Flex direction='column' height='100vh'>
      <Suspense fallback={<div>Loading...</div>}>
        <StatMenu />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <SplitPanes />
      </Suspense>
    </Flex>
  );
};

// eslint-disable-next-line import/no-default-export
export default Application;
