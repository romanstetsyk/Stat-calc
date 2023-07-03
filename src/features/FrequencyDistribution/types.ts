import { GridColumnName } from "../../Types";
import { DataTableRow } from "../../components/DataTable";

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
};

export const topLeftCell = "Value";

export type OutputReturn = {
  varName: string;
  n: number;
  table: DataTableRow<FreqDist, typeof topLeftCell>[];
  stats: [typeof topLeftCell, ...FreqDist[]];
};

export type FreqDistSession = {
  outputId: string;
  timestamp: number;
  title: string;
  type: "frequencyDistribution";
  data: OutputReturn[];
  formSummary: TForm;
};
