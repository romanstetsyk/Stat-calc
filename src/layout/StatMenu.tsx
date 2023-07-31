import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuList,
} from "@chakra-ui/react";
import { UploadFile } from "~/components/UploadFile";
import { StatModal as DescriptiveStatisticsModal } from "~/features/DescriptiveStatistics/StatModal";
import { StatModal as FrequencyDistributionModal } from "~/features/FrequencyDistribution/StatModal";
import { StatModal as GroupNumericDataModal } from "~/features/GroupNumericData/StatModal";
import { StatModal as HistogramModal } from "~/features/Histogram/StatModal";
import { StatModal as OneSampleZDataModal } from "~/features/OneSampleZData/StatModal";
import { StatModal as OneSampleZSummaryModal } from "~/features/OneSampleZSummary/StatModal";
import { StatModal as TwoSampleZDataModal } from "~/features/TwoSampleZData/StatModal";
import { StatModal as TwoSampleZSummaryModal } from "~/features/TwoSampleZSummary/StatModal";

const StatMenu = () => {
  return (
    <Flex wrap={"wrap"} fontSize={"sm"}>
      <UploadFile />

      <Menu>
        <MenuButton
          px={2}
          py={1}
          transition="all 0.2s"
          borderRadius="sm"
          borderWidth="1px"
          _hover={{ bg: "gray.400" }}
          _expanded={{ bg: "gray.500" }}
          _focus={{ boxShadow: "outline" }}
        >
          Z Stats <ChevronDownIcon />
        </MenuButton>
        <MenuList zIndex={36}>
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
          px={2}
          py={1}
          transition="all 0.2s"
          borderRadius="sm"
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
          px={2}
          py={1}
          transition="all 0.2s"
          borderRadius="sm"
          borderWidth="1px"
          _hover={{ bg: "gray.400" }}
          _expanded={{ bg: "gray.500" }}
          _focus={{ boxShadow: "outline" }}
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

export default StatMenu;
