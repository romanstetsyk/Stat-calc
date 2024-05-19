import type {
  DataEditorProps,
  EditListItem,
  GridSelection,
  Item,
} from '@glideapps/glide-data-grid';

import type { ArrayLike } from '~/framework/array-like';
import type { ColumnHeading } from '~/modules/application/types';

type GridColumnName = `col${number}`;

type DatasetData<T extends string | number = string | number> = {
  id: string;
  title: string;
  ext: string;
  rowData: ArrayLike<ArrayLike<T>>;
  colData: ArrayLike<ArrayLike<T>>;
};

type ColumnChanges = {
  existingColumns: ColumnHeading[];
  deletedColumns: ColumnHeading[];
};

type Batch = {
  edits: EditListItem[];
  selection?: GridSelection;
  title?: string;
  isSaved: boolean;
};

type RecentEdits = {
  currentSelection?: GridSelection;
  isSaved: boolean;
  undoHistory: Batch[];
  redoHistory: Batch[];
  canUndo: boolean;
  canRedo: boolean;
  isApplyingUndo: boolean;
  isApplyingRedo: boolean;
  undo: () => { cell: Item }[] | undefined;
  redo: () => { cell: Item }[] | undefined;
  save: () => void;
};

type GridData = {
  id: DatasetData['id'];
  title: DatasetData['title'];
  renameDataset: (title: string) => void;
  ext: DatasetData['ext'];
  rowData: DatasetData['rowData'];
  colData: DatasetData['colData'];
  onCellEdited: DataEditorProps['onCellEdited'];
  onCellsEdited: DataEditorProps['onCellsEdited'];
  overwriteData: (data: DatasetData) => void;
  getContent: DataEditorProps['getCellContent'];
  getColumnChanges: (columns: ColumnHeading[]) => ColumnChanges;
  recentEdits: RecentEdits;
  onGridSelectionChange: DataEditorProps['onGridSelectionChange'];
};

export type { Batch, ColumnChanges, DatasetData, GridColumnName, GridData };
