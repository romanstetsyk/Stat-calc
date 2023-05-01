export const isFiniteNumber = (value: string): boolean | string => {
  const err = "must be a number";
  if (value.trim() === "") {
    return err;
  }
  const n = Number(value);
  return Number.isFinite(n) || err;
};

export const isPositiveNumber = (value: string): boolean | string => {
  const n = Number(value);
  return (Number.isFinite(n) && n > 0) || "must be a number greater than 0";
};

export const isIntegerGreaterThanOne = (value: string): boolean | string => {
  const n = Number(value);
  return (Number.isInteger(n) && n > 1) || "must be an integer greater than 1";
};
