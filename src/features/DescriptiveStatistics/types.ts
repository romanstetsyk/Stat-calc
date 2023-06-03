import { GridColumnName, SessionItem } from "../../Types";
import { DataTableRow } from "../../components/DataTable";

export const SampleStatistics = [
  "N",
  "Mean",
  "Median",
  "S.Var",
  "S.Stdev",
  "Range",
  "Std.Err",
  "P.Var",
  "P.Stdev",
] as const;

export type SampleStatistics = (typeof SampleStatistics)[number];

export type TForm = {
  columns: GridColumnName[];
  options: SampleStatistics[];
  withLabel: boolean;
};

export type DescriptiveStatisticsSession = {
  timestamp: number;
  title: string;
  type: SessionItem;
  data: DataTableRow<SampleStatistics, "">[];
  stats: ["", ...SampleStatistics[]];
};
