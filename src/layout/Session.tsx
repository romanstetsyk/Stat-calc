import { useContext, memo } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { SampleStatistics } from "../features/DescriptiveStatistics/types";
import { DataTable } from "../components/DataTable";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const Session = memo(() => {
  const { session } = useContext(SessionContext);

  if (session.length === 0) {
    return <Text>No data</Text>;
  }

  return (
    <Box>
      {session.map((item) => {
        if (item.type === "descriptive") {
          const { timestamp, title, data, stats } = item;
          return (
            <Box key={timestamp} mb={8}>
              <Flex gap={4} alignItems={"baseline"} mb={4}>
                <Heading as="h4" size="sm">
                  {title}
                </Heading>
                <Text fontSize="md">
                  {new Date(timestamp).toLocaleString()}
                </Text>
              </Flex>
              <DataTable<SampleStatistics, ""> data={data} stats={stats} />
            </Box>
          );
        }
        if (item.type === "frequencyDistribution") {
          const { timestamp, title, data } = item;
          return (
            <Box key={timestamp} mb={8}>
              <Flex gap={4} alignItems={"baseline"} mb={4}>
                <Heading as="h4" size="sm">
                  {title}
                </Heading>
                <Text fontSize="md">
                  {new Date(timestamp).toLocaleString()}
                </Text>
              </Flex>
              {data.map(({ varName, n, table, stats }) => (
                <div key={varName}>
                  <p>
                    Variable: {varName}. Count: {n}
                  </p>
                  <DataTable data={table} stats={stats} />
                </div>
              ))}
            </Box>
          );
        }
      })}
    </Box>
  );
});
