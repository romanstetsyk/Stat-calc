import { Flex } from '@chakra-ui/react';

import { DataTable } from '~/modules/application/components';

import type { OutputReturn, SampleStatistics } from './types';

type Props = {
  outputData: OutputReturn;
};

const OutputContent = ({ outputData }: Props): JSX.Element => {
  const { data, stats } = outputData;
  return (
    <Flex
      flexDirection='column'
      gap={2}
      maxHeight={{ base: '100vh', md: '60vh' }}
    >
      <DataTable<SampleStatistics, ''> data={data} stats={stats} />
    </Flex>
  );
};

export { OutputContent };
