/* eslint-disable @typescript-eslint/no-magic-numbers */
import quantile from '@stdlib/stats-base-dists-normal-quantile';

import { Perform } from '~/modules/application/enums';
import type { DataTableRow } from '~/modules/application/types';
import { parseNumber } from '~/utils/parse-number';

import type { CIColumns, CIReturn, SampleStatistics, TForm } from './types';

const DECIMAL = 6;

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
      '': '\u03BC\u2081 - \u03BC\u2082',
      Level: parseNumber(confidenceLevel),
      'Z-crit': parseNumber(zcrit, DECIMAL),
      'M.E.': parseNumber(me, DECIMAL),
      'L.Limit': parseNumber(ll, DECIMAL),
      'U.Limit': parseNumber(ul, DECIMAL),
      'Std.Err.': parseNumber(stderrPooled, DECIMAL),
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
        '': 'Sample 1',
        N: n1,
        Mean: xbar1,
        'Known Stdev': stdev1,
        'Std.Err': parseNumber(stderr1, DECIMAL),
      },
      {
        '': 'Sample 2',
        N: n2,
        Mean: xbar2,
        'Known Stdev': stdev2,
        'Std.Err': parseNumber(stderr2, DECIMAL),
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
