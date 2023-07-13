import mean from "@stdlib/stats-base-mean";
import mediansorted from "@stdlib/stats-base-mediansorted";
import range from "@stdlib/stats-base-range";
import stdev from "@stdlib/stats-base-stdev";
import variance from "@stdlib/stats-base-variance";
import { DataTableRow } from "~/components/DataTable";
import { ColumnValues, GridColumnName } from "~/Types";
import { isFiniteNumberString } from "~/utils/assertions";
import { getVarName, getVarValues } from "~/utils/getColumnNameAndValues";
import { parseNumber } from "~/utils/parseNumber";
import { SampleStatistics } from "./types";

const DECIMAL = 6;

export const calcStatistics = (
  columns: GridColumnName[],
  columnData: ColumnValues,
  withLabel: boolean,
  options: SampleStatistics[]
) =>
  columns.map((colHeader) => {
    const varName = getVarName(columnData, colHeader, withLabel);
    const varValues = getVarValues(columnData, colHeader, withLabel);
    const arrOfNums = varValues.filter(isFiniteNumberString).map(Number);
    const n = arrOfNums.length;
    const row: DataTableRow<SampleStatistics, ""> = { "": varName };

    // Data length
    if (options.includes("N")) {
      row["N"] = n.toString();
    }

    // Mean
    if (options.includes("Mean")) {
      row["Mean"] = mean(n, arrOfNums, 1).toFixed(DECIMAL);
    }

    // Median
    if (options.includes("Median")) {
      row["Median"] = mediansorted(
        n,
        arrOfNums.sort((a, b) => a - b),
        1
      ).toFixed(DECIMAL);
    }

    // Sample variance
    if (options.includes("S.Var")) {
      row["S.Var"] = variance(n, 1, arrOfNums, 1).toFixed(DECIMAL);
    }

    // Population variance
    if (options.includes("P.Var")) {
      row["P.Var"] = variance(n, 0, arrOfNums, 1).toFixed(DECIMAL);
    }

    // Sample standard deviation
    if (options.includes("S.Stdev")) {
      row["S.Stdev"] = stdev(n, 1, arrOfNums, 1).toFixed(DECIMAL);
    }

    // Population standard deviation
    if (options.includes("P.Stdev")) {
      row["P.Stdev"] = stdev(n, 0, arrOfNums, 1).toFixed(DECIMAL);
    }

    // Standard error (uses sample stdev)
    if (options.includes("Std.Err")) {
      row["Std.Err"] = (stdev(n, 1, arrOfNums, 1) / n ** 0.5).toFixed(DECIMAL);
    }

    // Range
    if (options.includes("Range")) {
      row["Range"] = parseNumber(range(n, arrOfNums, 1));
    }

    return row;
  });