// import { GridColumnName } from "../../Types";

import { BinMethod, GridColumnName } from "~/Types";

export const FrequencyDistribution = [
  "Frequency",
  "Relative Frequency",
  "Cumulative Frequency",
  "Cumulative Relative Frequency",
] as const;

export type FrequencyDistribution = (typeof FrequencyDistribution)[number];

export type TForm = {
  columns: GridColumnName[];
  options: FrequencyDistribution;
  withLabel: boolean;
  method: BinMethod;
  manual: {
    start?: string;
    width: string;
  };
  squareRoot: {
    start?: string;
  };
};
