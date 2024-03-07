import { GridCellKind } from '@glideapps/glide-data-grid';
import gcusum from '@stdlib/blas-ext-base-gcusum';
import roundn from '@stdlib/math-base-special-roundn';
import tabulate from '@stdlib/utils-tabulate';

import { Config } from '~/modules/application/config';
import type { DataTableRow } from '~/modules/application/types';
import type { GridData } from '~/modules/data-grid/types';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';

import type { FrequencyDistribution, OutputReturn, TForm } from './types';
import { TopLeftCell } from './types';

const { ROUND_DECIMAL } = Config;

const calcFrequency = (
  formSummary: TForm,
  colData: GridData['colData'],
): OutputReturn[] => {
  const { withLabel, columns, options } = formSummary;

  return columns.map((colHeader) => {
    const varName = getVarName(colData, Number(colHeader), withLabel);
    const varValues = getVarValues(colData, Number(colHeader), withLabel);
    const n = varValues.length;
    const out = tabulate<(typeof varValues)[number]>(varValues);

    const table: DataTableRow<FrequencyDistribution, TopLeftCell>[] = out.map(
      ([x, fr, relFr]) => {
        const row: DataTableRow<FrequencyDistribution, TopLeftCell> = {
          Value: {
            data: x.toString(),
            kind: GridCellKind.Text,
            displayData: x.toString(),
          },
          Frequency: {
            data: fr,
            kind: GridCellKind.Number,
            displayData: fr.toString(),
          },
          'Relative Frequency': {
            data: relFr,
            kind: GridCellKind.Number,
            displayData: roundn(relFr, ROUND_DECIMAL).toString(),
          },
        };
        return row;
      },
    );

    if (options.includes('Cumulative Frequency')) {
      const freqArr = out.map((e) => e[1]);
      const cumulFreq = Array.from<number>({ length: freqArr.length });
      gcusum(table.length, 0, freqArr, 1, cumulFreq, 1);
      for (const [i, row] of table.entries()) {
        row['Cumulative Frequency'] = {
          data: cumulFreq[i],
          kind: GridCellKind.Number,
          displayData: cumulFreq[i].toString(),
        };
      }
    }

    if (options.includes('Cumulative Relative Frequency')) {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const relFreqArr = out.map((e) => e[2]);
      const cumulRelFreq = Array.from<number>({ length: relFreqArr.length });
      gcusum(table.length, 0, relFreqArr, 1, cumulRelFreq, 1);
      for (const [i, row] of table.entries()) {
        row['Cumulative Relative Frequency'] = {
          data: cumulRelFreq[i],
          kind: GridCellKind.Number,
          displayData: roundn(cumulRelFreq[i], ROUND_DECIMAL).toString(),
        };
      }
    }
    const stats: [TopLeftCell, ...typeof options] = [TopLeftCell, ...options];
    return { varName, n, table, stats };
  });
};

export { calcFrequency };
