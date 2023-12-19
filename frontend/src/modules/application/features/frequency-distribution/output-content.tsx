import { Flex, Heading } from '@chakra-ui/react';

import { DataTable } from '~/modules/application/components';

import type { OutputReturn } from './types';

type Props = {
  outputData: OutputReturn[];
};

const OutputContent = ({ outputData }: Props): JSX.Element => {
  return (
    <Flex flexDirection='column' gap={2}>
      {outputData.map(({ varName, n, table, stats }) => (
        <Flex flexDirection='column' gap={2} key={varName}>
          <Heading size='xs' as='h5'>
            Variable: {varName}. Count: {n}
          </Heading>
          <DataTable data={table} stats={stats} />
        </Flex>
      ))}
    </Flex>
  );
};

export { OutputContent };
