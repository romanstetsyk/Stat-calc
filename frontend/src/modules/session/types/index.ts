import type { DescriptiveStatisticsSession } from '~/modules/application/features/descriptive-statistics/types';
import type { FrequencyDistributionSession } from '~/modules/application/features/frequency-distribution/types';
import type { GroupNumericalDataSession } from '~/modules/application/features/group-numeric-data/types';
import type { HistogramSession } from '~/modules/application/features/histogram/types';
import type { Z1DataSession } from '~/modules/application/features/one-sample-z-data/types';
import type { Z1SummarySession } from '~/modules/application/features/one-sample-z-summary/types';
import type { Z2DataSession } from '~/modules/application/features/two-sample-z-data/types';
import type { Z2SummarySession } from '~/modules/application/features/two-sample-z-summary/types';

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
