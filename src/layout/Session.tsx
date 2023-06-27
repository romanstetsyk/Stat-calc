import { useContext, memo, useRef, useState, useEffect } from "react";
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
import DraggableGrid from "ruuri";
import { TSession } from "src/Types";

export const Session = memo(() => {
  const { session } = useContext(SessionContext);

  const divRef = useRef<HTMLDivElement | null>(null);
  // needed to load content only after ref has been set
  const [divRefLoaded, setDivRefLoaded] = useState(false);

  useEffect(() => {
    if (divRef.current) {
      setDivRefLoaded(true);
    }
  }, []);

  if (session.length === 0) {
    return <Text>No data</Text>;
  }

  return (
    <CardBody overflow={"scroll"} px={0} ref={divRef}>
      {divRefLoaded && divRef.current && (
        <DraggableGrid
          dragEnabled
          dragSort
          dragAutoScroll={{
            targets: [
              { element: window, priority: 0 },
              { element: divRef.current, priority: 1 },
            ],
            sortDuringScroll: true,
            threshold: 100,
            safeZone: 0,
          }}
          layout={{ fillGaps: false }}
          dragContainer={document.getElementById("dragContainer")}
          dragHandle={".draggableHeader"}
          dragStartPredicate={{ delay: 200 }}
          uniKey={"outputId"}
          data={session}
          renderItem={(item: TSession) => {
            if (item.type === "descriptive") {
              const { outputId, title, data, stats } = item;
              return (
                <Card
                  key={outputId}
                  mx={2}
                  my={1}
                  data-group
                  cursor={"auto"}
                  boxShadow="xs"
                  transitionDuration="200ms"
                  transitionProperty="boxShadow"
                  _hover={{
                    boxShadow:
                      "var(--chakra-shadows-base), var(--chakra-shadows-xs)",
                  }}
                >
                  <Flex
                    gap={4}
                    alignItems={"flex-start"}
                    className="draggableHeader"
                  >
                    <CardHeader>
                      <Heading as="h4" size="sm">
                        {title}
                      </Heading>
                      {/* <Text fontSize="md">
                    {new Date(timestamp).toLocaleString()}
                  </Text> */}
                    </CardHeader>
                    <Tooltip
                      hasArrow
                      label="Remove from session"
                      placement="top"
                      fontSize={"xs"}
                    >
                      <CloseButton
                        size="sm"
                        ml="auto"
                        p={"var(--card-padding)"}
                        visibility={"hidden"}
                        _groupHover={{ visibility: "visible" }}
                      />
                    </Tooltip>
                  </Flex>
                  <CardBody pt={0}>
                    <DataTable<SampleStatistics, "">
                      data={data}
                      stats={stats}
                    />
                  </CardBody>
                </Card>
              );
            }
            if (item.type === "frequencyDistribution") {
              const { timestamp, title, data } = item;
              return (
                <Box key={timestamp} data-group>
                  <Flex gap={4} alignItems={"baseline"} mb={4}>
                    <Heading as="h4" size="sm">
                      {title}
                    </Heading>
                    <Text fontSize="md">
                      {new Date(timestamp).toLocaleString()}
                    </Text>
                    <Tooltip
                      hasArrow
                      label="Remove from session"
                      placement="top"
                      fontSize={"xs"}
                    >
                      <CloseButton
                        size="sm"
                        ml="auto"
                        visibility={"hidden"}
                        _groupHover={{ visibility: "visible" }}
                      />
                    </Tooltip>
                  </Flex>
                  {data.map(({ varName, n, table, stats }) => (
                    <Box key={varName} my={4}>
                      <Heading size="xs" as="h5" mb={4}>
                        Variable: {varName}. Count: {n}
                      </Heading>
                      <DataTable data={table} stats={stats} />
                    </Box>
                  ))}
                </Box>
              );
            }
          }}
        />
      )}
    </CardBody>
  );
});
