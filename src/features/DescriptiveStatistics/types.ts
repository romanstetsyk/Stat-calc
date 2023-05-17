import { GridColumnName } from "../../Types";
import { SampleStatisticsEnum } from "../../components/DataTable";

export type DisplayOptions = "form" | "result";

export type TForm = {
  columns: false | GridColumnName | GridColumnName[];
  options: SampleStatisticsEnum[];
};
