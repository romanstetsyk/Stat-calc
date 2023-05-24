import { GridColumnName } from "../../Types";

export const SampleStatistics = [
  "N",
  "Mean",
  "Median",
  "S.Var",
  "P.Var",
  "S.Stdev",
  "P.Stdev",
  "Std.Err",
] as const;

export type SampleStatistics = (typeof SampleStatistics)[number];

export type DisplayOptions = "form" | "result";

export type TForm = {
  columns: GridColumnName[];
  options: SampleStatistics[];
  withLabel: boolean;
};
