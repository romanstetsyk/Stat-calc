import type { DataTableRow } from '~/components/data-table';
import type { BinMethod, ColumnHeading } from '~/types';

const FrequencyDistribution = [
  'Frequency',
  'Relative Frequency',
  'Cumulative Frequency',
  'Cumulative Relative Frequency',
] as const;

type FrequencyDistribution = (typeof FrequencyDistribution)[number];

type TForm = {
  columns: ColumnHeading[];
  options: FrequencyDistribution[];
  withLabel: boolean;
  method: BinMethod;
  manual: {
    start?: number;
    width: number;
  };
  squareRoot: {
    start?: number;
  };
};

const topLeftCell = 'Limits';

type OutputReturn = {
  varName: string;
  n: number;
  table: DataTableRow<FrequencyDistribution, typeof topLeftCell>[];
  stats: [typeof topLeftCell, ...FrequencyDistribution[]];
};

type GroupNumericalDataSession = {
  id: string;
  timestamp: number;
  title: string;
  type: 'groupNumericalData';
  data: OutputReturn[];
  formSummary: TForm;
};

export type { GroupNumericalDataSession, OutputReturn, TForm };
export { FrequencyDistribution, topLeftCell };
