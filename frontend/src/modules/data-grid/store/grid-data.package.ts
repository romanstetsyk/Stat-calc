import type {
  EditableGridCell,
  EditListItem,
  GridCell,
  GridSelection,
  Item,
} from '@glideapps/glide-data-grid';
import { GridCellKind } from '@glideapps/glide-data-grid';

import { ArrayLike } from '~/framework/array-like';
import { ExternalStore } from '~/framework/external-store';
import type { ColumnHeading } from '~/modules/application/types';

import { Config } from '../config';
import type { Batch, ColumnChanges, DatasetData, GridData } from '../types';

class Dataset extends ExternalStore<GridData> {
  protected snapshot: GridData;

  public constructor(id: string) {
    super();

    this.snapshot = {
      id,
      title: Config.DEFAULT_TITLE,
      renameDataset: this.renameDataset.bind(this),
      ext: Config.DEFAULT_EXT,
      rowData: new ArrayLike(),
      colData: new ArrayLike(),
      getContent: this.getContent.bind(this),
      onCellEdited: this.onCellEdited.bind(this),
      onCellsEdited: this.onCellsEdited.bind(this),
      overwriteData: this.overwriteData.bind(this),
      getColumnChanges: this.getColumnChanges.bind(this),
      recentEdits: {
        isSaved: false,
        undoHistory: [],
        redoHistory: [],
        canUndo: false,
        canRedo: false,
        isApplyingUndo: false,
        isApplyingRedo: false,
        undo: this.undo.bind(this),
        redo: this.redo.bind(this),
        save: this.save.bind(this),
      },
      onGridSelectionChange: this.onGridSelectionChange.bind(this),
    };
  }

  public renameDataset(title: string): void {
    this.addEdit([], true);
    this.snapshot.title = title;
    this.emitChange();
  }

  public onGridSelectionChange(newSelection: GridSelection): void {
    this.snapshot.recentEdits.currentSelection = newSelection;
    this.emitChange();
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

    this.snapshot.recentEdits.isSaved = false;
    this.snapshot.recentEdits.undoHistory = [];
    this.snapshot.recentEdits.redoHistory = [];
    this.snapshot.recentEdits.canUndo = false;
    this.snapshot.recentEdits.canRedo = false;
    this.snapshot.recentEdits.isApplyingUndo = false;
    this.snapshot.recentEdits.isApplyingRedo = false;

    this.emitChange();
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  private onCellEdited(cell: Item, newValue: EditableGridCell): void {
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
    this.addEdit(newValues);
    for (const { location: cell, value: newValue } of newValues) {
      this.onCellEdited(cell, newValue);
    }

    this.emitChange();
    return true;
  }

  private addEdit(values: readonly EditListItem[], withTitle = false): void {
    if (
      !this.snapshot.recentEdits.isApplyingUndo &&
      !this.snapshot.recentEdits.isApplyingRedo
    ) {
      const batch: Batch = this.getCurrentBatch(values, withTitle);
      this.snapshot.recentEdits.undoHistory.push(batch);
      this.snapshot.recentEdits.redoHistory = [];
      this.updateCanUndoRedo();
      this.snapshot.recentEdits.isSaved = false;
    }
  }

  private updateCanUndoRedo(): void {
    this.snapshot.recentEdits.canUndo =
      this.snapshot.recentEdits.undoHistory.length > 0;
    this.snapshot.recentEdits.canRedo =
      this.snapshot.recentEdits.redoHistory.length > 0;
  }

  private getCurrentBatch(
    values: readonly EditListItem[],
    withTitle = false,
  ): Batch {
    return {
      edits: values.map(({ location }) => ({
        location,
        value: this.getContent(location) as EditableGridCell,
      })),
      selection: this.snapshot.recentEdits.currentSelection,
      title: withTitle ? this.snapshot.title : undefined,
      isSaved: this.snapshot.recentEdits.isSaved,
    };
  }

  private applyOperation(operation: Batch, type: 'undo' | 'redo'): void {
    const batch = this.getCurrentBatch(
      operation.edits,
      Boolean(operation.title),
    );

    type === 'undo'
      ? this.snapshot.recentEdits.redoHistory.push(batch)
      : this.snapshot.recentEdits.undoHistory.push(batch);

    this.updateCanUndoRedo();
    this.snapshot.recentEdits.currentSelection = operation.selection;
    if (operation.title) {
      this.renameDataset(operation.title);
    }
    this.snapshot.recentEdits.isSaved = operation.isSaved;
    this.onCellsEdited(operation.edits);
  }

  public undo(): { cell: Item }[] | undefined {
    if (!this.snapshot.recentEdits.canUndo) {
      return;
    }
    const operation = this.snapshot.recentEdits.undoHistory.pop();
    if (!operation) {
      return;
    }
    this.snapshot.recentEdits.isApplyingUndo = true;
    this.applyOperation(operation, 'undo');
    this.snapshot.recentEdits.isApplyingUndo = false;
    return operation.edits.map(({ location }) => ({
      cell: location,
    }));
  }

  public redo(): { cell: Item }[] | undefined {
    if (!this.snapshot.recentEdits.canRedo) {
      return;
    }
    const operation = this.snapshot.recentEdits.redoHistory.pop();
    if (!operation) {
      return;
    }
    this.snapshot.recentEdits.isApplyingRedo = true;
    this.applyOperation(operation, 'redo');
    this.snapshot.recentEdits.isApplyingRedo = false;
    return operation.edits.map(({ location }) => ({
      cell: location,
    }));
  }

  public save(): void {
    this.snapshot.recentEdits.isSaved = true;
    for (const batch of this.snapshot.recentEdits.undoHistory) {
      batch.isSaved = false;
    }
    for (const batch of this.snapshot.recentEdits.redoHistory) {
      batch.isSaved = false;
    }
  }
}

export { Dataset };
