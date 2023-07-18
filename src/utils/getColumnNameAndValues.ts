import { GridTrack, GridTracks } from "~/Types";
import { createColName } from "./createColName";

function firstKey(obj: GridTrack) {
  for (const prop in obj) {
    return obj[prop];
  }
}

export const getVarName = (
  colData: GridTracks,
  colHeader: number,
  withLabel: boolean
): string => {
  return withLabel
    ? `${firstKey(colData[colHeader])} (${createColName(colHeader)})`
    : createColName(colHeader);
};

export const getVarValues = (
  colData: GridTracks,
  colHeader: number,
  withLabel: boolean
): string[] => {
  const arr = [];
  for (const key in colData[colHeader]) {
    arr.push(colData[colHeader][key]);
  }
  return withLabel ? arr.slice(1) : arr;
};
