/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import cdf from '@stdlib/stats-base-dists-normal-cdf';
import quantile from '@stdlib/stats-base-dists-normal-quantile';
import mean from '@stdlib/stats-base-mean';
import stdev from '@stdlib/stats-base-stdev';

import type { DataTableRow } from '~/components/data-table';
import { Perform } from '~/types';
import type { ArrayLike } from '~/utils/array-like';
import { isFiniteNumberString } from '~/utils/assertions';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';
import { parseNumber } from '~/utils/parse-number';

import type {
  CIColumns,
  HTColumns,
  HTReturn,
  SampleStatistics,
  TForm,
} from './types';

const DECIMAL = 6;

const calcHT = (
  formSummary: TForm,
  colData: InstanceType<typeof ArrayLike<ArrayLike<string>>>,
  // eslint-disable-next-line sonarjs/cognitive-complexity
): HTReturn => {
  const sample1 = Number(formSummary.sample1);
  const sample2 = Number(formSummary.sample2);
  const withLabel = formSummary.withLabel;
  const knownStdev1 = Number(formSummary.stdev1);
  const knownStdev2 = Number(formSummary.stdev2);
  const nullValue = Number(formSummary.nullValue);
  const alternative = formSummary.alternative;
  const alpha = Number(formSummary.alpha);

  const includeSampleData = formSummary.optional.sampleStatistics;
  const includeCI = formSummary.optional.confidenceInterval;

  const var1Name = getVarName(colData, sample1, withLabel);
  const var1Values = getVarValues(colData, sample1, withLabel);
  const arrOfNums1 = var1Values.filter(isFiniteNumberString).map(Number);
  const n1 = arrOfNums1.length;
  const xbar1 = mean(n1, arrOfNums1, 1);
  const stdevApprox1 = knownStdev1 || stdev(n1, 1, arrOfNums1, 1);

  const var2Name = getVarName(colData, sample2, withLabel);
  const var2Values = getVarValues(colData, sample2, withLabel);
  const arrOfNums2 = var2Values.filter(isFiniteNumberString).map(Number);
  const n2 = arrOfNums2.length;
  const xbar2 = mean(n2, arrOfNums2, 1);
  const stdevApprox2 = knownStdev2 || stdev(n2, 1, arrOfNums2, 1);

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
    case 'notEqual': {
      ciLevel = 1 - alpha;
      zcrit = -quantile(alpha / 2, 0, 1);
      pvalue = 2 * cdf(-Math.abs(zstat), 0, 1);
      break;
    }
    case 'greaterThan': {
      ciLevel = 1 - 2 * alpha;
      zcrit = -quantile(alpha, 0, 1);
      pvalue = 1 - cdf(zstat, 0, 1);
      break;
    }
    case 'lessThan': {
      ciLevel = 1 - 2 * alpha;
      zcrit = -quantile(alpha, 0, 1);
      pvalue = cdf(zstat, 0, 1);
      break;
    }
    default: {
      throw new Error('Invalid hypothesis direction');
    }
  }

  const HTData: DataTableRow<HTColumns, ''>[] = [
    {
      '': '\u03BC\u2081 - \u03BC\u2082',
      Alpha: parseNumber(alpha),
      'Z-crit': parseNumber(zcrit, DECIMAL),
      'Std.Err.': parseNumber(stderrPooled, DECIMAL),
      'Z-stat': parseNumber(zstat, DECIMAL),
      'P-value': parseNumber(pvalue, DECIMAL),
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

  if (includeSampleData) {
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

  if (includeCI && (alternative === 'notEqual' || alpha < 0.5)) {
    const me = zcrit * stderrPooled;
    const ll = xdiff - me;
    const ul = xdiff + me;

    const CIData: DataTableRow<CIColumns, ''>[] = [
      {
        '': '\u03BC\u2081 - \u03BC\u2082',
        Level: parseNumber(ciLevel),
        'Z-crit': parseNumber(zcrit, DECIMAL),
        'M.E.': parseNumber(me, DECIMAL),
        'L.Limit': parseNumber(ll, DECIMAL),
        'U.Limit': parseNumber(ul, DECIMAL),
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
