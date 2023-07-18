import { DescriptiveStatisticsSession } from "~/features/DescriptiveStatistics/types";
import { FreqDistSession } from "~/features/FrequencyDistribution/types";
import { HistogramSession } from "./features/Histogram/types";

export type GridColumnName = `col${number}`;

export type ArrayLikeMutable<T> = {
  add: (idx: number, newValue: T) => void;
  delete: (idx: number) => void;
  length: number;
  [n: number]: T;
} & object; // exclude strings

/**
 * @example { 0:'a', 8:'b', length: 2 }
 */
export type GridTrack = ArrayLikeMutable<string>;
export type GridTracks = ArrayLikeMutable<GridTrack>;

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

export type TSession =
  | DescriptiveStatisticsSession
  | FreqDistSession
  | HistogramSession;

export const enum BinMethod {
  MANUAL = "MANUAL",
  SQUARE_ROOT = "SQUARE_ROOT",
  // OTHER = "OTHER",
}
