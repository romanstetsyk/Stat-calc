/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GridCellKind } from '@glideapps/glide-data-grid';
import roundn from '@stdlib/math-base-special-roundn';
import cdf from '@stdlib/stats-base-dists-normal-cdf';
import quantile from '@stdlib/stats-base-dists-normal-quantile';
import mean from '@stdlib/stats-base-mean';
import stdev from '@stdlib/stats-base-stdev';

import { Config } from '~/modules/application/config';
import { HypothesisType, Perform } from '~/modules/application/enums';
import type { DataTableRow } from '~/modules/application/types';
import type { GridData } from '~/modules/data-grid/types';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';

import type {
  CIColumns,
  HTColumns,
  HTReturn,
  SampleStatistics,
  TForm,
} from './types';

const { ROUND_DECIMAL } = Config;

// eslint-disable-next-line sonarjs/cognitive-complexity
const calcHT = (formSummary: TForm, colData: GridData['colData']): HTReturn => {
  const { sample1, knownStdev1 } = formSummary.sample1Data;
  const { sample2, knownStdev2 } = formSummary.sample2Data;
  const {
    nullValue,
    alternative,
    alpha,
    optional: { includeConfidenceInterval },
  } = formSummary.hypothesisTest;
  const { includeSampleStatistics } = formSummary.optional;
  const { withLabel } = formSummary;

  const var1Name = getVarName(colData, Number(sample1), withLabel);
  const var1Values = getVarValues(colData, Number(sample1), withLabel);
  const arrOfNums1 = var1Values.filter(
    (e): e is number => typeof e === 'number',
  );
  const n1 = arrOfNums1.length;
  const xbar1 = mean(n1, arrOfNums1, 1);
  const stdevApprox1 = knownStdev1 ?? stdev(n1, 1, arrOfNums1, 1);

  const var2Name = getVarName(colData, Number(sample2), withLabel);
  const var2Values = getVarValues(colData, Number(sample2), withLabel);
  const arrOfNums2 = var2Values.filter(
    (e): e is number => typeof e === 'number',
  );
  const n2 = arrOfNums2.length;
  const xbar2 = mean(n2, arrOfNums2, 1);
  const stdevApprox2 = knownStdev2 ?? stdev(n2, 1, arrOfNums2, 1);

  const xdiff = xbar1 - xbar2;
  const stderr1 = stdevApprox1 / Math.sqrt(n1);
  const stderr2 = stdevApprox2 / Math.sqrt(n2);
  const stderrPooled = Math.sqrt(
    stdevApprox1 ** 2 / n1 + stdevApprox2 ** 2 / n2,
  );
  const zstat = (xdiff - nullValue) / stderrPooled;

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
