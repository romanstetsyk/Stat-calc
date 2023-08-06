import gcusum from "@stdlib/blas-ext-base-gcusum";
import tabulate from "@stdlib/utils-tabulate";
import { DataTableRow } from "~/components/DataTable";
import { ArrayLike } from "~/utils/ArrayLike";
import { getVarName, getVarValues } from "~/utils/getColumnNameAndValues";
import { parseNumber } from "~/utils/parseNumber";
import { FrequencyDistribution, OutputReturn, topLeftCell } from "./types";

export const calcFrequency = (
  columns: `${number}`[],
  colData: InstanceType<typeof ArrayLike<ArrayLike<string>>>,
  withLabel: boolean,
  options: FrequencyDistribution[]
): OutputReturn[] =>
  columns.map((colHeader) => {
    const varName = getVarName(colData, Number(colHeader), withLabel);
    const varValues = getVarValues(colData, Number(colHeader), withLabel);
    const n = varValues.length;
    const out = tabulate(varValues);

    const table: DataTableRow<FrequencyDistribution, typeof topLeftCell>[] =
      out.map(([x, fr, relFr]) => {
        const row: DataTableRow<FrequencyDistribution, typeof topLeftCell> = {
          Value: x.toString(),
          Frequency: (fr as number).toString(),
          "Relative Frequency": parseNumber(relFr as number),
        };
        return row;
      });

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
