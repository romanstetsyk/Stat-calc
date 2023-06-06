import { useContext, memo } from "react";
import { SessionContext } from "../contexts/SessionContext";
import { SampleStatistics } from "../features/DescriptiveStatistics/types";
import { DataTable } from "../components/DataTable";
import {
  Box,
  CloseButton,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  Tooltip,
} from "@chakra-ui/react";

export const Session = memo(() => {
  const { session } = useContext(SessionContext);

  if (session.length === 0) {
    return <Text>No data</Text>;
  }

  return (
    <Stack divider={<StackDivider />} spacing={8}>
      {session.map((item) => {
        if (item.type === "descriptive") {
          const { timestamp, title, data, stats } = item;
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
              <DataTable<SampleStatistics, ""> data={data} stats={stats} />
            </Box>
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
    </Stack>
  );
});