type GridColumnName = `col${number}`;

type ColumnHeading = `${number}`;

const enum HypothesisType {
  LeftTailed = 'left-tailed',
  RightTailed = 'right-tailed',
  TwoTailed = 'two-tailed',
}

const H0Sign = {
  [HypothesisType.TwoTailed]: '\u003D',
  [HypothesisType.LeftTailed]: '\u2265',
  [HypothesisType.RightTailed]: '\u2264',
} as const;

const H1Sign = {
  [HypothesisType.TwoTailed]: '\u2260',
  [HypothesisType.LeftTailed]: '\u003C',
  [HypothesisType.RightTailed]: '\u003E',
} as const;

const enum Perform {
  HypothesisTest = 'Hypothesis Test',
  ConfidenceInerval = 'Confidence Interval',
}

type DisplayOptions = 'form' | 'result';

const enum BinMethod {
  MANUAL = 'MANUAL',
  SQUARE_ROOT = 'SQUARE_ROOT',
  // OTHER = "OTHER",
}

export type { ColumnHeading, DisplayOptions, GridColumnName };
export { BinMethod, H0Sign, H1Sign, HypothesisType, Perform };
