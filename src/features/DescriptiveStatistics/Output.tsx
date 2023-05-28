import React from "react";
import { Button } from "@chakra-ui/react";

import mean from "@stdlib/stats-base-mean";
import mediansorted from "@stdlib/stats-base-mediansorted";
import variance from "@stdlib/stats-base-variance";
import stdev from "@stdlib/stats-base-stdev";
import range from "@stdlib/stats-base-range";

import { TForm } from "./types";
import { ColumnValues, DisplayOptions, GridColumnName } from "../../Types";
import { DataTable, DataTableRow } from "../../components/DataTable";
import { SampleStatistics } from "./types";
import { parseNumber } from "../../utils/parseNumber";
import { getVarName, getVarValues } from "../../utils/getColumnNameAndValues";
import { isFiniteNumberString } from "../../utils/assertions";

const DECIMAL = 6;

type Props = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  cols: ColumnValues;
};

export const Output = ({ setDisplay, formSummary, cols }: Props) => {
  const { columns, options, withLabel } = formSummary;

  const data: DataTableRow<SampleStatistics, "">[] = (
    columns as GridColumnName[]
  ).map((colHeader) => {
    const varName = getVarName(cols, colHeader, withLabel);
    const varValues = getVarValues(cols, colHeader, withLabel);
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

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      <DataTable<SampleStatistics, ""> data={data} stats={["", ...options]} />
    </>
  );
};
