import { GridColumnName } from "../../Types";

export type DisplayOptions = "form" | "result";

export enum Options {
  N = "n",
  Mean = "Mean",
  Median = "Median",
  SVariance = "Sample Variance",
  PVariance = "Population Variance",
  SStdev = "Sample Stdev",
  PStdev = "Population Stdev",
}

export type TForm = {
  columns: false | GridColumnName | GridColumnName[];
  options: Options[];
};
