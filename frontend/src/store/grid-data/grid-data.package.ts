import type { GridCell, Item } from '@glideapps/glide-data-grid';
import { GridCellKind } from '@glideapps/glide-data-grid';

import { ArrayLike } from '~/utils/array-like';

import type {
  OnCellsEditedParams,
  OverwriteRowsParameters,
  Snapshot,
} from './types';

class Dataset {
  private listeners: (() => void)[] = [];

  private snapshot: Snapshot;

  public constructor(datasetId: string) {
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);

    this.snapshot = {
      datasetId,
      rowData: new ArrayLike<ArrayLike<string>>(),
      colData: new ArrayLike<ArrayLike<string>>(),
      getContent: this.getContent.bind(this),
      onCellsEdited: this.onCellsEdited.bind(this),
      overwriteRows: this.overwriteRows.bind(this),
    };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emitChange(): void {
    this.snapshot = { ...this.snapshot };
    for (const listener of this.listeners) {
      listener();
    }
  }

  public getContent(cell: Item): GridCell {
    const [colIdx, rowIdx] = cell;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const d = this.snapshot.rowData?.[rowIdx]?.[colIdx] || '';
    return {
      kind: GridCellKind.Text,
      allowOverlay: true,
      readonly: false,
      displayData: String(d),
      data: String(d),
    };
  }

  public overwriteRows({
    datasetId,
    newRows,
    newCols,
  }: OverwriteRowsParameters): void {
    this.snapshot.datasetId = datasetId;
    this.snapshot.rowData = newRows;
    this.snapshot.colData = newCols;
    this.emitChange();
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public onCellsEdited(newValues: OnCellsEditedParams): boolean {
    for (const { location: cell, value: newValue } of newValues) {
      if (newValue.kind !== GridCellKind.Text) {
        continue;
      }

      const [colIdx, rowIdx] = cell;

      // if cell is being deleted and row doesn't exist
      if (newValue.data === '' && !(rowIdx in this.snapshot.rowData)) {
        continue;
      }

      // if cell is being deleted and row exists
      if (newValue.data === '' && rowIdx in this.snapshot.rowData) {
        if (this.snapshot.rowData[rowIdx][colIdx]) {
          this.snapshot.rowData[rowIdx].delete(colIdx);
          this.snapshot.colData[colIdx].delete(rowIdx);

          // if after deletion row is empty, delete it
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          if (this.snapshot.rowData[rowIdx].length === 0) {
            this.snapshot.rowData.delete(rowIdx);
          }
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          if (this.snapshot.colData[colIdx].length === 0) {
            this.snapshot.colData.delete(colIdx);
          }
        }
        continue;
      }

      if (newValue.data !== '') {
        if (!(rowIdx in this.snapshot.rowData)) {
          this.snapshot.rowData.add(rowIdx, new ArrayLike<string>());
        }
        this.snapshot.rowData[rowIdx].add(colIdx, newValue.data);

        if (!(colIdx in this.snapshot.colData)) {
          this.snapshot.colData.add(colIdx, new ArrayLike<string>());
        }
        this.snapshot.colData[colIdx].add(rowIdx, newValue.data);
      }
    }

    this.emitChange();
    return true;
  }

  public getSnapshot(): Snapshot {
    return this.snapshot;
  }
}

export { Dataset };
