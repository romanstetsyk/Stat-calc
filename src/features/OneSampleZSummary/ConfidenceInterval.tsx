import { useCallback, useMemo } from "react";
import DataEditor, {
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import quantile from "@stdlib/stats-base-dists-normal-quantile";

import { TForm } from "./types";

type IProps = {
  formSummary: TForm;
};

// Set column order here
enum CI {
  Level = "Level",
  N = "n",
  Xbar = "Sample Mean",
  Stdev = "Std. Dev.",
  Stderr = "Std. Err.",
  Zcrit = "Z-crit",
  Me = "M.E.",
  LL = "L. Limit",
  UL = "U. Limit",
}

type ResultRow = {
  [key in CI]: string;
};

function ConfidenceInterval({ formSummary }: IProps) {
  const { xbar, stdev, n, level } = formSummary;

  const stderr = Number(stdev) / Math.sqrt(Number(n));
  const zcrit = -1 * quantile((1 - Number(level)) / 2, 0, 1);
  const me = zcrit * stderr;
  const ll = Number(xbar) - me;
  const ul = Number(xbar) + me;

  const columnHeaders: (GridColumn & { title: CI })[] = useMemo(() => {
    return Object.values(CI).map((e) => ({ title: e, id: e }));
  }, []);

  let data: ResultRow[] = [
    {
      [CI.Level]: level,
      [CI.N]: n,
      [CI.Xbar]: xbar,
      [CI.Stdev]: stdev,
      [CI.Stderr]: String(stderr),
      [CI.Zcrit]: String(zcrit),
      [CI.Me]: String(me),
      [CI.LL]: String(ll),
      [CI.UL]: String(ul),
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
      <p>Confidence Interval</p>
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

export { ConfidenceInterval };
