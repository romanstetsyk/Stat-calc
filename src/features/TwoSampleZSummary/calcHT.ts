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
  const xbar1 = Number(formSummary.xbar1);
  const xbar2 = Number(formSummary.xbar2);
  const stdev1 = Number(formSummary.stdev1);
  const stdev2 = Number(formSummary.stdev2);
  const n1 = Number(formSummary.n1);
  const n2 = Number(formSummary.n2);
  const nullValue = Number(formSummary.nullValue);
  const alternative = formSummary.alternative;
  const alpha = Number(formSummary.alpha);

  const xdiff = xbar1 - xbar2;
  const stderr1 = stdev1 / Math.sqrt(n1);
  const stderr2 = stdev2 / Math.sqrt(n2);
  const stderrPooled = Math.sqrt(stdev1 ** 2 / n1 + stdev2 ** 2 / n2);
  const zstat = (xdiff - nullValue) / stderrPooled;

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

  const sampleData: DataTableRow<SampleStatistics, "">[] = [
    {
      "": "Sample 1",
      N: n1,
      Mean: xbar1,
      "Known Stdev": stdev1,
      "Std.Err": parseNumber(stderr1, DECIMAL),
    },
    {
      "": "Sample 2",
      N: n2,
      Mean: xbar2,
      "Known Stdev": stdev2,
      "Std.Err": parseNumber(stderr2, DECIMAL),
    },
  ];

  const sampleStats: ["", ...SampleStatistics[]] = [
    "",
    "N",
    "Mean",
    "Known Stdev",
    "Std.Err",
  ];

  const HTData: DataTableRow<HTColumns, "">[] = [
    {
      "": "\u03BC\u2081 - \u03BC\u2082",
      Alpha: parseNumber(alpha),
      "Z-crit": zcrit.toFixed(DECIMAL),
      "Std.Err.": stderrPooled.toFixed(DECIMAL),
      "Z-stat": zstat.toFixed(DECIMAL),
      "P-value": pvalue.toFixed(DECIMAL),
    },
  ];

  const HTStats: ["", ...HTColumns[]] = [
    "",
    "Alpha",
    "Z-crit",
    "Std.Err.",
    "Z-stat",
    "P-value",
  ];

  const outputData: HTReturn = {
    perform: Perform.HypothesisTest,
    HTData,
    HTStats,
    sampleData,
    sampleStats,
  };

  if (alternative === "notEqual" || alpha < 0.5) {
    const me = zcrit * stderrPooled;
    const ll = xdiff - me;
    const ul = xdiff + me;

    const CIData: DataTableRow<CIColumns, "">[] = [
      {
        "": "\u03BC\u2081 - \u03BC\u2082",
        Level: parseNumber(ciLevel),
        "Z-crit": parseNumber(zcrit, DECIMAL),
        "M.E.": parseNumber(me, DECIMAL),
        "L.Limit": parseNumber(ll, DECIMAL),
        "U.Limit": parseNumber(ul, DECIMAL),
      },
    ];

    const CIStats: ["", ...CIColumns[]] = [
      "",
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
