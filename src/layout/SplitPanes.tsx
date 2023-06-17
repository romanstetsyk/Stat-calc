import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Allotment, AllotmentHandle } from "allotment";
import { useEffect, useRef, useState } from "react";
import { DataGrid } from "./DataGrid";
import { Session } from "./Session";

export const SplitPanes = () => {
  const ref = useRef<AllotmentHandle | null>(null);

  const [showSessionMobile, setShowSessionMobile] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showSession, setShowSession] = useState(true);

  const [sizes, setSizes] = useState<number[]>(() => {
    const savedSizes = window.localStorage.getItem("allotmentSizes");
    return typeof savedSizes === "string" ? JSON.parse(savedSizes) : [2, 1];
  });

  const adjustSizes = (s: number[]) => {
    setSizes(s);
    window.localStorage.setItem("allotmentSizes", JSON.stringify(s));
  };

  const smallScreen = useBreakpointValue(
    { base: true, md: false },
    { ssr: false }
  );

  useEffect(() => {
    let id: number;
    if (!smallScreen) {
      // settimeout necessary to run after allotment finishes the layout process
      id = setTimeout(() => {
        ref.current?.reset(); // reset to preferred size
      }, 0);
    }
    return () => clearTimeout(id);
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
        // defaultSizes={sizes}
        onDragEnd={adjustSizes}
        onVisibleChange={(_index, value) => {
          console.log("onVisibleChange ran");
          switch (_index) {
            case 0:
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
          visible={smallScreen ? !showSessionMobile : showGrid}
          preferredSize={`${((100 * sizes[0]) / (sizes[0] + sizes[1])).toFixed(
            2
          )}%`}
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
          visible={smallScreen ? showSessionMobile : showSession}
          preferredSize={`${((100 * sizes[1]) / (sizes[0] + sizes[1])).toFixed(
            2
          )}%`}
        >
          <Card maxW="full" height="100%" m={2}>
            <CardHeader>
              <Heading size={"md"}>Session</Heading>
            </CardHeader>
            <CardBody overflow={"scroll"} px={0}>
              <Session />
            </CardBody>
          </Card>
        </Allotment.Pane>
      </Allotment>
    </>
  );
};
