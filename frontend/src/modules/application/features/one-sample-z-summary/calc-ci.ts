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
  const { xbar, stdev, n } = formSummary.sampleSummary;
  const { confidenceLevel } = formSummary.confidenceInterval;

  const stderr = stdev / Math.sqrt(n);
  const zcrit = -1 * quantile((1 - confidenceLevel) / 2, 0, 1);
  const me = zcrit * stderr;
  const ll = xbar - me;
  const ul = xbar + me;

  const CIData: DataTableRow<CIColumns | SampleStatistics>[] = [
    {
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

  const CIStats: (CIColumns | SampleStatistics)[] = [
    'Level',
    'Z-crit',
    'N',
    'Mean',
    'Known Stdev',
    'Std.Err',
    'M.E.',
    'L.Limit',
    'U.Limit',
  ];

  return { perform: Perform.ConfidenceInerval, CIData, CIStats };
};

export { calcCI };
