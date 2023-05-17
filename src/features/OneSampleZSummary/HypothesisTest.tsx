import quantile from "@stdlib/stats-base-dists-normal-quantile";
import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { TForm } from "./types";
import {
  SampleStatisticsEnum as SSEnum,
  ConfidenceIntervalEnum as CIEnum,
  HypothesisTestEnum as HTEnum,
  DataTable,
} from "../../components/DataTable";
import { HypothesisTestNotation } from "../../components/HypothesisTestNotation";

type Props = {
  formSummary: TForm;
};

export const HypothesisTest = ({ formSummary }: Props) => {
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

  const hypothesisTestData = [
    {
      "": "Sample 1",
      [HTEnum.Alpha]: Number(alpha),
      [HTEnum.Zcrit]: zcrit,
      [HTEnum.Zstat]: zstat,
      [HTEnum.Pvalue]: pvalue,
    },
  ];

  const me = zcrit * stderr;
  const ll = Number(xbar) - me;
  const ul = Number(xbar) + me;

  const confidenceIntervalData = [
    {
      "": "Sample 1",
      [CIEnum.Level]: ciLevel,
      [CIEnum.Zcrit]: zcrit,
      [CIEnum.Me]: me,
      [CIEnum.LL]: ll,
      [CIEnum.UL]: ul,
    },
  ];

  return (
    <>
      <HypothesisTestNotation
        mu0dir={mu0dir}
        mu1dir={mu1dir}
        mu0val={mu0val}
        mu1val={mu1val}
      />

      <p>Sample Data</p>
      <DataTable
        data={sampleStatisticsData}
        stats={[SSEnum.N, SSEnum.Xbar, SSEnum.SStdev, SSEnum.Stderr]}
      />
      <p>Hypothesis Test Result</p>
      <DataTable
        data={hypothesisTestData}
        stats={[HTEnum.Alpha, HTEnum.Zcrit, HTEnum.Zstat, HTEnum.Pvalue]}
      />
      <p>Confidence Interval</p>
      <DataTable
        data={confidenceIntervalData}
        stats={[CIEnum.Level, CIEnum.Zcrit, CIEnum.Me, CIEnum.LL, CIEnum.UL]}
      />
    </>
  );
};
