import quantile from "@stdlib/stats-base-dists-normal-quantile";
import { CIColumns, TForm, SampleStatistics } from "./types";
import { DataTable, DataTableRow } from "../../components/DataTable";

const DECIMAL = 6;

type Props = {
  formSummary: TForm;
};

export const ConfidenceInterval = ({ formSummary }: Props) => {
  const { xbar, stdev, n, level } = formSummary;

  const stderr = Number(stdev) / Math.sqrt(Number(n));
  const zcrit = -1 * quantile((1 - Number(level)) / 2, 0, 1);
  const me = zcrit * stderr;
  const ll = Number(xbar) - me;
  const ul = Number(xbar) + me;

  const sampleStatisticsData: DataTableRow<SampleStatistics>[] = [
    {
      N: n,
      Mean: xbar,
      "S.Stdev": stdev,
      "Std.Err": stderr.toFixed(DECIMAL),
    },
  ];

  const confidenceIntervalData: DataTableRow<CIColumns>[] = [
    {
      Level: level,
      "Z-crit": zcrit.toFixed(DECIMAL),
      "M.E.": me.toFixed(DECIMAL),
      "L.Limit": ll.toFixed(DECIMAL),
      "U.Limit": ul.toFixed(DECIMAL),
    },
  ];

  return (
    <>
      <p>Sample Statistics</p>
      <DataTable<SampleStatistics>
        data={sampleStatisticsData}
        stats={["N", "Mean", "S.Stdev", "Std.Err"]}
      />
      <p>Confidence Interval</p>
      <DataTable<CIColumns>
        data={confidenceIntervalData}
        stats={["Level", "Z-crit", "M.E.", "L.Limit", "U.Limit"]}
      />
    </>
  );
};
