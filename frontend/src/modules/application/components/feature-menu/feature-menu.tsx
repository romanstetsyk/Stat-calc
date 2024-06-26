import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Card,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuList,
  Skeleton,
} from '@chakra-ui/react';
import { lazy, Suspense } from 'react';

// import { LoadDatasetFallback } from '~/modules/datasets/components/load-dataset';

const DescriptiveStatisticsModal = lazy(
  () =>
    import('~/modules/application/features/descriptive-statistics/stat-modal'),
);

const FrequencyDistributionModal = lazy(
  () =>
    import('~/modules/application/features/frequency-distribution/stat-modal'),
);

const GroupNumericDataModal = lazy(
  () => import('~/modules/application/features/group-numeric-data/stat-modal'),
);

const HistogramModal = lazy(
  () => import('~/modules/application/features/histogram/stat-modal'),
);

const OneSampleZDataModal = lazy(
  () => import('~/modules/application/features/one-sample-z-data/stat-modal'),
);

const OneSampleZSummaryModal = lazy(
  () =>
    import('~/modules/application/features/one-sample-z-summary/stat-modal'),
);

const TwoSampleZDataModal = lazy(
  () => import('~/modules/application/features/two-sample-z-data/stat-modal'),
);

const TwoSampleZSummaryModal = lazy(
  () =>
    import('~/modules/application/features/two-sample-z-summary/stat-modal'),
);

const LoadDataset = lazy(() =>
  import('~/modules/datasets/components/load-dataset').then((module) => ({
    default: module.LoadDataset,
  })),
);

const FeatureMenu = (): JSX.Element => {
  return (
    <Card
      flexDirection='row'
      fontSize='sm'
      mx={2}
      p={1}
      width='fit-content'
      boxShadow='none'
    >
      <Suspense
        fallback={
          // Defining fallback inline shows it with lower delay
          <Skeleton px={3} py={1} borderRadius='md' borderWidth='1px'>
            Upload
          </Skeleton>
        }
      >
        <LoadDataset />
      </Suspense>

      <Suspense
        fallback={
          // Defining fallback inline shows it with lower delay
          <Skeleton px={3} py={1} borderRadius='md' borderWidth='1px'>
            Z Stats <ChevronDownIcon />
          </Skeleton>
        }
      >
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                px={3}
                py={1}
                transition='all 0.2s'
                borderRadius='md'
                borderWidth='1px'
                _hover={{ bg: 'gray.200' }}
                _expanded={{ bg: 'gray.200' }}
                _focus={{ boxShadow: 'outline' }}
              >
                Z Stats {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </MenuButton>
              <MenuList zIndex={36}>
                <MenuGroup title='One Sample'>
                  <OneSampleZSummaryModal />
                  <OneSampleZDataModal />
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title='Two Sample'>
                  <TwoSampleZSummaryModal />
                  <TwoSampleZDataModal />
                </MenuGroup>
              </MenuList>
            </>
          )}
        </Menu>
      </Suspense>

      <Suspense
        fallback={
          // Defining fallback inline shows it with lower delay
          <Skeleton px={3} py={1} borderRadius='md' borderWidth='1px'>
            Summarize <ChevronDownIcon />
          </Skeleton>
        }
      >
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                px={3}
                py={1}
                transition='all 0.2s'
                borderRadius='md'
                borderWidth='1px'
                _hover={{ bg: 'gray.200' }}
                _expanded={{ bg: 'gray.200' }}
                _focus={{ boxShadow: 'outline' }}
              >
                Summarize {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </MenuButton>
              {/* split view handle has z-index 35 by default */}
              <MenuList zIndex={36}>
                <DescriptiveStatisticsModal />
                <FrequencyDistributionModal />
                <GroupNumericDataModal />
              </MenuList>
            </>
          )}
        </Menu>
      </Suspense>

      <Suspense
        fallback={
          // Defining fallback inline shows it with lower delay
          <Skeleton px={3} py={1} borderRadius='md' borderWidth='1px'>
            Graphics <ChevronDownIcon />
          </Skeleton>
        }
      >
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                px={3}
                py={1}
                transition='all 0.2s'
                borderRadius='md'
                borderWidth='1px'
                _hover={{ bg: 'gray.200' }}
                _expanded={{ bg: 'gray.200' }}
                _focus={{ boxShadow: 'outline' }}
              >
                Graphics {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </MenuButton>
              <MenuList zIndex={36}>
                <HistogramModal />
              </MenuList>
            </>
          )}
        </Menu>
      </Suspense>
    </Card>
  );
};

export { FeatureMenu };
