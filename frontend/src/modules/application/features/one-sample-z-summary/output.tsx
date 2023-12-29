import { Button } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type * as React from 'react';
import { useEffect, useMemo } from 'react';

import type { DisplayStep } from '~/modules/application/types';

import { calcZ1Summary } from './calc-z1-summary';
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

  const outputData: CIReturn | HTReturn = useMemo(
    () => calcZ1Summary(formSummary),
    [formSummary],
  );

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
