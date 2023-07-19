import { DataTableRow } from "~/components/DataTable";
import { BinMethod } from "~/Types";
import { ArrayLike } from "~/utils/ArrayLike";
import { isFiniteNumberString } from "~/utils/assertions";
import { getVarName, getVarValues } from "~/utils/getColumnNameAndValues";
import { Tabulate, TabulateParams } from "~/utils/Tabulate";
import { FrequencyDistribution, TForm, topLeftCell } from "./types";

export const calcGroups = (
  colData: InstanceType<typeof ArrayLike<ArrayLike<string>>>,
  formSummary: TForm
) => {
  const { withLabel, columns, options, method } = formSummary;

  return columns.map((colHeader) => {
    const varName = getVarName(colData, Number(colHeader), withLabel);
    const varValues = getVarValues(colData, Number(colHeader), withLabel);
    const arrOfNums = varValues.filter(isFiniteNumberString).map(Number);
    const n = arrOfNums.length;

    let tabulateParams: TabulateParams;
    if (method === BinMethod.MANUAL) {
      const { start, width } = formSummary.manual;
      tabulateParams = {
        method,
        dataset: arrOfNums,
        start: start === "" ? NaN : Number(start),
        width: Number(width),
      };
    } else if (method === BinMethod.SQUARE_ROOT) {
      const { start } = formSummary.squareRoot;
      tabulateParams = {
        method,
        dataset: arrOfNums,
        start: start === "" ? NaN : Number(start),
      };
    } else {
      throw new Error("Unknown bin method");
    }

    const out = new Tabulate(tabulateParams, {
      allowHidden: false,
      showHidden: true,
      hideEmpty: true, // if frequency is 0 then hide class
      precision: 0,
    });

    if (options.includes("Relative Frequency")) {
      out.computeRelativeFrequency();
    }

    if (options.includes("Cumulative Frequency")) {
      out.computeCumulativeFrequency();
    }

    if (options.includes("Cumulative Relative Frequency")) {
      out.computeCumulativeRelativeFrequency();
    }

    const table: DataTableRow<FrequencyDistribution, typeof topLeftCell>[] =
      out.bins.map(({ limits, ...rest }) => ({
        ...rest,
        [topLeftCell]: limits.join(" - "),
      }));

    const stats: [typeof topLeftCell, ...typeof options] = [
      topLeftCell,
      ...options,
    ];
    return { varName, n, table, stats };
  });
};
