import { HypothesisType } from './hypothesis-type';

const H1Sign = {
  [HypothesisType.TwoTailed]: '\u2260',
  [HypothesisType.LeftTailed]: '\u003C',
  [HypothesisType.RightTailed]: '\u003E',
} as const;

export { H1Sign };
