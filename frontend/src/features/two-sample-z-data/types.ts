import type { DataTableRow } from '~/components/data-table';
import type { H1Sign, Perform } from '~/types';

const SampleStatistics = [
  'N',
  'Mean',
  'S.Stdev',
  'Known Stdev',
  'Std.Err',
] as const;

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
  withLabel: boolean;
  sample1?: `${number}`;
  sample2?: `${number}`;
  stdev1?: string;
  stdev2?: string;
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

type Z2DataSession = {
  id: string;
  timestamp: number;
  title: string;
  type: 'z2data';
  data: HTReturn | CIReturn;
  formSummary: TForm;
};

export type { CIReturn, HTReturn, OutputReturn, TForm, Z2DataSession };
export { CIColumns, HTColumns, SampleStatistics };
