import { GridColumnName } from "../../Types";

export type DisplayOptions = "form" | "result";

export type TFormSummary = {
  columns: false | GridColumnName | GridColumnName[];
};
