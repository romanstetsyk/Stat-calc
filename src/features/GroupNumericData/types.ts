import { BinMethod, GridColumnName } from "~/Types";

export const FreqDist = [
  "Frequency",
  "Relative Frequency",
  "Cumulative Frequency",
  "Cumulative Relative Frequency",
] as const;

export type FreqDist = (typeof FreqDist)[number];

export type TForm = {
  columns: GridColumnName[];
  options: FreqDist[];
  withLabel: boolean;
  method: BinMethod;
  manual: {
    start?: string;
    width: string;
  };
};
