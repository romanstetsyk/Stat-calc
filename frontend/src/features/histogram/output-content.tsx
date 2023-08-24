import { Box, Heading } from '@chakra-ui/react';

import { Histogram } from '~/components/histogram';

import type { OutputReturn } from './types';

type Props = {
  outputData: OutputReturn[];
};

const OutputContent = ({ outputData }: Props): JSX.Element[] => {
  return outputData.map(({ varName, out, options }) => (
    <Box key={varName}>
      <Heading size='xs' as='h5' mb={4}>
        Variable: {varName}
      </Heading>
      <Histogram
        key={varName}
        domain={out.domain}
        classWidth={out.width}
        table={out.bins}
        parsing={{
          xAxisKey: 'midpoint',
          yAxisKey: options,
        }}
        datalabel={varName}
      />
    </Box>
  ));
};

export { OutputContent };
