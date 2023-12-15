import type {
  EditableGridCell,
  GridCell,
  Item,
} from '@glideapps/glide-data-grid';

import type { ArrayLike } from '~/framework/array-like';

type GridColumnName = `col${number}`;

type OnCellsEditedParams = readonly {
  location: Item;
  value: EditableGridCell;
}[];

type OverwriteRowsParameters = {
  datasetId: string;
  newRows: ArrayLike<ArrayLike<string>>;
  newCols: ArrayLike<ArrayLike<string>>;
};

type GridData = {
  datasetId: string;
  rowData: ArrayLike<ArrayLike<string>>;
  colData: ArrayLike<ArrayLike<string>>;
  onCellsEdited: (newValues: OnCellsEditedParams) => boolean;
  overwriteRows: (arg: OverwriteRowsParameters) => void;
  getContent: (cell: Item) => GridCell;
};

export type {
  GridColumnName,
  GridData,
  OnCellsEditedParams,
  OverwriteRowsParameters,
};
