import { DataTableRow } from "~/components/DataTable";
import { H1Sign, Perform } from "~/Types";

export const SampleStatistics = [
  "N",
  "Mean",
  "S.Stdev",
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
  columns: `${number}`[];
  withLabel: boolean;
  knownStdev?: string;
  perform: Perform;
  alternative: H1Sign;
  nullValue: string;
  alpha: string;
  level: string;
};

export type HTReturn = {
  perform: Perform.HypothesisTest;
  HTData: DataTableRow<HTColumns | SampleStatistics, "">[];
  HTStats: ["", ...(HTColumns | SampleStatistics)[]];
  CIData?: DataTableRow<CIColumns, "">[];
  CIStats?: ["", ...CIColumns[]];
};

export type CIReturn = {
  perform: Perform.ConfidenceInerval;
  CIData: DataTableRow<CIColumns | SampleStatistics, "">[];
  CIStats: ["", ...(CIColumns | SampleStatistics)[]];
};

export type OutputReturn = {
  formSummary: TForm;
  outputData: HTReturn | CIReturn;
};

export type Z1DataSession = {
  id: string;
  timestamp: number;
  title: string;
  type: "z1data";
  data: HTReturn | CIReturn;
  formSummary: TForm;
};
