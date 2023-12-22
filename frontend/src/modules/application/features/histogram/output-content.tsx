import { Flex, Heading } from '@chakra-ui/react';

import { Histogram } from '~/modules/application/components';

import type { OutputReturn } from './types';

type Props = {
  outputData: OutputReturn[];
};

const OutputContent = ({ outputData }: Props): JSX.Element => {
  return (
    <Flex flexDirection='column' gap={2}>
      {outputData.map(({ varName, out, options }) => (
        <Flex
          flexDirection='column'
          gap={2}
          key={varName}
          maxHeight={{ base: '100vh', md: '60vh' }}
        >
          <Heading size='xs' as='h5'>
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
        </Flex>
      ))}
    </Flex>
  );
};

export { OutputContent };
