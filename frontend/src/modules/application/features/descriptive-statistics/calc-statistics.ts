/* eslint-disable @typescript-eslint/no-magic-numbers */
import mean from '@stdlib/stats-base-mean';
import mediansorted from '@stdlib/stats-base-mediansorted';
import range from '@stdlib/stats-base-range';
import stdev from '@stdlib/stats-base-stdev';
import variance from '@stdlib/stats-base-variance';

import type { ArrayLike } from '~/framework/array-like';
import type { ColumnHeading, DataTableRow } from '~/modules/application/types';
import { isFiniteNumberString } from '~/utils/assertions';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';
import { parseNumber } from '~/utils/parse-number';

import type { SampleStatistics } from './types';

const DECIMAL = 6;

const calcStatistics = (
  columns: ColumnHeading[],
  colData: ArrayLike<ArrayLike<string>>,
  withLabel: boolean,
  options: SampleStatistics[],
): DataTableRow<SampleStatistics, ''>[] =>
  columns.map((colHeader) => {
    const varName = getVarName(colData, Number(colHeader), withLabel);
    const varValues = getVarValues(colData, Number(colHeader), withLabel);
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const arrOfNums = varValues.filter(isFiniteNumberString).map(Number);
    const n = arrOfNums.length;
    const row: DataTableRow<SampleStatistics, ''> = { '': varName };

    // Data length
    if (options.includes('N')) {
      row.N = n.toString();
    }

    // Mean
    if (options.includes('Mean')) {
      row.Mean = mean(n, arrOfNums, 1).toFixed(DECIMAL);
    }

    // Median
    if (options.includes('Median')) {
      row.Median = mediansorted(
        n,
        arrOfNums.sort((a, b) => a - b),
        1,
      ).toFixed(DECIMAL);
    }

    // Sample variance
    if (options.includes('S.Var')) {
      row['S.Var'] = variance(n, 1, arrOfNums, 1).toFixed(DECIMAL);
    }

    // Population variance
    if (options.includes('P.Var')) {
      row['P.Var'] = variance(n, 0, arrOfNums, 1).toFixed(DECIMAL);
    }

    // Sample standard deviation
    if (options.includes('S.Stdev')) {
      row['S.Stdev'] = stdev(n, 1, arrOfNums, 1).toFixed(DECIMAL);
    }

    // Population standard deviation
    if (options.includes('P.Stdev')) {
      row['P.Stdev'] = stdev(n, 0, arrOfNums, 1).toFixed(DECIMAL);
    }

    // Standard error (uses sample stdev)
    if (options.includes('Std.Err')) {
      row['Std.Err'] = (stdev(n, 1, arrOfNums, 1) / n ** 0.5).toFixed(DECIMAL);
    }

    // Range
    if (options.includes('Range')) {
      row.Range = parseNumber(range(n, arrOfNums, 1));
    }

    return row;
  });

export { calcStatistics };
