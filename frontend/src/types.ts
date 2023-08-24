import type { DescriptiveStatisticsSession } from '~/features/descriptive-statistics/types';
import type { FrequencyDistributionSession } from '~/features/frequency-distribution/types';
import type { GroupNumericalDataSession } from '~/features/group-numeric-data/types';
import type { HistogramSession } from '~/features/histogram/types';
import type { Z1DataSession } from '~/features/one-sample-z-data/types';
import type { Z1SummarySession } from '~/features/one-sample-z-summary/types';
import type { Z2DataSession } from '~/features/two-sample-z-data/types';
import type { Z2SummarySession } from '~/features/two-sample-z-summary/types';

type GridColumnName = `col${number}`;

const H0Sign = {
  equal: '\u003D',
  greaterThanEqual: '\u2265',
  lessThanEqual: '\u2264',
} as const;

type H0Sign = keyof typeof H0Sign;

const H1Sign = {
  notEqual: '\u2260',
  lessThan: '\u003C',
  greaterThan: '\u003E',
} as const;

type H1Sign = keyof typeof H1Sign;

const HypothesisSignMap: Record<H1Sign, H0Sign> = {
  notEqual: 'equal',
  greaterThan: 'lessThanEqual',
  lessThan: 'greaterThanEqual',
} as const;

const enum Perform {
  HypothesisTest = 'hypothesisTest',
  ConfidenceInerval = 'confidenceInterval',
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

export type { DisplayOptions, GridColumnName, TSession };
export { BinMethod, H0Sign, H1Sign, HypothesisSignMap, Perform };
