import { GridColumnName } from "../../Types";

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
