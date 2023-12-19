/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import quantile from '@stdlib/stats-base-dists-normal-quantile';
import mean from '@stdlib/stats-base-mean';
import stdev from '@stdlib/stats-base-stdev';

import type { ArrayLike } from '~/framework/array-like';
import { Perform } from '~/modules/application/enums';
import type { DataTableRow } from '~/modules/application/types';
import { isFiniteNumberString } from '~/utils/assertions';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';
import { parseNumber } from '~/utils/parse-number';

import type { CIColumns, CIReturn, SampleStatistics, TForm } from './types';

const DECIMAL = 6;

const calcCI = (
  formSummary: TForm,
  colData: ArrayLike<ArrayLike<string>>,
): CIReturn => {
  const { sample1, knownStdev1 } = formSummary.sample1Data;
  const { sample2, knownStdev2 } = formSummary.sample2Data;
  const { confidenceLevel } = formSummary.confidenceInterval;
  const { includeSampleStatistics } = formSummary.optional;
  const { withLabel } = formSummary;

  const var1Name = getVarName(colData, Number(sample1), withLabel);
  const var1Values = getVarValues(colData, Number(sample1), withLabel);
  const arrOfNums1 = var1Values.filter(isFiniteNumberString).map(Number);
  const n1 = arrOfNums1.length;
  const xbar1 = mean(n1, arrOfNums1, 1);
  const stdevApprox1 = knownStdev1 ?? stdev(n1, 1, arrOfNums1, 1);

  const var2Name = getVarName(colData, Number(sample2), withLabel);
  const var2Values = getVarValues(colData, Number(sample2), withLabel);
  const arrOfNums2 = var2Values.filter(isFiniteNumberString).map(Number);
  const n2 = arrOfNums2.length;
  const xbar2 = mean(n2, arrOfNums2, 1);
  const stdevApprox2 = knownStdev2 ?? stdev(n2, 1, arrOfNums2, 1);

  const xdiff = xbar1 - xbar2;
  const stderr1 = stdevApprox1 / Math.sqrt(n1);
  const stderr2 = stdevApprox2 / Math.sqrt(n2);
  const stderrPooled = Math.sqrt(
    stdevApprox1 ** 2 / n1 + stdevApprox2 ** 2 / n2,
  );
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
        '': var1Name,
        N: n1,
        Mean: parseNumber(xbar1, DECIMAL),
        // eslint-disable-next-line sonarjs/no-duplicate-string
        [knownStdev1 ? 'Known Stdev' : 'S.Stdev']: parseNumber(
          stdevApprox1,
          DECIMAL,
        ),
        'Std.Err': parseNumber(stderr1, DECIMAL),
      },
      {
        '': var2Name,
        N: n2,
        Mean: parseNumber(xbar2, DECIMAL),
        [knownStdev2 ? 'Known Stdev' : 'S.Stdev']: parseNumber(
          stdevApprox2,
          DECIMAL,
        ),
        'Std.Err': parseNumber(stderr2, DECIMAL),
      },
    ];

    const sampleStats: ['', ...SampleStatistics[]] = [
      '',
      'N',
      'Mean',
      'Std.Err',
    ];
    if (knownStdev1 && knownStdev2) {
      sampleStats.splice(3, 0, 'Known Stdev');
    } else if (!knownStdev1 && !knownStdev2) {
      sampleStats.splice(3, 0, 'S.Stdev');
    } else {
      sampleStats.splice(3, 0, 'S.Stdev', 'Known Stdev');
    }

    outputData.sampleData = sampleData;
    outputData.sampleStats = sampleStats;
  }

  return outputData;
};

export { calcCI };
