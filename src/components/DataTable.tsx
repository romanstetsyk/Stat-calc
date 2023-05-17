import { useCallback, useMemo } from "react";
import DataEditor, {
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";

export enum SampleStatisticsEnum {
  N = "n",
  Xbar = "Mean",
  Median = "Median",
  SVariance = "Sample Variance",
  PVariance = "Population Variance",
  SStdev = "Sample Stdev",
  PStdev = "Population Stdev",
  Stderr = "Std. err.",
}

export enum ConfidenceIntervalEnum {
  Level = "Level",
  Zcrit = "Z-crit",
  Me = "M.E.",
  LL = "L. Limit",
  UL = "U. Limit",
}

export enum HypothesisTestEnum {
  Zcrit = "Z-crit",
  Zstat = "Z-stat",
  Pvalue = "P-Value",
  Alpha = "alpha",
}

// Header of the first column
type RowTitle = "";

export type DataTableRow = {
  [key in
    | SampleStatisticsEnum
    | ConfidenceIntervalEnum
    | HypothesisTestEnum]?: number;
} & Record<RowTitle, string>;

type Props = {
  data: DataTableRow[];
  stats: (SampleStatisticsEnum | ConfidenceIntervalEnum | HypothesisTestEnum)[];
};

export const DataTable = ({ data, stats }: Props) => {
  const columnHeaders: (GridColumn & {
    title:
      | SampleStatisticsEnum
      | ConfidenceIntervalEnum
      | HypothesisTestEnum
      | RowTitle;
  })[] = useMemo(() => {
    const rowTitle: RowTitle = "";
    return [rowTitle, ...Object.values(stats)].map((e) => ({
      title: e,
      id: e,
    }));
  }, []);

  const getCellContent = useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = data[row];
    // dumb but simple way to do this
    const indexes: (keyof DataTableRow)[] = columnHeaders.map(
      (col) => col.title as keyof DataTableRow
    );

    const d = dataRow[indexes[col]];

    if (col === 0) {
      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: false,
        displayData: String(d),
        data: String(d),
      };
    }
    return {
      kind: GridCellKind.Number,
      allowOverlay: true,
      readonly: false,
      displayData: String(d),
      data: Number(d),
    };
  }, []);

  return (
    <DataEditor
      getCellContent={getCellContent}
      columns={columnHeaders}
      rows={data.length}
      getCellsForSelection={true}
      rowMarkers="none"
      copyHeaders={true}
      smoothScrollX={true}
    />
  );
};
