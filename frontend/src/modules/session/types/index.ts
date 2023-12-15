import type { DescriptiveStatisticsSession } from '~/features/descriptive-statistics/types';
import type { FrequencyDistributionSession } from '~/features/frequency-distribution/types';
import type { GroupNumericalDataSession } from '~/features/group-numeric-data/types';
import type { HistogramSession } from '~/features/histogram/types';
import type { Z1DataSession } from '~/features/one-sample-z-data/types';
import type { Z1SummarySession } from '~/features/one-sample-z-summary/types';
import type { Z2DataSession } from '~/features/two-sample-z-data/types';
import type { Z2SummarySession } from '~/features/two-sample-z-summary/types';

type TSession =
  | DescriptiveStatisticsSession
  | FrequencyDistributionSession
  | HistogramSession
  | GroupNumericalDataSession
  | Z1SummarySession
  | Z1DataSession
  | Z2SummarySession
  | Z2DataSession;

type SessionData = {
  session: TSession[];
  addSessionItem: (item: TSession) => void;
  removeSessionItem: (id: string) => void;
  updateSessionItem: (newItem: TSession) => void;
};

export type { SessionData, TSession };
