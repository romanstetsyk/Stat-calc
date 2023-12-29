import type {
  EditableGridCell,
  GridCell,
  Item,
} from '@glideapps/glide-data-grid';

import type { ArrayLike } from '~/framework/array-like';
import type { ColumnHeading } from '~/modules/application/types';

type GridColumnName = `col${number}`;

type OnCellsEditedParams = readonly {
  location: Item;
  value: EditableGridCell;
}[];

type OverwriteRowsParameters = {
  datasetId: string;
  newRows: ArrayLike<ArrayLike<string | number>>;
  newCols: ArrayLike<ArrayLike<string | number>>;
};

type ColumnChanges = {
  existingColumns: ColumnHeading[];
  deletedColumns: ColumnHeading[];
};

type GridData = {
  datasetId: string;
  rowData: ArrayLike<ArrayLike<string | number>>;
  colData: ArrayLike<ArrayLike<string | number>>;
  onCellsEdited: (newValues: OnCellsEditedParams) => boolean;
  overwriteRows: (arg: OverwriteRowsParameters) => void;
  getContent: (cell: Item) => GridCell;
  getColumnChanges: (columns: ColumnHeading[]) => ColumnChanges;
};

export type {
  ColumnChanges,
  GridColumnName,
  GridData,
  OnCellsEditedParams,
  OverwriteRowsParameters,
};
