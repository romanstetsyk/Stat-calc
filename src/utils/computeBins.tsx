export const computeBins = (
  arr: number[],
  start: number,
  width: number
): { values: number[][]; l: number; u: number } => {
  const max = Math.max(...arr);
  const bins: number[][] = [];

  let i = 0;
  while (start + i * width <= max) {
    bins.push([start + i * width, start + (i + 1) * width]);
    i += 1;
  }
  return { values: bins, l: start, u: start + i * width };
};
