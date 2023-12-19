/* eslint-disable @typescript-eslint/no-magic-numbers */
const normalizeArray = (nums: number[]): number[] => {
  const sum = nums.reduce((acc, n) => acc + n, 0);
  return nums.map((n) => (100 * n) / sum);
};

export { normalizeArray };
