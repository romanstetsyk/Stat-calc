import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuList,
} from '@chakra-ui/react';

import { UploadFile } from '~/components/upload-file';
import { StatModal as DescriptiveStatisticsModal } from '~/features/descriptive-statistics/stat-modal';
import { StatModal as FrequencyDistributionModal } from '~/features/frequency-distribution/stat-modal';
import { StatModal as GroupNumericDataModal } from '~/features/group-numeric-data/stat-modal';
import { StatModal as HistogramModal } from '~/features/histogram/stat-modal';
import { StatModal as OneSampleZDataModal } from '~/features/one-sample-z-data/stat-modal';
import { StatModal as OneSampleZSummaryModal } from '~/features/one-sample-z-summary/stat-modal';
import { StatModal as TwoSampleZDataModal } from '~/features/two-sample-z-data/stat-modal';
import { StatModal as TwoSampleZSummaryModal } from '~/features/two-sample-z-summary/stat-modal';

const StatMenu = (): JSX.Element => {
  return (
    <Flex wrap='wrap' fontSize='sm'>
      <UploadFile />

      <Menu>
        <MenuButton
          px={2}
          py={1}
          transition='all 0.2s'
          borderRadius='sm'
          borderWidth='1px'
          _hover={{ bg: 'gray.400' }}
          _expanded={{ bg: 'gray.500' }}
          _focus={{ boxShadow: 'outline' }}
        >
          Z Stats <ChevronDownIcon />
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
      </Menu>
      <Menu>
        <MenuButton
          px={2}
          py={1}
          transition='all 0.2s'
          borderRadius='sm'
          borderWidth='1px'
          _hover={{ bg: 'gray.400' }}
          _expanded={{ bg: 'gray.500' }}
          _focus={{ boxShadow: 'outline' }}
        >
          Summarize <ChevronDownIcon />
        </MenuButton>
        {/* split view handle has z-index 35 by default */}
        <MenuList zIndex={36}>
          <DescriptiveStatisticsModal />
          <FrequencyDistributionModal />
          <GroupNumericDataModal />
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton
          px={2}
          py={1}
          transition='all 0.2s'
          borderRadius='sm'
          borderWidth='1px'
          _hover={{ bg: 'gray.400' }}
          _expanded={{ bg: 'gray.500' }}
          _focus={{ boxShadow: 'outline' }}
        >
          Graphics <ChevronDownIcon />
        </MenuButton>
        <MenuList zIndex={36}>
          <HistogramModal />
        </MenuList>
      </Menu>
    </Flex>
  );
};

// eslint-disable-next-line import/no-default-export
export default StatMenu;
