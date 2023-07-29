import {
  EditableGridCell,
  GridCell,
  GridCellKind,
  Item,
} from "@glideapps/glide-data-grid";

import { ArrayLike } from "~/utils/ArrayLike";

// functions with which components subscribed to this datastore
let listeners: (() => void)[] = [];
function emitChange() {
  listeners.forEach((listener) => listener());
}

function finalize() {
  snapshot = { ...snapshot };
  emitChange();
}

function getContent(cell: Item): GridCell {
  const [colIdx, rowIdx] = cell;
  const d = snapshot.rowData?.[rowIdx]?.[colIdx] ?? "";
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
  for (const { location: cell, value: newValue } of newValues) {
    if (newValue.kind !== GridCellKind.Text) continue;

    const [colIdx, rowIdx] = cell;

    // if cell is being deleted and row doesn't exist
    if (newValue.data === "" && !(rowIdx in snapshot.rowData)) continue;

    // if cell is being deleted and row exists
    if (newValue.data === "" && rowIdx in snapshot.rowData) {
      if (snapshot.rowData[rowIdx][colIdx]) {
        snapshot.rowData[rowIdx].delete(colIdx);
        snapshot.colData[colIdx].delete(rowIdx);

        // if after deletion row is empty, delete it
        if (snapshot.rowData[rowIdx].length === 0) {
          snapshot.rowData.delete(rowIdx);
        }
        if (snapshot.colData[colIdx].length === 0) {
          snapshot.colData.delete(colIdx);
        }
      }
      continue;
    }

    if (newValue.data !== "") {
      if (!(rowIdx in snapshot.rowData)) {
        snapshot.rowData.add(rowIdx, new ArrayLike<string>());
      }
      snapshot.rowData[rowIdx].add(colIdx, newValue.data);

      if (!(colIdx in snapshot.colData)) {
        snapshot.colData.add(colIdx, new ArrayLike<string>());
      }
      snapshot.colData[colIdx].add(rowIdx, newValue.data);
    }
  }

  finalize();
  return true;
}

type OverwriteRowsParams = {
  datasetId: string;
  newRows: ArrayLike<ArrayLike<string>>;
  newCols: ArrayLike<ArrayLike<string>>;
};

function overwriteRows({ datasetId, newRows, newCols }: OverwriteRowsParams) {
  snapshot.datasetId = datasetId;
  snapshot.rowData = newRows;
  snapshot.colData = newCols;
  finalize();
}

let snapshot = {
  datasetId: "",
  rowData: new ArrayLike<ArrayLike<string>>(),
  colData: new ArrayLike<ArrayLike<string>>(),
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