export type GridColumnName = `col${number}`;

export type ColumnValues = {
  [key: GridColumnName]: string[];
};

export interface GridRow {
  [colName: GridColumnName]: string;
}
