import { DataTable } from '~/modules/application/components';

import type { OutputReturn, SampleStatistics } from './types';

type Props = {
  outputData: OutputReturn;
};

const OutputContent = ({ outputData }: Props): JSX.Element => {
  const { data, stats } = outputData;
  return <DataTable<SampleStatistics, ''> data={data} stats={stats} />;
};

export { OutputContent };
