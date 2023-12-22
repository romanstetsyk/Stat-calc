/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GridCellKind } from '@glideapps/glide-data-grid';
import roundn from '@stdlib/math-base-special-roundn';
import quantile from '@stdlib/stats-base-dists-normal-quantile';

import { Config } from '~/modules/application/config';
import { Perform } from '~/modules/application/enums';
import type { DataTableRow } from '~/modules/application/types';

import type { CIColumns, CIReturn, SampleStatistics, TForm } from './types';

const { ROUND_DECIMAL } = Config;

const calcCI = (formSummary: TForm): CIReturn => {
  const { xbar1, stdev1, n1 } = formSummary.sample1Summary;
  const { xbar2, stdev2, n2 } = formSummary.sample2Summary;
  const { confidenceLevel } = formSummary.confidenceInterval;
  const { includeSampleStatistics } = formSummary.optional;

  const xdiff = xbar1 - xbar2;
  const stderr1 = stdev1 / Math.sqrt(n1);
  const stderr2 = stdev2 / Math.sqrt(n2);
  const stderrPooled = Math.sqrt(stdev1 ** 2 / n1 + stdev2 ** 2 / n2);
  const zcrit = -1 * quantile((1 - confidenceLevel) / 2, 0, 1);
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
        data: confidenceLevel,
        kind: GridCellKind.Number,
        displayData: confidenceLevel.toString(),
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
      'Std.Err.': {
        data: stderrPooled,
        kind: GridCellKind.Number,
        displayData: roundn(stderrPooled, ROUND_DECIMAL).toString(),
      },
    },
  ];

  const CIStats: ['', ...CIColumns[]] = [
    '',
    'Level',
    'Z-crit',
    'Std.Err.',
    'M.E.',
    'L.Limit',
    'U.Limit',
  ];

  const outputData: CIReturn = {
    perform: Perform.ConfidenceInerval,
    CIData,
    CIStats,
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

  return outputData;
};

export { calcCI };
