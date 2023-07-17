import { GridColumnName } from "~/Types";

export const createColName = (index: number): GridColumnName =>
  `col${index + 1}`;
