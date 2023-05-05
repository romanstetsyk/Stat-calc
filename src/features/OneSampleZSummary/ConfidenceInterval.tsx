import { useCallback, useMemo } from "react";
import DataEditor, {
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import { TForm } from "./types";

type IProps = {
  formSummary: TForm;
};

enum CI {
  N = "n",
  Xbar = "Sample Mean",
  Stdev = "Std. Dev.",
  Stderr = "Std. Err.",
  Zcrit = "Z-crit",
}

type ResultRow = {
  [key in CI]: string;
};

function ConfidenceInterval({ formSummary }: IProps) {
  const { xbar, stdev, n } = formSummary;

  const stderr = String(+stdev / Math.sqrt(+n));

  const columnHeaders: (GridColumn & { title: CI })[] = useMemo(() => {
    return Object.values(CI).map((e) => ({ title: e, width: 100 }));
  }, []);

  let data: ResultRow[] = [
    {
      [CI.N]: n,
      [CI.Xbar]: xbar,
      [CI.Stdev]: stdev,
      [CI.Stderr]: stderr,
      [CI.Zcrit]: "42",
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
    <DataEditor
      getCellContent={getContent}
      columns={columnHeaders}
      rows={1}
      getCellsForSelection={true}
      rowMarkers="none"
      copyHeaders={true}
      smoothScrollX={true}
    />
  );
}

export { ConfidenceInterval };
