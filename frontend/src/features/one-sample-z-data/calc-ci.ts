/* eslint-disable @typescript-eslint/no-magic-numbers */
import quantile from '@stdlib/stats-base-dists-normal-quantile';
import mean from '@stdlib/stats-base-mean';
import stdev from '@stdlib/stats-base-stdev';

import type { DataTableRow } from '~/components/data-table';
import { Perform } from '~/types';
import type { ArrayLike } from '~/utils/array-like';
import { isFiniteNumberString } from '~/utils/assertions';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';
import { parseNumber } from '~/utils/parse-number';

import type { CIColumns, CIReturn, SampleStatistics, TForm } from './types';

const DECIMAL = 6;

const calcCI = (
  formSummary: TForm,
  colData: ArrayLike<ArrayLike<string>>,
): CIReturn => {
  const { columns, withLabel, knownStdev } = formSummary.sampleData;
  const { confidenceLevel } = formSummary.confidenceInterval;

  const CIData: DataTableRow<CIColumns | SampleStatistics, ''>[] = columns.map(
    (colHeader) => {
      const varName = getVarName(colData, Number(colHeader), withLabel);
      const varValues = getVarValues(colData, Number(colHeader), withLabel);
      // eslint-disable-next-line unicorn/no-array-callback-reference
      const arrOfNums = varValues.filter(isFiniteNumberString).map(Number);
      const n = arrOfNums.length;
      const xbar = mean(n, arrOfNums, 1);
      const stdevApprox = knownStdev ?? stdev(n, 1, arrOfNums, 1);
      const stderr = stdevApprox / Math.sqrt(n);
      const zcrit = -1 * quantile((1 - confidenceLevel) / 2, 0, 1);
      const me = zcrit * stderr;
      const [ll, ul] = [xbar - me, xbar + me];

      const rowData: DataTableRow<CIColumns | SampleStatistics, ''> = {
        '': varName,
        N: n.toString(),
        Mean: parseNumber(xbar, DECIMAL),
        [knownStdev ? 'Known Stdev' : 'S.Stdev']: parseNumber(
          stdevApprox,
          DECIMAL,
        ),
        'Std.Err': parseNumber(stderr, DECIMAL),
        Level: confidenceLevel,
        'Z-crit': parseNumber(zcrit, DECIMAL),
        'M.E.': parseNumber(me, DECIMAL),
        'L.Limit': parseNumber(ll, DECIMAL),
        'U.Limit': parseNumber(ul, DECIMAL),
      };
      return rowData;
    },
  );

  const CIStats: ['', ...(CIColumns | SampleStatistics)[]] = [
    '',
    'N',
    'Mean',
    knownStdev ? 'Known Stdev' : 'S.Stdev',
    'Std.Err',
    'Level',
    'Z-crit',
    'M.E.',
    'L.Limit',
    'U.Limit',
  ];

  return { perform: Perform.ConfidenceInerval, CIData, CIStats };
};

export { calcCI };
