import type { GridCell, GridColumn, Item } from '@glideapps/glide-data-grid';
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid';
import { useCallback, useMemo } from 'react';

// T can be const enum or union of literals
type DataTableRow<
  T extends string,
  Title extends string = 'column',
> = Title extends 'column'
  ? Partial<{
      [key in T]: string | number;
    }>
  : Partial<{
      [key in T]: string | number;
    }> &
      Record<Title, string | number>;

//
type Props<T extends string, Title extends string = 'column'> = {
  data: DataTableRow<T, Title>[];
  stats: Title extends 'column' ? T[] : [Title, ...T[]];
};

const DataTable = <T extends string, Title extends string = 'column'>({
  data,
  stats,
}: Props<T, Title>): JSX.Element | null => {
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
        (col) => col.title as keyof DataTableRow<T, Title>,
      );

      const d = dataRow[indexes[col]];

      return {
        kind: GridCellKind.Text,
        allowOverlay: true,
        readonly: false,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        displayData: d === undefined ? '-' : String(d),
        data: String(d),
        contentAlign: 'right',
      };
    },
    [columnHeaders, data],
  );

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  if (stats.length === 0) {
    return null;
  }

  return (
    <DataEditor
      getCellContent={getCellContent}
      columns={columnHeaders}
      rows={data.length}
      getCellsForSelection={true}
      rowMarkers='none'
      copyHeaders={true}
      smoothScrollX={true}
    />
  );
};

export type { DataTableRow };
export { DataTable };
