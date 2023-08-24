/* eslint-disable @typescript-eslint/no-magic-numbers */
import cdf from '@stdlib/stats-base-dists-normal-cdf';
import quantile from '@stdlib/stats-base-dists-normal-quantile';
import mean from '@stdlib/stats-base-mean';
import stdev from '@stdlib/stats-base-stdev';

import type { DataTableRow } from '~/components/data-table';
import { Perform } from '~/types';
import type { ArrayLike } from '~/utils/array-like';
import { isFiniteNumberString } from '~/utils/assertions';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';
import { parseNumber } from '~/utils/parse-number';

import type {
  CIColumns,
  HTColumns,
  HTReturn,
  SampleStatistics,
  TForm,
} from './types';

const DECIMAL = 6;

const calcHT = (
  formSummary: TForm,
  colData: InstanceType<typeof ArrayLike<ArrayLike<string>>>,
): HTReturn => {
  const columns = formSummary.columns;
  const withLabel = formSummary.withLabel;
  const knownStdev = formSummary.knownStdev;
  const nullValue = Number(formSummary.nullValue);
  const alternative = formSummary.alternative;
  const alpha = Number(formSummary.alpha);

  const includeCI = formSummary.optional.confidenceInterval;

  const CIData: DataTableRow<CIColumns, ''>[] = [];

  const HTData: DataTableRow<HTColumns | SampleStatistics, ''>[] = columns.map(
    (colHeader) => {
      const varName = getVarName(colData, Number(colHeader), withLabel);
      const varValues = getVarValues(colData, Number(colHeader), withLabel);
      // eslint-disable-next-line unicorn/no-array-callback-reference
      const arrOfNums = varValues.filter(isFiniteNumberString).map(Number);
      const n = arrOfNums.length;
      const xbar = mean(n, arrOfNums, 1);
      const stdevApprox = knownStdev
        ? Number(knownStdev)
        : stdev(n, 1, arrOfNums, 1);
      const stderr = stdevApprox / Math.sqrt(n);
      const zstat = (xbar - Number(nullValue)) / stderr;

      let ciLevel: number;
      let zcrit: number;
      let pvalue: number;
      switch (alternative) {
        case 'notEqual': {
          ciLevel = 1 - Number(alpha);
          zcrit = -quantile(Number(alpha) / 2, 0, 1);
          pvalue = 2 * cdf(-Math.abs(zstat), 0, 1);
          break;
        }
        case 'greaterThan': {
          ciLevel = 1 - 2 * Number(alpha);
          zcrit = -quantile(Number(alpha), 0, 1);
          pvalue = 1 - cdf(zstat, 0, 1);
          break;
        }
        case 'lessThan': {
          ciLevel = 1 - 2 * Number(alpha);
          zcrit = -quantile(Number(alpha), 0, 1);
          pvalue = cdf(zstat, 0, 1);
          break;
        }
        default: {
          throw new Error('Invalid hypothesis direction');
        }
      }

      if (includeCI && (alternative === 'notEqual' || Number(alpha) < 0.5)) {
        const me = zcrit * stderr;
        const ll = Number(xbar) - me;
        const ul = Number(xbar) + me;
        CIData.push({
          '': varName,
          Level: parseNumber(ciLevel),
          'M.E.': parseNumber(me, DECIMAL),
          'L.Limit': parseNumber(ll, DECIMAL),
          'U.Limit': parseNumber(ul, DECIMAL),
        });
      }

      const rowData: DataTableRow<HTColumns | SampleStatistics, ''> = {
        '': varName,
        N: n.toString(),
        Mean: parseNumber(xbar, DECIMAL),
        [knownStdev ? 'Known Stdev' : 'S.Stdev']: parseNumber(
          stdevApprox,
          DECIMAL,
        ),
        'Std.Err': parseNumber(stderr, DECIMAL),
        'Z-crit': parseNumber(zcrit, DECIMAL),
        Alpha: parseNumber(alpha),
        'Z-stat': parseNumber(zstat, DECIMAL),
        'P-value': parseNumber(pvalue, DECIMAL),
      };

      return rowData;
    },
  );

  const HTStats: ['', ...(HTColumns | SampleStatistics)[]] = [
    '',
    'N',
    'Mean',
    knownStdev ? 'Known Stdev' : 'S.Stdev',
    'Std.Err',
    'Z-crit',
    'Z-stat',
    'P-value',
  ];

  const CIStats: ['', ...CIColumns[]] = [
    '',
    'Level',
    'M.E.',
    'L.Limit',
    'U.Limit',
  ];

  const output: HTReturn = { perform: Perform.HypothesisTest, HTData, HTStats };

  if (includeCI && (alternative === 'notEqual' || Number(alpha) < 0.5)) {
    output.CIData = CIData;
    output.CIStats = CIStats;
  }

  return output;
};

export { calcHT };
