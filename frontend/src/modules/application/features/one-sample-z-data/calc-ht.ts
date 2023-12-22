/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GridCellKind } from '@glideapps/glide-data-grid';
import roundn from '@stdlib/math-base-special-roundn';
import cdf from '@stdlib/stats-base-dists-normal-cdf';
import quantile from '@stdlib/stats-base-dists-normal-quantile';
import mean from '@stdlib/stats-base-mean';
import stdev from '@stdlib/stats-base-stdev';

import type { ArrayLike } from '~/framework/array-like';
import { Config } from '~/modules/application/config';
import { HypothesisType, Perform } from '~/modules/application/enums';
import type { DataTableRow } from '~/modules/application/types';
import { isFiniteNumberString } from '~/utils/assertions';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';

import type {
  CIColumns,
  HTColumns,
  HTReturn,
  SampleStatistics,
  TForm,
} from './types';

const { ROUND_DECIMAL } = Config;

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
          pvalue = 2 * cdf(-1 * Math.abs(zstat), 0, 1);
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
          '': {
            data: varName,
            kind: GridCellKind.Text,
            displayData: varName,
          },
          'Level': {
            data: ciLevel,
            kind: GridCellKind.Number,
            displayData: roundn(ciLevel, ROUND_DECIMAL).toString(),
          },
          'M.E.': {
            data: me,
            kind: GridCellKind.Number,
            displayData: roundn(me, ROUND_DECIMAL).toString(),
          },
          'L.Limit': {
            data: ll,
            kind: GridCellKind.Number,
            displayData: roundn(ll, ROUND_DECIMAL).toString(),
          },
          'U.Limit': {
            data: ul,
            kind: GridCellKind.Number,
            displayData: roundn(ul, ROUND_DECIMAL).toString(),
          },
        });
      }

      const rowData: DataTableRow<HTColumns | SampleStatistics, ''> = {
        '': {
          data: varName,
          kind: GridCellKind.Text,
          displayData: varName,
        },
        'N': {
          data: n,
          kind: GridCellKind.Number,
          displayData: n.toString(),
        },
        'Mean': {
          data: xbar,
          kind: GridCellKind.Number,
          displayData: roundn(xbar, ROUND_DECIMAL).toString(),
        },
        [knownStdev ? 'Known Stdev' : 'S.Stdev']: {
          data: stdevApprox,
          kind: GridCellKind.Number,
          displayData: roundn(stdevApprox, ROUND_DECIMAL).toString(),
        },
        'Std.Err': {
          data: stderr,
          kind: GridCellKind.Number,
          displayData: roundn(stderr, ROUND_DECIMAL).toString(),
        },
        'Z-crit': {
          data: zcrit,
          kind: GridCellKind.Number,
          displayData: roundn(zcrit, ROUND_DECIMAL).toString(),
        },
        'Alpha': {
          data: alpha,
          kind: GridCellKind.Number,
          displayData: alpha.toString(),
        },
        'Z-stat': {
          data: zstat,
          kind: GridCellKind.Number,
          displayData: roundn(zstat, ROUND_DECIMAL).toString(),
        },
        'P-value': {
          data: pvalue,
          kind: GridCellKind.Number,
          displayData: roundn(pvalue, ROUND_DECIMAL).toString(),
        },
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
    'Alpha',
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
