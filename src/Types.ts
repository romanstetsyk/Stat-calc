import { DescriptiveStatisticsSession } from "~/features/DescriptiveStatistics/types";
import { FreqDistSession } from "~/features/FrequencyDistribution/types";

export type GridColumnName = `col${number}`;

export type ColumnValues = {
  [key: GridColumnName]: string[];
};

export type GridRow = {
  [colName: GridColumnName]: string;
};

export const H0Sign = {
  equal: "\u003D",
  greaterThanEqual: "\u2265",
  lessThanEqual: "\u2264",
} as const;
export type H0Sign = keyof typeof H0Sign;

export const H1Sign = {
  notEqual: "\u2260",
  lessThan: "\u003C",
  greaterThan: "\u003E",
} as const;
export type H1Sign = keyof typeof H1Sign;

export const HypothesisSignMap: Record<H1Sign, H0Sign> = {
  notEqual: "equal",
  greaterThan: "lessThanEqual",
  lessThan: "greaterThanEqual",
} as const;

export const enum Perform {
  HypothesisTest = "hypothesisTest",
  ConfidenceInerval = "confidenceInterval",
}

export type DisplayOptions = "form" | "result";

export type TSession = DescriptiveStatisticsSession | FreqDistSession;

export const enum BinMethod {
  MANUAL = "MANUAL",
  SQUARE_ROOT = "SQUARE_ROOT",
  // OTHER = "OTHER",
}
