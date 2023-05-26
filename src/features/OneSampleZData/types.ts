import { GridColumnName, H0Sign, H1Sign, Perform } from "../../Types";

export const SampleStatistics = [
  "N",
  "Mean",
  "Known Stdev",
  "Std.Err",
] as const;
export type SampleStatistics = (typeof SampleStatistics)[number];

export const CIColumns = [
  "Level",
  "Z-crit",
  "M.E.",
  "L.Limit",
  "U.Limit",
] as const;
export type CIColumns = (typeof CIColumns)[number];

export const HTColumns = ["Alpha", "Z-crit", "Z-stat", "P-value"] as const;
export type HTColumns = (typeof HTColumns)[number];

export type TForm = {
  columns: GridColumnName[];
  withLabel: boolean;
  pstdev?: string;
  perform: Perform;
  mu0dir: H0Sign;
  mu1dir: H1Sign;
  mu0val: string;
  mu1val: string;
  alpha: string;
  level: string;
};
