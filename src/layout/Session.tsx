import { useContext, memo } from "react";
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
import DraggableGrid, { DraggableItem } from "ruuri";

export const Session = memo(() => {
  const { session } = useContext(SessionContext);

  if (session.length === 0) {
    return <Text>No data</Text>;
  }

  return (
    <DraggableGrid
      dragEnabled
      dragSort
      layout={{
        fillGaps: true,
      }}
      dragHandle={".draggableHeader"}
      dragStartPredicate={{ delay: 200 }}
    >
      {session.map((item) => {
        if (item.type === "descriptive") {
          const { timestamp, title, data, stats } = item;
          return (
            <DraggableItem key={timestamp}>
              <Card
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
                  <DataTable<SampleStatistics, ""> data={data} stats={stats} />
                </CardBody>
              </Card>
            </DraggableItem>
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
      })}
    </DraggableGrid>
  );
});
