import quantile from "@stdlib/stats-base-dists-normal-quantile";
import mean from "@stdlib/stats-base-mean";
import stdev from "@stdlib/stats-base-stdev";
import { TForm } from "./types";
import { ColumnValues, GridColumnName } from "../../Types";
import {
  SampleStatisticsEnum as SSEnum,
  ConfidenceIntervalEnum as CIEnum,
  DataTable,
  DataTableRow,
} from "../../components/DataTable";

type Props = {
  formSummary: TForm;
  cols: ColumnValues;
};

export const ConfidenceInterval = ({ formSummary, cols }: Props) => {
  const { columns, level } = formSummary;

  const rows: DataTableRow[] = (columns as Array<GridColumnName>).map(
    (colName) => {
      const arrOfNums = cols[colName].map(Number).filter(Number.isFinite);
      const n = arrOfNums.length;
      const xbar = mean(n, arrOfNums, 1);
      const sampleStdev = stdev(n, 1, arrOfNums, 1);
      const stderr = sampleStdev / Math.sqrt(n);
      const zcrit = -1 * quantile((1 - Number(level)) / 2, 0, 1);
      const me = zcrit * stderr;
      const ll = Number(xbar) - me;
      const ul = Number(xbar) + me;

      const rowData: DataTableRow = {
        "": colName,
        [SSEnum.N]: n,
        [SSEnum.Xbar]: xbar,
        [SSEnum.SStdev]: sampleStdev,
        [SSEnum.Stderr]: stderr,
        [CIEnum.Level]: Number(level),
        [CIEnum.Zcrit]: zcrit,
        [CIEnum.Me]: me,
        [CIEnum.LL]: ll,
        [CIEnum.UL]: ul,
      };
      return rowData;
    }
  );

  return (
    <>
      <p>Sample Statistics</p>
      <DataTable
        data={rows}
        stats={[SSEnum.N, SSEnum.Xbar, SSEnum.SStdev, SSEnum.Stderr]}
      />
      <p>Confidence Interval</p>
      <DataTable
        data={rows}
        stats={[CIEnum.Level, CIEnum.Zcrit, CIEnum.Me, CIEnum.LL, CIEnum.UL]}
      />
    </>
  );
};
