/* eslint-disable @typescript-eslint/no-magic-numbers */
import gcusum from '@stdlib/blas-ext-base-gcusum';
import tabulate from '@stdlib/utils-tabulate';

import type { DataTableRow } from '~/components/data-table';
import type { ColumnHeading } from '~/types';
import type { ArrayLike } from '~/utils/array-like';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';
import { parseNumber } from '~/utils/parse-number';

import type { FrequencyDistribution, OutputReturn } from './types';
import { topLeftCell } from './types';

const calcFrequency = (
  columns: ColumnHeading[],
  colData: ArrayLike<ArrayLike<string>>,
  withLabel: boolean,
  options: FrequencyDistribution[],
): OutputReturn[] =>
  columns.map((colHeader) => {
    const varName = getVarName(colData, Number(colHeader), withLabel);
    const varValues = getVarValues(colData, Number(colHeader), withLabel);
    const n = varValues.length;
    const out = tabulate(varValues);

    const table: DataTableRow<FrequencyDistribution, typeof topLeftCell>[] =
      out.map(([x, fr, relFr]) => {
        const row: DataTableRow<FrequencyDistribution, typeof topLeftCell> = {
          Value: x.toString(),
          Frequency: fr.toString(),
          'Relative Frequency': parseNumber(relFr),
        };
        return row;
      });

    if (options.includes('Cumulative Frequency')) {
      const freqArr = out.map((e) => e[1]);
      const cumulFreq = Array.from<number>({ length: freqArr.length });
      gcusum(table.length, 0, freqArr, 1, cumulFreq, 1);
      for (const [i, row] of table.entries()) {
        row['Cumulative Frequency'] = cumulFreq[i].toString();
      }
    }

    if (options.includes('Cumulative Relative Frequency')) {
      const relFreqArr = out.map((e) => e[2]);
      const cumulRelFreq = Array.from<number>({ length: relFreqArr.length });
      gcusum(table.length, 0, relFreqArr, 1, cumulRelFreq, 1);
      for (const [i, row] of table.entries()) {
        row['Cumulative Relative Frequency'] = parseNumber(cumulRelFreq[i]);
      }
    }
    const stats: [typeof topLeftCell, ...typeof options] = [
      topLeftCell,
      ...options,
    ];
    return { varName, n, table, stats };
  });

export { calcFrequency };
