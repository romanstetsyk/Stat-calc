import type { DataEditorProps } from '@glideapps/glide-data-grid';

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

type GridData = {
  id: DatasetData['id'];
  title: DatasetData['title'];
  ext: DatasetData['ext'];
  rowData: DatasetData['rowData'];
  colData: DatasetData['colData'];
  onCellEdited: DataEditorProps['onCellEdited'];
  onCellsEdited: DataEditorProps['onCellsEdited'];
  overwriteData: (data: DatasetData) => void;
  getContent: DataEditorProps['getCellContent'];
  getColumnChanges: (columns: ColumnHeading[]) => ColumnChanges;
};

export type { ColumnChanges, DatasetData, GridColumnName, GridData };
