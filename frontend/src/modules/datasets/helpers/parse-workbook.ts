import type { WorkBook } from 'xlsx';
import { utils } from 'xlsx';

import { ArrayLike } from '~/framework/array-like';
import type { DatasetData } from '~/modules/data-grid/types';

import { classifyInput } from './classify-input';

type FileRow = Record<number, unknown> & { __rowNum__: number };

const parseWorkbook = (
  workbook: WorkBook,
): Pick<DatasetData, 'rowData' | 'colData'> => {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const range = utils.decode_range(sheet['!ref'] ?? 'A1');
  const headers = Array.from<unknown, `${number}`>(
    { length: range.e.c - range.s.c + 1 },
    (_, i) => `${i + range.s.c}`,
  );
  const data = utils.sheet_to_json<FileRow>(sheet, {
    header: headers,
    // blankrows: true,
  });

  const rowData: DatasetData['rowData'] = new ArrayLike();
  const colData: DatasetData['colData'] = new ArrayLike();

  for (const row of data) {
    const { __rowNum__, ...rest } = row;
    const newRow: DatasetData['rowData'][number] = new ArrayLike();
    for (const col in rest) {
      const value = classifyInput(rest[col]);
      newRow.add(Number(col), value);

      if (!(col in colData)) {
        colData.add(Number(col), new ArrayLike());
      }
      colData[col].add(__rowNum__, value);
    }

    rowData.add(__rowNum__, newRow);
  }

  return { rowData, colData };
};

export { parseWorkbook };
