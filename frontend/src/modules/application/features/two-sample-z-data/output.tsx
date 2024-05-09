import { Button } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type * as React from 'react';
import { useEffect, useMemo } from 'react';

import type { DisplayStep } from '~/modules/application/types';
import { useGridData } from '~/modules/data-grid/hooks';

import { calcZ2Data } from './calc-z2-data';
import { OutputContent } from './output-content';
import type { CIReturn, HTReturn, TForm, Z2DataSession } from './types';

type Props = {
  id?: string;
  setDisplay: React.Dispatch<React.SetStateAction<DisplayStep>>;
  formSummary: TForm;
  setOutput: React.Dispatch<React.SetStateAction<Z2DataSession | undefined>>;
};

const Output = ({
  id,
  setDisplay,
  formSummary,
  setOutput,
}: Props): JSX.Element => {
  const outputId = useMemo(() => id ?? nanoid(), [id]);

  const { colData } = useGridData();

  const outputData: CIReturn | HTReturn = useMemo(
    () => calcZ2Data(formSummary, colData),
    [colData, formSummary],
  );

  useEffect(() => {
    setOutput({
      id: outputId,
      timestamp: Date.now(),
      title: 'Two Sample Z',
      type: 'z2data',
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
