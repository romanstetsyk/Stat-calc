/* eslint-disable @typescript-eslint/no-magic-numbers */
const roundToPrecision = (n: number): number => {
  return Number.parseFloat(n.toFixed(12));
};

export { roundToPrecision };
