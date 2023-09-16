import type { ValueOf } from '~/common/types/types.js';

const hasKeys = (
  obj: unknown,
  ...keys: string[]
): obj is Record<(typeof keys)[number], unknown> =>
  typeof obj === 'object' && obj !== null && keys.every((key) => key in obj);

const hasValue = (obj: unknown, value: unknown): value is ValueOf<typeof obj> =>
  typeof obj === 'object' && obj !== null && Object.values(obj).includes(value);

export { hasKeys, hasValue };
