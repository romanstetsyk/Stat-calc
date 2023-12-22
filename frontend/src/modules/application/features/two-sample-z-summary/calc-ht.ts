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
  const { xbar1, stdev1, n1 } = formSummary.sample1Summary;
  const { xbar2, stdev2, n2 } = formSummary.sample2Summary;
  const { nullValue, alternative, alpha, optional } =
    formSummary.hypothesisTest;
  const { includeConfidenceInterval } = optional;
  const { includeSampleStatistics } = formSummary.optional;

  const xdiff = xbar1 - xbar2;
  const stderr1 = stdev1 / Math.sqrt(n1);
  const stderr2 = stdev2 / Math.sqrt(n2);
  const stderrPooled = Math.sqrt(stdev1 ** 2 / n1 + stdev2 ** 2 / n2);
  const zstat = (xdiff - nullValue) / stderrPooled;

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

  const HTData: DataTableRow<HTColumns, ''>[] = [
    {
      '': {
        data: '\u03BC\u2081 - \u03BC\u2082',
        kind: GridCellKind.Text,
        displayData: '\u03BC\u2081 - \u03BC\u2082',
      },
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
      'Std.Err.': {
        data: stderrPooled,
        kind: GridCellKind.Number,
        displayData: roundn(stderrPooled, ROUND_DECIMAL).toString(),
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

  const HTStats: ['', ...HTColumns[]] = [
    '',
    'Alpha',
    'Z-crit',
    'Std.Err.',
    'Z-stat',
    'P-value',
  ];

  const outputData: HTReturn = {
    perform: Perform.HypothesisTest,
    HTData,
    HTStats,
  };

  if (includeSampleStatistics) {
    const sampleData: DataTableRow<SampleStatistics, ''>[] = [
      {
        '': {
          data: 'Sample 1',
          kind: GridCellKind.Text,
          displayData: 'Sample 1',
        },
        'N': {
          data: n1,
          kind: GridCellKind.Number,
          displayData: n1.toString(),
        },
        'Mean': {
          data: xbar1,
          kind: GridCellKind.Number,
          displayData: roundn(xbar1, ROUND_DECIMAL).toString(),
        },
        'Known Stdev': {
          data: stdev1,
          kind: GridCellKind.Number,
          displayData: roundn(stdev1, ROUND_DECIMAL).toString(),
        },
        'Std.Err': {
          data: stderr1,
          kind: GridCellKind.Number,
          displayData: roundn(stderr1, ROUND_DECIMAL).toString(),
        },
      },
      {
        '': {
          data: 'Sample 2',
          kind: GridCellKind.Text,
          displayData: 'Sample 2',
        },
        'N': {
          data: n2,
          kind: GridCellKind.Number,
          displayData: n2.toString(),
        },
        'Mean': {
          data: xbar2,
          kind: GridCellKind.Number,
          displayData: roundn(xbar2, ROUND_DECIMAL).toString(),
        },
        'Known Stdev': {
          data: stdev2,
          kind: GridCellKind.Number,
          displayData: roundn(stdev2, ROUND_DECIMAL).toString(),
        },
        'Std.Err': {
          data: stderr2,
          kind: GridCellKind.Number,
          displayData: roundn(stderr2, ROUND_DECIMAL).toString(),
        },
      },
    ];

    const sampleStats: ['', ...SampleStatistics[]] = [
      '',
      'N',
      'Mean',
      'Known Stdev',
      'Std.Err',
    ];

    outputData.sampleData = sampleData;
    outputData.sampleStats = sampleStats;
  }

  if (
    includeConfidenceInterval &&
    (alternative === HypothesisType.TwoTailed || alpha < 0.5)
  ) {
    const me = zcrit * stderrPooled;
    const ll = xdiff - me;
    const ul = xdiff + me;

    const CIData: DataTableRow<CIColumns, ''>[] = [
      {
        '': {
          data: '\u03BC\u2081 - \u03BC\u2082',
          kind: GridCellKind.Text,
          displayData: '\u03BC\u2081 - \u03BC\u2082',
        },
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

    const CIStats: ['', ...CIColumns[]] = [
      '',
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
