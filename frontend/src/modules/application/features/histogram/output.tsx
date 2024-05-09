import { Button } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type * as React from 'react';
import { useEffect, useMemo } from 'react';

import type { DisplayStep } from '~/modules/application/types';
import { useGridData } from '~/modules/data-grid/hooks';

import { calcHistogram } from './calc-histogram';
import { OutputContent } from './output-content';
import type { HistogramSession, TForm } from './types';

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayStep>>;
  formSummary: TForm;
  setOutput: React.Dispatch<React.SetStateAction<HistogramSession | undefined>>;
};

const Output = ({
  id,
  setDisplay,
  formSummary,
  setOutput,
}: Props): JSX.Element => {
  const outputId = useMemo(() => id ?? nanoid(), [id]);

  const { colData } = useGridData();
  const arrOfTables = useMemo(
    () => calcHistogram(formSummary, colData),
    [colData, formSummary],
  );

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: 'Histogram',
      type: 'histogram',
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
