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
import { debounce } from "lodash-es";
import { DataColumnsContext } from "~/contexts/DataColumnsContext";
import { GridColumnName, GridRow } from "~/Types";

const ROW_COUNT = 300;
const ROW_HEIGHT = 24;
const COL_COUNT = 50;
const COL_WIDTH = 100;
const HEADER_HEIGHT = 28;

const generateHeaders = (colCount: number = COL_COUNT) =>
  Array.from({ length: colCount }, (_, i) => {
    const col: {
      title: GridColumnName;
      id: GridColumnName;
      width: number;
    } = {
      title: `col${i + 1}`,
      id: `col${i + 1}`,
      width: COL_WIDTH,
    };
    return col;
  });

export const DataGrid = () => {
  const { rowData, setRowData, delRows, delColumns, delCells } =
    useContext(DataColumnsContext);
  const [rowCount, setRowCount] = useState<number>(ROW_COUNT);
  const [columnHeaders, setColumnHeaders] = useState(() => generateHeaders());

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
        displayData: String(d),
        data: String(d),
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
      setRowData(rowData.slice());
    },
    [columnHeaders, rowData, setRowData]
  );

  return (
    <DataEditor
      getCellContent={getContent}
      columns={columnHeaders}
      rows={Math.max(rowCount, rowData.length)}
      rowHeight={ROW_HEIGHT}
      headerHeight={HEADER_HEIGHT}
      onCellEdited={onCellEdited}
      rowMarkers={"clickable-number"}
      getCellsForSelection={true}
      onPaste={true}
      onColumnResize={onColumnResize}
      scaleToRem={true}
      onVisibleRegionChanged={debounce(({ x, y, width, height }) => {
        if (x + width > columnHeaders.length - 5) {
          setColumnHeaders(generateHeaders(columnHeaders.length + 10));
        }
        if (y + height > rowCount - 40) {
          setRowCount((prev) => prev + 50);
        }
      }, 100)}
      onDelete={(selection) => {
        const rows = selection.rows.toArray();
        const columns = selection.columns.toArray();
        const range = selection.current?.range;
        if (rows.length > 0) delRows(rows);
        if (columns.length > 0) delColumns(columns);
        if (range) delCells(range);
        return false;
      }}
    />
  );
};
