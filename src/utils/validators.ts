import { isFiniteNumberString } from "./assertions";

export const isFiniteNumber = (value: string): boolean | string =>
  isFiniteNumberString(value) || "must be a number";

export const isPositiveNumber = (value: string): boolean | string => {
  const n = Number(value);
  return (Number.isFinite(n) && n > 0) || "must be a number greater than 0";
};

export const isIntegerGreaterThanOne = (value: string): boolean | string => {
  const n = Number(value);
  return (Number.isInteger(n) && n > 1) || "must be an integer greater than 1";
};

export const isValidLevel = (value: string): boolean | string => {
  const n = Number(value);
  return (
    (Number.isFinite(n) && n > 0 && n < 1) ||
    "must be a number greater than 0 but less than 1"
  );
};
