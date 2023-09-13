const hasKeys = (
  obj: unknown,
  ...keys: string[]
): obj is Record<(typeof keys)[number], unknown> =>
  keys.every((key) => typeof obj === 'object' && obj !== null && key in obj);

export { hasKeys };
