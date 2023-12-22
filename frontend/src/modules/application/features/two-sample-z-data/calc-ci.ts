/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GridCellKind } from '@glideapps/glide-data-grid';
import roundn from '@stdlib/math-base-special-roundn';
import quantile from '@stdlib/stats-base-dists-normal-quantile';
import mean from '@stdlib/stats-base-mean';
import stdev from '@stdlib/stats-base-stdev';

import type { ArrayLike } from '~/framework/array-like';
import { Config } from '~/modules/application/config';
import { Perform } from '~/modules/application/enums';
import type { DataTableRow } from '~/modules/application/types';
import { isFiniteNumberString } from '~/utils/assertions';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';

import type { CIColumns, CIReturn, SampleStatistics, TForm } from './types';

const { ROUND_DECIMAL } = Config;

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
          data: var1Name,
          kind: GridCellKind.Text,
          displayData: var1Name,
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
        // eslint-disable-next-line sonarjs/no-duplicate-string
        [knownStdev1 ? 'Known Stdev' : 'S.Stdev']: {
          data: stdevApprox1,
          kind: GridCellKind.Number,
          displayData: roundn(stdevApprox1, ROUND_DECIMAL).toString(),
        },
        'Std.Err': {
          data: stderr1,
          kind: GridCellKind.Number,
          displayData: roundn(stderr1, ROUND_DECIMAL).toString(),
        },
      },
      {
        '': {
          data: var2Name,
          kind: GridCellKind.Text,
          displayData: var2Name,
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
        [knownStdev2 ? 'Known Stdev' : 'S.Stdev']: {
          data: stdevApprox2,
          kind: GridCellKind.Number,
          displayData: roundn(stdevApprox2, ROUND_DECIMAL).toString(),
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
