import type { DataTableRow } from '~/components/data-table';
import type { ArrayLike } from '~/framework/array-like';
import { BinMethod } from '~/types';
import { isFiniteNumberString } from '~/utils/assertions';
import { getVarName, getVarValues } from '~/utils/get-column-name-and-values';
import type { TabulateParams } from '~/utils/tabulate';
import { Tabulate } from '~/utils/tabulate';

import type { FrequencyDistribution, OutputReturn, TForm } from './types';
import { topLeftCell } from './types';

const calcGroups = (
  colData: ArrayLike<ArrayLike<string>>,
  formSummary: TForm,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
): OutputReturn[] => {
  const { withLabel, columns, options, method, manual, squareRoot } =
    formSummary;

  return columns.map((colHeader) => {
    const varName = getVarName(colData, Number(colHeader), withLabel);
    const varValues = getVarValues(colData, Number(colHeader), withLabel);
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const arrOfNums = varValues.filter(isFiniteNumberString).map(Number);
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

    const table: DataTableRow<FrequencyDistribution, typeof topLeftCell>[] =
      out.bins.map(({ limits, ...rest }) => ({
        ...rest,
        [topLeftCell]: limits.join(' - '),
      }));

    const stats: [typeof topLeftCell, ...typeof options] = [
      topLeftCell,
      ...options,
    ];
    return { varName, n, table, stats };
  });
};

export { calcGroups };
