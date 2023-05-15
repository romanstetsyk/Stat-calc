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

// Header of the first column
type RowTitle = "";

export type SampleStatisticsTableRow = {
  [key in SampleStatisticsEnum]?: number;
} & Record<RowTitle, string>;

type Props = {
  data: SampleStatisticsTableRow[];
  stats: SampleStatisticsEnum[];
};

export const SampleStatisticsTable = ({ data, stats }: Props) => {
  const sampleStatisticsColumnHeaders: (GridColumn & {
    title: SampleStatisticsEnum | RowTitle;
  })[] = useMemo(() => {
    const rowTitle: RowTitle = "";
    return [rowTitle, ...Object.values(stats)].map((e) => ({
      title: e,
      id: e,
    }));
  }, []);

  const sampleStatisticsData: SampleStatisticsTableRow[] = data;

  const getSampleStatisticsContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell;
      const dataRow = sampleStatisticsData[row];
      // dumb but simple way to do this
      const indexes: (keyof SampleStatisticsTableRow)[] =
        sampleStatisticsColumnHeaders.map(
          (col) => col.title as keyof SampleStatisticsTableRow
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
    },
    [sampleStatisticsData]
  );

  return (
    <>
      <p>Sample data</p>
      <DataEditor
        getCellContent={getSampleStatisticsContent}
        columns={sampleStatisticsColumnHeaders}
        rows={data.length}
        getCellsForSelection={true}
        rowMarkers="none"
        copyHeaders={true}
        smoothScrollX={true}
      />
    </>
  );
};
