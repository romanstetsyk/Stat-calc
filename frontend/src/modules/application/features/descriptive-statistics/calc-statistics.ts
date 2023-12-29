import { GridCellKind } from '@glideapps/glide-data-grid';
import roundn from '@stdlib/math-base-special-roundn';
import mean from '@stdlib/stats-base-mean';
import mediansorted from '@stdlib/stats-base-mediansorted';
import range from '@stdlib/stats-base-range';
import stdev from '@stdlib/stats-base-stdev';
import variance from '@stdlib/stats-base-variance';

import { Config } from '~/modules/application/config';
import type { DataTableRow } from '~/modules/application/types';
import type { GridData } from '~/modules/data-grid/types';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';

import type { OutputReturn, SampleStatistics, TForm } from './types';

const { ROUND_DECIMAL } = Config;

const calcStatistics = (
  formSummary: TForm,
  colData: GridData['colData'],
): OutputReturn => {
  const { withLabel, columns, options } = formSummary;

  const data = columns.map((colHeader) => {
    const varName = getVarName(colData, Number(colHeader), withLabel);
    const varValues = getVarValues(colData, Number(colHeader), withLabel);
    const arrOfNums = varValues.filter(
      (e): e is number => typeof e === 'number',
    );
    const n = arrOfNums.length;
    const row: DataTableRow<SampleStatistics, ''> = {
      '': {
        data: varName,
        kind: GridCellKind.Text,
        displayData: varName,
      },
    };

    // Data length
    if (options.includes('N')) {
      row.N = {
        data: n,
        kind: GridCellKind.Number,
        displayData: n.toString(),
      };
    }

    // Mean
    if (options.includes('Mean')) {
      const xbar = mean(n, arrOfNums, 1);
      row.Mean = {
        data: xbar,
        kind: GridCellKind.Number,
        displayData: roundn(xbar, ROUND_DECIMAL).toString(),
      };
    }

    // Median
    if (options.includes('Median')) {
      const sorted = arrOfNums.toSorted((a, b) => a - b);
      const median = mediansorted(n, sorted, 1);
      row.Median = {
        data: median,
        kind: GridCellKind.Number,
        displayData: roundn(median, ROUND_DECIMAL).toString(),
      };
    }

    // Sample variance
    if (options.includes('S.Var')) {
      const sVar = variance(n, 1, arrOfNums, 1);
      row['S.Var'] = {
        data: sVar,
        kind: GridCellKind.Number,
        displayData: roundn(sVar, ROUND_DECIMAL).toString(),
      };
    }

    // Population variance
    if (options.includes('P.Var')) {
      const pVar = variance(n, 0, arrOfNums, 1);
      row['P.Var'] = {
        data: pVar,
        kind: GridCellKind.Number,
        displayData: roundn(pVar, ROUND_DECIMAL).toString(),
      };
    }

    // Sample standard deviation
    if (options.includes('S.Stdev')) {
      const sStdev = stdev(n, 1, arrOfNums, 1);
      row['S.Stdev'] = {
        data: sStdev,
        kind: GridCellKind.Number,
        displayData: roundn(sStdev, ROUND_DECIMAL).toString(),
      };
    }

    // Population standard deviation
    if (options.includes('P.Stdev')) {
      const pStdev = stdev(n, 0, arrOfNums, 1);
      row['P.Stdev'] = {
        data: pStdev,
        kind: GridCellKind.Number,
        displayData: roundn(pStdev, ROUND_DECIMAL).toString(),
      };
    }

    // Standard error (uses sample stdev)
    if (options.includes('Std.Err')) {
      const stderr = stdev(n, 1, arrOfNums, 1) / Math.sqrt(n);
      row['Std.Err'] = {
        data: stderr,
        kind: GridCellKind.Number,
        displayData: roundn(stderr, ROUND_DECIMAL).toString(),
      };
    }

    // Range
    if (options.includes('Range')) {
      const sRange = range(n, arrOfNums, 1);
      row.Range = {
        data: sRange,
        kind: GridCellKind.Number,
        displayData: sRange.toString(),
      };
    }

    return row;
  });

  const stats = ['', ...options] satisfies ['', ...SampleStatistics[]];
  return { data, stats };
};

export { calcStatistics };
