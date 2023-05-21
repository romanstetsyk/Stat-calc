import quantile from "@stdlib/stats-base-dists-normal-quantile";
import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { CIColumns, HTColumns, SampleStatistics, TForm } from "./types";
import { DataTable, DataTableRow } from "../../components/DataTable";
import { HypothesisTestNotation } from "../../components/HypothesisTestNotation";

const DECIMAL = 6;

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

  const sampleStatisticsData: DataTableRow<SampleStatistics>[] = [
    {
      N: n,
      Mean: xbar,
      "Known Stdev": stdev,
      "Std.Err": stderr.toFixed(DECIMAL),
    },
  ];

  const hypothesisTestData: DataTableRow<HTColumns>[] = [
    {
      Alpha: alpha,
      "Z-crit": zcrit.toFixed(DECIMAL),
      "Z-stat": zstat.toFixed(DECIMAL),
      "P-value": pvalue.toFixed(DECIMAL),
    },
  ];

  const me = zcrit * stderr;
  const ll = Number(xbar) - me;
  const ul = Number(xbar) + me;

  const confidenceIntervalData: DataTableRow<CIColumns>[] = [
    {
      Level: ciLevel.toString(),
      "Z-crit": zcrit.toFixed(DECIMAL),
      "M.E.": me.toFixed(DECIMAL),
      "L.Limit": ll.toFixed(DECIMAL),
      "U.Limit": ul.toFixed(DECIMAL),
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
      <DataTable<SampleStatistics>
        data={sampleStatisticsData}
        stats={["N", "Mean", "Known Stdev", "Std.Err"]}
      />
      <p>Hypothesis Test Result</p>
      <DataTable<HTColumns>
        data={hypothesisTestData}
        stats={["Alpha", "Z-crit", "Z-stat", "P-value"]}
      />
      <p>Confidence Interval</p>
      <DataTable<CIColumns>
        data={confidenceIntervalData}
        stats={["Level", "Z-crit", "M.E.", "L.Limit", "U.Limit"]}
      />
    </>
  );
};
