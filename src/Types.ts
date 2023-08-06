import { DescriptiveStatisticsSession } from "~/features/DescriptiveStatistics/types";
import { FrequencyDistributionSession } from "~/features/FrequencyDistribution/types";
import { GroupNumericalDataSession } from "./features/GroupNumericData/types";
import { HistogramSession } from "./features/Histogram/types";
import { Z1DataSession } from "./features/OneSampleZData/types";
import { Z1SummarySession } from "./features/OneSampleZSummary/types";
import { Z2DataSession } from "./features/TwoSampleZData/types";
import { Z2SummarySession } from "./features/TwoSampleZSummary/types";

export type GridColumnName = `col${number}`;

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
  | FrequencyDistributionSession
  | HistogramSession
  | GroupNumericalDataSession
  | Z1SummarySession
  | Z1DataSession
  | Z2SummarySession
  | Z2DataSession;

export const enum BinMethod {
  MANUAL = "MANUAL",
  SQUARE_ROOT = "SQUARE_ROOT",
  // OTHER = "OTHER",
}
