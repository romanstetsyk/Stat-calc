import { H1Sign, Perform } from "~/Types";

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
  xbar: string;
  stdev: string;
  n: string;
  perform: Perform;
  alternative: H1Sign;
  nullValue: string;
  alpha: string;
  level: string;
};
