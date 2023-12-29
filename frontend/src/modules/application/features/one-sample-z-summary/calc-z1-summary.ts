import { Perform } from '~/modules/application/enums';

import { calcCI } from './calc-ci';
import { calcHT } from './calc-ht';
import type { CIReturn, HTReturn, TForm } from './types';

const calcZ1Summary = (formSummary: TForm): HTReturn | CIReturn => {
  const { perform } = formSummary;
  switch (perform) {
    case Perform.HypothesisTest: {
      return calcHT(formSummary);
    }
    case Perform.ConfidenceInerval: {
      return calcCI(formSummary);
    }
    default: {
      throw new Error('Unknown z-test type');
    }
  }
};

export { calcZ1Summary };
