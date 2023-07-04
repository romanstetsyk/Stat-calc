import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuList,
} from "@chakra-ui/react";
import { StatModal as DescriptiveStatisticsModal } from "~/features/DescriptiveStatistics/StatModal";
import { StatModal as FrequencyDistributionModal } from "~/features/FrequencyDistribution/StatModal";
import { StatModal as GroupNumericDataModal } from "~/features/GroupNumericData/StatModal";
import { StatModal as HistogramModal } from "~/features/Histogram/StatModal";
import { StatModal as OneSampleZDataModal } from "~/features/OneSampleZData/StatModal";
import { StatModal as OneSampleZSummaryModal } from "~/features/OneSampleZSummary/StatModal";
import { StatModal as TwoSampleZDataModal } from "~/features/TwoSampleZData/StatModal";
import { StatModal as TwoSampleZSummaryModal } from "~/features/TwoSampleZSummary/StatModal";
import { SplitPanes } from "~/layout/SplitPanes";

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
          {/* split view handle has z-index 35 by default */}
          <MenuList zIndex={36}>
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
