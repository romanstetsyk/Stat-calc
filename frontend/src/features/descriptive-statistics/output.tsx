import { Button } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type * as React from 'react';
import { useEffect, useMemo } from 'react';

import { DataTable } from '~/components/data-table';
import { useGridData } from '~/modules/data-grid/store';
import type { DisplayOptions } from '~/types';

import { calcStatistics } from './calc-statistics';
import type {
  DescriptiveStatisticsSession,
  SampleStatistics,
  TForm,
} from './types';

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  setOutput: React.Dispatch<
    React.SetStateAction<DescriptiveStatisticsSession | undefined>
  >;
  formSummary: TForm;
};

const Output = ({
  id,
  setDisplay,
  setOutput,
  formSummary,
}: Props): JSX.Element => {
  const outputId = useMemo(() => id ?? nanoid(), [id]);

  const { colData } = useGridData();
  const { columns, options, withLabel } = formSummary;

  const data = useMemo(
    () => calcStatistics(columns, colData, withLabel, options),
    [colData, columns, options, withLabel],
  );

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: 'Descriptive Statistics',
      type: 'descriptive',
      data,
      stats: ['', ...options],
      formSummary,
    });
  }, [data, formSummary, options, outputId, setOutput]);

  return (
    <>
      <Button
        onClick={(): void => {
          setDisplay('form');
        }}
      >
        ← Back
      </Button>
      <DataTable<SampleStatistics, ''> data={data} stats={['', ...options]} />
    </>
  );
};

export { Output };
