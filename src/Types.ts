export type GridColumnName = `col${number}`;

export type ColumnValues = {
  [key: GridColumnName]: string[];
};

export type GridRow = {
  [colName: GridColumnName]: string;
};
