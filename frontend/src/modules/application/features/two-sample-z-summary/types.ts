import type { HypothesisType, Perform } from '~/modules/application/enums';
import type { DataTableRow } from '~/modules/application/types';

const SampleStatistics = ['N', 'Mean', 'Known Stdev', 'Std.Err'] as const;

type SampleStatistics = (typeof SampleStatistics)[number];

const CIColumns = [
  'Level',
  'Z-crit',
  'Std.Err.',
  'M.E.',
  'L.Limit',
  'U.Limit',
] as const;

type CIColumns = (typeof CIColumns)[number];

const HTColumns = ['Alpha', 'Z-crit', 'Std.Err.', 'Z-stat', 'P-value'] as const;

type HTColumns = (typeof HTColumns)[number];

type TForm = {
  sample1Summary: {
    xbar1: number;
    stdev1: number;
    n1: number;
  };
  sample2Summary: {
    xbar2: number;
    stdev2: number;
    n2: number;
  };
  perform: Perform;
  hypothesisTest: {
    alternative: HypothesisType;
    nullValue: number;
    alpha: number;
    optional: {
      includeConfidenceInterval: boolean;
    };
  };
  confidenceInterval: {
    confidenceLevel: number;
  };
  optional: {
    includeSampleStatistics: boolean;
  };
};

type HTReturn = {
  perform: Perform.HypothesisTest;
  HTData: DataTableRow<HTColumns, ''>[];
  HTStats: ['', ...HTColumns[]];
  CIData?: DataTableRow<CIColumns, ''>[];
  CIStats?: ['', ...CIColumns[]];
  sampleData?: DataTableRow<SampleStatistics, ''>[];
  sampleStats?: ['', ...SampleStatistics[]];
};

type CIReturn = {
  perform: Perform.ConfidenceInerval;
  CIData: DataTableRow<CIColumns, ''>[];
  CIStats: ['', ...CIColumns[]];
  sampleData?: DataTableRow<SampleStatistics, ''>[];
  sampleStats?: ['', ...SampleStatistics[]];
};

type OutputReturn = {
  formSummary: TForm;
  outputData: HTReturn | CIReturn;
};

type Z2SummarySession = {
  id: string;
  timestamp: number;
  title: string;
  type: 'z2summary';
  data: HTReturn | CIReturn;
  formSummary: TForm;
};

export type { CIReturn, HTReturn, OutputReturn, TForm, Z2SummarySession };
export { CIColumns, HTColumns, SampleStatistics };
