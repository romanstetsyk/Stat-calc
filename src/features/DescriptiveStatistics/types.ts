import { GridColumnName } from "../../Types";
import { SampleStatisticsEnum } from "../../components/SampleStatisticsTable";

export type DisplayOptions = "form" | "result";

export type TForm = {
  columns: false | GridColumnName | GridColumnName[];
  options: SampleStatisticsEnum[];
};
