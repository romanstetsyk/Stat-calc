import mean from "@stdlib/stats-base-mean";
import stdev from "@stdlib/stats-base-stdev";
import quantile from "@stdlib/stats-base-dists-normal-quantile";
import { CIColumns, SampleStatistics, TForm } from "./types";
import { DataTable, DataTableRow } from "../../components/DataTable";
import { isFiniteNumberString } from "../../utils/assertions";
import { useContext } from "react";
import { DataColumnsContext } from "../../contexts/DataColumnsContext";

const DECIMAL = 6;

type Props = {
  formSummary: TForm;
};

export const ConfidenceInterval = ({ formSummary }: Props) => {
  const { columnData } = useContext(DataColumnsContext);

  const { sample1, stdev1, sample2, stdev2, level } = formSummary;

  if (!sample1 || !sample2) return null;

  const arrOfNums1 = columnData[sample1]
    .filter(isFiniteNumberString)
    .map(Number);
  const n1 = arrOfNums1.length;
  const xbar1 = mean(n1, arrOfNums1, 1);
  const stdevApprox1 = stdev1 ? Number(stdev1) : stdev(n1, 1, arrOfNums1, 1);

  const arrOfNums2 = columnData[sample2]
    .filter(isFiniteNumberString)
    .map(Number);
  const n2 = arrOfNums2.length;
  const xbar2 = mean(n2, arrOfNums2, 1);
  const stdevApprox2 = stdev2 ? Number(stdev2) : stdev(n2, 1, arrOfNums2, 1);

  const xdiff = xbar1 - xbar2;
  const stderr1 = stdevApprox1 / Math.sqrt(n1);
  const stderr2 = stdevApprox2 / Math.sqrt(n2);
  const stderrPooled = Math.sqrt(
    stdevApprox1 ** 2 / n1 + stdevApprox2 ** 2 / n2
  );
  const zcrit = -1 * quantile((1 - Number(level)) / 2, 0, 1);
  const me = zcrit * stderrPooled;
  const ll = xdiff - me;
  const ul = xdiff + me;

  const sampleStatisticsData: DataTableRow<SampleStatistics, "">[] = [
    {
      "": "Sample 1",
      N: n1.toString(),
      Mean: xbar1.toFixed(DECIMAL),
      "Known Stdev": stdev1 ? stdev1 : stdevApprox1.toFixed(DECIMAL),
      "Std.Err": stderr1.toFixed(DECIMAL),
    },
    {
      "": "Sample 2",
      N: n2.toString(),
      Mean: xbar2.toFixed(DECIMAL),
      "Known Stdev": stdev2 ? stdev2 : stdevApprox2.toFixed(DECIMAL),
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
