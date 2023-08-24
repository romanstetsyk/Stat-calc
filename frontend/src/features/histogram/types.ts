import type { BinMethod } from '~/types';
import type { Tabulate } from '~/utils/tabulate';

const FrequencyDistribution = [
  'Frequency',
  'Relative Frequency',
  'Cumulative Frequency',
  'Cumulative Relative Frequency',
] as const;

type FrequencyDistribution = (typeof FrequencyDistribution)[number];

type TForm = {
  columns: `${number}`[];
  options: FrequencyDistribution;
  withLabel: boolean;
  method: BinMethod;
  manual: {
    start?: string;
    width: string;
  };
  squareRoot: {
    start?: string;
  };
};

type OutputReturn = {
  varName: string;
  out: Tabulate;
  options: FrequencyDistribution;
};

type HistogramSession = {
  id: string;
  timestamp: number;
  title: string;
  type: 'histogram';
  data: OutputReturn[];
  formSummary: TForm;
};

export type { HistogramSession, OutputReturn, TForm };
export { FrequencyDistribution };
