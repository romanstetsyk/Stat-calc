export enum PerformType {
  hypothesisTest = "hypothesisTest",
  confidenceInterval = "confidenceInterval",
}

export type TFormSummary = {
  xbar: string;
  stdev: string;
  n: string;
  perform: PerformType;
  mu0dir: "eq" | "ge" | "le";
  mu1dir: "ne" | "lt" | "gt";
  mu0val: string;
  mu1val: string;
  alpha: string;
  level: string;
};

export type DisplayOptions = "form" | "result";
