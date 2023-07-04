import { ColumnValues, GridColumnName } from "~/Types";

export const getVarName = (
  cols: ColumnValues,
  colHeader: GridColumnName,
  withLabel: boolean
): string => {
  return withLabel ? `${cols[colHeader][0]} (${colHeader})` : colHeader;
};

export const getVarValues = (
  cols: ColumnValues,
  colHeader: GridColumnName,
  withLabel: boolean
): string[] => {
  return withLabel ? cols[colHeader].slice(1) : cols[colHeader];
};
