/* eslint-disable @typescript-eslint/no-magic-numbers */
import quantile from '@stdlib/stats-base-dists-normal-quantile';

import type { DataTableRow } from '~/components/data-table';
import { Perform } from '~/types';
import { parseNumber } from '~/utils/parse-number';

import type { CIColumns, CIReturn, SampleStatistics, TForm } from './types';

const DECIMAL = 6;

const calcCI = (formSummary: TForm): CIReturn => {
  const xbar = Number(formSummary.xbar);
  const stdev = Number(formSummary.stdev);
  const n = Number(formSummary.n);
  const level = Number(formSummary.level);

  const stderr = stdev / Math.sqrt(n);
  const zcrit = -1 * quantile((1 - level) / 2, 0, 1);
  const me = zcrit * stderr;
  const ll = xbar - me;
  const ul = xbar + me;

  const CIData: DataTableRow<CIColumns | SampleStatistics>[] = [
    {
      Level: parseNumber(level),
      'Z-crit': parseNumber(zcrit, DECIMAL),
      N: n,
      Mean: xbar,
      'Known Stdev': stdev,
      'Std.Err': parseNumber(stderr, DECIMAL),
      'M.E.': parseNumber(me, DECIMAL),
      'L.Limit': parseNumber(ll, DECIMAL),
      'U.Limit': parseNumber(ul, DECIMAL),
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
