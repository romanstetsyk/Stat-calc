import { GridColumnName } from "../../Types";
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
  outputId: string;
  timestamp: number;
  title: string;
  type: "descriptive";
  data: DataTableRow<SampleStatistics, "">[];
  stats: ["", ...SampleStatistics[]];
};
