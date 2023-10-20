import type { ValueOf } from 'shared/build/index.js';

const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

type TOKEN_TYPES = ValueOf<typeof TOKEN_TYPES>;

export { TOKEN_TYPES };
