import { Button, Flex } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type * as React from 'react';
import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { dataStore } from '~/data-store';
import type { DisplayOptions } from '~/types';

import { calcFrequency } from './calc-frequency';
import { OutputContent } from './output-content';
import type { FrequencyDistributionSession, TForm } from './types';

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
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

  const { colData } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot,
  );
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

      <Flex gap={4} flexDirection='column'>
        <OutputContent outputData={arrOfTables} />
      </Flex>
    </>
  );
};

export { Output };