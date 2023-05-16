import quantile from "@stdlib/stats-base-dists-normal-quantile";
import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { TForm } from "./types";
import { HypothesisTestTable } from "./Tables/HypothesisTestTable";
import { ConfidenceIntervalTable } from "./Tables/ConfidenceIntervalTable";
import {
  SampleStatisticsEnum as SSEnum,
  SampleStatisticsTable,
} from "../../components/SampleStatisticsTable";

// ASCII codes of comparison signs
const codes = {
  eq: 61,
  ge: 8805,
  le: 8804,
  ne: 8800,
  gt: 62,
  lt: 60,
};

type IProps = {
  formSummary: TForm;
};

function HypothesisTest({ formSummary }: IProps) {
  const { xbar, stdev, n, mu0dir, mu0val, mu1dir, mu1val, alpha } = formSummary;

  const stderr = Number(stdev) / Math.sqrt(Number(n));
  const zstat = (Number(xbar) - Number(mu0val)) / stderr;

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

  const sampleStatisticsData = [
    {
      "": "Sample 1",
      [SSEnum.N]: Number(n),
      [SSEnum.Xbar]: Number(xbar),
      [SSEnum.SStdev]: Number(stdev),
      [SSEnum.Stderr]: stderr,
    },
  ];

  const me = zcrit * stderr;
  const ll = Number(xbar) - me;
  const ul = Number(xbar) + me;

  return (
    <>
      <p>
        H<sub>0</sub>: &mu; {String.fromCharCode(codes[mu0dir])} {mu0val}
      </p>
      <p>
        H<sub>a</sub>: &mu; {String.fromCharCode(codes[mu1dir])} {mu1val}
      </p>
      <SampleStatisticsTable
        data={sampleStatisticsData}
        stats={[SSEnum.N, SSEnum.Xbar, SSEnum.SStdev, SSEnum.Stderr]}
      />
      <HypothesisTestTable
        zcrit={zcrit}
        zstat={zstat}
        pvalue={pvalue}
        alpha={Number(alpha)}
      />

      <ConfidenceIntervalTable
        level={ciLevel}
        zcrit={zcrit}
        me={me}
        ll={ll}
        ul={ul}
      />
    </>
  );
}

export { HypothesisTest };
