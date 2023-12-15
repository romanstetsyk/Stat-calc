import type { GridCell, Item } from '@glideapps/glide-data-grid';
import { GridCellKind } from '@glideapps/glide-data-grid';

import { ArrayLike } from '~/framework/array-like';

type Snapshot = {
  datasetId: string;
  rowData: ArrayLike<ArrayLike<string>>;
  colData: ArrayLike<ArrayLike<string>>;
  onCellsEdited: (newValues: OnCellsEditedParams) => boolean;
  overwriteRows: (arg: OverwriteRowsParameters) => void;
  getContent: (cell: Item) => GridCell;
};

import type { OnCellsEditedParams, OverwriteRowsParameters } from './types';

// functions with which components subscribed to this datastore
let listeners: (() => void)[] = [];
function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

function finalize(): void {
  snapshot = { ...snapshot };
  emitChange();
}

function getContent(cell: Item): GridCell {
  const [colIdx, rowIdx] = cell;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const d = snapshot.rowData?.[rowIdx]?.[colIdx] || '';
  return {
    kind: GridCellKind.Text,
    allowOverlay: true,
    readonly: false,
    displayData: String(d),
    data: String(d),
  };
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function onCellsEdited(newValues: OnCellsEditedParams): boolean {
  for (const { location: cell, value: newValue } of newValues) {
    if (newValue.kind !== GridCellKind.Text) {
      continue;
    }

    const [colIdx, rowIdx] = cell;

    // if cell is being deleted and row doesn't exist
    if (newValue.data === '' && !(rowIdx in snapshot.rowData)) {
      continue;
    }

    // if cell is being deleted and row exists
    if (newValue.data === '' && rowIdx in snapshot.rowData) {
      if (snapshot.rowData[rowIdx][colIdx]) {
        snapshot.rowData[rowIdx].delete(colIdx);
        snapshot.colData[colIdx].delete(rowIdx);

        // if after deletion row is empty, delete it
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (snapshot.rowData[rowIdx].length === 0) {
          snapshot.rowData.delete(rowIdx);
        }
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (snapshot.colData[colIdx].length === 0) {
          snapshot.colData.delete(colIdx);
        }
      }
      continue;
    }

    if (newValue.data !== '') {
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

function overwriteRows({
  datasetId,
  newRows,
  newCols,
}: OverwriteRowsParameters): void {
  snapshot.datasetId = datasetId;
  snapshot.rowData = newRows;
  snapshot.colData = newCols;
  finalize();
}

let snapshot: Snapshot = {
  datasetId: '',
  rowData: new ArrayLike<ArrayLike<string>>(),
  colData: new ArrayLike<ArrayLike<string>>(),
  onCellsEdited,
  overwriteRows,
  getContent,
};

const subscribe = (listener: () => void): (() => void) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const getSnapshot = (): Snapshot => snapshot;

export { getSnapshot, subscribe };
