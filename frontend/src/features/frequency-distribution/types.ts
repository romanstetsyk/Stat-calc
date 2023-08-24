import type { DataTableRow } from '~/components/data-table';

const FrequencyDistribution = [
  'Frequency',
  'Relative Frequency',
  'Cumulative Frequency',
  'Cumulative Relative Frequency',
] as const;

type FrequencyDistribution = (typeof FrequencyDistribution)[number];

type TForm = {
  columns: `${number}`[];
  options: FrequencyDistribution[];
  withLabel: boolean;
};

const topLeftCell = 'Value';

type OutputReturn = {
  varName: string;
  n: number;
  table: DataTableRow<FrequencyDistribution, typeof topLeftCell>[];
  stats: [typeof topLeftCell, ...FrequencyDistribution[]];
};

type FrequencyDistributionSession = {
  id: string;
  timestamp: number;
  title: string;
  type: 'frequencyDistribution';
  data: OutputReturn[];
  formSummary: TForm;
};

export type { FrequencyDistributionSession, OutputReturn, TForm };
export { FrequencyDistribution, topLeftCell };
