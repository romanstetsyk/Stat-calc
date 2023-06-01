import quantile from "@stdlib/stats-base-dists-normal-quantile";
import mean from "@stdlib/stats-base-mean";
import stdev from "@stdlib/stats-base-stdev";
import cdf from "@stdlib/stats-base-dists-normal-cdf";
import { CIColumns, HTColumns, SampleStatistics, TForm } from "./types";
import { GridColumnName } from "../../Types";
import { DataTable, DataTableRow } from "../../components/DataTable";
import {
  HypothesisNotation,
  PopulationMean,
} from "../../components/HypothesisNotation";
import { parseNumber } from "../../utils/parseNumber";
import { getVarName, getVarValues } from "../../utils/getColumnNameAndValues";
import { isFiniteNumberString } from "../../utils/assertions";
import { useContext } from "react";
import { DataColumnsContext } from "../../contexts/DataColumnsContext";

const DECIMAL = 6;

type Props = {
  formSummary: TForm;
};

export const HypothesisTest = ({ formSummary }: Props) => {
  const cols = useContext(DataColumnsContext);

  const { columns, alternative, nullValue, alpha, knownStdev, withLabel } =
    formSummary;

  const rows: DataTableRow<SampleStatistics | CIColumns | HTColumns, "">[] = (
    columns as Array<GridColumnName>
  ).map((colHeader) => {
    const varName = getVarName(cols, colHeader, withLabel);
    const varValues = getVarValues(cols, colHeader, withLabel);
    const arrOfNums = varValues.filter(isFiniteNumberString).map(Number);
    const n = arrOfNums.length;
    const xbar = mean(n, arrOfNums, 1);
    const stdevApprox = knownStdev
      ? Number(knownStdev)
      : stdev(n, 1, arrOfNums, 1);
    const stderr = stdevApprox / Math.sqrt(n);
    const zstat = (xbar - Number(nullValue)) / stderr;

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

    const me = zcrit * stderr;
    const ll = Number(xbar) - me;
    const ul = Number(xbar) + me;

    const rowData: DataTableRow<SampleStatistics | CIColumns | HTColumns, ""> =
      {
        "": varName,
        N: n.toString(),
        Mean: xbar.toFixed(DECIMAL),
        "Known Stdev": stdevApprox.toFixed(DECIMAL),
        "Std.Err": stderr.toFixed(DECIMAL),
        Level: parseNumber(ciLevel),
        "Z-crit": zcrit.toFixed(DECIMAL),
        "M.E.": me.toFixed(DECIMAL),
        "L.Limit": ll.toFixed(DECIMAL),
        "U.Limit": ul.toFixed(DECIMAL),
        Alpha: parseNumber(alpha),
        "Z-stat": zstat.toFixed(DECIMAL),
        "P-value": pvalue.toFixed(DECIMAL),
      };

    return rowData;
  });

  return (
    <>
      <HypothesisNotation
        param={<PopulationMean />}
        h1dir={alternative}
        h1val={parseNumber(nullValue)}
      />

      <p>Sample Data</p>
      <DataTable<SampleStatistics, "">
        data={rows}
        stats={["", "N", "Mean", "Known Stdev", "Std.Err"]}
      />
      <p>Hypothesis Test Result</p>
      <DataTable<HTColumns, "">
        data={rows}
        stats={["", "Alpha", "Z-crit", "Z-stat", "P-value"]}
      />
      {!(alternative !== "notEqual" && Number(alpha) >= 0.5) && (
        <>
          <p>Confidence Interval</p>
          <DataTable<CIColumns, "">
            data={rows}
            stats={["", "Level", "Z-crit", "M.E.", "L.Limit", "U.Limit"]}
          />
        </>
      )}
    </>
  );
};
