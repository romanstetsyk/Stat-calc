import { GridColumnName } from "../../Types";

export enum PerformType {
  hypothesisTest = "hypothesisTest",
  confidenceInterval = "confidenceInterval",
}

export type TForm = {
  columns: false | GridColumnName | GridColumnName[];
  perform: PerformType;
  mu0dir: "eq" | "ge" | "le";
  mu1dir: "ne" | "lt" | "gt";
  mu0val: string;
  mu1val: string;
  alpha: string;
  level: string;
};

export type DisplayOptions = "form" | "result";
