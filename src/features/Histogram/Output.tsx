import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";

// import mean from "@stdlib/stats-base-mean";
// import mediansorted from "@stdlib/stats-base-mediansorted";
// import variance from "@stdlib/stats-base-variance";
// import stdev from "@stdlib/stats-base-stdev";

import { FreqDist, BinMethod } from "src/features/GroupNumericData/types";
import { DisplayOptions, GridColumnName } from "../../Types";
import { DataTableRow } from "../../components/DataTable";
import { getVarName, getVarValues } from "../../utils/getColumnNameAndValues";
import { Tabulate } from "../../utils/computeBins";
import { isFiniteNumberString } from "../../utils/assertions";
import { DataColumnsContext } from "../../contexts/DataColumnsContext";
import { Histogram } from "src/components/Histogram";
import { TForm } from "./types";

type Props = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
};

export const Output = ({ setDisplay, formSummary }: Props) => {
  const { columnData } = useContext(DataColumnsContext);

  const { withLabel, columns, options, manual } = formSummary;

  const arrOfTables = (columns as GridColumnName[]).map((colHeader) => {
    const varName = getVarName(columnData, colHeader, withLabel);
    const varValues = getVarValues(columnData, colHeader, withLabel);
    const arrOfNums = varValues.filter(isFiniteNumberString).map(Number);
    const n = arrOfNums.length;

    const { start, width } = manual;

    const out = new Tabulate(
      {
        method: BinMethod.MANUAL,
        dataset: arrOfNums,
        start: start === "" ? NaN : Number(start),
        width: Number(width),
      },
      { allowHidden: false, showHidden: true, hideEmpty: false }
    );

    const table: DataTableRow<FreqDist, "Value">[] = out.bins.map(
      ({ values, limits }) => {
        const row: DataTableRow<FreqDist, "Value"> = {
          Value: "[" + limits.join(", ") + ")",
          Frequency: String(values.freq),
        };
        return row;
      }
    );

    if (options.includes("Relative Frequency")) {
      out.computeRelativeFrequency();
      table.forEach((row, i) => {
        row["Relative Frequency"] = out.bins[i].values.relFreq?.toString();
      });
    }

    if (options.includes("Cumulative Frequency")) {
      out.computeCumulativeFrequency();
      table.forEach((row, i) => {
        row["Cumulative Frequency"] = out.bins[i].values.cumulFreq?.toString();
      });
    }

    if (options.includes("Cumulative Relative Frequency")) {
      out.computeCumulativeRelativeFrequency();
      table.forEach((row, i) => {
        row["Cumulative Relative Frequency"] =
          out.bins[i].values.cumulRelFreq?.toString();
      });
    }

    return { varName, n, table };
  });

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      {arrOfTables.map(({ varName, table }) => (
        <Histogram
          key={varName}
          table={table}
          parsing={{
            xAxisKey: "Value",
            yAxisKey: options,
          }}
          datalabel={varName}
        />
      ))}
    </>
  );
};
