import cdf from "@stdlib/stats-base-dists-normal-cdf";
import quantile from "@stdlib/stats-base-dists-normal-quantile";
import { DataTableRow } from "~/components/DataTable";
import { Perform } from "~/Types";
import { parseNumber } from "~/utils/parseNumber";
import {
  CIColumns,
  HTColumns,
  HTReturn,
  SampleStatistics,
  TForm,
} from "./types";

const DECIMAL = 6;

export const calcHT = (formSummary: TForm): HTReturn => {
  const xbar = Number(formSummary.xbar);
  const stdev = Number(formSummary.stdev);
  const n = Number(formSummary.n);
  const alternative = formSummary.alternative;
  const nullValue = Number(formSummary.nullValue);
  const alpha = Number(formSummary.alpha);

  const includeCI = formSummary.optional.confidenceInterval;

  const stderr = stdev / Math.sqrt(n);
  const zstat = (xbar - nullValue) / stderr;

  let ciLevel: number;
  let zcrit: number;
  let pvalue: number;
  switch (alternative) {
    case "notEqual":
      ciLevel = 1 - alpha;
      zcrit = -quantile(alpha / 2, 0, 1);
      pvalue = 2 * cdf(-Math.abs(zstat), 0, 1);
      break;
    case "greaterThan":
      ciLevel = 1 - 2 * alpha;
      zcrit = -quantile(alpha, 0, 1);
      pvalue = 1 - cdf(zstat, 0, 1);
      break;
    case "lessThan":
      ciLevel = 1 - 2 * alpha;
      zcrit = -quantile(alpha, 0, 1);
      pvalue = cdf(zstat, 0, 1);
      break;
    default:
      throw new Error("Invalid hypothesis direction");
  }

  const HTData: DataTableRow<HTColumns | SampleStatistics>[] = [
    {
      Alpha: parseNumber(alpha),
      "Z-crit": parseNumber(zcrit, DECIMAL),
      N: n,
      Mean: xbar,
      "Known Stdev": stdev,
      "Std.Err": parseNumber(stderr, DECIMAL),
      "Z-stat": parseNumber(zstat, DECIMAL),
      "P-value": parseNumber(pvalue, DECIMAL),
    },
  ];

  const HTStats: (HTColumns | SampleStatistics)[] = [
    "Alpha",
    "Z-crit",
    "N",
    "Mean",
    "Known Stdev",
    "Std.Err",
    "Z-stat",
    "P-value",
  ];

  const outputData: HTReturn = {
    perform: Perform.HypothesisTest,
    HTData,
    HTStats,
  };

  // render CI only if condition is true
  if (includeCI && (alternative === "notEqual" || alpha < 0.5)) {
    const me = zcrit * stderr;
    const ll = xbar - me;
    const ul = xbar + me;

    const CIData: DataTableRow<CIColumns>[] = [
      {
        Level: parseNumber(ciLevel),
        "Z-crit": parseNumber(zcrit, DECIMAL),
        "M.E.": parseNumber(me, DECIMAL),
        "L.Limit": parseNumber(ll, DECIMAL),
        "U.Limit": parseNumber(ul, DECIMAL),
      },
    ];

    const CIStats: CIColumns[] = [
      "Level",
      "Z-crit",
      "M.E.",
      "L.Limit",
      "U.Limit",
    ];

    outputData["CIData"] = CIData;
    outputData["CIStats"] = CIStats;
  }

  return outputData;
};
