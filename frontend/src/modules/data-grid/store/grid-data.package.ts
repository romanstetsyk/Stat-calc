import type {
  EditableGridCell,
  EditListItem,
  GridCell,
  Item,
} from '@glideapps/glide-data-grid';
import { GridCellKind } from '@glideapps/glide-data-grid';

import { ArrayLike } from '~/framework/array-like';
import { ExternalStore } from '~/framework/external-store';
import type { ColumnHeading } from '~/modules/application/types';

import { Config } from '../config';
import type { ColumnChanges, DatasetData, GridData } from '../types';

class Dataset extends ExternalStore<GridData> {
  protected snapshot: GridData;

  public constructor(id: string) {
    super();

    this.snapshot = {
      id,
      title: Config.DEFAULT_TITLE,
      ext: Config.DEFAULT_EXT,
      rowData: new ArrayLike(),
      colData: new ArrayLike(),
      getContent: this.getContent.bind(this),
      onCellEdited: this.onCellEdited.bind(this),
      onCellsEdited: this.onCellsEdited.bind(this),
      overwriteData: this.overwriteData.bind(this),
      getColumnChanges: this.getColumnChanges.bind(this),
    };
  }

  public getColumnChanges(columns: ColumnHeading[]): ColumnChanges {
    // eslint-disable-next-line unicorn/no-array-reduce
    return columns.reduce<ColumnChanges>(
      (acc, c) => {
        c in this.snapshot.colData
          ? acc.existingColumns.push(c)
          : acc.deletedColumns.push(c);
        return acc;
      },
      { existingColumns: [], deletedColumns: [] },
    );
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

  public overwriteData({
    id,
    title,
    ext,
    rowData,
    colData,
  }: DatasetData): void {
    this.snapshot.id = id;
    this.snapshot.title = title;
    this.snapshot.ext = ext;
    this.snapshot.rowData = rowData;
    this.snapshot.colData = colData;
    this.emitChange();
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public onCellEdited(cell: Item, newValue: EditableGridCell): void {
    if (newValue.kind !== GridCellKind.Text) {
      return;
    }

    const [colIdx, rowIdx] = cell;

    // if cell is being deleted and row doesn't exist
    if (newValue.data === '' && !(rowIdx in this.snapshot.rowData)) {
      return;
    }

    // if cell is being deleted and row exists
    if (newValue.data === '' && rowIdx in this.snapshot.rowData) {
      if (this.snapshot.rowData[rowIdx][colIdx]) {
        this.snapshot.rowData[rowIdx].delete(colIdx);
        this.snapshot.colData[colIdx].delete(rowIdx);

        // if after deletion row is empty, delete it
        if (this.snapshot.rowData[rowIdx].length === 0) {
          this.snapshot.rowData.delete(rowIdx);
        }

        if (this.snapshot.colData[colIdx].length === 0) {
          this.snapshot.colData.delete(colIdx);
        }
      }
      return;
    }

    if (newValue.data !== '') {
      if (!(rowIdx in this.snapshot.rowData)) {
        this.snapshot.rowData.add(rowIdx, new ArrayLike());
      }
      this.snapshot.rowData[rowIdx].add(
        colIdx,
        Number.parseFloat(newValue.data) === Number(newValue.data)
          ? Number(newValue.data)
          : newValue.data,
      );

      if (!(colIdx in this.snapshot.colData)) {
        this.snapshot.colData.add(colIdx, new ArrayLike());
      }
      this.snapshot.colData[colIdx].add(
        rowIdx,
        Number.parseFloat(newValue.data) === Number(newValue.data)
          ? Number(newValue.data)
          : newValue.data,
      );
    }
  }

  public onCellsEdited(newValues: readonly EditListItem[]): boolean {
    for (const { location: cell, value: newValue } of newValues) {
      this.onCellEdited(cell, newValue);
    }

    this.emitChange();
    return true;
  }
}

export { Dataset };
