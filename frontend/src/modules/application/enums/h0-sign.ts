import { HypothesisType } from './hypothesis-type';

const H0Sign = {
  [HypothesisType.TwoTailed]: '\u003D',
  [HypothesisType.LeftTailed]: '\u2265',
  [HypothesisType.RightTailed]: '\u2264',
} as const;

export { H0Sign };
