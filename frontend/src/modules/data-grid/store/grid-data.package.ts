import type { GridCell, Item } from '@glideapps/glide-data-grid';
import { GridCellKind } from '@glideapps/glide-data-grid';

import { ArrayLike } from '~/framework/array-like';
import { ExternalStore } from '~/framework/external-store';

import type {
  GridData,
  OnCellsEditedParams,
  OverwriteRowsParameters,
} from '../types';

class Dataset extends ExternalStore<GridData> {
  protected snapshot: GridData;

  public constructor(datasetId: string) {
    super();

    this.snapshot = {
      datasetId,
      rowData: new ArrayLike<ArrayLike<string | number>>(),
      colData: new ArrayLike<ArrayLike<string | number>>(),
      getContent: this.getContent.bind(this),
      onCellsEdited: this.onCellsEdited.bind(this),
      overwriteRows: this.overwriteRows.bind(this),
    };
  }

  public getContent(cell: Item): GridCell {
    const [colIdx, rowIdx] = cell;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const d = this.snapshot.rowData?.[rowIdx]?.[colIdx] ?? '';
    return {
      kind: GridCellKind.Text,
      allowOverlay: true,
      readonly: false,
      displayData: String(d),
      data: String(d),
      contentAlign:
        typeof d === 'number' || Number.parseFloat(d) === Number(d)
          ? 'right'
          : 'left',
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
          this.snapshot.rowData.add(rowIdx, new ArrayLike<string | number>());
        }
        this.snapshot.rowData[rowIdx].add(
          colIdx,
          Number.parseFloat(newValue.data) === Number(newValue.data)
            ? Number(newValue.data)
            : newValue.data,
        );

        if (!(colIdx in this.snapshot.colData)) {
          this.snapshot.colData.add(colIdx, new ArrayLike<string | number>());
        }
        this.snapshot.colData[colIdx].add(
          rowIdx,
          Number.parseFloat(newValue.data) === Number(newValue.data)
            ? Number(newValue.data)
            : newValue.data,
        );
      }
    }

    // this.emitChange();
    return true;
  }
}

export { Dataset };
