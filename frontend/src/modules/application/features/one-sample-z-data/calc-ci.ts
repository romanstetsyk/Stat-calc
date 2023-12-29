import { GridCellKind } from '@glideapps/glide-data-grid';
import roundn from '@stdlib/math-base-special-roundn';
import quantile from '@stdlib/stats-base-dists-normal-quantile';
import mean from '@stdlib/stats-base-mean';
import stdev from '@stdlib/stats-base-stdev';

import { Config } from '~/modules/application/config';
import { Perform } from '~/modules/application/enums';
import type { DataTableRow } from '~/modules/application/types';
import type { GridData } from '~/modules/data-grid/types';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';

import type { CIColumns, CIReturn, SampleStatistics, TForm } from './types';

const { ROUND_DECIMAL } = Config;

const calcCI = (formSummary: TForm, colData: GridData['colData']): CIReturn => {
  const { columns, withLabel, knownStdev } = formSummary.sampleData;
  const { confidenceLevel } = formSummary.confidenceInterval;

  const CIData: DataTableRow<CIColumns | SampleStatistics, ''>[] = columns.map(
    (colHeader) => {
      const varName = getVarName(colData, Number(colHeader), withLabel);
      const varValues = getVarValues(colData, Number(colHeader), withLabel);
      const arrOfNums = varValues.filter(
        (e): e is number => typeof e === 'number',
      );
      const n = arrOfNums.length;
      const xbar = mean(n, arrOfNums, 1);
      const stdevApprox = knownStdev ?? stdev(n, 1, arrOfNums, 1);
      const stderr = stdevApprox / Math.sqrt(n);
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const zcrit = -1 * quantile((1 - confidenceLevel) / 2, 0, 1);
      const me = zcrit * stderr;
      const [ll, ul] = [xbar - me, xbar + me];

      const rowData: DataTableRow<CIColumns | SampleStatistics, ''> = {
        '': {
          data: varName,
          kind: GridCellKind.Text,
          displayData: varName,
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
        [knownStdev ? 'Known Stdev' : 'S.Stdev']: {
          data: stdevApprox,
          kind: GridCellKind.Number,
          displayData: roundn(stdevApprox, ROUND_DECIMAL).toString(),
        },
        'Std.Err': {
          data: stderr,
          kind: GridCellKind.Number,
          displayData: roundn(stderr, ROUND_DECIMAL).toString(),
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
      };
      return rowData;
    },
  );

  const CIStats: ['', ...(CIColumns | SampleStatistics)[]] = [
    '',
    'N',
    'Mean',
    knownStdev ? 'Known Stdev' : 'S.Stdev',
    'Std.Err',
    'Level',
    'Z-crit',
    'M.E.',
    'L.Limit',
    'U.Limit',
  ];

  return { perform: Perform.ConfidenceInerval, CIData, CIStats };
};

export { calcCI };
