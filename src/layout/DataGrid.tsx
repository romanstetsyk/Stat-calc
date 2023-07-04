import "@glideapps/glide-data-grid/dist/index.css";
import { useCallback, useContext, useState } from "react";
import {
  DataEditor,
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import { DataColumnsContext } from "~/contexts/DataColumnsContext";
import { GridColumnName, GridRow } from "~/Types";

export const DataGrid = () => {
  const { rowData, setRowData } = useContext(DataColumnsContext);

  const [columnHeaders, setColumnHeaders] = useState(() =>
    Array.from({ length: 50 }, (_, i) => {
      const col: {
        title: GridColumnName;
        id: GridColumnName;
        width: number;
      } = {
        title: `col${i + 1}`,
        id: `col${i + 1}`,
        width: 100,
      };
      return col;
    })
  );

  const onColumnResize = useCallback(
    (_col: GridColumn, newSize: number, colIndex: number) => {
      setColumnHeaders((prev) =>
        prev.map((header, idx) =>
          idx === colIndex ? { ...header, width: newSize } : header
        )
      );
    },
    []
  );

  const getContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell;
      const dataRow = rowData[row] || {};
      // dumb but simple way to do this
      const indexes: (keyof GridRow)[] = columnHeaders.map(
        (col) => col.title as GridColumnName
      );
      const d = dataRow[indexes[col]] || "";
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: false,
        displayData: d,
        data: d,
      };
    },
    [columnHeaders, rowData]
  );

  const onCellEdited = useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      if (newValue.kind !== GridCellKind.Text) {
        return;
      }
      const indexes: (keyof GridRow)[] = columnHeaders.map(
        (col) => col.title as GridColumnName
      );
      const [colIdx, rowIdx] = cell;
      const col = indexes[colIdx];
      if (!rowData[rowIdx]) {
        rowData[rowIdx] = {};
      }
      rowData[rowIdx][col] = newValue.data;
      setRowData([...rowData]);
    },
    [columnHeaders, rowData, setRowData]
  );

  return (
    <DataEditor
      getCellContent={getContent}
      columns={columnHeaders}
      rows={300}
      rowHeight={24}
      headerHeight={28}
      onCellEdited={onCellEdited}
      rowMarkers={"clickable-number"}
      getCellsForSelection={true}
      onPaste={true}
      onColumnResize={onColumnResize}
      scaleToRem={true}
    />
  );
};
