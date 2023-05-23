import React from "react";
import { Button } from "@chakra-ui/react";

// import mean from "@stdlib/stats-base-mean";
// import mediansorted from "@stdlib/stats-base-mediansorted";
// import variance from "@stdlib/stats-base-variance";
// import stdev from "@stdlib/stats-base-stdev";
import tabulate from "@stdlib/utils-tabulate";
import gcusum from "@stdlib/blas-ext-base-gcusum";

import { DisplayOptions, TForm } from "./types";
import { ColumnValues, GridColumnName } from "../../Types";
import { DataTable, DataTableRow } from "../../components/DataTable";
import { FreqDist } from "./types";
import { parseNumber } from "../../utils/parseNumber";

// const DECIMAL = 6;

type Props = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  cols: ColumnValues;
};

export const Output = ({ setDisplay, formSummary, cols }: Props) => {
  const { columns, options } = formSummary;

  const arrOfTables = (columns as GridColumnName[]).map((colName) => {
    const values = cols[colName];
    const n = values.length;
    const out = tabulate(values);
    const table: DataTableRow<FreqDist, "Value">[] = out.map(
      ([x, fr, relFr]) => {
        const row: DataTableRow<FreqDist, "Value"> = {
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

    return { colName, n, table };
  });

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      {arrOfTables.map(({ colName, n, table }) => (
        <div key={colName}>
          <p>
            Column: {colName}. Total: {n}
          </p>
          <DataTable<FreqDist, "Value">
            data={table}
            stats={["Value", ...options]}
          />
        </div>
      ))}
    </>
  );
};
