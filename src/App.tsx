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
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
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
import { useEffect, useRef, useState } from "react";

export const App = () => {
  const [showSessionMobile, setShowSessionMobile] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showSession, setShowSession] = useState(true);

  const [sizes, setSizes] = useState<number[]>([700, 300]);

  console.log("app");

  const smallScreen = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );

  const ref = useRef<{ resize: (args: number[]) => void; reset: () => void }>(
    null
  );

  useEffect(() => {
    if (!smallScreen && ref.current) {
      ref.current.resize(sizes);
    }
  }, [sizes, smallScreen]);

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

      {smallScreen && (
        <IconButton
          zIndex={1}
          width={"max-content"}
          position={"fixed"}
          top="50%"
          right="0"
          onClick={() => {
            setShowSessionMobile(true);
          }}
          aria-label="Add to friends"
          icon={<ChevronLeftIcon />}
        />
      )}
      {smallScreen && (
        <IconButton
          zIndex={1}
          width={"max-content"}
          position={"fixed"}
          top="50%"
          left="0"
          onClick={() => {
            setShowSessionMobile(false);
          }}
          aria-label="Add to friends"
          icon={<ChevronRightIcon />}
        />
      )}
      <Allotment
        ref={ref}
        snap
        defaultSizes={sizes}
        onDragEnd={setSizes}
        onVisibleChange={(_index, value) => {
          console.log("onVisibleChange ran");
          switch (_index) {
            case 0:
              console.log(value);
              setShowGrid(value);
              break;
            case 1:
              setShowSession(value);
              break;
            default:
              throw new Error("unknown allotment pane");
          }
        }}
      >
        <Allotment.Pane
          minSize={100}
          preferredSize={sizes[0]}
          visible={smallScreen ? !showSessionMobile : showGrid}
        >
          <Card maxW="full" height="100%" m={2}>
            <CardHeader pb={0}>
              <Heading size={"md"}>Untitled</Heading>
            </CardHeader>
            <CardBody overflow={"scroll"} px={0}>
              <DataGrid />
            </CardBody>
          </Card>
        </Allotment.Pane>
        <Allotment.Pane
          minSize={100}
          preferredSize={sizes[1]}
          visible={smallScreen ? showSessionMobile : showSession}
        >
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
    </Flex>
  );
};
