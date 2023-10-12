import type { ValueOf } from '~/types/types.js';

const hasValue = (obj: unknown, value: unknown): value is ValueOf<typeof obj> =>
  typeof obj === 'object' && obj !== null && Object.values(obj).includes(value);

export { hasValue };
