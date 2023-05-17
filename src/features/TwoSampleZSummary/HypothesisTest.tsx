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
  const {
    xbar1,
    stdev1,
    n1,
    xbar2,
    stdev2,
    n2,
    mu0dir,
    mu0val,
    mu1dir,
    mu1val,
    alpha,
  } = formSummary;

  const xdiff = Number(xbar1) - Number(xbar2);
  const stderr = Math.sqrt((+stdev1) ** 2 / +n1 + (+stdev2) ** 2 / +n2);
  const zstat = (xdiff - Number(mu0val)) / stderr;

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

  const hypothesisTestData = [
    {
      "": "mu1 - mu2",
      [HTEnum.Alpha]: Number(alpha),
      [HTEnum.Zcrit]: zcrit,
      [SSEnum.Stderr]: stderr,
      [HTEnum.Zstat]: zstat,
      [HTEnum.Pvalue]: pvalue,
    },
  ];

  const me = zcrit * stderr;
  const ll = xdiff - me;
  const ul = xdiff + me;

  const confidenceIntervalData = [
    {
      "": "mu1 - mu2",
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
        stats={[SSEnum.N, SSEnum.Xbar, SSEnum.SStdev]}
      />
      <p>Hypothesis Test Result</p>
      <DataTable
        data={hypothesisTestData}
        stats={[
          HTEnum.Alpha,
          HTEnum.Zcrit,
          SSEnum.Stderr,
          HTEnum.Zstat,
          HTEnum.Pvalue,
        ]}
      />
      <p>Confidence Interval</p>
      <DataTable
        data={confidenceIntervalData}
        stats={[CIEnum.Level, CIEnum.Zcrit, CIEnum.Me, CIEnum.LL, CIEnum.UL]}
      />
    </>
  );
};
