export type GridColumnName = `col${number}`;

export type ColumnValues = {
  [key: GridColumnName]: string[];
};

export type GridRow = {
  [colName: GridColumnName]: string;
};

export type H0Sign = "eq" | "ge" | "le";
export type H1Sign = "ne" | "lt" | "gt";

export const enum Perform {
  HypothesisTest = "hypothesisTest",
  ConfidenceInerval = "confidenceInterval",
}

export type DisplayOptions = "form" | "result";
