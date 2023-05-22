import mean from "@stdlib/stats-base-mean";
import stdev from "@stdlib/stats-base-stdev";
import quantile from "@stdlib/stats-base-dists-normal-quantile";
import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { HTColumns, SampleStatistics, CIColumns, TForm } from "./types";
import { DataTable, DataTableRow } from "../../components/DataTable";
import {
  HypothesisNotation,
  PopulationMeanDiff,
} from "../../components/HypothesisNotation";
import { parseNumber } from "../../utils/parseNumber";
import { ColumnValues } from "../../Types";

const DECIMAL = 6;

type Props = {
  formSummary: TForm;
  cols: ColumnValues;
};

export const HypothesisTest = ({ formSummary, cols }: Props) => {
  const {
    sample1,
    stdev1,
    sample2,
    stdev2,
    mu0dir,
    mu0val,
    mu1dir,
    mu1val,
    alpha,
  } = formSummary;

  if (!sample1 || !sample2) return null;

  const arrOfNums1 = cols[sample1].map(Number).filter(Number.isFinite);
  const n1 = arrOfNums1.length;
  const xbar1 = mean(n1, arrOfNums1, 1);
  const stdevApprox1 = stdev1 ? Number(stdev1) : stdev(n1, 1, arrOfNums1, 1);

  const arrOfNums2 = cols[sample2].map(Number).filter(Number.isFinite);
  const n2 = arrOfNums2.length;
  const xbar2 = mean(n2, arrOfNums2, 1);
  const stdevApprox2 = stdev2 ? Number(stdev2) : stdev(n2, 1, arrOfNums2, 1);

  const xdiff = xbar1 - xbar2;
  const stderr1 = stdevApprox1 / Math.sqrt(n1);
  const stderr2 = stdevApprox2 / Math.sqrt(n2);
  const stderrPooled = Math.sqrt(
    stdevApprox1 ** 2 / n1 + stdevApprox2 ** 2 / n2
  );
  const zstat = (xdiff - Number(mu0val)) / stderrPooled;

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

  const hypothesisTestData: DataTableRow<HTColumns, "">[] = [
    {
      "": "mu1 - mu2",
      Alpha: parseNumber(alpha),
      "Z-crit": zcrit.toFixed(DECIMAL),
      "Std.Err.": stderrPooled.toFixed(DECIMAL),
      "Z-stat": zstat.toFixed(DECIMAL),
      "P-value": pvalue.toFixed(DECIMAL),
    },
  ];

  const me = zcrit * stderrPooled;
  const ll = xdiff - me;
  const ul = xdiff + me;

  const confidenceIntervalData: DataTableRow<CIColumns, "">[] = [
    {
      "": "mu1 - mu2",
      Level: parseNumber(ciLevel),
      "M.E.": me.toFixed(DECIMAL),
      "L.Limit": ll.toFixed(DECIMAL),
      "U.Limit": ul.toFixed(DECIMAL),
    },
  ];

  return (
    <>
      <HypothesisNotation
        param={<PopulationMeanDiff />}
        h0dir={mu0dir}
        h1dir={mu1dir}
        h0val={mu0val}
        h1val={mu1val}
      />

      <p>Sample Data</p>
      <DataTable
        data={sampleStatisticsData}
        stats={["", "N", "Mean", "Known Stdev", "Std.Err"]}
      />
      <p>Hypothesis Test Result</p>
      <DataTable
        data={hypothesisTestData}
        stats={["", "Alpha", "Z-crit", "Std.Err.", "Z-stat", "P-value"]}
      />
      {!(mu1dir !== "ne" && Number(alpha) >= 0.5) && (
        <>
          <p>Confidence Interval</p>
          <DataTable
            data={confidenceIntervalData}
            stats={["", "Level", "M.E.", "L.Limit", "U.Limit"]}
          />
        </>
      )}
    </>
  );
};
