import {
  EditableGridCell,
  GridCell,
  GridCellKind,
  Item,
} from "@glideapps/glide-data-grid";
import { GridTrack, GridTracks } from "~/Types";
import { createGridTrack } from "~/utils/createGridTrack";

// functions with which components subscribed to this datastore
let listeners: (() => void)[] = [];
function emitChange() {
  listeners.forEach((listener) => listener());
}

// remove trailing empty slots in sparse array
// function adjustLength(arr: unknown[]) {
//   arr.length = arr.findLastIndex((e) => e !== undefined) + 1;
// }

function finalize() {
  snapshot = { ...snapshot };
  emitChange();
}

// function getColumns(rows: GridRow[]): ColumnValues {
//   const columns: ColumnValues = {};
//   for (const obj of rows) {
//     if (!obj) continue;
//     (Object.keys(obj) as Array<keyof GridRow>).forEach((key) => {
//       if (obj[key] !== "") {
//         columns[key] = (columns[key] || []).concat([obj[key]]);
//       }
//     });
//   }
//   return columns;
// }

function getContent(cell: Item): GridCell {
  const [colIdx, rowIdx] = cell;
  const d = rowData?.[rowIdx]?.[colIdx] ?? "";
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
    if (newValue.data === "" && !(rowIdx in rowData)) continue;

    // if cell is being deleted and row exists
    if (newValue.data === "" && rowIdx in rowData) {
      if (rowData[rowIdx][colIdx]) {
        delete rowData[rowIdx][colIdx];
        rowData[rowIdx].length -= 1;

        delete colData[colIdx][rowIdx];
        colData[colIdx].length -= 1;

        // if after deletion row is empty, delete it
        if (rowData[rowIdx].length === 0) {
          delete rowData[rowIdx];
          rowData.length -= 1;
        }
        if (colData[colIdx].length === 0) {
          delete colData[colIdx];
          colData.length -= 1;
        }
      }
      continue;
    }

    if (newValue.data !== "") {
      if (!(rowIdx in rowData)) {
        rowData[rowIdx] = createGridTrack<GridTrack>();
        rowData.length += 1;
      }
      rowData[rowIdx][colIdx] = newValue.data;
      rowData[rowIdx].length += 1;

      if (!(colIdx in colData)) {
        colData[colIdx] = createGridTrack<GridTrack>();
        colData.length += 1;
      }
      colData[colIdx][rowIdx] = newValue.data;
      colData[colIdx].length += 1;
    }
  }
  console.log("rowData", rowData);
  console.log("colData", colData);

  finalize();
  return true;
}

type OverwriteRowsParams = {
  datasetId: string;
  newRows: GridTracks;
};

function overwriteRows({ datasetId: newId, newRows }: OverwriteRowsParams) {
  snapshot.datasetId = newId;
  rowData = newRows;
  finalize();
}

let rowData = createGridTrack<GridTracks>();
const colData = createGridTrack<GridTracks>();

let snapshot = {
  datasetId: "",
  rowData,
  colData,
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
