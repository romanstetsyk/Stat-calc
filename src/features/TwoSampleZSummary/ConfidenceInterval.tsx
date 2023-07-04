import quantile from "@stdlib/stats-base-dists-normal-quantile";
import { DataTable, DataTableRow } from "~/components/DataTable";
import { CIColumns, SampleStatistics, TForm } from "./types";

const DECIMAL = 6;

type Props = {
  formSummary: TForm;
};

export const ConfidenceInterval = ({ formSummary }: Props) => {
  const { xbar1, stdev1, n1, xbar2, stdev2, n2, level } = formSummary;

  const xdiff = Number(xbar1) - Number(xbar2);
  const stderr1 = Number(stdev1) / Math.sqrt(Number(n1));
  const stderr2 = Number(stdev2) / Math.sqrt(Number(n2));
  const stderrPooled = Math.sqrt((+stdev1) ** 2 / +n1 + (+stdev2) ** 2 / +n2);
  const zcrit = -1 * quantile((1 - Number(level)) / 2, 0, 1);
  const me = zcrit * stderrPooled;
  const ll = xdiff - me;
  const ul = xdiff + me;

  const sampleStatisticsData: DataTableRow<SampleStatistics, "">[] = [
    {
      "": "Sample 1",
      N: n1,
      Mean: xbar1,
      "Known Stdev": stdev1,
      "Std.Err": stderr1.toFixed(DECIMAL),
    },
    {
      "": "Sample 2",
      N: n2,
      Mean: xbar2,
      "Known Stdev": stdev2,
      "Std.Err": stderr2.toFixed(DECIMAL),
    },
  ];

  const confidenceIntervalData: DataTableRow<CIColumns, "">[] = [
    {
      "": "mu1 - mu2",
      Level: level,
      "Z-crit": zcrit.toFixed(DECIMAL),
      "M.E.": me.toFixed(DECIMAL),
      "L.Limit": ll.toFixed(DECIMAL),
      "U.Limit": ul.toFixed(DECIMAL),
      "Std.Err.": stderrPooled.toFixed(DECIMAL),
    },
  ];

  return (
    <>
      <p>Sample Statistics</p>
      <DataTable<SampleStatistics, "">
        data={sampleStatisticsData}
        stats={["", "N", "Mean", "Known Stdev", "Std.Err"]}
      />
      <p>Confidence Interval</p>
      <DataTable<CIColumns, "">
        data={confidenceIntervalData}
        stats={[
          "",
          "Level",
          "Z-crit",
          "Std.Err.",
          "M.E.",
          "L.Limit",
          "U.Limit",
        ]}
      />
    </>
  );
};
