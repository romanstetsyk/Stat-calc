export const isFiniteNumber = (value: string): boolean | string => {
  const n = Number(value);
  return Number.isFinite(n) || "must be a number";
};

export const isPositiveNumber = (value: string): boolean | string => {
  const n = Number(value);
  return (Number.isFinite(n) && n > 0) || "must be a number greater than 0";
};
