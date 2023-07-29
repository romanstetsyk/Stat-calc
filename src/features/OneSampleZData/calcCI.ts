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
  const { columns, withLabel, knownStdev, level } = formSummary;
  const CIData: DataTableRow<CIColumns | SampleStatistics, "">[] = columns.map(
    (colHeader) => {
      const varName = getVarName(colData, Number(colHeader), withLabel);
      const varValues = getVarValues(colData, Number(colHeader), withLabel);
      const arrOfNums = varValues.filter(isFiniteNumberString).map(Number);
      const n = arrOfNums.length;
      const xbar = mean(n, arrOfNums, 1);
      const stdevApprox = knownStdev
        ? Number(knownStdev)
        : stdev(n, 1, arrOfNums, 1);
      const stderr = stdevApprox / Math.sqrt(n);
      const zcrit = -1 * quantile((1 - Number(level)) / 2, 0, 1);
      const me = zcrit * stderr;
      const ll = Number(xbar) - me;
      const ul = Number(xbar) + me;

      const rowData: DataTableRow<CIColumns | SampleStatistics, ""> = {
        "": varName,
        N: n.toString(),
        Mean: parseNumber(xbar, DECIMAL),
        [knownStdev ? "Known Stdev" : "S.Stdev"]: parseNumber(
          stdevApprox,
          DECIMAL
        ),
        "Std.Err": parseNumber(stderr, DECIMAL),
        Level: level,
        "Z-crit": parseNumber(zcrit, DECIMAL),
        "M.E.": parseNumber(me, DECIMAL),
        "L.Limit": parseNumber(ll, DECIMAL),
        "U.Limit": parseNumber(ul, DECIMAL),
      };
      return rowData;
    }
  );

  const CIStats: ["", ...(CIColumns | SampleStatistics)[]] = [
    "",
    "N",
    "Mean",
    knownStdev ? "Known Stdev" : "S.Stdev",
    "Std.Err",
    "Level",
    "Z-crit",
    "M.E.",
    "L.Limit",
    "U.Limit",
  ];

  return { perform: Perform.ConfidenceInerval, CIData, CIStats };
};
