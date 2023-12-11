import { Button, Flex } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type * as React from 'react';
import { useEffect, useMemo } from 'react';

import { useGridData } from '~/store/grid-data';
import type { DisplayOptions } from '~/types';

import { calcHistogram } from './calc-histogram';
import { OutputContent } from './output-content';
import type { HistogramSession, TForm } from './types';

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
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
    () => calcHistogram(colData, formSummary),
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
      <Flex gap={4} flexDirection='column'>
        <OutputContent outputData={arrOfTables} />
      </Flex>
    </>
  );
};

export { Output };
