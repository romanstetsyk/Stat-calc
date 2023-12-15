import type { SizedGridColumn } from '@glideapps/glide-data-grid';

import { Config } from '../config';
import { createColumnName } from './create-column-name';

const gridHeadersGenerator = (): ((
  columnCount?: number,
) => SizedGridColumn[]) => {
  let headers: SizedGridColumn[] = [];

  return (columnCount: number = Config.COL_COUNT): SizedGridColumn[] => {
    const initialLength = headers.length;
    const arr = Array.from({ length: columnCount - initialLength }, (_, i) => {
      const colName = createColumnName(initialLength + i);
      return {
        title: colName,
        id: colName,
        width: Config.COL_WIDTH,
      } satisfies SizedGridColumn;
    });

    // eslint-disable-next-line unicorn/prefer-spread
    headers = headers.concat(arr); // concat has better performance for large arrays

    return headers;
  };
};

export { gridHeadersGenerator };
