import quantile from "@stdlib/stats-base-dists-normal-quantile";
import mean from "@stdlib/stats-base-mean";
import stdev from "@stdlib/stats-base-stdev";
import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { TForm } from "./types";
import { ColumnValues, GridColumnName } from "../../Types";
import {
  SampleStatisticsEnum as SSEnum,
  ConfidenceIntervalEnum as CIEnum,
  HypothesisTestEnum as HTEnum,
  DataTable,
} from "../../components/DataTable";

// ASCII codes of comparison signs
const codes = {
  eq: 61,
  ge: 8805,
  le: 8804,
  ne: 8800,
  gt: 62,
  lt: 60,
};

type Props = {
  formSummary: TForm;
  cols: ColumnValues;
};

export const HypothesisTest = ({ formSummary, cols }: Props) => {
  const { columns, mu0dir, mu0val, mu1dir, mu1val, alpha } = formSummary;

  const rows = (columns as Array<GridColumnName>).map((colName) => {
    const arrOfNums = cols[colName].map(Number).filter(Number.isFinite);
    const n = arrOfNums.length;
    const xbar = mean(n, arrOfNums, 1);
    const sampleStdev = stdev(n, 1, arrOfNums, 1);
    const stderr = sampleStdev / Math.sqrt(n);
    const zstat = (xbar - Number(mu0val)) / stderr;

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

    const me = zcrit * stderr;
    const ll = Number(2) - me;
    const ul = Number(2) + me;

    return {
      "": colName,
      [SSEnum.N]: n,
      [SSEnum.Xbar]: xbar,
      [SSEnum.SStdev]: sampleStdev,
      [SSEnum.Stderr]: stderr,
      [CIEnum.Level]: Number(ciLevel),
      [CIEnum.Zcrit]: zcrit,
      [CIEnum.Me]: me,
      [CIEnum.LL]: ll,
      [CIEnum.UL]: ul,
      [HTEnum.Alpha]: Number(alpha),
      [HTEnum.Zcrit]: zcrit,
      [HTEnum.Zstat]: zstat,
      [HTEnum.Pvalue]: pvalue,
    };
  });

  return (
    <>
      <p>
        H<sub>0</sub>: &mu; {String.fromCharCode(codes[mu0dir])} {mu0val}
      </p>
      <p>
        H<sub>a</sub>: &mu; {String.fromCharCode(codes[mu1dir])} {mu1val}
      </p>
      <p>Sample Data</p>
      <DataTable
        data={rows}
        stats={[SSEnum.N, SSEnum.Xbar, SSEnum.SStdev, SSEnum.Stderr]}
      />
      <p>Hypothesis Test Result</p>
      <DataTable
        data={rows}
        stats={[HTEnum.Alpha, HTEnum.Zcrit, HTEnum.Zstat, HTEnum.Pvalue]}
      />
      <p>Confidence Interval</p>
      <DataTable
        data={rows}
        stats={[CIEnum.Level, CIEnum.Zcrit, CIEnum.Me, CIEnum.LL, CIEnum.UL]}
      />
    </>
  );
};
