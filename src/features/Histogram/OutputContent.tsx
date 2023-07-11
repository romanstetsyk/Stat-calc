import { Box, Heading } from "@chakra-ui/react";
import { Histogram } from "~/components/Histogram";
import { OutputReturn } from "./types";

type Props = {
  outputData: OutputReturn[];
};

export const OutputContent = ({ outputData }: Props) => {
  return [
    outputData.map(({ varName, out, options }) => (
      <Box key={varName}>
        <Heading size="xs" as="h5" mb={4}>
          Variable: {varName}
        </Heading>
        <Histogram
          key={varName}
          domain={out.domain}
          classWidth={out.width}
          table={out.bins}
          parsing={{
            xAxisKey: "midpoint",
            yAxisKey: options,
          }}
          datalabel={varName}
        />
      </Box>
    )),
  ];
};
