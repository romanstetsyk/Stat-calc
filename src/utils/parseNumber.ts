/**
 * Remove rounding errors
 * @param n numeric value as number or string (e.g. 0.10 or '0.10')
 * @param p number of decimal places
 * @returns
 */
export const parseNumber = (n?: number | string, p = 12): string => {
  switch (typeof n) {
    case "number":
      return parseFloat(n.toFixed(p)).toString();
    case "string":
      return parseFloat(n).toString();
    default:
      return "NaN";
  }
};

export const roundToPrecision = (n: number): number => {
  return parseFloat(n.toFixed(12));
};
