import { GridColumnName, H0Sign, H1Sign } from "../../Types";

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

export enum PerformType {
  hypothesisTest = "hypothesisTest",
  confidenceInterval = "confidenceInterval",
}

export type TForm = {
  columns: false | GridColumnName | GridColumnName[];
  pstdev?: string;
  perform: PerformType;
  mu0dir: H0Sign;
  mu1dir: H1Sign;
  mu0val: string;
  mu1val: string;
  alpha: string;
  level: string;
};

export type DisplayOptions = "form" | "result";
