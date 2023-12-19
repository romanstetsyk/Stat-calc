import { Button } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type * as React from 'react';
import { useEffect, useMemo } from 'react';

import type { DisplayStep } from '~/modules/application/types';
import { useGridData } from '~/modules/data-grid/store';

import { calcFrequency } from './calc-frequency';
import { OutputContent } from './output-content';
import type { FrequencyDistributionSession, TForm } from './types';

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayStep>>;
  formSummary: TForm;
  setOutput: React.Dispatch<
    React.SetStateAction<FrequencyDistributionSession | undefined>
  >;
};

const Output = ({
  id,
  setDisplay,
  formSummary,
  setOutput,
}: Props): JSX.Element => {
  const outputId = useMemo(() => id ?? nanoid(), [id]);

  const { colData } = useGridData();
  const { columns, options, withLabel } = formSummary;

  const arrOfTables = useMemo(
    () => calcFrequency(columns, colData, withLabel, options),
    [colData, columns, options, withLabel],
  );

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: 'Frequency Distribution',
      type: 'frequencyDistribution',
      data: arrOfTables,
      formSummary,
    });
  }, [arrOfTables, formSummary, outputId, setOutput]);

  return (
    <>
      <Button
        onClick={(): void => {
          setDisplay('form');
        }}
      >
        ← Back
      </Button>
      <OutputContent outputData={arrOfTables} />
    </>
  );
};

export { Output };
