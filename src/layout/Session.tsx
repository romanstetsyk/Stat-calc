import { useContext, useRef } from "react";
import { CardBody, Text } from "@chakra-ui/react";
import DraggableGrid, { DraggableGridHandle } from "ruuri";
import { DataTable } from "~/components/DataTable";
import { SessionItemWrapper } from "~/components/Session/SessionItemWrapper";
import { SessionContext } from "~/contexts/SessionContext";
import { SampleStatistics } from "~/features/DescriptiveStatistics/types";
import { OutputContent as FrequencyDistOutputContent } from "~/features/FrequencyDistribution/OutputContent";
import { OutputContent as HistogramOutputContent } from "~/features/Histogram/OutputContent";
import { TSession } from "~/Types";
import { layoutFunction } from "~/utils/layoutFunction";

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
        uniKey={"id"}
        data={session}
        renderItem={(item: TSession) => {
          if (item.type === "descriptive") {
            const { id, title, data, stats } = item;
            return (
              <SessionItemWrapper
                key={id}
                id={id}
                title={title}
                gridRef={gridRef}
              >
                <CardBody px={3} py={2} overflow={"auto"}>
                  <DataTable<SampleStatistics, ""> data={data} stats={stats} />
                </CardBody>
              </SessionItemWrapper>
            );
          } else if (item.type === "frequencyDistribution") {
            const { id, title, data } = item;
            return (
              <SessionItemWrapper
                key={id}
                id={id}
                title={title}
                gridRef={gridRef}
              >
                <CardBody
                  px={3}
                  py={2}
                  display={"flex"}
                  gap={4}
                  flexDirection={"column"}
                  overflow={"auto"}
                >
                  <FrequencyDistOutputContent outputData={data} />
                </CardBody>
              </SessionItemWrapper>
            );
          } else if (item.type === "histogram") {
            const { id, title, data } = item;
            return (
              <SessionItemWrapper
                key={id}
                id={id}
                title={title}
                gridRef={gridRef}
              >
                <CardBody
                  px={3}
                  py={2}
                  display={"flex"}
                  gap={4}
                  flexDirection={"column"}
                  overflow={"auto"}
                >
                  <HistogramOutputContent outputData={data} />
                </CardBody>
              </SessionItemWrapper>
            );
          }
        }}
      />
    </CardBody>
  );
};
