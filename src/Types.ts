export type GridColumnName = `col${number}`;

export type ColumnValues = {
  [key: GridColumnName]: string[];
};

export type GridRow = {
  [colName: GridColumnName]: string;
};

export const H0Sign = { eq: "\u003D", ge: "\u2265", le: "\u2264" } as const;
export type H0Sign = keyof typeof H0Sign;

export const H1Sign = { ne: "\u2260", lt: "\u003C", gt: "\u003E" } as const;
export type H1Sign = keyof typeof H1Sign;

export const HypothesisSignMap: Record<H1Sign, H0Sign> = {
  ne: "eq",
  gt: "le",
  lt: "ge",
};

export const enum Perform {
  HypothesisTest = "hypothesisTest",
  ConfidenceInerval = "confidenceInterval",
}

export type DisplayOptions = "form" | "result";
