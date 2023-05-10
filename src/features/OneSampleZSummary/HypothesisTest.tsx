import { useCallback, useMemo } from "react";
import DataEditor, {
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import quantile from "@stdlib/stats-base-dists-normal-quantile";
import cdf from "@stdlib/stats-base-dists-normal-cdf";

import { TForm } from "./types";

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

// Columns of hypothesis test table
enum HTTable {
  N = "n",
  Xbar = "Sample Mean",
  Stdev = "Std. Dev.",
  Stderr = "Std. Err.",
  Alpha = "Alpha",
  Zcrit = "Z-crit",
  ZStat = "Z-stat",
  PValue = "P-value",
}

type HTTableRow = {
  [key in HTTable]: string;
};

// Columns of confidence interval table
enum CITable {
  LL = "L.Limit",
  UL = "U.Limit",
}

type CITableRow = {
  [key in CITable]: number;
};

function HypothesisTest({ formSummary }: IProps) {
  const { xbar, stdev, n, mu0dir, mu0val, mu1dir, mu1val, alpha } = formSummary;

  const stderr = Number(stdev) / Math.sqrt(Number(n));
  const zstat = (Number(xbar) - Number(mu0val)) / stderr;

  let ciLevel: string;
  let zcrit: number;
  let pvalue: number;
  switch (mu1dir) {
    case "ne":
      ciLevel = `${100 * (1 - Number(alpha))}%`;
      zcrit = -quantile(Number(alpha) / 2, 0, 1);
      pvalue = 2 * cdf(-Math.abs(zstat), 0, 1);
      break;
    case "gt":
      ciLevel = `${100 * (1 - 2 * Number(alpha))}%`;
      zcrit = -quantile(Number(alpha), 0, 1);
      pvalue = 1 - cdf(zstat, 0, 1);
      break;
    case "lt":
      ciLevel = `${100 * (1 - 2 * Number(alpha))}%`;
      zcrit = quantile(Number(alpha), 0, 1);
      pvalue = cdf(zstat, 0, 1);
      break;
    default:
      throw new Error("Invalid hypothesis direction");
  }

  const ll = Number(xbar) - zcrit * stderr;
  const ul = Number(xbar) + zcrit * stderr;

  const columnHeaders: (GridColumn & { title: HTTable })[] = useMemo(() => {
    return Object.values(HTTable).map((e) => ({
      title: e,
      width: 100,
    }));
  }, []);

  let data: HTTableRow[] = [
    {
      [HTTable.N]: n,
      [HTTable.Xbar]: xbar,
      [HTTable.Stdev]: stdev,
      [HTTable.Stderr]: String(stderr),
      [HTTable.Zcrit]: String(zcrit),
      [HTTable.ZStat]: String(zstat),
      [HTTable.PValue]: String(pvalue),
      [HTTable.Alpha]: alpha,
    },
  ];

  const getContent = useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = data[row];
    // dumb but simple way to do this
    const indexes: (keyof HTTableRow)[] = columnHeaders.map(
      (col) => col.title as keyof HTTableRow
    );
    const d = dataRow[indexes[col]];
    return {
      kind: GridCellKind.Text,
      allowOverlay: true,
      readonly: false,
      displayData: d,
      data: d,
    };
  }, []);

  const CIHeaders: (GridColumn & { title: CITable })[] = useMemo(() => {
    return Object.values(CITable).map((e) => ({ title: e, width: 100 }));
  }, []);

  const CIData: CITableRow[] = [{ [CITable.LL]: ll, [CITable.UL]: ul }];

  const getCIContent = useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = CIData[row];
    const indexes: (keyof CITableRow)[] = CIHeaders.map(
      (col) => col.title as keyof CITableRow
    );
    const d = dataRow[indexes[col]];
    return {
      kind: GridCellKind.Number,
      allowOverlay: true,
      readonly: false,
      displayData: String(d),
      data: d,
    };
  }, []);

  return (
    <>
      <p>
        H0: &mu; {String.fromCharCode(codes[mu0dir])} {mu0val}
      </p>
      <p>
        H1: &mu; {String.fromCharCode(codes[mu1dir])} {mu1val}
      </p>
      <p>Results of Hypothesis Test</p>
      <DataEditor
        getCellContent={getContent}
        columns={columnHeaders}
        rows={1}
        getCellsForSelection={true}
        rowMarkers="none"
        copyHeaders={true}
        smoothScrollX={true}
      />
      <p>{ciLevel} Confidence Interval</p>
      <DataEditor
        getCellContent={getCIContent}
        columns={CIHeaders}
        rows={1}
        getCellsForSelection={true}
        rowMarkers="none"
        copyHeaders={true}
        smoothScrollX={true}
      />
    </>
  );
}

export { HypothesisTest };
