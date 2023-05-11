import quantile from "@stdlib/stats-base-dists-normal-quantile";
import { TForm } from "./types";
import { SampleStatisticsTable } from "./Tables/SampleStatisticsTable";
import { ConfidenceIntervalTable } from "./Tables/ConfidenceIntervalTable";

type IProps = {
  formSummary: TForm;
};

function ConfidenceInterval({ formSummary }: IProps) {
  const { xbar, stdev, n, level } = formSummary;

  const stderr = Number(stdev) / Math.sqrt(Number(n));
  const zcrit = -1 * quantile((1 - Number(level)) / 2, 0, 1);
  const me = zcrit * stderr;
  const ll = Number(xbar) - me;
  const ul = Number(xbar) + me;

  return (
    <>
      <SampleStatisticsTable xbar={xbar} stdev={stdev} stderr={stderr} n={n} />
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
