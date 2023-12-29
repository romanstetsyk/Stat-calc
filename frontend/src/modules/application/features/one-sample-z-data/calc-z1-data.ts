import { Perform } from '~/modules/application/enums';
import type { GridData } from '~/modules/data-grid/types';

import { calcCI } from './calc-ci';
import { calcHT } from './calc-ht';
import type { CIReturn, HTReturn, TForm } from './types';

const calcZ1Data = (
  formSummary: TForm,
  colData: GridData['colData'],
): HTReturn | CIReturn => {
  const { perform } = formSummary;
  switch (perform) {
    case Perform.HypothesisTest: {
      return calcHT(formSummary, colData);
    }
    case Perform.ConfidenceInerval: {
      return calcCI(formSummary, colData);
    }
    default: {
      throw new Error('Unknown z-test type');
    }
  }
};

export { calcZ1Data };
