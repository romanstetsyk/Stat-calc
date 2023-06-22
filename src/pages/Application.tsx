import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
  Flex,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import "allotment/dist/style.css";

import { StatModal as OneSampleZSummaryModal } from "src/features/OneSampleZSummary/StatModal";
import { StatModal as OneSampleZDataModal } from "src/features/OneSampleZData/StatModal";
import { StatModal as DescriptiveStatisticsModal } from "src/features/DescriptiveStatistics/StatModal";
import { StatModal as FrequencyDistributionModal } from "src/features/FrequencyDistribution/StatModal";
import { StatModal as GroupNumericDataModal } from "src/features/GroupNumericData/StatModal";
import { StatModal as TwoSampleZSummaryModal } from "src/features/TwoSampleZSummary/StatModal";
import { StatModal as TwoSampleZDataModal } from "src/features/TwoSampleZData/StatModal";
import { StatModal as HistogramModal } from "src/features/Histogram/StatModal";

import { SplitPanes } from "src/layout/SplitPanes";

// Should be default export to use with dynamic import
export default function Application() {
  return (
    <Flex direction={"column"} height={"100vh"}>
      <Flex>
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
          <MenuList zIndex={6}>
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
          <MenuList zIndex={6}>
            <DescriptiveStatisticsModal />
            <FrequencyDistributionModal />
            <GroupNumericDataModal />
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
            Graphics <ChevronDownIcon />
          </MenuButton>
          <MenuList zIndex={6}>
            <HistogramModal />
          </MenuList>
        </Menu>
      </Flex>

      <SplitPanes />
    </Flex>
  );
}
