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
  "Std.Err.",
  "M.E.",
  "L.Limit",
  "U.Limit",
] as const;
export type CIColumns = (typeof CIColumns)[number];

export const HTColumns = [
  "Alpha",
  "Z-crit",
  "Std.Err.",
  "Z-stat",
  "P-value",
] as const;
export type HTColumns = (typeof HTColumns)[number];

export type TForm = {
  withLabel: boolean;
  sample1?: `${number}`;
  sample2?: `${number}`;
  stdev1?: string;
  stdev2?: string;
  perform: Perform;
  alternative: H1Sign;
  nullValue: string;
  alpha: string;
  level: string;
  optional: {
    sampleStatistics: boolean;
    confidenceInterval: boolean;
  };
};

export type HTReturn = {
  perform: Perform.HypothesisTest;
  HTData: DataTableRow<HTColumns, "">[];
  HTStats: ["", ...HTColumns[]];
  CIData?: DataTableRow<CIColumns, "">[];
  CIStats?: ["", ...CIColumns[]];
  sampleData?: DataTableRow<SampleStatistics, "">[];
  sampleStats?: ["", ...SampleStatistics[]];
};

export type CIReturn = {
  perform: Perform.ConfidenceInerval;
  CIData: DataTableRow<CIColumns, "">[];
  CIStats: ["", ...CIColumns[]];
  sampleData?: DataTableRow<SampleStatistics, "">[];
  sampleStats?: ["", ...SampleStatistics[]];
};

export type OutputReturn = {
  formSummary: TForm;
  outputData: HTReturn | CIReturn;
};

export type Z2DataSession = {
  id: string;
  timestamp: number;
  title: string;
  type: "z2data";
  data: HTReturn | CIReturn;
  formSummary: TForm;
};
