import { useContext, useRef } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { SampleStatistics } from "../features/DescriptiveStatistics/types";
import { DataTable } from "../components/DataTable";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CloseButton,
  Flex,
  Heading,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import DraggableGrid, { DraggableGridHandle } from "ruuri";
import { TSession } from "src/Types";
import { layoutFunction } from "src/utils/layoutFunction";
import { SessionItemWrapper } from "src/components/SessionItemWrapper";

export const Session = () => {
  const { session } = useContext(SessionContext);

  const gridRef = useRef<DraggableGridHandle | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  if (session.length === 0) {
    return <Text>No data</Text>;
  }

  return (
    <CardBody overflow={"scroll"} px={0} ref={divRef}>
      <DraggableGrid
        ref={gridRef}
        layout={layoutFunction}
        onDragEnd={() => gridRef.current?.grid?.layout()}
        dragEnabled
        dragSort={false}
        dragAutoScroll={{
          targets: () => [
            { element: window, priority: 0 },
            { element: divRef.current ?? window, priority: 1 },
          ],
          sortDuringScroll: false,
          threshold: 0,
          safeZone: 0,
        }}
        dragContainer={document.getElementById("dragContainer")}
        dragHandle={".draggableHeader"}
        // dragStartPredicate={{ delay: 200 }}
        uniKey={"outputId"}
        data={session}
        renderItem={(item: TSession) => {
          if (item.type === "descriptive") {
            const { outputId, title, data, stats } = item;
            return (
              <SessionItemWrapper
                key={outputId}
                outputId={outputId}
                title={title}
              >
                <DataTable<SampleStatistics, ""> data={data} stats={stats} />
              </SessionItemWrapper>
            );
          }
          if (item.type === "frequencyDistribution") {
            const { outputId, timestamp, title, data } = item;
            return (
              <SessionItemWrapper outputId="a" title={title}>
                <Flex gap={4} direction={"column"}>
                  {data.map(({ varName, n, table, stats }) => (
                    <Box key={varName}>
                      <Heading size="xs" as="h5" mb={4}>
                        Variable: {varName}. Count: {n}
                      </Heading>
                      <DataTable data={table} stats={stats} />
                    </Box>
                  ))}
                </Flex>
              </SessionItemWrapper>
            );
          }
        }}
      />
    </CardBody>
  );
};
