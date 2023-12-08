import type { DataTableRow } from '~/components/data-table';
import type { HypothesisType, Perform } from '~/types';

const SampleStatistics = ['N', 'Mean', 'Known Stdev', 'Std.Err'] as const;

type SampleStatistics = (typeof SampleStatistics)[number];

const CIColumns = ['Level', 'Z-crit', 'M.E.', 'L.Limit', 'U.Limit'] as const;

type CIColumns = (typeof CIColumns)[number];

const HTColumns = ['Alpha', 'Z-crit', 'Z-stat', 'P-value'] as const;

type HTColumns = (typeof HTColumns)[number];

type TForm = {
  sampleSummary: {
    xbar: number;
    stdev: number;
    n: number;
  };
  perform: Perform;
  hypothesisTest: {
    alternative: HypothesisType;
    nullValue: number;
    alpha: number;
    optional: { includeConfidenceInterval: boolean };
  };
  confidenceInterval: {
    confidenceLevel: number;
  };
};

type HTReturn = {
  perform: Perform.HypothesisTest;
  HTData: DataTableRow<HTColumns | SampleStatistics>[];
  HTStats: (HTColumns | SampleStatistics)[];
  CIData?: DataTableRow<CIColumns>[];
  CIStats?: CIColumns[];
};

type CIReturn = {
  perform: Perform.ConfidenceInerval;
  CIData: DataTableRow<CIColumns | SampleStatistics>[];
  CIStats: (CIColumns | SampleStatistics)[];
};

type OutputReturn = {
  formSummary: TForm;
  outputData: HTReturn | CIReturn;
};

type Z1SummarySession = {
  id: string;
  timestamp: number;
  title: string;
  type: 'z1summary';
  data: HTReturn | CIReturn;
  formSummary: TForm;
};

export type { CIReturn, HTReturn, OutputReturn, TForm, Z1SummarySession };
export { CIColumns, HTColumns, SampleStatistics };
