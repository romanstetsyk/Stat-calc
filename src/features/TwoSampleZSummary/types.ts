import { H0Sign, H1Sign } from "../../Types";

export enum PerformType {
  hypothesisTest = "hypothesisTest",
  confidenceInterval = "confidenceInterval",
}

export type TForm = {
  xbar1: string;
  xbar2: string;
  stdev1: string;
  stdev2: string;
  n1: string;
  n2: string;
  perform: PerformType;
  mu0dir: H0Sign;
  mu1dir: H1Sign;
  mu0val: string;
  mu1val: string;
  alpha: string;
  level: string;
};

export type DisplayOptions = "form" | "result";
