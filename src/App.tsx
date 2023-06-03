import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import { StatModal as OneSampleZSummaryModal } from "./features/OneSampleZSummary/StatModal";
import { StatModal as OneSampleZDataModal } from "./features/OneSampleZData/StatModal";
import { StatModal as DescriptiveStatisticsModal } from "./features/DescriptiveStatistics/StatModal";
import { StatModal as FrequencyDistributionModal } from "./features/FrequencyDistribution/StatModal";
import { StatModal as GroupNumericDataModal } from "./features/GroupNumericData/StatModal";
import { StatModal as TwoSampleZSummaryModal } from "./features/TwoSampleZSummary/StatModal";
import { StatModal as TwoSampleZDataModal } from "./features/TwoSampleZData/StatModal";
import { Session } from "./layout/Session";
import { DataGrid } from "./layout/DataGrid";

export const App = () => {
  return (
    <>
      <Menu>
        <MenuButton
          px={4}
          py={2}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          _hover={{ bg: "gray.400" }}
          _expanded={{ bg: "gray.500" }}
          _focus={{ boxShadow: "outline" }}
        >
          Z Stats <ChevronDownIcon />
        </MenuButton>
        <MenuList>
          <MenuGroup title="One Sample">
            <OneSampleZSummaryModal />
            <OneSampleZDataModal />
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Two Sample">
            <TwoSampleZSummaryModal />
            <TwoSampleZDataModal />
          </MenuGroup>
        </MenuList>
      </Menu>
      <Menu>
        <MenuButton
          px={4}
          py={2}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          _hover={{ bg: "gray.400" }}
          _expanded={{ bg: "gray.500" }}
          _focus={{ boxShadow: "outline" }}
        >
          Summarize <ChevronDownIcon />
        </MenuButton>
        <MenuList>
          <DescriptiveStatisticsModal />
          <FrequencyDistributionModal />
          <GroupNumericDataModal />
        </MenuList>
      </Menu>

      <DataGrid />

      <h2>Session</h2>
      <Session />
    </>
  );
};
