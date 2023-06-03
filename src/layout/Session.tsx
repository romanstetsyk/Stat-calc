import { useContext, memo } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { SampleStatistics } from "../features/DescriptiveStatistics/types";
import { DataTable } from "../components/DataTable";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const Session = memo(() => {
  const { session } = useContext(SessionContext);

  if (session.length === 0) {
    return null;
  }

  return (
    <Box>
      {session.map(({ type, timestamp, title, data, stats }) => {
        if (type === "descriptive") {
          return (
            <Box key={timestamp} mb={8}>
              <Flex gap={4} alignItems={"baseline"} mb={4}>
                <Heading as="h4" size="md">
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
      })}
    </Box>
  );
});
