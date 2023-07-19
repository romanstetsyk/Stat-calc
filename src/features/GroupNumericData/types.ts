import { DataTableRow } from "~/components/DataTable";
import { BinMethod } from "~/Types";

export const FrequencyDistribution = [
  "Frequency",
  "Relative Frequency",
  "Cumulative Frequency",
  "Cumulative Relative Frequency",
] as const;

export type FrequencyDistribution = (typeof FrequencyDistribution)[number];

export type TForm = {
  columns: `${number}`[];
  options: FrequencyDistribution[];
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

export const topLeftCell = "Limits";

export type OutputReturn = {
  varName: string;
  n: number;
  table: DataTableRow<FrequencyDistribution, typeof topLeftCell>[];
  stats: [typeof topLeftCell, ...FrequencyDistribution[]];
};

export type GroupNumericalDataSession = {
  id: string;
  timestamp: number;
  title: string;
  type: "groupNumericalData";
  data: OutputReturn[];
  formSummary: TForm;
};
