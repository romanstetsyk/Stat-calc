import type { DataTableRow } from '~/components/data-table';
import type { H1Sign, Perform } from '~/types';

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
  xbar1: string;
  xbar2: string;
  stdev1: string;
  stdev2: string;
  n1: string;
  n2: string;
  perform: Perform;
  alternative: H1Sign;
  nullValue: string;
  alpha: string;
  level: string;
  optional: {
    sampleStatistics: boolean;
    confidenceInterval: boolean;
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
