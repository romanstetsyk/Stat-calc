import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";

// import mean from "@stdlib/stats-base-mean";
// import mediansorted from "@stdlib/stats-base-mediansorted";
// import variance from "@stdlib/stats-base-variance";
// import stdev from "@stdlib/stats-base-stdev";
import tabulate from "@stdlib/utils-tabulate";
import gcusum from "@stdlib/blas-ext-base-gcusum";

import { TForm } from "./types";
import { DisplayOptions, GridColumnName } from "../../Types";
import { DataTable, DataTableRow } from "../../components/DataTable";
import { FreqDist } from "./types";
import { parseNumber } from "../../utils/parseNumber";
import { getVarName, getVarValues } from "../../utils/getColumnNameAndValues";
import { DataColumnsContext } from "../../contexts/DataColumnsContext";

// const DECIMAL = 6;

type Props = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
};

export const Output = ({ setDisplay, formSummary }: Props) => {
  const { columnData } = useContext(DataColumnsContext);

  const { withLabel, columns, options } = formSummary;

  const arrOfTables = (columns as GridColumnName[]).map((colHeader) => {
    const varName = getVarName(columnData, colHeader, withLabel);
    const varValues = getVarValues(columnData, colHeader, withLabel);
    const n = varValues.length;
    const out = tabulate(varValues);
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

    return { varName, n, table };
  });

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      {arrOfTables.map(({ varName, n, table }) => (
        <div key={varName}>
          <p>
            Variable: {varName}. Count: {n}
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
