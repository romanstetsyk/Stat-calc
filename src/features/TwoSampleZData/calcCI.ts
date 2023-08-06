import quantile from "@stdlib/stats-base-dists-normal-quantile";
import mean from "@stdlib/stats-base-mean";
import stdev from "@stdlib/stats-base-stdev";
import { DataTableRow } from "~/components/DataTable";
import { Perform } from "~/Types";
import { ArrayLike } from "~/utils/ArrayLike";
import { isFiniteNumberString } from "~/utils/assertions";
import { getVarName, getVarValues } from "~/utils/getColumnNameAndValues";
import { parseNumber } from "~/utils/parseNumber";
import { CIColumns, CIReturn, SampleStatistics, TForm } from "./types";

const DECIMAL = 6;

export const calcCI = (
  formSummary: TForm,
  colData: InstanceType<typeof ArrayLike<ArrayLike<string>>>
): CIReturn => {
  const sample1 = Number(formSummary.sample1);
  const sample2 = Number(formSummary.sample2);
  const withLabel = formSummary.withLabel;
  const knownStdev1 = Number(formSummary.stdev1);
  const knownStdev2 = Number(formSummary.stdev2);
  const level = Number(formSummary.level);

  const includeSampleData = formSummary.optional.sampleStatistics;

  const var1Name = getVarName(colData, sample1, withLabel);
  const var1Values = getVarValues(colData, sample1, withLabel);
  const arrOfNums1 = var1Values.filter(isFiniteNumberString).map(Number);
  const n1 = arrOfNums1.length;
  const xbar1 = mean(n1, arrOfNums1, 1);
  const stdevApprox1 = knownStdev1 ? knownStdev1 : stdev(n1, 1, arrOfNums1, 1);

  const var2Name = getVarName(colData, sample2, withLabel);
  const var2Values = getVarValues(colData, sample2, withLabel);
  const arrOfNums2 = var2Values.filter(isFiniteNumberString).map(Number);
  const n2 = arrOfNums2.length;
  const xbar2 = mean(n2, arrOfNums2, 1);
  const stdevApprox2 = knownStdev2 ? knownStdev2 : stdev(n2, 1, arrOfNums2, 1);

  const xdiff = xbar1 - xbar2;
  const stderr1 = stdevApprox1 / Math.sqrt(n1);
  const stderr2 = stdevApprox2 / Math.sqrt(n2);
  const stderrPooled = Math.sqrt(
    stdevApprox1 ** 2 / n1 + stdevApprox2 ** 2 / n2
  );
  const zcrit = -1 * quantile((1 - level) / 2, 0, 1);
  const me = zcrit * stderrPooled;
  const ll = xdiff - me;
  const ul = xdiff + me;

  const CIData: DataTableRow<CIColumns, "">[] = [
    {
      "": "\u03BC\u2081 - \u03BC\u2082",
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

  const outputData: CIReturn = {
    perform: Perform.ConfidenceInerval,
    CIData,
    CIStats,
  };

  if (includeSampleData) {
    const sampleData: DataTableRow<SampleStatistics, "">[] = [
      {
        "": var1Name,
        N: n1,
        Mean: parseNumber(xbar1, DECIMAL),
        [knownStdev1 ? "Known Stdev" : "S.Stdev"]: parseNumber(
          stdevApprox1,
          DECIMAL
        ),
        "Std.Err": parseNumber(stderr1, DECIMAL),
      },
      {
        "": var2Name,
        N: n2,
        Mean: parseNumber(xbar2, DECIMAL),
        [knownStdev2 ? "Known Stdev" : "S.Stdev"]: parseNumber(
          stdevApprox2,
          DECIMAL
        ),
        "Std.Err": parseNumber(stderr2, DECIMAL),
      },
    ];

    const sampleStats: ["", ...SampleStatistics[]] = [
      "",
      "N",
      "Mean",
      "Std.Err",
    ];
    if (knownStdev1 && knownStdev2) {
      sampleStats.splice(3, 0, "Known Stdev");
    } else if (!knownStdev1 && !knownStdev2) {
      sampleStats.splice(3, 0, "S.Stdev");
    } else {
      sampleStats.splice(3, 0, "S.Stdev", "Known Stdev");
    }

    outputData["sampleData"] = sampleData;
    outputData["sampleStats"] = sampleStats;
  }

  return outputData;
};
