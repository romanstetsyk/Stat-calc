/* eslint-disable @typescript-eslint/no-magic-numbers */
/**
 * Remove rounding errors
 * @param n numeric value as number or string (e.g. 0.10 or '0.10')
 * @param p number of decimal places
 * @returns
 */
const parseNumber = (n?: number | string, p = 12): string => {
  switch (typeof n) {
    case 'number': {
      return Number.parseFloat(n.toFixed(p)).toString();
    }
    case 'string': {
      return Number.parseFloat(n).toString();
    }
    default: {
      return 'NaN';
    }
  }
};

const roundToPrecision = (n: number): number => {
  return Number.parseFloat(n.toFixed(12));
};

export { parseNumber, roundToPrecision };
