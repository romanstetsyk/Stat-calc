const hasKeys = (
  obj: unknown,
  ...keys: string[]
): obj is Record<(typeof keys)[number], unknown> =>
  typeof obj === 'object' && obj !== null && keys.every((key) => key in obj);

export { hasKeys };
