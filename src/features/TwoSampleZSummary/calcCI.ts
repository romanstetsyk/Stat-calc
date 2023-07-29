import quantile from "@stdlib/stats-base-dists-normal-quantile";
import { DataTableRow } from "~/components/DataTable";
import { Perform } from "~/Types";
import { parseNumber } from "~/utils/parseNumber";
import { CIColumns, CIReturn, SampleStatistics, TForm } from "./types";

const DECIMAL = 6;

export const calcCI = (formSummary: TForm): CIReturn => {
  const xbar1 = Number(formSummary.xbar1);
  const xbar2 = Number(formSummary.xbar2);
  const stdev1 = Number(formSummary.stdev1);
  const stdev2 = Number(formSummary.stdev2);
  const n1 = Number(formSummary.n1);
  const n2 = Number(formSummary.n2);
  const level = Number(formSummary.level);

  const xdiff = xbar1 - xbar2;
  const stderr1 = stdev1 / Math.sqrt(n1);
  const stderr2 = stdev2 / Math.sqrt(n2);
  const stderrPooled = Math.sqrt(stdev1 ** 2 / n1 + stdev2 ** 2 / n2);
  const zcrit = -1 * quantile((1 - Number(level)) / 2, 0, 1);
  const me = zcrit * stderrPooled;
  const ll = xdiff - me;
  const ul = xdiff + me;

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

  const CIData: DataTableRow<CIColumns, "">[] = [
    {
      "": "mu1 - mu2",
      Level: parseNumber(level),
      "Z-crit": parseNumber(zcrit, DECIMAL),
      "M.E.": parseNumber(me, DECIMAL),
      "L.Limit": parseNumber(ll, DECIMAL),
      "U.Limit": parseNumber(ul, DECIMAL),
      "Std.Err.": parseNumber(stderrPooled, DECIMAL),
    },
  ];

  const CIStats: ["", ...CIColumns[]] = [
    "",
    "Level",
    "Z-crit",
    "Std.Err.",
    "M.E.",
    "L.Limit",
    "U.Limit",
  ];

  return {
    perform: Perform.ConfidenceInerval,
    CIData,
    CIStats,
    sampleData,
    sampleStats,
  };
};
