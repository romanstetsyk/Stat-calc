import { useCallback, useMemo } from "react";
import DataEditor, {
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";

// Columns of sample statistics table
enum SampleStatisticsEnum {
  N = "n",
  Xbar = "Sample Mean",
  Stdev = "Std. Dev.",
  Stderr = "Std. Err.",
}

type SampleStatisticsTableRow = {
  [key in SampleStatisticsEnum]: number;
};

interface IProps {
  xbar: string;
  stdev: string;
  stderr: number;
  n: string;
}

function SampleStatisticsTable({ xbar, stdev, stderr, n }: IProps) {
  const sampleStatisticsColumnHeaders: (GridColumn & {
    title: SampleStatisticsEnum;
  })[] = useMemo(() => {
    return Object.values(SampleStatisticsEnum).map((e) => ({
      title: e,
      id: e,
    }));
  }, []);

  const sampleStatisticsData: SampleStatisticsTableRow[] = useMemo(
    () => [
      {
        [SampleStatisticsEnum.N]: Number(n),
        [SampleStatisticsEnum.Xbar]: Number(xbar),
        [SampleStatisticsEnum.Stdev]: Number(stdev),
        [SampleStatisticsEnum.Stderr]: stderr,
      },
    ],
    []
  );
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
      return {
        kind: GridCellKind.Number,
        allowOverlay: true,
        readonly: false,
        displayData: String(d),
        data: d,
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
        rows={1}
        getCellsForSelection={true}
        rowMarkers="none"
        copyHeaders={true}
        smoothScrollX={true}
      />
    </>
  );
}

export { SampleStatisticsTable };
