import { DataTableRow } from "~/components/DataTable";

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
};

export const topLeftCell = "Value";

export type OutputReturn = {
  varName: string;
  n: number;
  table: DataTableRow<FrequencyDistribution, typeof topLeftCell>[];
  stats: [typeof topLeftCell, ...FrequencyDistribution[]];
};

export type FrequencyDistributionSession = {
  id: string;
  timestamp: number;
  title: string;
  type: "frequencyDistribution";
  data: OutputReturn[];
  formSummary: TForm;
};
