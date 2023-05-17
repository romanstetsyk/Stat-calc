import quantile from "@stdlib/stats-base-dists-normal-quantile";
import { TForm } from "./types";
import {
  SampleStatisticsEnum as SSEnum,
  ConfidenceIntervalEnum as CIEnum,
  DataTable,
} from "../../components/DataTable";

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

  const sampleStatisticsData = [
    {
      "": "Sample 1",
      [SSEnum.N]: Number(n),
      [SSEnum.Xbar]: Number(xbar),
      [SSEnum.SStdev]: Number(stdev),
      [SSEnum.Stderr]: stderr,
    },
  ];

  const confidenceIntervalData = [
    {
      "": "Sample 1",
      [CIEnum.Level]: Number(level),
      [CIEnum.Zcrit]: zcrit,
      [CIEnum.Me]: me,
      [CIEnum.LL]: ll,
      [CIEnum.UL]: ul,
    },
  ];

  return (
    <>
      <p>Sample Statistics</p>
      <DataTable
        data={sampleStatisticsData}
        stats={[SSEnum.N, SSEnum.Xbar, SSEnum.SStdev, SSEnum.Stderr]}
      />
      <p>Confidence Interval</p>
      <DataTable
        data={confidenceIntervalData}
        stats={[CIEnum.Level, CIEnum.Zcrit, CIEnum.Me, CIEnum.LL, CIEnum.UL]}
      />
    </>
  );
};
