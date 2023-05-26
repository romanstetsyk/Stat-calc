import quantile from "@stdlib/stats-base-dists-normal-quantile";
import mean from "@stdlib/stats-base-mean";
import stdev from "@stdlib/stats-base-stdev";
import { CIColumns, SampleStatistics, TForm } from "./types";
import { ColumnValues, GridColumnName } from "../../Types";
import { DataTable, DataTableRow } from "../../components/DataTable";
import { getVarName, getVarValues } from "../../utils/getColumnNameAndValues";

const DECIMAL = 6;

type Props = {
  formSummary: TForm;
  cols: ColumnValues;
};

export const ConfidenceInterval = ({ formSummary, cols }: Props) => {
  const { columns, level, pstdev, withLabel } = formSummary;

  const rows: DataTableRow<SampleStatistics | CIColumns, "">[] = (
    columns as Array<GridColumnName>
  ).map((colHeader) => {
    const varName = getVarName(cols, colHeader, withLabel);
    const varValues = getVarValues(cols, colHeader, withLabel);
    const arrOfNums = varValues.map(Number).filter(Number.isFinite);
    const n = arrOfNums.length;
    const xbar = mean(n, arrOfNums, 1);
    const stdevApprox = pstdev ? Number(pstdev) : stdev(n, 1, arrOfNums, 1);
    const stderr = stdevApprox / Math.sqrt(n);
    const zcrit = -1 * quantile((1 - Number(level)) / 2, 0, 1);
    const me = zcrit * stderr;
    const ll = Number(xbar) - me;
    const ul = Number(xbar) + me;

    const rowData: DataTableRow<SampleStatistics | CIColumns, ""> = {
      "": varName,
      N: n.toString(),
      Mean: xbar.toFixed(DECIMAL),
      "Known Stdev": stdevApprox.toFixed(DECIMAL),
      "Std.Err": stderr.toFixed(DECIMAL),
      Level: level,
      "Z-crit": zcrit.toFixed(DECIMAL),
      "M.E.": me.toFixed(DECIMAL),
      "L.Limit": ll.toFixed(DECIMAL),
      "U.Limit": ul.toFixed(DECIMAL),
    };
    return rowData;
  });

  return (
    <>
      <p>Sample Statistics</p>
      <DataTable<SampleStatistics, "">
        data={rows}
        stats={["", "N", "Mean", "Known Stdev", "Std.Err"]}
      />
      <p>Confidence Interval</p>
      <DataTable<CIColumns, "">
        data={rows}
        stats={["", "Level", "Z-crit", "M.E.", "L.Limit", "U.Limit"]}
      />
    </>
  );
};
