import { Button } from "@chakra-ui/react";

import DataEditor, {
  Item,
  GridCell,
  GridCellKind,
  GridColumn,
} from "@glideapps/glide-data-grid";

import mean from "@stdlib/stats-base-mean";
import mediansorted from "@stdlib/stats-base-mediansorted";
import variance from "@stdlib/stats-base-variance";
import stdev from "@stdlib/stats-base-stdev";

import { DisplayOptions, Options, TForm } from "./types";
import { ColumnValues, GridColumnName } from "../../Types";
import React, { useMemo } from "react";

type IProps = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TForm;
  cols: ColumnValues;
};

type DescTableRow = {
  [key in Options]?: string;
} & { col: string };

function Output({ setDisplay, formSummary, cols }: IProps) {
  const { columns, options } = formSummary;

  const columnHeaders: GridColumn[] = useMemo(
    () => [
      { title: "col", width: 100 },
      ...options.map((opt) => {
        return {
          title: opt,
          width: 100,
        };
      }),
    ],
    []
  );

  const data: DescTableRow[] = (columns as Array<GridColumnName>).map(
    (colName) => {
      const arrOfNums = cols[colName].filter(Number).map(Number);
      const n = arrOfNums.length;
      const row: DescTableRow = {
        col: colName,
      };

      // Data length
      if (options.includes(Options.N)) {
        row[Options.N] = String(n);
      }

      // Mean
      if (options.includes(Options.Mean)) {
        row[Options.Mean] = String(mean(n, arrOfNums, 1));
      }

      // Median
      if (options.includes(Options.Median)) {
        row[Options.Median] = String(
          mediansorted(
            n,
            arrOfNums.sort((a, b) => a - b),
            1
          )
        );
      }

      // Sample variance
      if (options.includes(Options.SVariance)) {
        row[Options.SVariance] = String(variance(n, 1, arrOfNums, 1));
      }

      // Population variance
      if (options.includes(Options.PVariance)) {
        row[Options.PVariance] = String(variance(n, 0, arrOfNums, 1));
      }

      // Sample standard deviation
      if (options.includes(Options.SStdev)) {
        row[Options.SStdev] = String(stdev(n, 1, arrOfNums, 1));
      }

      // Sample standard deviation
      if (options.includes(Options.PStdev)) {
        row[Options.PStdev] = String(stdev(n, 0, arrOfNums, 1));
      }

      return row;
    }
  );

  const getContent = React.useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = data[row] || {};
    // dumb but simple way to do this
    const indexes: (keyof DescTableRow)[] = columnHeaders.map(
      (col) => col.title as keyof DescTableRow
    );
    const d = dataRow[indexes[col]] || "";
    return {
      kind: GridCellKind.Text,
      allowOverlay: true,
      readonly: false,
      displayData: d,
      data: d,
    };
  }, []);

  return (
    <>
      <Button onClick={() => setDisplay("form")}>Edit</Button>
      <DataEditor
        getCellContent={getContent}
        columns={columnHeaders}
        rows={data.length}
        getCellsForSelection={true}
        rowMarkers="none"
        copyHeaders={true}
        smoothScrollX={true}
      />
    </>
  );
}

export { Output };
