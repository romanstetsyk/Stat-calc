import {
  EditableGridCell,
  GridCell,
  GridCellKind,
  Item,
} from "@glideapps/glide-data-grid";
import { ColumnValues, GridColumnName, GridRow } from "~/Types";

// functions with which components subscribed to this datastore
let listeners: (() => void)[] = [];
function emitChange() {
  listeners.forEach((listener) => listener());
}

// remove trailing empty slots in sparse array
function adjustLength() {
  rowData.length = rowData.findLastIndex((e) => e !== undefined) + 1;
}

function finalize() {
  adjustLength();
  snapshot = { ...snapshot };
  emitChange();
}

function getColumns(rows: GridRow[]): ColumnValues {
  const columns: ColumnValues = {};
  for (const obj of rows) {
    if (!obj) continue;
    (Object.keys(obj) as Array<keyof GridRow>).forEach((key) => {
      if (obj[key] !== "") {
        columns[key] = (columns[key] || []).concat([obj[key]]);
      }
    });
  }
  return columns;
}

function getContent(cell: Item): GridCell {
  const [colIdx, rowIdx] = cell;
  const dataRow = rowData[rowIdx] ?? {};
  const col: GridColumnName = `col${colIdx + 1}`;
  const d = dataRow[col] ?? "";
  return {
    kind: GridCellKind.Text,
    allowOverlay: true,
    readonly: false,
    displayData: String(d),
    data: String(d),
  };
}

type OnCellsEditedParams = readonly {
  location: Item;
  value: EditableGridCell;
}[];

function onCellsEdited(newValues: OnCellsEditedParams) {
  console.log("onCellsEdited");
  for (const { location: cell, value: newValue } of newValues) {
    if (newValue.kind !== GridCellKind.Text) continue;

    const [colIdx, rowIdx] = cell;

    // if cell is being deleted and row doesn't exist
    if (newValue.data === "" && !(rowIdx in rowData)) continue;

    const col: GridColumnName = `col${colIdx + 1}`;

    // if cell is being deleted and row exists
    if (newValue.data === "" && rowIdx in rowData) {
      delete rowData[rowIdx][col];
      // if after deletion row is empty, delete it
      if (Object.keys(rowData[rowIdx]).length === 0) {
        delete rowData[rowIdx];
      }
      continue;
    }

    if (newValue.data !== "") {
      if (!(rowIdx in rowData)) rowData[rowIdx] = {};
      rowData[rowIdx][col] = newValue.data;
    }
  }
  finalize();
  return true;
}

type OverwriteRowsParams = {
  datasetId: string;
  newRows: GridRow[];
};

function overwriteRows({ datasetId: newId, newRows }: OverwriteRowsParams) {
  snapshot.datasetId = newId;
  rowData = newRows;
  finalize();
}

let rowData: GridRow[] = [];
const columnData = getColumns(rowData);
let snapshot = {
  datasetId: "",
  rowData,
  columnData,
  onCellsEdited,
  overwriteRows,
  getContent,
};

export const dataStore = {
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot() {
    return snapshot;
  },
};
