import type { DescriptiveStatisticsSession } from '~/features/descriptive-statistics/types';
import type { FrequencyDistributionSession } from '~/features/frequency-distribution/types';
import type { GroupNumericalDataSession } from '~/features/group-numeric-data/types';
import type { HistogramSession } from '~/features/histogram/types';
import type { Z1DataSession } from '~/features/one-sample-z-data/types';
import type { Z1SummarySession } from '~/features/one-sample-z-summary/types';
import type { Z2DataSession } from '~/features/two-sample-z-data/types';
import type { Z2SummarySession } from '~/features/two-sample-z-summary/types';

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

type TSession =
  | DescriptiveStatisticsSession
  | FrequencyDistributionSession
  | HistogramSession
  | GroupNumericalDataSession
  | Z1SummarySession
  | Z1DataSession
  | Z2SummarySession
  | Z2DataSession;

const enum BinMethod {
  MANUAL = 'MANUAL',
  SQUARE_ROOT = 'SQUARE_ROOT',
  // OTHER = "OTHER",
}

export type { ColumnHeading, DisplayOptions, GridColumnName, TSession };
export { BinMethod, H0Sign, H1Sign, HypothesisType, Perform };
