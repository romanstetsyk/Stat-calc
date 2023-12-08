/* eslint-disable @typescript-eslint/no-magic-numbers */
import cdf from '@stdlib/stats-base-dists-normal-cdf';
import quantile from '@stdlib/stats-base-dists-normal-quantile';

import type { DataTableRow } from '~/components/data-table';
import { HypothesisType, Perform } from '~/types';
import { parseNumber } from '~/utils/parse-number';

import type {
  CIColumns,
  HTColumns,
  HTReturn,
  SampleStatistics,
  TForm,
} from './types';

const DECIMAL = 6;

const calcHT = (formSummary: TForm): HTReturn => {
  const { xbar, stdev, n } = formSummary.sampleSummary;
  const {
    alternative,
    nullValue,
    alpha,
    optional: { includeConfidenceInterval },
  } = formSummary.hypothesisTest;

  const stderr = stdev / Math.sqrt(n);
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

  const HTData: DataTableRow<HTColumns | SampleStatistics>[] = [
    {
      Alpha: parseNumber(alpha),
      'Z-crit': parseNumber(zcrit, DECIMAL),
      N: n,
      Mean: xbar,
      'Known Stdev': stdev,
      'Std.Err': parseNumber(stderr, DECIMAL),
      'Z-stat': parseNumber(zstat, DECIMAL),
      'P-value': parseNumber(pvalue, DECIMAL),
    },
  ];

  const HTStats: (HTColumns | SampleStatistics)[] = [
    'Alpha',
    'Z-crit',
    'N',
    'Mean',
    'Known Stdev',
    'Std.Err',
    'Z-stat',
    'P-value',
  ];

  const outputData: HTReturn = {
    perform: Perform.HypothesisTest,
    HTData,
    HTStats,
  };

  // render CI only if condition is true
  if (
    includeConfidenceInterval &&
    (alternative === HypothesisType.TwoTailed || alpha < 0.5)
  ) {
    const me = zcrit * stderr;
    const ll = xbar - me;
    const ul = xbar + me;

    const CIData: DataTableRow<CIColumns>[] = [
      {
        Level: parseNumber(ciLevel),
        'Z-crit': parseNumber(zcrit, DECIMAL),
        'M.E.': parseNumber(me, DECIMAL),
        'L.Limit': parseNumber(ll, DECIMAL),
        'U.Limit': parseNumber(ul, DECIMAL),
      },
    ];

    const CIStats: CIColumns[] = [
      'Level',
      'Z-crit',
      'M.E.',
      'L.Limit',
      'U.Limit',
    ];

    outputData.CIData = CIData;
    outputData.CIStats = CIStats;
  }

  return outputData;
};

export { calcHT };
