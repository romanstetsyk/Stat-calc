import * as React from "react";
import { useContext } from "react";
import { Button } from "@chakra-ui/react";
import { Histogram } from "~/components/Histogram";
import { DataColumnsContext } from "~/contexts/DataColumnsContext";
import { BinMethod } from "~/features/GroupNumericData/types";
import { DisplayOptions, GridColumnName } from "~/Types";
import { isFiniteNumberString } from "~/utils/assertions";
import { Tabulate } from "~/utils/computeBins";
import { getVarName, getVarValues } from "~/utils/getColumnNameAndValues";
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
      { allowHidden: false, showHidden: true, hideEmpty: false, precision: 0 }
    );

    if (options.includes("Relative Frequency")) {
      out.computeRelativeFrequency();
    }

    if (options.includes("Cumulative Frequency")) {
      out.computeCumulativeFrequency();
    }

    if (options.includes("Cumulative Relative Frequency")) {
      out.computeCumulativeRelativeFrequency();
    }
    console.log(out);
    return {
      varName,
      n,
      l: out.l,
      u: out.u,
      classWidth: out.width,
      out,
    };
  });

  return (
    <>
      <Button onClick={() => setDisplay("form")}>← Back</Button>
      {arrOfTables.map(({ varName, out, l, u, classWidth }) => (
        <Histogram
          l={l}
          u={u}
          classWidth={classWidth}
          key={varName}
          table={out.bins}
          parsing={{
            xAxisKey: "midpoint",
            yAxisKey: options,
          }}
          datalabel={varName}
        />
      ))}
    </>
  );
};
