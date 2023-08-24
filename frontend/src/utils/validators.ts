import { isFiniteNumberString } from './assertions';

const isFiniteNumber = (value: string): boolean | string =>
  isFiniteNumberString(value) || 'must be a number';
const isPositiveNumber = (value: string): boolean | string => {
  const n = Number(value);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return (Number.isFinite(n) && n > 0) || 'must be a number greater than 0';
};
const isIntegerGreaterThanOne = (value: string): boolean | string => {
  const n = Number(value);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return (Number.isInteger(n) && n > 1) || 'must be an integer greater than 1';
};
const isValidLevel = (value: string): boolean | string => {
  const lowerLimit = 0;
  const upperLimit = 1;
  const n = Number(value);
  return (
    (Number.isFinite(n) && n > lowerLimit && n < upperLimit) ||
    'must be a number greater than 0 but less than 1'
  );
};

export {
  isFiniteNumber,
  isIntegerGreaterThanOne,
  isPositiveNumber,
  isValidLevel,
};
