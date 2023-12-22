/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GridCellKind } from '@glideapps/glide-data-grid';
import roundn from '@stdlib/math-base-special-roundn';
import cdf from '@stdlib/stats-base-dists-normal-cdf';
import quantile from '@stdlib/stats-base-dists-normal-quantile';

import { Config } from '~/modules/application/config';
import { HypothesisType, Perform } from '~/modules/application/enums';
import type { DataTableRow } from '~/modules/application/types';

import type {
  CIColumns,
  HTColumns,
  HTReturn,
  SampleStatistics,
  TForm,
} from './types';

const { ROUND_DECIMAL } = Config;

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

  const HTData: DataTableRow<HTColumns | SampleStatistics>[] = [
    {
      'Alpha': {
        data: alpha,
        kind: GridCellKind.Number,
        displayData: alpha.toString(),
      },
      'Z-crit': {
        data: zcrit,
        kind: GridCellKind.Number,
        displayData: roundn(zcrit, ROUND_DECIMAL).toString(),
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
      'Known Stdev': {
        data: stdev,
        kind: GridCellKind.Number,
        displayData: roundn(stdev, ROUND_DECIMAL).toString(),
      },
      'Std.Err': {
        data: stderr,
        kind: GridCellKind.Number,
        displayData: roundn(stderr, ROUND_DECIMAL).toString(),
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
        'Level': {
          data: ciLevel,
          kind: GridCellKind.Number,
          displayData: ciLevel.toString(),
        },
        'Z-crit': {
          data: zcrit,
          kind: GridCellKind.Number,
          displayData: roundn(zcrit, ROUND_DECIMAL).toString(),
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
