const Config = {
  SHOW_SESSION_MOBILE: false,
  SHOW_DATASET: true,
  SHOW_SESSION: true,
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  PANE_SIZES: [2, 1], // initial proportion left/right
  PANE_MIN_WIDTH: 200, // px

  ROUND_DECIMAL: -6, // Round a number to the nearest multiple of 10^n.
} as const;

export { Config };
