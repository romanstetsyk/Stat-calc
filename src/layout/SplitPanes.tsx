import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Allotment } from "allotment";
import { useEffect, useRef, useState } from "react";
import { DataGrid } from "./DataGrid";
import { Session } from "./Session";

type AllotmentRef = {
  resize: (args: number[]) => void;
  reset: () => void;
};

export const SplitPanes = () => {
  const ref = useRef<AllotmentRef>(null);

  const [showSessionMobile, setShowSessionMobile] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showSession, setShowSession] = useState(true);

  const [sizes, setSizes] = useState<number[]>([700, 300]);

  const smallScreen = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );

  useEffect(() => {
    if (!smallScreen && ref.current) {
      ref.current.resize(sizes);
    }
  }, [sizes, smallScreen]);

  return (
    <>
      {!showSessionMobile && smallScreen && (
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
      {showSessionMobile && smallScreen && (
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
    </>
  );
};