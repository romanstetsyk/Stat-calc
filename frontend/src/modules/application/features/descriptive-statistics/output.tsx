import { Button } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type * as React from 'react';
import { useEffect, useMemo } from 'react';

import type { DisplayStep } from '~/modules/application/types';
import { useGridData } from '~/modules/data-grid/store';

import { calcStatistics } from './calc-statistics';
import { OutputContent } from './output-content';
import type { DescriptiveStatisticsSession, TForm } from './types';

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayStep>>;
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

  const outputData = useMemo(
    () => calcStatistics(columns, colData, withLabel, options),
    [colData, columns, options, withLabel],
  );

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: 'Descriptive Statistics',
      type: 'descriptive',
      data: outputData,
      formSummary,
    });
  }, [outputData, formSummary, options, outputId, setOutput]);

  return (
    <>
      <Button
        onClick={(): void => {
          setDisplay('form');
        }}
      >
        ← Back
      </Button>
      <OutputContent outputData={outputData} />
    </>
  );
};

export { Output };
