import type {
  GridCell,
  GridColumn,
  Item,
  NumberCell,
  TextCell,
} from '@glideapps/glide-data-grid';
import { DataEditor, GridCellKind } from '@glideapps/glide-data-grid';
import { useCallback, useMemo } from 'react';

import type { DataTableRow } from '~/modules/application/types';

type Props<T extends string, Title extends string = ' '> = {
  data: DataTableRow<T, Title>[];
  stats: Title extends ' ' ? T[] : [Title, ...T[]];
};

const DataTable = <T extends string, Title extends string = ' '>({
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
      const cellValue = data[row][stats[col]];

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!cellValue) {
        return {
          data: '',
          kind: GridCellKind.Text,
          displayData: '--',
          allowOverlay: true,
          readonly: true,
        };
      }

      if (cellValue.kind === GridCellKind.Number) {
        return {
          ...cellValue,
          allowOverlay: true,
          readonly: false,
          contentAlign: 'right',
        } satisfies NumberCell;
      }
      return {
        ...cellValue,
        allowOverlay: true,
        readonly: false,
        contentAlign: 'left',
      } satisfies TextCell;
    },
    [data, stats],
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
      smoothScrollY={true}
      scaleToRem={true}
    />
  );
};

export { DataTable };
