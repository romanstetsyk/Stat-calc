/* eslint-disable @typescript-eslint/no-magic-numbers */
import cdf from '@stdlib/stats-base-dists-normal-cdf';
import quantile from '@stdlib/stats-base-dists-normal-quantile';
import mean from '@stdlib/stats-base-mean';
import stdev from '@stdlib/stats-base-stdev';

import type { DataTableRow } from '~/components/data-table';
import { HypothesisType, Perform } from '~/types';
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
  colData: ArrayLike<ArrayLike<string>>,
): HTReturn => {
  const { columns, withLabel, knownStdev } = formSummary.sampleData;
  const {
    nullValue,
    alternative,
    alpha,
    optional: { includeConfidenceInterval },
  } = formSummary.hypothesisTest;

  const CIData: DataTableRow<CIColumns, ''>[] = [];

  const HTData: DataTableRow<HTColumns | SampleStatistics, ''>[] = columns.map(
    (colHeader) => {
      const varName = getVarName(colData, Number(colHeader), withLabel);
      const varValues = getVarValues(colData, Number(colHeader), withLabel);
      // eslint-disable-next-line unicorn/no-array-callback-reference
      const arrOfNums = varValues.filter(isFiniteNumberString).map(Number);
      const n = arrOfNums.length;
      const xbar = mean(n, arrOfNums, 1);
      const stdevApprox = knownStdev ?? stdev(n, 1, arrOfNums, 1);
      const stderr = stdevApprox / Math.sqrt(n);
      const zstat = (xbar - nullValue) / stderr;

      let ciLevel: number;
      let zcrit: number;
      let pvalue: number;
      switch (alternative) {
        case HypothesisType.TwoTailed: {
          ciLevel = 1 - alpha;
          zcrit = -1 * quantile(alpha / 2, 0, 1);
          pvalue = 2 * cdf(-Math.abs(zstat), 0, 1);
          break;
        }
        case HypothesisType.RightTailed: {
          ciLevel = 1 - 2 * alpha;
          zcrit = -1 * quantile(alpha, 0, 1);
          pvalue = 1 - cdf(zstat, 0, 1);
          break;
        }
        case HypothesisType.LeftTailed: {
          ciLevel = 1 - 2 * alpha;
          zcrit = -1 * quantile(alpha, 0, 1);
          pvalue = cdf(zstat, 0, 1);
          break;
        }
        default: {
          throw new Error('Invalid hypothesis direction');
        }
      }

      if (
        includeConfidenceInterval &&
        (alternative === HypothesisType.TwoTailed || alpha < 0.5)
      ) {
        const me = zcrit * stderr;
        const ll = xbar - me;
        const ul = xbar + me;
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

  if (
    includeConfidenceInterval &&
    (alternative === HypothesisType.TwoTailed || Number(alpha) < 0.5)
  ) {
    output.CIData = CIData;
    output.CIStats = CIStats;
  }

  return output;
};

export { calcHT };
