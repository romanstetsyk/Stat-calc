import { GridColumnName, H0Sign, H1Sign } from "../../Types";

export enum PerformType {
  hypothesisTest = "hypothesisTest",
  confidenceInterval = "confidenceInterval",
}

export type TForm = {
  columns: false | GridColumnName | GridColumnName[];
  pstdev?: string;
  perform: PerformType;
  mu0dir: H0Sign;
  mu1dir: H1Sign;
  mu0val: string;
  mu1val: string;
  alpha: string;
  level: string;
};

export type DisplayOptions = "form" | "result";
