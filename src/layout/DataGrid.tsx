import "@glideapps/glide-data-grid/dist/index.css";
import DataEditor, {
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import { useCallback, useContext, useMemo } from "react";
import { GridColumnName, GridRow } from "../Types";
import { DataColumnsContext } from "../contexts/DataColumnsContext";

export const DataGrid = () => {
  const { rowData, setRowData } = useContext(DataColumnsContext);

  const columnHeaders: GridColumn[] = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const col: { title: GridColumnName; width: number } = {
          title: `col${i + 1}`,
          width: 100,
        };
        return col;
      }),
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
      rows={10}
      onCellEdited={onCellEdited}
      rowMarkers={"clickable-number"}
      getCellsForSelection={true}
      onPaste={true}
    />
  );
};
