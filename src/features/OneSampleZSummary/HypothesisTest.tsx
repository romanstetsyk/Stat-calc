import { useCallback, useMemo } from "react";
import DataEditor, {
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import { TForm } from "./types";

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

enum HT {
  N = "n",
  Xbar = "Sample Mean",
  Stdev = "Std. Dev.",
  Stderr = "Std. Err.",
}

type ResultRow = {
  [key in HT]: string;
};

function HypothesisTest({ formSummary }: IProps) {
  const { xbar, stdev, n, mu0dir, mu0val, mu1dir, mu1val } = formSummary;

  const columnHeaders: (GridColumn & { title: HT })[] = useMemo(() => {
    return Object.values(HT).map((e) => ({ title: e, width: 100 }));
  }, []);

  let data: ResultRow[] = [
    {
      [HT.N]: n,
      [HT.Xbar]: xbar,
      [HT.Stdev]: stdev,
      [HT.Stderr]: "12",
    },
  ];

  const getContent = useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = data[row];
    // dumb but simple way to do this
    const indexes: (keyof ResultRow)[] = columnHeaders.map(
      (col) => col.title as keyof ResultRow
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

  return (
    <>
      <p>
        H0: &mu; {String.fromCharCode(codes[mu0dir])} {mu0val}
      </p>
      <p>
        H1: &mu; {String.fromCharCode(codes[mu1dir])} {mu1val}
      </p>
      <DataEditor
        getCellContent={getContent}
        columns={columnHeaders}
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
