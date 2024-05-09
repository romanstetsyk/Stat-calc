import { Button } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type * as React from 'react';
import { useEffect, useMemo } from 'react';

import type { DisplayStep } from '~/modules/application/types';
import { useGridData } from '~/modules/data-grid/hooks';

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

  const outputData = useMemo(
    () => calcStatistics(formSummary, colData),
    [colData, formSummary],
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
  }, [formSummary, outputData, outputId, setOutput]);

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
