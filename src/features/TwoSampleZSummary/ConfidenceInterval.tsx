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
  const { xbar1, stdev1, n1, xbar2, stdev2, n2, level } = formSummary;

  const xdiff = Number(xbar1) - Number(xbar2);
  const stderr = Math.sqrt((+stdev1) ** 2 / +n1 + (+stdev2) ** 2 / +n2);
  const zcrit = -1 * quantile((1 - Number(level)) / 2, 0, 1);
  const me = zcrit * stderr;
  const ll = xdiff - me;
  const ul = xdiff + me;

  const sampleStatisticsData = [
    {
      "": "Sample 1",
      [SSEnum.N]: Number(n1),
      [SSEnum.Xbar]: Number(xbar1),
      [SSEnum.SStdev]: Number(stdev1),
    },
    {
      "": "Sample 2",
      [SSEnum.N]: Number(n2),
      [SSEnum.Xbar]: Number(xbar2),
      [SSEnum.SStdev]: Number(stdev2),
    },
  ];

  const confidenceIntervalData = [
    {
      "": "mu1 - mu2",
      [CIEnum.Level]: Number(level),
      [CIEnum.Zcrit]: zcrit,
      [CIEnum.Me]: me,
      [CIEnum.LL]: ll,
      [CIEnum.UL]: ul,
      [SSEnum.Stderr]: stderr,
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
        stats={[
          CIEnum.Level,
          CIEnum.Zcrit,
          SSEnum.Stderr,
          CIEnum.Me,
          CIEnum.LL,
          CIEnum.UL,
        ]}
      />
    </>
  );
};
