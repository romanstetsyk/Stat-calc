import { Button } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type * as React from 'react';
import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { dataStore } from '~/data-store';
import type { DisplayOptions } from '~/types';
import { Perform } from '~/types';

import { calcCI } from './calc-ci';
import { calcHT } from './calc-ht';
import { OutputContent } from './output-content';
import type { CIReturn, HTReturn, TForm, Z1DataSession } from './types';

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  setOutput: React.Dispatch<React.SetStateAction<Z1DataSession | undefined>>;
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
  const { perform } = formSummary;

  const outputData: CIReturn | HTReturn = useMemo(() => {
    let result;
    switch (perform) {
      case Perform.HypothesisTest: {
        result = calcHT(formSummary, colData);
        break;
      }
      case Perform.ConfidenceInerval: {
        result = calcCI(formSummary, colData);
        break;
      }
      default: {
        throw new Error('Unknown z-test type');
      }
    }
    return result;
  }, [colData, formSummary, perform]);

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: 'One Sample Z',
      type: 'z1data',
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
      <OutputContent formSummary={formSummary} outputData={outputData} />
    </>
  );
};

export { Output };
