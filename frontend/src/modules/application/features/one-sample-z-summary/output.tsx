import { Button } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type * as React from 'react';
import { useEffect, useMemo } from 'react';

import { Perform } from '~/modules/application/enums';
import type { DisplayStep } from '~/modules/application/types';

import { calcCI } from './calc-ci';
import { calcHT } from './calc-ht';
import { OutputContent } from './output-content';
import type { CIReturn, HTReturn, TForm, Z1SummarySession } from './types';

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayStep>>;
  formSummary: TForm;
  setOutput: React.Dispatch<React.SetStateAction<Z1SummarySession | undefined>>;
};

const Output = ({
  id,
  setDisplay,
  formSummary,
  setOutput,
}: Props): JSX.Element => {
  const outputId = useMemo(() => id ?? nanoid(), [id]);

  const { perform } = formSummary;

  const outputData: CIReturn | HTReturn = useMemo(() => {
    let result;
    switch (perform) {
      case Perform.HypothesisTest: {
        result = calcHT(formSummary);
        break;
      }
      case Perform.ConfidenceInerval: {
        result = calcCI(formSummary);
        break;
      }
      default: {
        throw new Error('Unknown z-test type');
      }
    }
    return result;
  }, [formSummary, perform]);

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: 'One Sample Z',
      type: 'z1summary',
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
