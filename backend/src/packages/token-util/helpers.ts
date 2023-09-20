import type { JwtPayload } from 'jsonwebtoken';

import { hasKeys } from '~/common/helpers/helpers.js';

import { TOKEN_TYPES } from './constants.js';
import type { JWTPayload } from './types.js';

const isJWTPayload = <T extends TOKEN_TYPES>(
  obj: JwtPayload,
): obj is JWTPayload<T> => {
  return (
    hasKeys(obj, 'id', 'type') &&
    typeof obj.id === 'string' &&
    Object.values(TOKEN_TYPES).includes(obj.type)
  );
};

export { isJWTPayload };
