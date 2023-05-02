import "@glideapps/glide-data-grid/dist/index.css";
import DataEditor, {
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import * as React from "react";
import ZModal from "./features/ZStatistics/ZModal";
import DescriptiveStatisticsModal from "./features/DescriptiveStatistics/DescriptiveStatisticsModal";
import { ColumnValues, GridColumnName } from "./Types";

interface GridRow {
  [colName: GridColumnName]: string;
}

const columnHeaders: GridColumn[] = Array.from({ length: 5 }, (_, i) => {
  const col: { title: GridColumnName; width: number } = {
    title: `col${i + 1}`,
    width: 100,
  };
  return col;
});

function getColumns(rows: GridRow[]): ColumnValues {
  const columns: ColumnValues = {};
  for (const obj of rows) {
    if (!obj) continue;
    (Object.keys(obj) as Array<keyof GridRow>).forEach((key) => {
      columns[key] = (columns[key] || []).concat([obj[key]]);
    });
  }
  return columns;
}

function App() {
  const [data, setData] = React.useState<GridRow[]>([]);

  const columns = getColumns(data);

  const getContent = React.useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = data[row] || {};
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
  }, []);

  const onCellEdited = React.useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      if (newValue.kind !== GridCellKind.Text) {
        return;
      }
      const indexes: (keyof GridRow)[] = columnHeaders.map(
        (col) => col.title as GridColumnName
      );
      const [colIdx, rowIdx] = cell;
      const col = indexes[colIdx];
      if (!data[rowIdx]) {
        data[rowIdx] = {};
      }
      data[rowIdx][col] = newValue.data;
      setData([...data]);
    },
    []
  );

  return (
    <>
      <ZModal />
      <DescriptiveStatisticsModal cols={columns} />
      <DataEditor
        getCellContent={getContent}
        columns={columnHeaders}
        rows={5}
        onCellEdited={onCellEdited}
        rowMarkers={"clickable-number"}
        getCellsForSelection={true}
        onPaste={true}
      />
      <ul>
        {data.map((row, i) => {
          return (
            <li key={i}>
              {Object.entries(row || {}).map(([k, v]) => `${k}: ${v}`)}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
