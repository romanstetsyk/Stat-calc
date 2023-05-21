import quantile from "@stdlib/stats-base-dists-normal-quantile";
import mean from "@stdlib/stats-base-mean";
import stdev from "@stdlib/stats-base-stdev";
import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { CIColumns, HTColumns, SampleStatistics, TForm } from "./types";
import { ColumnValues, GridColumnName } from "../../Types";
import { DataTable, DataTableRow } from "../../components/DataTable";
import {
  HypothesisNotation,
  PopulationMean,
} from "../../components/HypothesisNotation";

const DECIMAL = 6;

type Props = {
  formSummary: TForm;
  cols: ColumnValues;
};

export const HypothesisTest = ({ formSummary, cols }: Props) => {
  const { columns, mu0dir, mu0val, mu1dir, mu1val, alpha, pstdev } =
    formSummary;

  const rows: DataTableRow<SampleStatistics | CIColumns | HTColumns, "">[] = (
    columns as Array<GridColumnName>
  ).map((colName) => {
    const arrOfNums = cols[colName].map(Number).filter(Number.isFinite);
    const n = arrOfNums.length;
    const xbar = mean(n, arrOfNums, 1);
    const stdevApprox = pstdev ? Number(pstdev) : stdev(n, 1, arrOfNums, 1);
    const stderr = stdevApprox / Math.sqrt(n);
    const zstat = (xbar - Number(mu0val)) / stderr;

    let ciLevel: number;
    let zcrit: number;
    let pvalue: number;
    switch (mu1dir) {
      case "ne":
        ciLevel = 1 - Number(alpha);
        zcrit = -quantile(Number(alpha) / 2, 0, 1);
        pvalue = 2 * cdf(-Math.abs(zstat), 0, 1);
        break;
      case "gt":
        ciLevel = 1 - 2 * Number(alpha);
        zcrit = -quantile(Number(alpha), 0, 1);
        pvalue = 1 - cdf(zstat, 0, 1);
        break;
      case "lt":
        ciLevel = 1 - 2 * Number(alpha);
        zcrit = quantile(Number(alpha), 0, 1);
        pvalue = cdf(zstat, 0, 1);
        break;
      default:
        throw new Error("Invalid hypothesis direction");
    }

    const me = zcrit * stderr;
    const ll = Number(2) - me;
    const ul = Number(2) + me;

    const rowData: DataTableRow<SampleStatistics | CIColumns | HTColumns, ""> =
      {
        "": colName,
        N: n.toString(),
        Mean: xbar.toFixed(DECIMAL),
        "Known Stdev": stdevApprox.toFixed(DECIMAL),
        "Std.Err": stderr.toFixed(DECIMAL),
        Level: ciLevel.toString(),
        "Z-crit": zcrit.toFixed(DECIMAL),
        "M.E.": me.toFixed(DECIMAL),
        "L.Limit": ll.toFixed(DECIMAL),
        "U.Limit": ul.toFixed(DECIMAL),
        Alpha: alpha,
        "Z-stat": zstat.toFixed(DECIMAL),
        "P-value": pvalue.toFixed(DECIMAL),
      };

    return rowData;
  });

  return (
    <>
      <HypothesisNotation
        param={<PopulationMean />}
        h0dir={mu0dir}
        h1dir={mu1dir}
        h0val={mu0val}
        h1val={mu1val}
      />

      <p>Sample Data</p>
      <DataTable<SampleStatistics, "">
        data={rows}
        stats={["", "N", "Mean", "Known Stdev", "Std.Err"]}
      />
      <p>Hypothesis Test Result</p>
      <DataTable<HTColumns, "">
        data={rows}
        stats={["", "Alpha", "Z-crit", "Z-stat", "P-value"]}
      />
      <p>Confidence Interval</p>
      <DataTable<CIColumns, "">
        data={rows}
        stats={["", "Level", "Z-crit", "M.E.", "L.Limit", "U.Limit"]}
      />
    </>
  );
};
