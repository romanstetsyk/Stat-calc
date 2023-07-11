// import { GridColumnName } from "../../Types";

import { BinMethod, GridColumnName } from "~/Types";
import { Tabulate } from "~/utils/computeBins";

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

export type OutputReturn = {
  varName: string;
  out: Tabulate;
  options: FrequencyDistribution;
};

export type HistogramSession = {
  id: string;
  timestamp: number;
  title: string;
  type: "histogram";
  data: OutputReturn[];
  formSummary: TForm;
};
