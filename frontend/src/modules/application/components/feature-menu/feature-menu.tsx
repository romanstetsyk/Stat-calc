import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  Card,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuList,
} from '@chakra-ui/react';

import { StatModal as DescriptiveStatisticsModal } from '~/modules/application/features/descriptive-statistics/stat-modal';
import { StatModal as FrequencyDistributionModal } from '~/modules/application/features/frequency-distribution/stat-modal';
import { StatModal as GroupNumericDataModal } from '~/modules/application/features/group-numeric-data/stat-modal';
import { StatModal as HistogramModal } from '~/modules/application/features/histogram/stat-modal';
import { StatModal as OneSampleZDataModal } from '~/modules/application/features/one-sample-z-data/stat-modal';
import { StatModal as OneSampleZSummaryModal } from '~/modules/application/features/one-sample-z-summary/stat-modal';
import { StatModal as TwoSampleZDataModal } from '~/modules/application/features/two-sample-z-data/stat-modal';
import { StatModal as TwoSampleZSummaryModal } from '~/modules/application/features/two-sample-z-summary/stat-modal';
import { LoadDataset } from '~/modules/datasets/components';

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
      <LoadDataset />

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
    </Card>
  );
};

export { FeatureMenu };
