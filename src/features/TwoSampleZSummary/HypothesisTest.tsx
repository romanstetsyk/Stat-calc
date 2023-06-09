import quantile from "@stdlib/stats-base-dists-normal-quantile";
import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { HTColumns, SampleStatistics, CIColumns, TForm } from "./types";
import { DataTable, DataTableRow } from "../../components/DataTable";
import {
  HypothesisNotation,
  PopulationMeanDiff,
} from "../../components/HypothesisNotation";
import { parseNumber } from "../../utils/parseNumber";

const DECIMAL = 6;

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
    alternative,
    nullValue,
    alpha,
  } = formSummary;

  const xdiff = Number(xbar1) - Number(xbar2);
  const stderr1 = Number(stdev1) / Math.sqrt(Number(n1));
  const stderr2 = Number(stdev2) / Math.sqrt(Number(n2));
  const stderrPooled = Math.sqrt((+stdev1) ** 2 / +n1 + (+stdev2) ** 2 / +n2);
  const zstat = (xdiff - Number(nullValue)) / stderrPooled;

  let ciLevel: number;
  let zcrit: number;
  let pvalue: number;
  switch (alternative) {
    case "notEqual":
      ciLevel = 1 - Number(alpha);
      zcrit = -quantile(Number(alpha) / 2, 0, 1);
      pvalue = 2 * cdf(-Math.abs(zstat), 0, 1);
      break;
    case "greaterThan":
      ciLevel = 1 - 2 * Number(alpha);
      zcrit = -quantile(Number(alpha), 0, 1);
      pvalue = 1 - cdf(zstat, 0, 1);
      break;
    case "lessThan":
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
      N: n1,
      Mean: xbar1,
      "Known Stdev": stdev1,
      "Std.Err": stderr1.toFixed(DECIMAL),
    },
    {
      "": "Sample 2",
      N: n2,
      Mean: xbar2,
      "Known Stdev": stdev2,
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
        h1dir={alternative}
        h1val={parseNumber(nullValue)}
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
      {!(alternative !== "notEqual" && Number(alpha) >= 0.5) && (
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
