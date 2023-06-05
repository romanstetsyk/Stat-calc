import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  useDisclosure,
  DrawerCloseButton,
  Show,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import "allotment/dist/style.css";
import { Allotment } from "allotment";

import { StatModal as OneSampleZSummaryModal } from "./features/OneSampleZSummary/StatModal";
import { StatModal as OneSampleZDataModal } from "./features/OneSampleZData/StatModal";
import { StatModal as DescriptiveStatisticsModal } from "./features/DescriptiveStatistics/StatModal";
import { StatModal as FrequencyDistributionModal } from "./features/FrequencyDistribution/StatModal";
import { StatModal as GroupNumericDataModal } from "./features/GroupNumericData/StatModal";
import { StatModal as TwoSampleZSummaryModal } from "./features/TwoSampleZSummary/StatModal";
import { StatModal as TwoSampleZDataModal } from "./features/TwoSampleZData/StatModal";
import { Session } from "./layout/Session";
import { DataGrid } from "./layout/DataGrid";
import { MainHeader } from "./layout/MainHeader";

export const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction={"column"} height={"100vh"} overflow={"scroll"}>
      <MainHeader />
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
      </Flex>

      <Show above="md">
        <Allotment defaultSizes={[7, 3]}>
          <Allotment.Pane>
            <Card maxW="full" height="100%" m={2}>
              <CardHeader pb={0}>
                <Heading size={"md"}>Untitled</Heading>
              </CardHeader>
              <CardBody overflow={"scroll"} px={0}>
                <DataGrid />
              </CardBody>
            </Card>
          </Allotment.Pane>
          <Allotment.Pane>
            <Card maxW="full" height="100%" m={2}>
              <CardHeader>
                <Heading size={"md"}>Session</Heading>
              </CardHeader>
              <CardBody overflow={"scroll"}>
                <Session />
              </CardBody>
            </Card>
          </Allotment.Pane>
        </Allotment>
      </Show>

      <Show below="md">
        <IconButton
          zIndex={1}
          width={"max-content"}
          position={"fixed"}
          top="50%"
          right="0"
          onClick={onOpen}
          aria-label="Add to friends"
          icon={<ChevronLeftIcon />}
        />
        <Card maxW="full" height="100%" m={2}>
          <CardHeader pb={0}>
            <Heading size={"md"}>Untitled</Heading>
          </CardHeader>
          <CardBody overflow={"scroll"} px={0}>
            <DataGrid />
          </CardBody>
        </Card>
        <Drawer
          placement={"right"}
          onClose={onClose}
          isOpen={isOpen}
          size="full"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Session</DrawerHeader>
            <DrawerBody>
              <Session />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Show>
    </Flex>
  );
};
