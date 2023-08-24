import type { ArrayLike } from './array-like';
import { createColName } from './create-col-name';

function firstKey(obj: InstanceType<typeof ArrayLike<string>>): string {
  let n = 0;
  while (!(n in obj)) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    n += 1;
  }
  return obj[n];
}

const getVarName = (
  colData: InstanceType<typeof ArrayLike<ArrayLike<string>>>,
  colHeader: number,
  withLabel: boolean,
): string => {
  return withLabel
    ? `${firstKey(colData[colHeader])} (${createColName(colHeader)})`
    : createColName(colHeader);
};

const getVarValues = (
  colData: InstanceType<typeof ArrayLike<ArrayLike<string>>>,
  colHeader: number,
  withLabel: boolean,
): string[] => {
  const arr = [];
  for (const key in colData[colHeader]) {
    arr.push(colData[colHeader][key]);
  }
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return withLabel ? arr.slice(1) : arr;
};

export { getVarName, getVarValues };
