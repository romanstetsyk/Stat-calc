import { BinMethod } from "~/Types";
import { ArrayLike } from "~/utils/ArrayLike";
import { isFiniteNumberString } from "~/utils/assertions";
import { HistogramTableParameters, Tabulate } from "~/utils/computeBins";
import { getVarName, getVarValues } from "~/utils/getColumnNameAndValues";
import { OutputReturn, TForm } from "./types";

export const calcHistogram = (
  colData: InstanceType<typeof ArrayLike<ArrayLike<string>>>,
  formSummary: TForm
): OutputReturn[] => {
  const { withLabel, columns, options, method } = formSummary;

  return columns.map((colHeader) => {
    const varName = getVarName(colData, Number(colHeader), withLabel);
    const varValues = getVarValues(colData, Number(colHeader), withLabel);
    const arrOfNums = varValues.filter(isFiniteNumberString).map(Number);

    let tabulateParams: HistogramTableParameters;
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
      hideEmpty: false,
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
    return { varName, out, options };
  });
};
