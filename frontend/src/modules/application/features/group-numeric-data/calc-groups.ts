import { GridCellKind } from '@glideapps/glide-data-grid';

import { BinMethod } from '~/modules/application/enums';
import type { DataTableRow } from '~/modules/application/types';
import type { GridData } from '~/modules/data-grid/types';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';
import type { TabulateParams } from '~/utils/tabulate';
import { Tabulate } from '~/utils/tabulate';

import type { FrequencyDistribution, OutputReturn, TForm } from './types';
import { TopLeftCell } from './types';

const calcGroups = (
  formSummary: TForm,
  colData: GridData['colData'],
): OutputReturn[] => {
  const { withLabel, columns, options, method, manual, squareRoot } =
    formSummary;

  return columns.map((colHeader) => {
    const varName = getVarName(colData, Number(colHeader), withLabel);
    const varValues = getVarValues(colData, Number(colHeader), withLabel);
    const arrOfNums = varValues.filter(
      (e): e is number => typeof e === 'number',
    );
    const n = arrOfNums.length;

    let tabulateParams: TabulateParams;
    if (method === BinMethod.MANUAL) {
      const { start, width } = manual;
      tabulateParams = {
        method,
        dataset: arrOfNums,
        start: start ?? Number.NaN,
        width,
      };
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (method === BinMethod.SQUARE_ROOT) {
      const { start } = squareRoot;
      tabulateParams = {
        method,
        dataset: arrOfNums,
        start: start ?? Number.NaN,
      };
    } else {
      throw new Error('Unknown bin method');
    }

    const out = new Tabulate(tabulateParams, {
      allowHidden: false,
      showHidden: true,
      hideEmpty: true, // if frequency is 0 then hide class
      precision: 0,
    });

    if (options.includes('Relative Frequency')) {
      out.computeRelativeFrequency();
    }

    if (options.includes('Cumulative Frequency')) {
      out.computeCumulativeFrequency();
    }

    if (options.includes('Cumulative Relative Frequency')) {
      out.computeCumulativeRelativeFrequency();
    }

    const table: DataTableRow<FrequencyDistribution, TopLeftCell>[] =
      out.bins.map(({ limits, ...rest }) => ({
        ...Object.fromEntries(
          Object.entries(rest).map(([k, v]) => [
            k,
            { data: v, kind: GridCellKind.Number, displayData: v.toString() },
          ]),
        ),
        [TopLeftCell]: {
          data: limits.join(' - '),
          kind: GridCellKind.Text,
          displayData: limits.join(' - '),
        },
      }));

    const stats: [TopLeftCell, ...typeof options] = [TopLeftCell, ...options];
    return { varName, n, table, stats };
  });
};

export { calcGroups };
