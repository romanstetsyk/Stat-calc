import { Box, Heading } from "@chakra-ui/react";
import { DataTable } from "~/components/DataTable";
import { OutputReturn } from "./types";

type Props = {
  outputData: OutputReturn[];
};

export const OutputContent = ({ outputData }: Props) => {
  return [
    outputData.map(({ varName, n, table, stats }) => (
      <Box key={varName}>
        <Heading size="xs" as="h5" mb={4}>
          Variable: {varName}. Count: {n}
        </Heading>
        <DataTable data={table} stats={stats} />
      </Box>
    )),
  ];
};
