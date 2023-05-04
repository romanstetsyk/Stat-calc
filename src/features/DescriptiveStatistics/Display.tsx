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

import { DisplayOptions, TFormSummary } from "./types";
import { ColumnValues, GridColumnName } from "../../Types";
import React, { useMemo } from "react";

type IProps = {
  setDisplay: React.Dispatch<React.SetStateAction<DisplayOptions>>;
  formSummary: TFormSummary;
  cols: ColumnValues;
};

type DescTableRow = {
  col: string;
  n: string;
  mean: string;
  median: string;
  "s.variance": string;
  "p.variance": string;
};

function Display({ setDisplay, formSummary, cols }: IProps) {
  const { columns } = formSummary;

  const columnHeaders: GridColumn[] = useMemo(
    () => [
      { title: "col", width: 100 },
      { title: "n", width: 100 },
      { title: "mean", width: 100 },
      { title: "median", width: 100 },
      { title: "s.variance", width: 100 },
      { title: "p.variance", width: 100 },
    ],
    []
  );

  const data: DescTableRow[] = (columns as Array<GridColumnName>).map(
    (colName) => {
      const arrOfNums = cols[colName].filter(Number).map(Number);
      const n = arrOfNums.length;
      const row: DescTableRow = {
        col: colName,
        n: String(n),
        mean: String(mean(n, arrOfNums, 1)),
        median: String(
          mediansorted(
            n,
            arrOfNums.sort((a, b) => a - b),
            1
          )
        ),
        "s.variance": String(variance(n, 1, arrOfNums, 1)),
        "p.variance": String(variance(n, 0, arrOfNums, 1)),
      };
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

export default Display;
