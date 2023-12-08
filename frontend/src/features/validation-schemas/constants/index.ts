const MIN_SAMPLE_SIZE = 1;

const PROBABILITY = {
  MIN: 0,
  MAX: 1,
} as const;

const COLUMN_NAME_PATTERN = /^\d+$/;

export { COLUMN_NAME_PATTERN, MIN_SAMPLE_SIZE, PROBABILITY };
