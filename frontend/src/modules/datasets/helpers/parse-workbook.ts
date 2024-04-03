import type { WorkBook } from 'xlsx';
import { utils } from 'xlsx';

import { ArrayLike } from '~/framework/array-like';
import type { OverwriteData } from '~/modules/data-grid/types';

import { classifyInput } from './classify-input';

type FileRow = Record<number, unknown> & { __rowNum__: number };

const parseWorkbook = (
  id: OverwriteData['id'],
  title: OverwriteData['title'],
  workbook: WorkBook,
): OverwriteData => {
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

  const newRows = new ArrayLike<ArrayLike<string | number>>();
  const newCols = new ArrayLike<ArrayLike<string | number>>();

  for (const row of data) {
    const { __rowNum__, ...rest } = row;
    const newRow = new ArrayLike<string | number>();
    for (const col in rest) {
      const value = classifyInput(rest[col]);
      newRow.add(Number(col), value);

      if (!(col in newCols)) {
        newCols.add(Number(col), new ArrayLike<string | number>());
      }
      newCols[col].add(__rowNum__, value);
    }

    newRows.add(__rowNum__, newRow);
  }

  return { id, title, newRows, newCols };
};

export { parseWorkbook };
