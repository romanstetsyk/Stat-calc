/**
 * Remove rounding errors
 * @param n numeric value as number or string (e.g. 0.10 or '0.10')
 * @returns
 */
export const parseNumber = (n: number | string): string => {
  switch (typeof n) {
    case "number":
      return parseFloat(n.toFixed(12)).toString();
    case "string":
      return parseFloat(n).toString();
  }
};
