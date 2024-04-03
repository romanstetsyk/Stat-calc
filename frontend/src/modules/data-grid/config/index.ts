import { TIMEOUT } from '@shared/build/esm/index';

const Config = {
  // Initial grid parameters
  ROW_COUNT: 300,
  ROW_HEIGHT: 24,
  COL_COUNT: 50,
  COL_WIDTH: 100,
  HEADER_HEIGHT: 28,
  // How many columns and rows are added at a time by infinite scroll
  COLUMNS_ADDED_PER_SCROLL: 10,
  ROWS_ADDED_PER_SCROLL: 50,
  // Generate new columns and rows when this number of rows left
  COLUMNS_LOAD_THRESHOLD: 5,
  ROWS_LOAD_THRESHOLD: 40,
  // Scroll debounce
  DEBOUNCE_TIMEOUT: TIMEOUT['0.1s'],

  DEFAULT_TITLE: 'Untitled',
} as const;

export { Config };
