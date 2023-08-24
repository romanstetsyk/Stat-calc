import type { DataTableRow } from '~/components/data-table';

const SampleStatistics = [
  'N',
  'Mean',
  'Median',
  'S.Var',
  'S.Stdev',
  'Range',
  'Std.Err',
  'P.Var',
  'P.Stdev',
] as const;

type SampleStatistics = (typeof SampleStatistics)[number];

type TForm = {
  columns: `${number}`[];
  options: SampleStatistics[];
  withLabel: boolean;
};

type DescriptiveStatisticsSession = {
  id: string;
  timestamp: number;
  title: string;
  type: 'descriptive';
  data: DataTableRow<SampleStatistics, ''>[];
  stats: ['', ...SampleStatistics[]];
  formSummary: TForm;
};

export type { DescriptiveStatisticsSession, TForm };
export { SampleStatistics };
