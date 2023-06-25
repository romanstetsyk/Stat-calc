import { useCallback, useMemo } from "react";
import DataEditor, {
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";

// T can be const enum or union of literals
export type DataTableRow<
  T extends string,
  Title extends string = "column"
> = Title extends "column"
  ? Partial<{
      [key in T]: string;
    }>
  : Partial<{
      [key in T]: string;
    }> &
      Record<Title, string | number>;

//
type Props<T extends string, Title extends string = "column"> = {
  data: DataTableRow<T, Title>[];
  stats: Title extends "column" ? T[] : [Title, ...T[]];
};

export const DataTable = <T extends string, Title extends string = "column">({
  data,
  stats,
}: Props<T, Title>) => {
  const columnHeaders: GridColumn[] = useMemo(() => {
    return stats.map((e) => ({
      title: e,
      id: e,
    }));
  }, [stats]);

  const getCellContent = useCallback(
    (cell: Item): GridCell => {
      const [col, row] = cell;
      const dataRow = data[row];
      // dumb but simple way to do this
      const indexes: (keyof DataTableRow<T, Title>)[] = columnHeaders.map(
        (col) => col.title as keyof DataTableRow<T, Title>
      );

      const d = dataRow[indexes[col]];

      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: false,
        displayData: String(d),
        data: String(d),
        contentAlign: "right",
      };
    },
    [columnHeaders, data]
  );

  if (stats.length === 0) {
    return null;
  }

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
