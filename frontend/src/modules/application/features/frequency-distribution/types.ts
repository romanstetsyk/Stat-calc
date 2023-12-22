import type { ColumnHeading, DataTableRow } from '~/modules/application/types';

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
};

const TopLeftCell = 'Value';
type TopLeftCell = typeof TopLeftCell;

type OutputReturn = {
  varName: string;
  n: number;
  table: DataTableRow<FrequencyDistribution, TopLeftCell>[];
  stats: [TopLeftCell, ...FrequencyDistribution[]];
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
export { FrequencyDistribution, TopLeftCell };
