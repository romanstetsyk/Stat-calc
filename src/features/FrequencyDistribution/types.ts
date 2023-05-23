import { GridColumnName } from "../../Types";

export const FreqDist = [
  "Frequency",
  "Relative Frequency",
  "Cumulative Frequency",
  "Cumulative Relative Frequency",
] as const;

export type FreqDist = (typeof FreqDist)[number];

export type DisplayOptions = "form" | "result";

export type TForm = {
  label: boolean;
  columns: false | GridColumnName | GridColumnName[];
  options: FreqDist[];
};
