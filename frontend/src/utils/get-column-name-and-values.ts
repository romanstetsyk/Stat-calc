/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { GridData } from '~/modules/data-grid/types';
import { createColumnName } from '~/modules/data-grid/utils';

const getVarName = (
  colData: GridData['colData'],
  colHeader: number,
  withLabel: boolean,
): string => {
  return withLabel
    ? `${colData[colHeader].first()?.value} (${createColumnName(colHeader)})`
    : createColumnName(colHeader);
};

const getVarValues = (
  colData: GridData['colData'],
  column: number,
  excludefirst: boolean,
): (string | number)[] => {
  return Object.values(colData[column]).slice(Number(excludefirst));
};

export { getVarName, getVarValues };
