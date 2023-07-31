import { ArrayLike } from "./ArrayLike";
import { createColName } from "./createColName";

function firstKey(obj: InstanceType<typeof ArrayLike<string>>) {
  // for (const prop in obj) {
  //   return obj[prop];
  // }
  let n = 0;
  while (!(n in obj)) {
    n += 1;
  }
  return obj[n];
}

export const getVarName = (
  colData: InstanceType<typeof ArrayLike<ArrayLike<string>>>,
  colHeader: number,
  withLabel: boolean
): string => {
  return withLabel
    ? `${firstKey(colData[colHeader])} (${createColName(colHeader)})`
    : createColName(colHeader);
};

export const getVarValues = (
  colData: InstanceType<typeof ArrayLike<ArrayLike<string>>>,
  colHeader: number,
  withLabel: boolean
): string[] => {
  const arr = [];
  for (const key in colData[colHeader]) {
    arr.push(colData[colHeader][key]);
  }
  return withLabel ? arr.slice(1) : arr;
};
