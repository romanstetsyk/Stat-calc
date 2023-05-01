import "@glideapps/glide-data-grid/dist/index.css";
import DataEditor, {
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import * as React from "react";

type GridColumnName = `col${number}`;

interface DummyItem {
  [colName: GridColumnName]: string;
}

const columns: GridColumn[] = Array.from({ length: 5 }, (_, i) => {
  const col: { title: GridColumnName; width: number } = {
    title: `col${i}`,
    width: 100,
  };
  return col;
});

function getColumns(rows: DummyItem[]) {
  const columns: { [key: GridColumnName]: string[] } = {};
  for (const obj of rows) {
    if (!obj) continue;
    (Object.keys(obj) as Array<keyof DummyItem>).forEach((key) => {
      columns[key] = (columns[key] || []).concat([obj[key]]);
    });
  }
  return columns;
}

function App() {
  const [data, setData] = React.useState<DummyItem[]>([]);

  const cols = getColumns(data);
  console.log(cols);

  const getContent = React.useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = data[row] || {};
    // dumb but simple way to do this
    const indexes: (keyof DummyItem)[] = columns.map(
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
      const indexes: (keyof DummyItem)[] = columns.map(
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
      <DataEditor
        getCellContent={getContent}
        columns={columns}
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
