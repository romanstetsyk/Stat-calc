import gcusum from "@stdlib/blas-ext-base-gcusum";
import tabulate from "@stdlib/utils-tabulate";
import { DataTableRow } from "~/components/DataTable";
import { ColumnValues, GridColumnName } from "~/Types";
import { getVarName, getVarValues } from "~/utils/getColumnNameAndValues";
import { parseNumber } from "~/utils/parseNumber";
import { FreqDist, OutputReturn, topLeftCell } from "./types";

export const calcFrequency = (
  columns: GridColumnName[],
  columnData: ColumnValues,
  withLabel: boolean,
  options: FreqDist[]
): OutputReturn[] =>
  columns.map((colHeader) => {
    const varName = getVarName(columnData, colHeader, withLabel);
    const varValues = getVarValues(columnData, colHeader, withLabel);
    const n = varValues.length;
    const out = tabulate(varValues);

    const table: DataTableRow<FreqDist, typeof topLeftCell>[] = out.map(
      ([x, fr, relFr]) => {
        const row: DataTableRow<FreqDist, typeof topLeftCell> = {
          Value: x.toString(),
          Frequency: (fr as number).toString(),
          "Relative Frequency": parseNumber(relFr as number),
        };
        return row;
      }
    );

    if (options.includes("Cumulative Frequency")) {
      const freqArr = out.map((e) => e[1]);
      const cumulFreq = Array(freqArr.length);
      gcusum(table.length, 0, freqArr, 1, cumulFreq, 1);
      table.forEach((row, i) => {
        row["Cumulative Frequency"] = cumulFreq[i].toString();
      });
    }

    if (options.includes("Cumulative Relative Frequency")) {
      const relFreqArr = out.map((e) => e[2]);
      const cumulRelFreq = Array(relFreqArr.length);
      gcusum(table.length, 0, relFreqArr, 1, cumulRelFreq, 1);
      table.forEach((row, i) => {
        row["Cumulative Relative Frequency"] = parseNumber(cumulRelFreq[i]);
      });
    }
    const stats: [typeof topLeftCell, ...typeof options] = [
      topLeftCell,
      ...options,
    ];
    return { varName, n, table, stats };
  });
