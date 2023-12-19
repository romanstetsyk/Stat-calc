import type { ColumnHeading, DataTableRow } from '~/modules/application/types';

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
  columns: ColumnHeading[];
  options: SampleStatistics[];
  withLabel: boolean;
};

type OutputReturn = {
  data: DataTableRow<SampleStatistics, ''>[];
  stats: ['', ...SampleStatistics[]];
};

type DescriptiveStatisticsSession = {
  id: string;
  timestamp: number;
  title: string;
  type: 'descriptive';
  data: OutputReturn;
  formSummary: TForm;
};

export type { DescriptiveStatisticsSession, OutputReturn, TForm };
export { SampleStatistics };
