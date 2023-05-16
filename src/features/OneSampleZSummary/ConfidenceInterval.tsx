import quantile from "@stdlib/stats-base-dists-normal-quantile";
import { TForm } from "./types";
import { ConfidenceIntervalTable } from "./Tables/ConfidenceIntervalTable";
import {
  SampleStatisticsEnum as SSEnum,
  SampleStatisticsTable,
} from "../../components/SampleStatisticsTable";

type Props = {
  formSummary: TForm;
};

function ConfidenceInterval({ formSummary }: Props) {
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

  return (
    <>
      <SampleStatisticsTable
        data={sampleStatisticsData}
        stats={[SSEnum.N, SSEnum.Xbar, SSEnum.SStdev, SSEnum.Stderr]}
      />
      <ConfidenceIntervalTable
        level={Number(level)}
        zcrit={zcrit}
        me={me}
        ll={ll}
        ul={ul}
      />
    </>
  );
}

export { ConfidenceInterval };
