import { useContext, useRef } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { SampleStatistics } from "../features/DescriptiveStatistics/types";
import { DataTable } from "../components/DataTable";
import { CardBody, Text } from "@chakra-ui/react";
import DraggableGrid, { DraggableGridHandle } from "ruuri";
import { TSession } from "src/Types";
import { layoutFunction } from "src/utils/layoutFunction";
import { SessionItemWrapper } from "src/components/Session/SessionItemWrapper";
import { OutputContent } from "src/features/FrequencyDistribution/OutputContent";

export const Session = () => {
  const { session } = useContext(SessionContext);

  const gridRef = useRef<DraggableGridHandle | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  if (session.length === 0) {
    return <Text m={5}>No data</Text>;
  }

  return (
    <CardBody overflow={"scroll"} px={0} ref={divRef}>
      <DraggableGrid
        ref={gridRef}
        layout={layoutFunction}
        onDragEnd={() => gridRef.current?.grid?.refreshItems().layout()}
        dragEnabled
        dragSort={true}
        dragAutoScroll={{
          targets: () => [
            { element: window, priority: 0 },
            { element: divRef.current ?? window, priority: 1 },
          ],
          sortDuringScroll: false,
          threshold: 0,
          safeZone: 0.5,
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
                id={outputId}
                title={title}
                gridRef={gridRef}
              >
                <CardBody px={3} py={2}>
                  <DataTable<SampleStatistics, ""> data={data} stats={stats} />
                </CardBody>
              </SessionItemWrapper>
            );
          }
          if (item.type === "frequencyDistribution") {
            const { outputId, title, data } = item;
            return (
              <SessionItemWrapper
                key={outputId}
                id={outputId}
                title={title}
                gridRef={gridRef}
              >
                <CardBody
                  px={3}
                  py={2}
                  display={"flex"}
                  gap={4}
                  flexDirection={"column"}
                >
                  <OutputContent outputData={data} />
                </CardBody>
              </SessionItemWrapper>
            );
          }
        }}
      />
    </CardBody>
  );
};
