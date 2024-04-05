import { Flex, Heading } from '@chakra-ui/react';

import { DataTable } from '~/modules/application/components';

import type { FrequencyDistribution, OutputReturn, TopLeftCell } from './types';

type Props = {
  outputData: OutputReturn[];
};

const OutputContent = ({ outputData }: Props): JSX.Element => {
  return (
    <Flex flexDirection='column' gap={2}>
      {outputData.map(({ varName, n, table, stats }) => (
        <Flex
          flexDirection='column'
          gap={2}
          key={varName}
          maxHeight={{ base: '100vh', md: '60vh' }}
        >
          <Heading size='xs' as='h5'>
            Variable: {varName}. Count: {n}
          </Heading>
          <DataTable<FrequencyDistribution, TopLeftCell>
            data={table}
            stats={stats}
          />
        </Flex>
      ))}
    </Flex>
  );
};

export { OutputContent };
